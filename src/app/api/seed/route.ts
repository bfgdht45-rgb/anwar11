import { NextResponse } from 'next/server';
import { db } from '@/lib/db';

export async function GET() {
  const log: string[] = [];

  const executeSQL = async (sql: string, description: string) => {
    try {
      await db.$executeRawUnsafe(sql);
      log.push(`✅ ${description}`);
    } catch (e: any) {
      if (e.message?.includes('already exists') || e.code === '42P07' || e.code === '42710') {
        log.push(`⏭️ ${description} (موجود)`);
      } else {
        log.push(`❌ ${description}: ${e.message}`);
      }
    }
  };

  try {
    log.push('🌱 بدء تعبئة قاعدة البيانات...');

    // مسح البيانات القديمة باستخدام raw SQL
    log.push('🧹 مسح البيانات القديمة...');
    await executeSQL('DELETE FROM "Grade";', 'مسح Grade');
    await executeSQL('DELETE FROM "Notification";', 'مسح Notification');
    await executeSQL('DELETE FROM "Payment";', 'مسح Payment');
    await executeSQL('DELETE FROM "Invoice";', 'مسح Invoice');
    await executeSQL('DELETE FROM "Certificate";', 'مسح Certificate');
    await executeSQL('DELETE FROM "Coupon";', 'مسح Coupon');
    await executeSQL('DELETE FROM "Comment";', 'مسح Comment');
    await executeSQL('DELETE FROM "Question";', 'مسح Question');
    await executeSQL('DELETE FROM "Assignment";', 'مسح Assignment');
    await executeSQL('DELETE FROM "Exam";', 'مسح Exam');
    await executeSQL('DELETE FROM "PDFFile";', 'مسح PDFFile');
    await executeSQL('DELETE FROM "AdditionalFile";', 'مسح AdditionalFile');
    await executeSQL('DELETE FROM "Lesson";', 'مسح Lesson');
    await executeSQL('DELETE FROM "Unit";', 'مسح Unit');
    await executeSQL('DELETE FROM "User";', 'مسح User');

    // ===== المستخدمون =====
    log.push('👥 إنشاء المستخدمين...');
    const adminId = 'user-admin-001';
    await executeSQL(`
      INSERT INTO "User" ("id", "email", "password", "name", "role", "avatar", "phone", "createdAt", "updatedAt")
      VALUES ('${adminId}', 'admin@math.com', 'admin123', 'مدير المنصة', 'ADMIN', '👨‍💼', '01000000001', NOW(), NOW())
    `, 'إنشاء الأدمن');

    const teacher1Id = 'user-teacher-001';
    await executeSQL(`
      INSERT INTO "User" ("id", "email", "password", "name", "role", "avatar", "phone", "bio", "rating", "studentsCount", "lessonsCount", "totalEarnings", "specialties", "createdAt", "updatedAt")
      VALUES ('${teacher1Id}', 'teacher@math.com', 'teacher123', 'أ. محمد عبد الله', 'TEACHER', '👨‍🏫', '01000000002', 'مدرس رياضيات للمرحلة الثانوية بخبرة 15 عاماً', 4.9, 1240, 86, 184500, ARRAY['الجبر', 'التفاضل', 'التكامل'], NOW(), NOW())
    `, 'إنشاء المعلم 1');

    const teacher2Id = 'user-teacher-002';
    await executeSQL(`
      INSERT INTO "User" ("id", "email", "password", "name", "role", "avatar", "phone", "bio", "rating", "studentsCount", "lessonsCount", "totalEarnings", "specialties", "createdAt", "updatedAt")
      VALUES ('${teacher2Id}', 'fatima@math.com', 'teacher123', 'أ. فاطمة الزهراء', 'TEACHER', '👩‍🏫', '01000000005', 'مدرسة رياضيات للمرحلة الإعدادية', 4.8, 980, 64, 142000, ARRAY['الهندسة', 'القياس'], NOW(), NOW())
    `, 'إنشاء المعلم 2');

    const student1Id = 'user-student-001';
    await executeSQL(`
      INSERT INTO "User" ("id", "email", "password", "name", "role", "avatar", "phone", "stage", "year", "subscriptionStatus", "subscriptionExpiry", "completedLessons", "favorites", "createdAt", "updatedAt")
      VALUES ('${student1Id}', 'student@math.com', 'student123', 'أحمد محمود', 'STUDENT', '🧑‍🎓', '01000000003', 'high', 'second', 'active', '2026-08-30', ARRAY[]::TEXT[], ARRAY[]::TEXT[], NOW(), NOW())
    `, 'إنشاء الطالب 1');

    const student2Id = 'user-student-002';
    await executeSQL(`
      INSERT INTO "User" ("id", "email", "password", "name", "role", "avatar", "phone", "stage", "year", "subscriptionStatus", "subscriptionExpiry", "completedLessons", "favorites", "createdAt", "updatedAt")
      VALUES ('${student2Id}', 'sara@math.com', 'student123', 'سارة أحمد', 'STUDENT', '👩‍🎓', '01000000004', 'middle', 'third', 'active', '2026-07-15', ARRAY[]::TEXT[], ARRAY[]::TEXT[], NOW(), NOW())
    `, 'إنشاء الطالب 2');

    // ===== الوحدات =====
    log.push('📚 إنشاء الوحدات (المنهج الجديد)...');
    const unitsData = [
      // أولى إعدادي
      { id: 'unit-m1-1', title: 'جبر وإحصاء واحتمالات', stageId: 'middle', yearId: 'first', order: 1 },
      { id: 'unit-m1-2', title: 'هندسة', stageId: 'middle', yearId: 'first', order: 2 },
      // ثانية إعدادي
      { id: 'unit-m2-1', title: 'جبر وإحصاء واحتمالات', stageId: 'middle', yearId: 'second', order: 1 },
      { id: 'unit-m2-2', title: 'هندسة', stageId: 'middle', yearId: 'second', order: 2 },
      // ثالثة إعدادي
      { id: 'unit-m3-1', title: 'جبر وإحصاء واحتمالات', stageId: 'middle', yearId: 'third', order: 1 },
      { id: 'unit-m3-2', title: 'هندسة وحساب مثلثات وهندسة تحليلية', stageId: 'middle', yearId: 'third', order: 2 },
      // أولى ثانوي
      { id: 'unit-h1-1', title: 'جبر وحساب مثلثات', stageId: 'high', yearId: 'first', order: 1 },
      { id: 'unit-h1-2', title: 'هندسة', stageId: 'high', yearId: 'first', order: 2 },
      { id: 'unit-h1-3', title: 'هندسة تحليلية', stageId: 'high', yearId: 'first', order: 3 },
      // ثانية ثانوي - رياضيات بحتة
      { id: 'unit-h2-1', title: 'رياضيات بحتة (جبر - تفاضل - تكامل - حساب مثلثات)', stageId: 'high', yearId: 'second', order: 1 },
      // ثانية ثانوي - تطبيقية
      { id: 'unit-h2-2', title: 'رياضيات تطبيقية (استاتيكا - ديناميكا)', stageId: 'high', yearId: 'second', order: 2 },
      // ثالثة ثانوي - بحتة
      { id: 'unit-h3-1', title: 'رياضيات بحتة (جبر - تفاضل - تكامل - هندسة فراغية)', stageId: 'high', yearId: 'third', order: 1 },
      // ثالثة ثانوي - تطبيقية
      { id: 'unit-h3-2', title: 'رياضيات تطبيقية (استاتيكا - ديناميكا)', stageId: 'high', yearId: 'third', order: 2 },
    ];
    for (const u of unitsData) {
      await executeSQL(`
        INSERT INTO "Unit" ("id", "title", "description", "order", "stageId", "yearId", "color")
        VALUES ('${u.id}', '${u.title}', '${u.title}', ${u.order}, '${u.stageId}', '${u.yearId}', 'oklch(0.65 0.16 165)')
      `, `وحدة: ${u.title}`);
    }

    // ===== الدروس =====
    log.push('🎥 إنشاء الدروس...');
    const lesson1Id = 'lesson-001';
    await executeSQL(`
      INSERT INTO "Lesson" ("id", "title", "description", "teacherId", "unitId", "videoUrl", "videoSource", "videoDuration", "views", "order", "allowPdfDownload", "createdAt", "updatedAt")
      VALUES ('${lesson1Id}', 'مدخل إلى التفاضل - النهايات', 'في هذا الدرس سنتعرف على مفهوم النهايات وأهميتها في حساب التفاضل، وكيفية حساب نهاية الدوال المختلفة.', '${teacher1Id}', 'unit-h2-1', 'https://www.youtube.com/embed/M7lc1UVf-VE', 'youtube', '24:35', 1240, 1, true, NOW(), NOW())
    `, 'درس 1');

    await executeSQL(`
      INSERT INTO "PDFFile" ("id", "name", "url", "size", "pages", "lessonId")
      VALUES ('pdf-001', 'ملخص النهايات.pdf', 'https://example.com/limits.pdf', '2.4 MB', 12, '${lesson1Id}')
    `, 'PDF 1 للدرس 1');

    await executeSQL(`
      INSERT INTO "PDFFile" ("id", "name", "url", "size", "pages", "lessonId")
      VALUES ('pdf-002', 'تمارين محلولة.pdf', 'https://example.com/exercises.pdf', '1.8 MB', 8, '${lesson1Id}')
    `, 'PDF 2 للدرس 1');

    await executeSQL(`
      INSERT INTO "AdditionalFile" ("id", "name", "url", "type", "lessonId")
      VALUES ('file-001', 'جدول النهايات.png', 'https://example.com/table.png', 'image', '${lesson1Id}')
    `, 'ملف إضافي للدرس 1');

    const lesson2Id = 'lesson-002';
    await executeSQL(`
      INSERT INTO "Lesson" ("id", "title", "description", "teacherId", "unitId", "videoUrl", "videoSource", "videoDuration", "views", "order", "allowPdfDownload", "createdAt", "updatedAt")
      VALUES ('${lesson2Id}', 'قواعد الاشتقاق', 'نتعرف في هذا الدرس على قواعد اشتقاق الدوال الأساسية: قاعدة القوة، قاعدة الجمع، قاعدة الضرب، قاعدة القسمة، والقاعدة السلسلية.', '${teacher1Id}', 'unit-h2-1', 'https://www.youtube.com/embed/M7lc1UVf-VE', 'youtube', '32:18', 980, 2, true, NOW(), NOW())
    `, 'درس 2');

    const lesson3Id = 'lesson-003';
    await executeSQL(`
      INSERT INTO "Lesson" ("id", "title", "description", "teacherId", "unitId", "videoUrl", "videoSource", "videoDuration", "views", "order", "allowPdfDownload", "createdAt", "updatedAt")
      VALUES ('${lesson3Id}', 'معادلة المستقيل', 'دراسة معادلة المستقيم بأشكالها المختلفة وحساب الميل والمسافة.', '${teacher1Id}', 'unit-h1-3', 'https://player.vimeo.com/video/76979871', 'vimeo', '28:42', 760, 1, false, NOW(), NOW())
    `, 'درس 3');

    const lesson4Id = 'lesson-004';
    await executeSQL(`
      INSERT INTO "Lesson" ("id", "title", "description", "teacherId", "unitId", "videoUrl", "videoSource", "videoDuration", "views", "order", "allowPdfDownload", "createdAt", "updatedAt")
      VALUES ('${lesson4Id}', 'الأعداد النسبية وعملياتها', 'تعريف الأعداد النسبية وتمثيلها على المستقيم العددي.', '${teacher2Id}', 'unit-m1-1', 'https://www.youtube.com/embed/M7lc1UVf-VE', 'youtube', '20:15', 540, 1, true, NOW(), NOW())
    `, 'درس 4');

    // ===== الواجبات =====
    log.push('📝 إنشاء الواجبات...');
    const assignment1Id = 'assign-001';
    await executeSQL(`
      INSERT INTO "Assignment" ("id", "title", "description", "totalPoints", "autoGrade", "lessonId", "createdAt")
      VALUES ('${assignment1Id}', 'واجب النهايات', 'حل التمارين التالية على نهاية الدوال', 20, true, '${lesson1Id}', NOW())
    `, 'واجب 1');

    const questions1 = [
      { id: 'q-001', type: 'MCQ', difficulty: 'EASY', text: 'ما هي قيمة lim(x→2) (x² + 3x)؟', options: '10,8,12,14', correct: '10', points: 4 },
      { id: 'q-002', type: 'TRUEFALSE', difficulty: 'EASY', text: 'نهاية الدالة 1/x عند x→0 تساوي صفر.', correct: 'false', points: 4 },
      { id: 'q-003', type: 'FILL', difficulty: 'MEDIUM', text: 'lim(x→3) (x² - 9)/(x - 3) = ?', correct: '6', points: 4 },
      { id: 'q-004', type: 'MCQ', difficulty: 'MEDIUM', text: 'إذا كانت f(x) = sin(x)، فإن lim(x→0) f(x)/x = ؟', options: '0,1,∞,غير معرف', correct: '1', points: 4 },
      { id: 'q-005', type: 'ESSAY', difficulty: 'HARD', text: 'اثبت باستخدام تعريف النهاية أن lim(x→2) (3x) = 6.', correct: 'باستخدام تعريف إبسلون-دلتا', points: 4 },
    ];
    for (const q of questions1) {
      const optionsArr = q.options ? q.options.split(',').map((o: string) => `'${o.trim()}'`).join(',') : '';
      const optionsSQL = optionsArr ? `ARRAY[${optionsArr}]::TEXT[]` : 'ARRAY[]::TEXT[]';
      await executeSQL(`
        INSERT INTO "Question" ("id", "type", "difficulty", "text", "options", "correctAnswer", "points", "assignmentId", "createdAt")
        VALUES ('${q.id}', '${q.type}', '${q.difficulty}', '${q.text.replace(/'/g, "''")}', ${optionsSQL}, '${q.correct}', ${q.points}, '${assignment1Id}', NOW())
      `, `سؤال ${q.id}`);
    }

    const assignment2Id = 'assign-002';
    await executeSQL(`
      INSERT INTO "Assignment" ("id", "title", "description", "totalPoints", "autoGrade", "lessonId", "createdAt")
      VALUES ('${assignment2Id}', 'تمارين قواعد الاشتقاق', 'تطبيق قواعد الاشتقاق المختلفة', 16, true, '${lesson2Id}', NOW())
    `, 'واجب 2');

    const questions2 = [
      { id: 'q-006', type: 'MCQ', difficulty: 'EASY', text: 'مشتقة الدالة f(x) = x⁵ هي:', options: '5x⁴,x⁴,5x,x⁵/5', correct: '5x⁴', points: 4 },
      { id: 'q-007', type: 'FILL', difficulty: 'MEDIUM', text: 'إذا كانت f(x) = x²·sin(x)، فإن f\'(x) = ؟', correct: '2x·sin(x) + x²·cos(x)', points: 4 },
      { id: 'q-008', type: 'TRUEFALSE', difficulty: 'EASY', text: 'مشتقة الدالة الثابتة تساوي صفر.', correct: 'true', points: 4 },
      { id: 'q-009', type: 'MCQ', difficulty: 'HARD', text: 'مشتقة f(x) = ln(x²+1) هي:', options: '2x/(x²+1),1/(x²+1),2x,ln(2x)', correct: '2x/(x²+1)', points: 4 },
    ];
    for (const q of questions2) {
      const optionsArr = q.options ? q.options.split(',').map((o: string) => `'${o.trim()}'`).join(',') : '';
      const optionsSQL = optionsArr ? `ARRAY[${optionsArr}]::TEXT[]` : 'ARRAY[]::TEXT[]';
      await executeSQL(`
        INSERT INTO "Question" ("id", "type", "difficulty", "text", "options", "correctAnswer", "points", "assignmentId", "createdAt")
        VALUES ('${q.id}', '${q.type}', '${q.difficulty}', '${q.text.replace(/'/g, "''")}', ${optionsSQL}, '${q.correct}', ${q.points}, '${assignment2Id}', NOW())
      `, `سؤال ${q.id}`);
    }

    // ===== الامتحانات =====
    log.push('🏆 إنشاء الامتحانات...');
    const exam1Id = 'exam-001';
    await executeSQL(`
      INSERT INTO "Exam" ("id", "title", "description", "durationMinutes", "preventBack", "randomOrder", "showGrade", "showSolution", "passingScore", "lessonId", "createdAt")
      VALUES ('${exam1Id}', 'امتحان النهايات', 'امتحان شامل على نهاية الدوال', 30, true, true, true, true, 60, '${lesson1Id}', NOW())
    `, 'امتحان 1');

    const examQuestions = [
      { id: 'eq-001', type: 'MCQ', difficulty: 'EASY', text: 'lim(x→1) (x³ - 1)/(x - 1) = ?', options: '1,2,3,0', correct: '3', points: 5 },
      { id: 'eq-002', type: 'TRUEFALSE', difficulty: 'EASY', text: 'إذا ولت f(x) إلى L، فإن f(x) - L تؤول إلى صفر.', correct: 'true', points: 5 },
      { id: 'eq-003', type: 'FILL', difficulty: 'HARD', text: 'lim(x→∞) (3x² + 2x)/(x² - 1) = ?', correct: '3', points: 5 },
    ];
    for (const q of examQuestions) {
      const optionsArr = q.options ? q.options.split(',').map((o: string) => `'${o.trim()}'`).join(',') : '';
      const optionsSQL = optionsArr ? `ARRAY[${optionsArr}]::TEXT[]` : 'ARRAY[]::TEXT[]';
      await executeSQL(`
        INSERT INTO "Question" ("id", "type", "difficulty", "text", "options", "correctAnswer", "points", "examId", "createdAt")
        VALUES ('${q.id}', '${q.type}', '${q.difficulty}', '${q.text.replace(/'/g, "''")}', ${optionsSQL}, '${q.correct}', ${q.points}, '${exam1Id}', NOW())
      `, `سؤال امتحان ${q.id}`);
    }

    // امتحان HTML تفاعلي
    const htmlExamId = 'exam-002';
    const htmlContent = `<!DOCTYPE html><html dir="rtl"><head><meta charset="UTF-8"><style>body{font-family:Cairo,sans-serif;padding:24px;background:#f8fafc;color:#1e293b}h1{color:#0f766e;border-bottom:3px solid #0f766e;padding-bottom:12px}.q{background:#fff;padding:20px;border-radius:12px;margin-bottom:16px;box-shadow:0 1px 3px rgba(0,0,0,0.1)}.q h3{color:#134e4a;margin-bottom:12px}.o label{display:block;padding:10px 14px;margin:6px 0;background:#f1f5f9;border-radius:8px;cursor:pointer}.correct{background:#d1fae5!important;border-right:4px solid #10b981}.wrong{background:#fee2e2!important;border-right:4px solid #ef4444}button{background:#0f766e;color:#fff;padding:12px 28px;border:none;border-radius:8px;cursor:pointer;margin-top:16px}#r{padding:20px;border-radius:12px;margin-top:20px;text-align:center;display:none}</style></head><body><h1>📝 امتحان الجبر التفاعلي</h1><div class="q" data-c="b"><h3>السؤال 1: ما حل 2x + 6 = 14؟</h3><div class="o"><label><input type="radio" name="q1" value="a"> أ) 2</label><label><input type="radio" name="q1" value="b"> ب) 4</label><label><input type="radio" name="q1" value="c"> ج) 6</label><label><input type="radio" name="q1" value="d"> د) 8</label></div></div><div class="q" data-c="c"><h3>السؤال 2: ما قيمة x في x² = 49؟</h3><div class="o"><label><input type="radio" name="q2" value="a"> أ) 5</label><label><input type="radio" name="q2" value="b"> ب) 6</label><label><input type="radio" name="q2" value="c"> ج) 7</label><label><input type="radio" name="q2" value="d"> د) 8</label></div></div><div class="q" data-c="a"><h3>السؤال 3: ما ناتج 3 × (4 + 2)؟</h3><div class="o"><label><input type="radio" name="q3" value="a"> أ) 18</label><label><input type="radio" name="q3" value="b"> ب) 14</label><label><input type="radio" name="q3" value="c"> ج) 12</label><label><input type="radio" name="q3" value="d"> د) 24</label></div></div><button onclick="g()">تصحيح الامتحان ✅</button><div id="r"></div><script>function g(){const qs=document.querySelectorAll('.q');let c=0;qs.forEach(q=>{const a=q.getAttribute('data-c');const s=q.querySelector('input:checked');q.querySelectorAll('label').forEach(o=>o.classList.remove('correct','wrong'));if(s){if(s.value===a){c++;s.parentElement.classList.add('correct')}else{s.parentElement.classList.add('wrong');q.querySelectorAll('input').forEach(i=>{if(i.value===a)i.parentElement.classList.add('correct')})}}else{q.querySelectorAll('input').forEach(i=>{if(i.value===a)i.parentElement.classList.add('correct')})}});const p=Math.round(c/qs.length*100);const r=document.getElementById('r');r.style.display='block';r.style.background=p>=60?'#d1fae5':'#fee2e2';r.innerHTML='نتيجتك: '+c+' من '+qs.length+' ('+p+'%)';window.parent.postMessage({type:'exam-result',score:c,total:qs.length,percentage:p},'*')}</script></body></html>`;
    
    const escapedHtml = htmlContent.replace(/'/g, "''");
    await executeSQL(`
      INSERT INTO "Exam" ("id", "title", "description", "durationMinutes", "preventBack", "randomOrder", "showGrade", "showSolution", "passingScore", "isHtmlExam", "htmlContent", "lessonId", "createdAt")
      VALUES ('${htmlExamId}', 'امتحان تفاعلي - الجبر (HTML)', 'امتحان تفاعلي بـ HTML', 45, false, false, true, true, 50, true, '${escapedHtml}', '${lesson1Id}', NOW())
    `, 'امتحان HTML تفاعلي');

    // ===== التعليقات =====
    log.push('💬 إنشاء التعليقات...');
    await executeSQL(`
      INSERT INTO "Comment" ("id", "text", "rating", "userId", "lessonId", "createdAt")
      VALUES ('comment-001', 'شرح ممتاز! فهمت النهايات أخيراً. شكراً أستاذ محمد', 5, '${student1Id}', '${lesson1Id}', NOW())
    `, 'تعليق 1');
    await executeSQL(`
      INSERT INTO "Comment" ("id", "text", "rating", "userId", "lessonId", "createdAt")
      VALUES ('comment-002', 'الأمثلة كانت واضحة جداً، لكن أتمنى لو كانت هناك تمارين أكثر', 4, '${student2Id}', '${lesson1Id}', NOW())
    `, 'تعليق 2');

    // ===== الإشعارات =====
    log.push('🔔 إنشاء الإشعارات...');
    await executeSQL(`
      INSERT INTO "Notification" ("id", "title", "message", "type", "userId", "read", "createdAt")
      VALUES ('notif-001', 'درس جديد', 'تم إضافة درس جديد: قواعد الاشتقاق', 'INFO', '${student1Id}', false, NOW())
    `, 'إشعار 1');
    await executeSQL(`
      INSERT INTO "Notification" ("id", "title", "message", "type", "userId", "read", "createdAt")
      VALUES ('notif-002', 'نتيجة الواجب', 'تم تصحيح واجبك. حصلت على 18/20', 'SUCCESS', '${student1Id}', false, NOW())
    `, 'إشعار 2');
    await executeSQL(`
      INSERT INTO "Notification" ("id", "title", "message", "type", "read", "createdAt")
      VALUES ('notif-003', 'إعلان عام', 'بدء التسجيل في الامتحان الشهري', 'INFO', false, NOW())
    `, 'إشعار 3');

    // ===== الكوبونات =====
    log.push('🎫 إنشاء الكوبونات...');
    await executeSQL(`
      INSERT INTO "Coupon" ("id", "code", "discount", "type", "maxUses", "usedCount", "expiry", "active")
      VALUES ('coupon-001', 'MATH50', 50, 'percentage', 100, 0, '2026-12-31', true)
    `, 'كوبون 1');
    await executeSQL(`
      INSERT INTO "Coupon" ("id", "code", "discount", "type", "maxUses", "usedCount", "expiry", "active")
      VALUES ('coupon-002', 'NEW100', 100, 'fixed', 50, 0, '2026-09-30', true)
    `, 'كوبون 2');

    // ===== الدرجات =====
    log.push('📊 إنشاء الدرجات...');
    await executeSQL(`
      INSERT INTO "Grade" ("id", "score", "totalScore", "itemType", "itemId", "title", "studentId", "studentName", "assignmentId", "date")
      VALUES ('grade-001', 18, 20, 'assignment', '${assignment1Id}', 'واجب النهايات', '${student1Id}', 'أحمد محمود', '${assignment1Id}', NOW())
    `, 'درجة 1');

    // ===== المدفوعات =====
    log.push('💳 إنشاء المدفوعات...');
    await executeSQL(`
      INSERT INTO "Payment" ("id", "amount", "subscriptionName", "method", "status", "studentId", "studentName", "date")
      VALUES ('pay-001', 249, 'الباقة الفصلية', 'card', 'completed', '${student1Id}', 'أحمد محمود', NOW())
    `, 'دفعة 1');
    await executeSQL(`
      INSERT INTO "Invoice" ("id", "amount", "subscriptionName", "status", "studentId", "date")
      VALUES ('inv-001', 249, 'الباقة الفصلية', 'paid', '${student1Id}', NOW())
    `, 'فاتورة 1');

    // ===== الشهادات =====
    log.push('🏆 إنشاء الشهادات...');
    await executeSQL(`
      INSERT INTO "Certificate" ("id", "courseName", "grade", "studentId", "studentName", "issueDate")
      VALUES ('cert-001', 'الأعداد النسبية', 95, '${student1Id}', 'أحمد محمود', NOW())
    `, 'شهادة 1');
    await executeSQL(`
      INSERT INTO "Certificate" ("id", "courseName", "grade", "studentId", "studentName", "issueDate")
      VALUES ('cert-002', 'الجبر الأساسي', 88, '${student1Id}', 'أحمد محمود', NOW())
    `, 'شهادة 2');

    log.push('✅ تم تعبئة قاعدة البيانات بنجاح!');

    return NextResponse.json({
      success: true,
      message: 'تم تعبئة قاعدة البيانات بنجاح!',
      log,
      credentials: {
        admin: 'admin@math.com / admin123',
        teacher: 'teacher@math.com / teacher123',
        student: 'student@math.com / student123',
      },
    });
  } catch (error: any) {
    console.error('Seed error:', error);
    return NextResponse.json({
      success: false,
      error: error.message || 'فشل في التعبئة',
      log,
    }, { status: 500 });
  }
}
