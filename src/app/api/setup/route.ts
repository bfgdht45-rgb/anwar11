import { NextResponse } from 'next/server';
import { db } from '@/lib/db';

// GET /api/setup - إنشاء الجداول تلقائياً باستخدام raw SQL
// نستخدم approach مختلف: نتأكد أولاً إن الجدول موجود قبل ما نعمله، ونعمل try/catch لكل واحد
export async function GET() {
  const log: string[] = [];

  const executeSQL = async (sql: string, description: string) => {
    try {
      await db.$executeRawUnsafe(sql);
      log.push(`✅ ${description}`);
    } catch (e: any) {
      // لو الجدول موجود بالفعل (error 42P07) أو الـ enum موجود (error 42710) - تجاهل
      if (e.code === '42P07' || e.code === '42710' || e.message?.includes('already exists')) {
        log.push(`⏭️ ${description} (موجود بالفعل)`);
      } else {
        log.push(`❌ ${description}: ${e.message}`);
        throw e;
      }
    }
  };

  try {
    log.push('🏗️ بدء إنشاء الجداول...');

    // 1. إنشاء enum types (بدون IF NOT EXISTS - نتاكد بـ try/catch)
    log.push('📋 إنشاء الـ enums...');
    await executeSQL(`CREATE TYPE "UserRole" AS ENUM ('ADMIN', 'TEACHER', 'STUDENT')`, 'UserRole enum');
    await executeSQL(`CREATE TYPE "QuestionType" AS ENUM ('MCQ', 'TRUEFALSE', 'FILL', 'ESSAY', 'IMAGE')`, 'QuestionType enum');
    await executeSQL(`CREATE TYPE "Difficulty" AS ENUM ('EASY', 'MEDIUM', 'HARD')`, 'Difficulty enum');
    await executeSQL(`CREATE TYPE "NotificationType" AS ENUM ('INFO', 'SUCCESS', 'WARNING', 'ERROR')`, 'NotificationType enum');

    // 2. إنشاء الجداول - نستخدم IF NOT EXISTS (ده مدعوم في CREATE TABLE)
    log.push('👥 إنشاء جدول User...');
    await executeSQL(`
      CREATE TABLE IF NOT EXISTS "User" (
          "id" TEXT NOT NULL,
          "email" TEXT NOT NULL,
          "password" TEXT NOT NULL,
          "name" TEXT NOT NULL,
          "role" "UserRole" NOT NULL DEFAULT 'STUDENT',
          "avatar" TEXT NOT NULL DEFAULT '🧑',
          "phone" TEXT,
          "bio" TEXT,
          "rating" DOUBLE PRECISION DEFAULT 0,
          "studentsCount" INTEGER DEFAULT 0,
          "lessonsCount" INTEGER DEFAULT 0,
          "totalEarnings" DOUBLE PRECISION DEFAULT 0,
          "specialties" TEXT[] DEFAULT ARRAY[]::TEXT[],
          "stage" TEXT,
          "year" TEXT,
          "subscriptionStatus" TEXT,
          "subscriptionExpiry" TIMESTAMP(3),
          "completedLessons" TEXT[] DEFAULT ARRAY[]::TEXT[],
          "favorites" TEXT[] DEFAULT ARRAY[]::TEXT[],
          "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
          "updatedAt" TIMESTAMP(3) NOT NULL,
          CONSTRAINT "User_pkey" PRIMARY KEY ("id")
      )
    `, 'جدول User');

    log.push('📚 إنشاء جدول Unit...');
    await executeSQL(`
      CREATE TABLE IF NOT EXISTS "Unit" (
          "id" TEXT NOT NULL,
          "title" TEXT NOT NULL,
          "description" TEXT,
          "order" INTEGER NOT NULL DEFAULT 1,
          "stageId" TEXT NOT NULL,
          "yearId" TEXT NOT NULL,
          "color" TEXT NOT NULL DEFAULT 'oklch(0.65 0.16 165)',
          CONSTRAINT "Unit_pkey" PRIMARY KEY ("id")
      )
    `, 'جدول Unit');

    log.push('🎥 إنشاء جدول Lesson...');
    await executeSQL(`
      CREATE TABLE IF NOT EXISTS "Lesson" (
          "id" TEXT NOT NULL,
          "title" TEXT NOT NULL,
          "description" TEXT NOT NULL,
          "teacherId" TEXT NOT NULL,
          "unitId" TEXT NOT NULL,
          "videoUrl" TEXT NOT NULL,
          "videoSource" TEXT NOT NULL,
          "videoDuration" TEXT NOT NULL,
          "views" INTEGER NOT NULL DEFAULT 0,
          "order" INTEGER NOT NULL DEFAULT 0,
          "allowPdfDownload" BOOLEAN NOT NULL DEFAULT false,
          "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
          "updatedAt" TIMESTAMP(3) NOT NULL,
          CONSTRAINT "Lesson_pkey" PRIMARY KEY ("id")
      )
    `, 'جدول Lesson');

    log.push('📄 إنشاء جدول PDFFile...');
    await executeSQL(`
      CREATE TABLE IF NOT EXISTS "PDFFile" (
          "id" TEXT NOT NULL,
          "name" TEXT NOT NULL,
          "url" TEXT NOT NULL,
          "size" TEXT NOT NULL,
          "pages" INTEGER NOT NULL DEFAULT 1,
          "lessonId" TEXT NOT NULL,
          CONSTRAINT "PDFFile_pkey" PRIMARY KEY ("id")
      )
    `, 'جدول PDFFile');

    await executeSQL(`
      CREATE TABLE IF NOT EXISTS "AdditionalFile" (
          "id" TEXT NOT NULL,
          "name" TEXT NOT NULL,
          "url" TEXT NOT NULL,
          "type" TEXT NOT NULL,
          "lessonId" TEXT NOT NULL,
          CONSTRAINT "AdditionalFile_pkey" PRIMARY KEY ("id")
      )
    `, 'جدول AdditionalFile');

    log.push('📝 إنشاء جدول Assignment...');
    await executeSQL(`
      CREATE TABLE IF NOT EXISTS "Assignment" (
          "id" TEXT NOT NULL,
          "title" TEXT NOT NULL,
          "description" TEXT,
          "totalPoints" INTEGER NOT NULL DEFAULT 20,
          "dueDate" TIMESTAMP(3),
          "autoGrade" BOOLEAN NOT NULL DEFAULT true,
          "lessonId" TEXT,
          "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
          CONSTRAINT "Assignment_pkey" PRIMARY KEY ("id")
      )
    `, 'جدول Assignment');

    log.push('🏆 إنشاء جدول Exam...');
    await executeSQL(`
      CREATE TABLE IF NOT EXISTS "Exam" (
          "id" TEXT NOT NULL,
          "title" TEXT NOT NULL,
          "description" TEXT,
          "durationMinutes" INTEGER NOT NULL DEFAULT 30,
          "preventBack" BOOLEAN NOT NULL DEFAULT true,
          "randomOrder" BOOLEAN NOT NULL DEFAULT false,
          "showGrade" BOOLEAN NOT NULL DEFAULT true,
          "showSolution" BOOLEAN NOT NULL DEFAULT true,
          "passingScore" INTEGER NOT NULL DEFAULT 60,
          "isHtmlExam" BOOLEAN NOT NULL DEFAULT false,
          "htmlContent" TEXT,
          "lessonId" TEXT,
          "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
          CONSTRAINT "Exam_pkey" PRIMARY KEY ("id")
      )
    `, 'جدول Exam');

    log.push('❓ إنشاء جدول Question...');
    await executeSQL(`
      CREATE TABLE IF NOT EXISTS "Question" (
          "id" TEXT NOT NULL,
          "type" "QuestionType" NOT NULL,
          "difficulty" "Difficulty" NOT NULL DEFAULT 'MEDIUM',
          "text" TEXT NOT NULL,
          "options" TEXT[] DEFAULT ARRAY[]::TEXT[],
          "correctAnswer" TEXT NOT NULL,
          "explanation" TEXT,
          "points" INTEGER NOT NULL DEFAULT 5,
          "imageUrl" TEXT,
          "stageId" TEXT,
          "yearId" TEXT,
          "unitId" TEXT,
          "lessonId" TEXT,
          "assignmentId" TEXT,
          "examId" TEXT,
          "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
          CONSTRAINT "Question_pkey" PRIMARY KEY ("id")
      )
    `, 'جدول Question');

    log.push('💬 إنشاء جدول Comment...');
    await executeSQL(`
      CREATE TABLE IF NOT EXISTS "Comment" (
          "id" TEXT NOT NULL,
          "text" TEXT NOT NULL,
          "rating" INTEGER,
          "userId" TEXT NOT NULL,
          "lessonId" TEXT NOT NULL,
          "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
          CONSTRAINT "Comment_pkey" PRIMARY KEY ("id")
      )
    `, 'جدول Comment');

    log.push('📊 إنشاء جدول Grade...');
    await executeSQL(`
      CREATE TABLE IF NOT EXISTS "Grade" (
          "id" TEXT NOT NULL,
          "score" INTEGER NOT NULL,
          "totalScore" INTEGER NOT NULL,
          "date" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
          "itemType" TEXT NOT NULL,
          "itemId" TEXT NOT NULL,
          "title" TEXT NOT NULL,
          "studentId" TEXT NOT NULL,
          "studentName" TEXT NOT NULL,
          "assignmentId" TEXT,
          "examId" TEXT,
          CONSTRAINT "Grade_pkey" PRIMARY KEY ("id")
      )
    `, 'جدول Grade');

    log.push('🔔 إنشاء جدول Notification...');
    await executeSQL(`
      CREATE TABLE IF NOT EXISTS "Notification" (
          "id" TEXT NOT NULL,
          "title" TEXT NOT NULL,
          "message" TEXT NOT NULL,
          "type" "NotificationType" NOT NULL DEFAULT 'INFO',
          "userId" TEXT,
          "read" BOOLEAN NOT NULL DEFAULT false,
          "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
          CONSTRAINT "Notification_pkey" PRIMARY KEY ("id")
      )
    `, 'جدول Notification');

    log.push('💳 إنشاء جدول Payment...');
    await executeSQL(`
      CREATE TABLE IF NOT EXISTS "Payment" (
          "id" TEXT NOT NULL,
          "amount" DOUBLE PRECISION NOT NULL,
          "subscriptionName" TEXT NOT NULL,
          "method" TEXT NOT NULL,
          "status" TEXT NOT NULL,
          "date" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
          "couponCode" TEXT,
          "studentId" TEXT NOT NULL,
          "studentName" TEXT NOT NULL,
          CONSTRAINT "Payment_pkey" PRIMARY KEY ("id")
      )
    `, 'جدول Payment');

    log.push('🧾 إنشاء جدول Invoice...');
    await executeSQL(`
      CREATE TABLE IF NOT EXISTS "Invoice" (
          "id" TEXT NOT NULL,
          "amount" DOUBLE PRECISION NOT NULL,
          "subscriptionName" TEXT NOT NULL,
          "date" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
          "status" TEXT NOT NULL,
          "studentId" TEXT NOT NULL,
          CONSTRAINT "Invoice_pkey" PRIMARY KEY ("id")
      )
    `, 'جدول Invoice');

    log.push('🏅 إنشاء جدول Certificate...');
    await executeSQL(`
      CREATE TABLE IF NOT EXISTS "Certificate" (
          "id" TEXT NOT NULL,
          "courseName" TEXT NOT NULL,
          "issueDate" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
          "grade" DOUBLE PRECISION NOT NULL,
          "studentId" TEXT NOT NULL,
          "studentName" TEXT NOT NULL,
          CONSTRAINT "Certificate_pkey" PRIMARY KEY ("id")
      )
    `, 'جدول Certificate');

    log.push('🎫 إنشاء جدول Coupon...');
    await executeSQL(`
      CREATE TABLE IF NOT EXISTS "Coupon" (
          "id" TEXT NOT NULL,
          "code" TEXT NOT NULL,
          "discount" DOUBLE PRECISION NOT NULL,
          "type" TEXT NOT NULL,
          "maxUses" INTEGER NOT NULL DEFAULT 100,
          "usedCount" INTEGER NOT NULL DEFAULT 0,
          "expiry" TIMESTAMP(3) NOT NULL,
          "active" BOOLEAN NOT NULL DEFAULT true,
          CONSTRAINT "Coupon_pkey" PRIMARY KEY ("id")
      )
    `, 'جدول Coupon');

    // 3. إنشاء Indexes
    log.push('🔗 إنشاء الـ Indexes...');
    await executeSQL(`CREATE UNIQUE INDEX IF NOT EXISTS "User_email_key" ON "User"("email")`, 'Index User_email');
    await executeSQL(`CREATE UNIQUE INDEX IF NOT EXISTS "Assignment_lessonId_key" ON "Assignment"("lessonId")`, 'Index Assignment_lessonId');
    await executeSQL(`CREATE UNIQUE INDEX IF NOT EXISTS "Exam_lessonId_key" ON "Exam"("lessonId")`, 'Index Exam_lessonId');
    await executeSQL(`CREATE UNIQUE INDEX IF NOT EXISTS "Coupon_code_key" ON "Coupon"("code")`, 'Index Coupon_code');

    // 4. إنشاء Foreign keys (بدون IF NOT EXISTS - نتاكد بـ try/catch)
    log.push('🔗 إنشاء العلاقات...');
    const fks = [
      `ALTER TABLE "Lesson" ADD CONSTRAINT "Lesson_teacherId_fkey" FOREIGN KEY ("teacherId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE`,
      `ALTER TABLE "Lesson" ADD CONSTRAINT "Lesson_unitId_fkey" FOREIGN KEY ("unitId") REFERENCES "Unit"("id") ON DELETE RESTRICT ON UPDATE CASCADE`,
      `ALTER TABLE "PDFFile" ADD CONSTRAINT "PDFFile_lessonId_fkey" FOREIGN KEY ("lessonId") REFERENCES "Lesson"("id") ON DELETE CASCADE ON UPDATE CASCADE`,
      `ALTER TABLE "AdditionalFile" ADD CONSTRAINT "AdditionalFile_lessonId_fkey" FOREIGN KEY ("lessonId") REFERENCES "Lesson"("id") ON DELETE CASCADE ON UPDATE CASCADE`,
      `ALTER TABLE "Assignment" ADD CONSTRAINT "Assignment_lessonId_fkey" FOREIGN KEY ("lessonId") REFERENCES "Lesson"("id") ON DELETE SET NULL ON UPDATE CASCADE`,
      `ALTER TABLE "Exam" ADD CONSTRAINT "Exam_lessonId_fkey" FOREIGN KEY ("lessonId") REFERENCES "Lesson"("id") ON DELETE SET NULL ON UPDATE CASCADE`,
      `ALTER TABLE "Question" ADD CONSTRAINT "Question_assignmentId_fkey" FOREIGN KEY ("assignmentId") REFERENCES "Assignment"("id") ON DELETE SET NULL ON UPDATE CASCADE`,
      `ALTER TABLE "Question" ADD CONSTRAINT "Question_examId_fkey" FOREIGN KEY ("examId") REFERENCES "Exam"("id") ON DELETE SET NULL ON UPDATE CASCADE`,
      `ALTER TABLE "Comment" ADD CONSTRAINT "Comment_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE`,
      `ALTER TABLE "Comment" ADD CONSTRAINT "Comment_lessonId_fkey" FOREIGN KEY ("lessonId") REFERENCES "Lesson"("id") ON DELETE CASCADE ON UPDATE CASCADE`,
      `ALTER TABLE "Grade" ADD CONSTRAINT "Grade_studentId_fkey" FOREIGN KEY ("studentId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE`,
      `ALTER TABLE "Grade" ADD CONSTRAINT "Grade_assignmentId_fkey" FOREIGN KEY ("assignmentId") REFERENCES "Assignment"("id") ON DELETE SET NULL ON UPDATE CASCADE`,
      `ALTER TABLE "Grade" ADD CONSTRAINT "Grade_examId_fkey" FOREIGN KEY ("examId") REFERENCES "Exam"("id") ON DELETE SET NULL ON UPDATE CASCADE`,
      `ALTER TABLE "Notification" ADD CONSTRAINT "Notification_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE SET NULL ON UPDATE CASCADE`,
      `ALTER TABLE "Payment" ADD CONSTRAINT "Payment_studentId_fkey" FOREIGN KEY ("studentId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE`,
      `ALTER TABLE "Invoice" ADD CONSTRAINT "Invoice_studentId_fkey" FOREIGN KEY ("studentId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE`,
      `ALTER TABLE "Certificate" ADD CONSTRAINT "Certificate_studentId_fkey" FOREIGN KEY ("studentId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE`,
    ];

    for (const fk of fks) {
      const constraintName = (fk.match(/CONSTRAINT "([^"]+)"/) || [])[1] || 'FK';
      await executeSQL(fk, `FK ${constraintName}`);
    }

    log.push('✅ تم إنشاء كل الجداول بنجاح!');

    return NextResponse.json({
      success: true,
      message: 'تم إنشاء كل الجداول بنجاح!',
      log,
      nextStep: 'الآن افتح /api/seed لتعبئة البيانات',
    });
  } catch (error: any) {
    console.error('Setup error:', error);
    return NextResponse.json({
      success: false,
      error: error.message || 'فشل في إنشاء الجداول',
      log,
    }, { status: 500 });
  }
}
