import { NextResponse } from 'next/server';
import { db } from '@/lib/db';

// GET /api/lessons
export async function GET() {
  try {
    const lessons = await db.$queryRawUnsafe(`
      SELECT l.*,
             u.id as "teacherId", u.name as "teacherName", u.avatar as "teacherAvatar", u.bio as "teacherBio", u.rating as "teacherRating", u."studentsCount" as "teacherStudentsCount", u."lessonsCount" as "teacherLessonsCount", u.specialties as "teacherSpecialties",
             un.id as "unitId", un.title as "unitTitle", un."stageId", un."yearId"
      FROM "Lesson" l
      LEFT JOIN "User" u ON l."teacherId" = u.id
      LEFT JOIN "Unit" un ON l."unitId" = un.id
      ORDER BY l."order" ASC
    `) as any[];

    // جلب PDFs والملفات الإضافية لكل درس
    const lessonsWithRelations = await Promise.all((lessons || []).map(async (l: any) => {
      const pdfs = await db.$queryRawUnsafe(`SELECT * FROM "PDFFile" WHERE "lessonId" = '${l.id}'`) as any[];
      const additionalFiles = await db.$queryRawUnsafe(`SELECT * FROM "AdditionalFile" WHERE "lessonId" = '${l.id}'`) as any[];
      const comments = await db.$queryRawUnsafe(`
        SELECT c.*, u.name as "userName", u.avatar as "userAvatar"
        FROM "Comment" c
        LEFT JOIN "User" u ON c."userId" = u.id
        WHERE c."lessonId" = '${l.id}'
        ORDER BY c."createdAt" DESC
      `) as any[];

      // جلب الواجب
      let assignment = null;
      const assignments = await db.$queryRawUnsafe(`SELECT * FROM "Assignment" WHERE "lessonId" = '${l.id}' LIMIT 1`) as any[];
      if (assignments[0]) {
        const questions = await db.$queryRawUnsafe(`SELECT * FROM "Question" WHERE "assignmentId" = '${assignments[0].id}'`) as any[];
        assignment = { ...assignments[0], questions };
      }

      // جلب الامتحان
      let exam = null;
      const exams = await db.$queryRawUnsafe(`SELECT * FROM "Exam" WHERE "lessonId" = '${l.id}' LIMIT 1`) as any[];
      if (exams[0]) {
        const questions = await db.$queryRawUnsafe(`SELECT * FROM "Question" WHERE "examId" = '${exams[0].id}'`) as any[];
        exam = { ...exams[0], questions };
      }

      return {
        ...l,
        teacher: {
          id: l.teacherId,
          name: l.teacherName,
          avatar: l.teacherAvatar,
          bio: l.teacherBio,
          rating: l.teacherRating,
          studentsCount: l.teacherStudentsCount,
          lessonsCount: l.teacherLessonsCount,
          specialties: l.teacherSpecialties,
        },
        unit: {
          id: l.unitId,
          title: l.unitTitle,
          stageId: l.stageId,
          yearId: l.yearId,
        },
        pdfs,
        additionalFiles,
        comments,
        assignment,
        exam,
      };
    }));

    return NextResponse.json({ lessons: lessonsWithRelations });
  } catch (error: any) {
    console.error('GET /api/lessons error:', error);
    return NextResponse.json({ error: 'فشل في جلب الدروس: ' + error.message }, { status: 500 });
  }
}

// POST /api/lessons
export async function POST(request: any) {
  try {
    const body = await request.json();
    const id = `lesson-${Date.now()}`;

    // تحويل رابط YouTube
    let videoUrl = body.videoUrl || '';
    if (body.videoSource === 'youtube' && videoUrl && !videoUrl.includes('/embed/')) {
      const watchMatch = videoUrl.match(/[?&]v=([^&]+)/);
      if (watchMatch) videoUrl = `https://www.youtube.com/embed/${watchMatch[1]}`;
      else {
        const shortMatch = videoUrl.match(/youtu\.be\/([^?&]+)/);
        if (shortMatch) videoUrl = `https://www.youtube.com/embed/${shortMatch[1]}`;
      }
    } else if (body.videoSource === 'vimeo' && videoUrl && !videoUrl.includes('player.vimeo.com')) {
      const match = videoUrl.match(/vimeo\.com\/(\d+)/);
      if (match) videoUrl = `https://player.vimeo.com/video/${match[1]}`;
    }

    await db.$executeRawUnsafe(`
      INSERT INTO "Lesson" ("id", "title", "description", "teacherId", "unitId", "videoUrl", "videoSource", "videoDuration", "views", "order", "allowPdfDownload", "createdAt", "updatedAt")
      VALUES ('${id}', '${body.title.replace(/'/g, "''")}', '${(body.description || '').replace(/'/g, "''")}', '${body.teacherId}', '${body.unitId}', '${videoUrl}', '${body.videoSource || 'youtube'}', '${body.videoDuration || '00:00'}', 0, 0, ${body.allowPdfDownload ?? false}, NOW(), NOW())
    `);

    // إضافة PDFs
    if (body.pdfs?.length) {
      for (const p of body.pdfs) {
        await db.$executeRawUnsafe(`
          INSERT INTO "PDFFile" ("id", "name", "url", "size", "pages", "lessonId")
          VALUES ('pdf-${Date.now()}-${Math.random()}', '${p.name.replace(/'/g, "''")}', '${p.url}', '${p.size || '1 MB'}', ${p.pages || 1}, '${id}')
        `);
      }
    }

    // إضافة ملفات إضافية
    if (body.additionalFiles?.length) {
      for (const f of body.additionalFiles) {
        await db.$executeRawUnsafe(`
          INSERT INTO "AdditionalFile" ("id", "name", "url", "type", "lessonId")
          VALUES ('file-${Date.now()}-${Math.random()}', '${f.name.replace(/'/g, "''")}', '${f.url}', '${f.type || 'file'}', '${id}')
        `);
      }
    }

    // إنشاء واجب لو فيه أسئلة
    if (body.assignment?.questions?.length) {
      const assignId = `assign-${Date.now()}`;
      await db.$executeRawUnsafe(`
        INSERT INTO "Assignment" ("id", "title", "description", "totalPoints", "autoGrade", "lessonId", "createdAt")
        VALUES ('${assignId}', '${body.assignment.title || `واجب: ${body.title}`}'.replace(/'/g, "''"), '${(body.assignment.description || '').replace(/'/g, "''")}', ${body.assignment.totalPoints || 20}, true, '${id}', NOW())
      `);
      await db.$executeRawUnsafe(`UPDATE "Lesson" SET "updatedAt" = NOW() WHERE id = '${id}'`);
    }

    // إنشاء امتحان HTML لو فيه htmlContent
    if (body.exam?.htmlContent) {
      const examId = `exam-${Date.now()}`;
      const escapedHtml = body.exam.htmlContent.replace(/'/g, "''");
      await db.$executeRawUnsafe(`
        INSERT INTO "Exam" ("id", "title", "description", "durationMinutes", "preventBack", "randomOrder", "showGrade", "showSolution", "passingScore", "isHtmlExam", "htmlContent", "lessonId", "createdAt")
        VALUES ('${examId}', '${body.exam.title || `امتحان: ${body.title}`}'.replace(/'/g, "''"), '${(body.exam.description || '').replace(/'/g, "''")}', ${body.exam.durationMinutes || 30}, true, false, true, true, ${body.exam.passingScore || 60}, true, '${escapedHtml}', '${id}', NOW())
      `);
    }

    return NextResponse.json({ lesson: { id, ...body } }, { status: 201 });
  } catch (error: any) {
    console.error('POST /api/lessons error:', error);
    return NextResponse.json({ error: 'فشل في إنشاء الدرس: ' + error.message }, { status: 500 });
  }
}
