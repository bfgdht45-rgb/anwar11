import { NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { UserRole, QuestionType, Difficulty, NotificationType } from '@prisma/client';

// GET /api/seed - تعبئة قاعدة البيانات بالبيانات الأولية عبر المتصفح
export async function GET() {
  try {
    const log: string[] = [];

    log.push('🌱 بدء تعبئة قاعدة البيانات...');

    // مسح البيانات الموجودة
    log.push('🧹 مسح البيانات القديمة...');
    await db.grade.deleteMany();
    await db.notification.deleteMany();
    await db.payment.deleteMany();
    await db.invoice.deleteMany();
    await db.certificate.deleteMany();
    await db.coupon.deleteMany();
    await db.comment.deleteMany();
    await db.question.deleteMany();
    await db.assignment.deleteMany();
    await db.exam.deleteMany();
    await db.pDFFile.deleteMany();
    await db.additionalFile.deleteMany();
    await db.lesson.deleteMany();
    await db.unit.deleteMany();
    await db.user.deleteMany();

    // ===== المستخدمون =====
    log.push('👥 إنشاء المستخدمين...');
    const admin = await db.user.create({
      data: {
        email: 'admin@math.com',
        password: 'admin123',
        name: 'مدير المنصة',
        role: UserRole.ADMIN,
        avatar: '👨‍💼',
        phone: '01000000001',
      },
    });

    const teacher1 = await db.user.create({
      data: {
        email: 'teacher@math.com',
        password: 'teacher123',
        name: 'أ. محمد عبد الله',
        role: UserRole.TEACHER,
        avatar: '👨‍🏫',
        phone: '01000000002',
        bio: 'مدرس رياضيات للمرحلة الثانوية بخبرة 15 عاماً، خبير في الجبر والتفاضل والتكامل',
        rating: 4.9,
        studentsCount: 1240,
        lessonsCount: 86,
        totalEarnings: 184500,
        specialties: ['الجبر', 'التفاضل', 'التكامل', 'الهندسة التحليلية'],
      },
    });

    const teacher2 = await db.user.create({
      data: {
        email: 'fatima@math.com',
        password: 'teacher123',
        name: 'أ. فاطمة الزهراء',
        role: UserRole.TEACHER,
        avatar: '👩‍🏫',
        phone: '01000000005',
        bio: 'مدرسة رياضيات للمرحلة الإعدادية، متخصصة في الهندسة والقياس',
        rating: 4.8,
        studentsCount: 980,
        lessonsCount: 64,
        totalEarnings: 142000,
        specialties: ['الهندسة', 'القياس', 'الإحصاء'],
      },
    });

    const student1 = await db.user.create({
      data: {
        email: 'student@math.com',
        password: 'student123',
        name: 'أحمد محمود',
        role: UserRole.STUDENT,
        avatar: '🧑‍🎓',
        phone: '01000000003',
        stage: 'high',
        year: 'second',
        subscriptionStatus: 'active',
        subscriptionExpiry: new Date('2026-08-30'),
        completedLessons: [],
        favorites: [],
      },
    });

    const student2 = await db.user.create({
      data: {
        email: 'sara@math.com',
        password: 'student123',
        name: 'سارة أحمد',
        role: UserRole.STUDENT,
        avatar: '👩‍🎓',
        phone: '01000000004',
        stage: 'middle',
        year: 'third',
        subscriptionStatus: 'active',
        subscriptionExpiry: new Date('2026-07-15'),
        completedLessons: [],
        favorites: [],
      },
    });

    // ===== الوحدات =====
    log.push('📚 إنشاء الوحدات...');
    const units = [
      { title: 'الأعداد النسبية', description: 'دراسة الأعداد النسبية وعملياتها', order: 1, stageId: 'middle', yearId: 'first', color: 'oklch(0.65 0.16 165)' },
      { title: 'الجبر والمعادلات', description: 'حل المعادلات من الدرجة الأولى', order: 2, stageId: 'middle', yearId: 'first', color: 'oklch(0.7 0.17 50)' },
      { title: 'النسبة والتناسب', description: 'تطبيقات النسبة والتناسب', order: 1, stageId: 'middle', yearId: 'second', color: 'oklch(0.6 0.15 290)' },
      { title: 'الهندسة', description: 'أساسيات الهندسة والمضلعات', order: 2, stageId: 'middle', yearId: 'second', color: 'oklch(0.55 0.15 220)' },
      { title: 'الإحصاء', description: 'مبادئ الإحصاء', order: 1, stageId: 'middle', yearId: 'third', color: 'oklch(0.65 0.16 165)' },
      { title: 'الجبر', description: 'الجبر الخطي والمعادلات', order: 1, stageId: 'high', yearId: 'first', color: 'oklch(0.7 0.17 50)' },
      { title: 'التفاضل', description: 'مبادئ التفاضل', order: 1, stageId: 'high', yearId: 'second', color: 'oklch(0.6 0.15 290)' },
      { title: 'الهندسة التحليلية', description: 'الإحداثيات والمستقيمات', order: 2, stageId: 'high', yearId: 'second', color: 'oklch(0.55 0.15 220)' },
      { title: 'التكامل', description: 'التكامل المحدود', order: 1, stageId: 'high', yearId: 'third', color: 'oklch(0.65 0.16 165)' },
      { title: 'التفاضل المتقدم', description: 'نظرية النهايات', order: 2, stageId: 'high', yearId: 'third', color: 'oklch(0.7 0.17 50)' },
    ];

    const createdUnits = [];
    for (const u of units) {
      createdUnits.push(await db.unit.create({ data: u }));
    }

    // ===== الدروس =====
    log.push('🎥 إنشاء الدروس...');
    const lesson1 = await db.lesson.create({
      data: {
        title: 'مدخل إلى التفاضل - النهايات',
        description: 'في هذا الدرس سنتعرف على مفهوم النهايات وأهميتها في حساب التفاضل، وكيفية حساب نهاية الدوال المختلفة باستخدام القواعد الأساسية.',
        teacherId: teacher1.id,
        unitId: createdUnits[6].id,
        videoUrl: 'https://www.youtube.com/embed/M7lc1UVf-VE',
        videoSource: 'youtube',
        videoDuration: '24:35',
        views: 1240,
        order: 1,
        allowPdfDownload: true,
        pdfs: {
          create: [
            { name: 'ملخص النهايات.pdf', url: '#', size: '2.4 MB', pages: 12 },
            { name: 'تمارين محلولة.pdf', url: '#', size: '1.8 MB', pages: 8 },
          ],
        },
        additionalFiles: {
          create: [{ name: 'جدول النهايات الأساسية.png', url: '#', type: 'image' }],
        },
      },
    });

    const lesson2 = await db.lesson.create({
      data: {
        title: 'قواعد الاشتقاق',
        description: 'نتعرف في هذا الدرس على قواعد اشتقاق الدوال الأساسية: قاعدة القوة، قاعدة الجمع، قاعدة الضرب، قاعدة القسمة، والقاعدة السلسلية.',
        teacherId: teacher1.id,
        unitId: createdUnits[6].id,
        videoUrl: 'https://www.youtube.com/embed/M7lc1UVf-VE',
        videoSource: 'youtube',
        videoDuration: '32:18',
        views: 980,
        order: 2,
        allowPdfDownload: true,
        pdfs: { create: [{ name: 'قواعد الاشتقاق.pdf', url: '#', size: '3.1 MB', pages: 15 }] },
      },
    });

    const lesson3 = await db.lesson.create({
      data: {
        title: 'معادلة المستقيم',
        description: 'دراسة معادلة المستقيم بأشكالها المختلفة وحساب الميل والمسافة.',
        teacherId: teacher1.id,
        unitId: createdUnits[7].id,
        videoUrl: 'https://player.vimeo.com/video/76979871',
        videoSource: 'vimeo',
        videoDuration: '28:42',
        views: 760,
        order: 1,
        allowPdfDownload: false,
        pdfs: { create: [{ name: 'الهندسة التحليلية.pdf', url: '#', size: '2.7 MB', pages: 14 }] },
      },
    });

    const lesson4 = await db.lesson.create({
      data: {
        title: 'الأعداد النسبية وعملياتها',
        description: 'تعريف الأعداد النسبية وتمثيلها على المستقيم العددي.',
        teacherId: teacher2.id,
        unitId: createdUnits[0].id,
        videoUrl: 'https://www.youtube.com/embed/M7lc1UVf-VE',
        videoSource: 'youtube',
        videoDuration: '20:15',
        views: 540,
        order: 1,
        allowPdfDownload: true,
        pdfs: { create: [{ name: 'الأعداد النسبية.pdf', url: '#', size: '1.5 MB', pages: 7 }] },
      },
    });

    // ===== الواجبات =====
    log.push('📝 إنشاء الواجبات...');
    const assignment1 = await db.assignment.create({
      data: {
        title: 'واجب النهايات',
        description: 'حل التمارين التالية على نهاية الدوال',
        totalPoints: 20,
        autoGrade: true,
        lessonId: lesson1.id,
        questions: {
          create: [
            { type: QuestionType.MCQ, difficulty: Difficulty.EASY, text: 'ما هي قيمة lim(x→2) (x² + 3x)؟', options: ['10', '8', '12', '14'], correctAnswer: '10', explanation: 'نعوض بـ x=2: 4 + 6 = 10', points: 4 },
            { type: QuestionType.TRUEFALSE, difficulty: Difficulty.EASY, text: 'نهاية الدالة 1/x عند x→0 تساوي صفر.', correctAnswer: 'false', explanation: 'النهاية لا توجد', points: 4 },
            { type: QuestionType.FILL, difficulty: Difficulty.MEDIUM, text: 'lim(x→3) (x² - 9)/(x - 3) = ?', correctAnswer: '6', explanation: 'نحلل: (x-3)(x+3)/(x-3) = x+3 = 6', points: 4 },
            { type: QuestionType.MCQ, difficulty: Difficulty.MEDIUM, text: 'إذا كانت f(x) = sin(x)، فإن lim(x→0) f(x)/x = ؟', options: ['0', '1', '∞', 'غير معرف'], correctAnswer: '1', explanation: 'هذه نهاية شهيرة تساوي 1', points: 4 },
            { type: QuestionType.ESSAY, difficulty: Difficulty.HARD, text: 'اثبت باستخدام تعريف النهاية أن lim(x→2) (3x) = 6.', correctAnswer: 'باستخدام تعريف إبسلون-دلتا', points: 4 },
          ],
        },
      },
    });

    const assignment2 = await db.assignment.create({
      data: {
        title: 'تمارين قواعد الاشتقاق',
        description: 'تطبيق قواعد الاشتقاق المختلفة',
        totalPoints: 16,
        autoGrade: true,
        lessonId: lesson2.id,
        questions: {
          create: [
            { type: QuestionType.MCQ, difficulty: Difficulty.EASY, text: 'مشتقة الدالة f(x) = x⁵ هي:', options: ['5x⁴', 'x⁴', '5x', 'x⁵/5'], correctAnswer: '5x⁴', explanation: 'قاعدة القوة: n·x^(n-1)', points: 4 },
            { type: QuestionType.FILL, difficulty: Difficulty.MEDIUM, text: 'إذا كانت f(x) = x²·sin(x)، فإن f\'(x) = ؟', correctAnswer: '2x·sin(x) + x²·cos(x)', explanation: 'قاعدة الضرب', points: 4 },
            { type: QuestionType.TRUEFALSE, difficulty: Difficulty.EASY, text: 'مشتقة الدالة الثابتة تساوي صفر.', correctAnswer: 'true', points: 4 },
            { type: QuestionType.MCQ, difficulty: Difficulty.HARD, text: 'مشتقة f(x) = ln(x²+1) هي:', options: ['2x/(x²+1)', '1/(x²+1)', '2x', 'ln(2x)'], correctAnswer: '2x/(x²+1)', explanation: 'القاعدة السلسلية', points: 4 },
          ],
        },
      },
    });

    // ===== الامتحانات =====
    log.push('🏆 إنشاء الامتحانات...');
    const exam1 = await db.exam.create({
      data: {
        title: 'امتحان النهايات',
        description: 'امتحان شامل على نهاية الدوال',
        durationMinutes: 30,
        preventBack: true,
        randomOrder: true,
        showGrade: true,
        showSolution: true,
        passingScore: 60,
        questions: {
          create: [
            { type: QuestionType.MCQ, difficulty: Difficulty.EASY, points: 5, text: 'lim(x→1) (x³ - 1)/(x - 1) = ?', options: ['1', '2', '3', '0'], correctAnswer: '3', explanation: 'التحليل: x²+x+1 = 3' },
            { type: QuestionType.MCQ, difficulty: Difficulty.MEDIUM, points: 5, text: 'lim(x→0) (1 - cos(x))/x² = ?', options: ['0', '1/2', '1', '∞'], correctAnswer: '1/2', explanation: 'قاعدة لوبيتال' },
            { type: QuestionType.TRUEFALSE, difficulty: Difficulty.EASY, points: 5, text: 'إذا ولت f(x) إلى L، فإن f(x) - L تؤول إلى صفر.', correctAnswer: 'true' },
            { type: QuestionType.FILL, difficulty: Difficulty.HARD, points: 5, text: 'lim(x→∞) (3x² + 2x)/(x² - 1) = ?', correctAnswer: '3', explanation: 'بقسمة على x²' },
          ],
        },
      },
    });

    // امتحان HTML تفاعلي
    const htmlExamContent = `<!DOCTYPE html>
<html dir="rtl" lang="ar">
<head>
<meta charset="UTF-8">
<style>
  body { font-family: 'Cairo', system-ui, sans-serif; padding: 24px; background: #f8fafc; color: #1e293b; }
  h1 { color: #0f766e; border-bottom: 3px solid #0f766e; padding-bottom: 12px; }
  .question { background: white; padding: 20px; border-radius: 12px; margin-bottom: 16px; box-shadow: 0 1px 3px rgba(0,0,0,0.1); }
  .question h3 { color: #134e4a; margin-bottom: 12px; }
  .options label { display: block; padding: 10px 14px; margin: 6px 0; background: #f1f5f9; border-radius: 8px; cursor: pointer; transition: all 0.2s; }
  .options label:hover { background: #e0f2fe; }
  .options input { margin-left: 8px; }
  .correct { background: #d1fae5 !important; border-right: 4px solid #10b981; }
  .wrong { background: #fee2e2 !important; border-right: 4px solid #ef4444; }
  button { background: #0f766e; color: white; padding: 12px 28px; border: none; border-radius: 8px; font-size: 16px; cursor: pointer; margin-top: 16px; }
  button:hover { background: #115e59; }
  #result { padding: 20px; border-radius: 12px; margin-top: 20px; font-size: 18px; text-align: center; display: none; }
  .explanation { margin-top: 8px; padding: 10px; background: #fef3c7; border-radius: 6px; font-size: 14px; display: none; }
</style>
</head>
<body>
<h1>📝 امتحان الجبر التفاعلي</h1>
<p>اختر الإجابة الصحيحة لكل سؤال، ثم اضغط على "تصحيح الامتحان"</p>
<div class="question" data-correct="b">
  <h3>السؤال 1: ما حل المعادلة 2x + 6 = 14؟</h3>
  <div class="options">
    <label><input type="radio" name="q1" value="a"> أ) 2</label>
    <label><input type="radio" name="q1" value="b"> ب) 4</label>
    <label><input type="radio" name="q1" value="c"> ج) 6</label>
    <label><input type="radio" name="q1" value="d"> د) 8</label>
  </div>
  <div class="explanation">الشرح: 2x = 14 - 6 = 8، إذن x = 4</div>
</div>
<div class="question" data-correct="c">
  <h3>السؤال 2: ما قيمة x في x² = 49؟</h3>
  <div class="options">
    <label><input type="radio" name="q2" value="a"> أ) 5</label>
    <label><input type="radio" name="q2" value="b"> ب) 6</label>
    <label><input type="radio" name="q2" value="c"> ج) 7</label>
    <label><input type="radio" name="q2" value="d"> د) 8</label>
  </div>
  <div class="explanation">الشرح: √49 = 7</div>
</div>
<div class="question" data-correct="a">
  <h3>السؤال 3: ما ناتج 3 × (4 + 2)؟</h3>
  <div class="options">
    <label><input type="radio" name="q3" value="a"> أ) 18</label>
    <label><input type="radio" name="q3" value="b"> ب) 14</label>
    <label><input type="radio" name="q3" value="c"> ج) 12</label>
    <label><input type="radio" name="q3" value="d"> د) 24</label>
  </div>
  <div class="explanation">الشرح: 4+2=6، ثم 3×6=18</div>
</div>
<div class="question" data-correct="d">
  <h3>السؤال 4: ما حل 5x - 3 = 2x + 12؟</h3>
  <div class="options">
    <label><input type="radio" name="q4" value="a"> أ) 3</label>
    <label><input type="radio" name="q4" value="b"> ب) 4</label>
    <label><input type="radio" name="q4" value="c"> ج) 6</label>
    <label><input type="radio" name="q4" value="d"> د) 5</label>
  </div>
  <div class="explanation">الشرح: 5x - 2x = 12 + 3، 3x = 15، x = 5</div>
</div>
<div class="question" data-correct="b">
  <h3>السؤال 5: ما قيمة (3²)³ ؟</h3>
  <div class="options">
    <label><input type="radio" name="q5" value="a"> أ) 27</label>
    <label><input type="radio" name="q5" value="b"> ب) 729</label>
    <label><input type="radio" name="q5" value="c"> ج) 81</label>
    <label><input type="radio" name="q5" value="d"> د) 243</label>
  </div>
  <div class="explanation">الشرح: 3^(2×3) = 3⁶ = 729</div>
</div>
<button onclick="gradeExam()">تصحيح الامتحان ✅</button>
<div id="result"></div>
<script>
function gradeExam() {
  const questions = document.querySelectorAll('.question');
  let correct = 0;
  let total = questions.length;
  questions.forEach(q => {
    const correctAns = q.getAttribute('data-correct');
    const selected = q.querySelector('input:checked');
    const options = q.querySelectorAll('label');
    const explanation = q.querySelector('.explanation');
    options.forEach(opt => opt.classList.remove('correct', 'wrong'));
    if (selected) {
      if (selected.value === correctAns) { correct++; selected.parentElement.classList.add('correct'); }
      else {
        selected.parentElement.classList.add('wrong');
        options.forEach(opt => { const input = opt.querySelector('input'); if (input.value === correctAns) opt.classList.add('correct'); });
      }
    } else {
      options.forEach(opt => { const input = opt.querySelector('input'); if (input.value === correctAns) opt.classList.add('correct'); });
    }
    if (explanation) explanation.style.display = 'block';
  });
  const percentage = Math.round((correct / total) * 100);
  const result = document.getElementById('result');
  result.style.display = 'block';
  let color, message;
  if (percentage >= 80) { color = '#d1fae5'; message = '🎉 ممتاز! نتيجة رائعة'; }
  else if (percentage >= 60) { color = '#dbeafe'; message = '👍 جيد، تحتاج لمزيد من المراجعة'; }
  else { color = '#fee2e2'; message = '💪 تحتاج لمراجعة الدرس'; }
  result.style.background = color;
  result.innerHTML = '<strong>' + message + '</strong><br>نتيجتك: ' + correct + ' من ' + total + ' (' + percentage + '%)';
  window.parent.postMessage({ type: 'exam-result', score: correct, total: total, percentage: percentage }, '*');
}
</script>
</body>
</html>`;

    const htmlExam = await db.exam.create({
      data: {
        title: 'امتحان تفاعلي - الجبر (HTML)',
        description: 'امتحان تفاعلي مخصص بالكود HTML',
        durationMinutes: 45,
        preventBack: false,
        randomOrder: false,
        showGrade: true,
        showSolution: true,
        passingScore: 50,
        isHtmlExam: true,
        htmlContent: htmlExamContent,
        lessonId: lesson1.id,
      },
    });

    // ربط الامتحان بالدرس يتم تلقائياً عبر lessonId

    // ===== التعليقات =====
    log.push('💬 إنشاء التعليقات...');
    await db.comment.create({
      data: {
        text: 'شرح ممتاز! فهمت النهايات أخيراً. شكراً أستاذ محمد 🙏',
        rating: 5,
        userId: student1.id,
        lessonId: lesson1.id,
      },
    });
    await db.comment.create({
      data: {
        text: 'الأمثلة كانت واضحة جداً، لكن أتمنى لو كانت هناك تمارين أكثر.',
        rating: 4,
        userId: student2.id,
        lessonId: lesson1.id,
      },
    });

    // ===== الإشعارات =====
    log.push('🔔 إنشاء الإشعارات...');
    await db.notification.create({ data: { title: 'درس جديد', message: 'تم إضافة درس جديد: قواعد الاشتقاق', type: NotificationType.INFO, userId: student1.id } });
    await db.notification.create({ data: { title: 'نتيجة الواجب', message: 'تم تصحيح واجبك. حصلت على 18/20', type: NotificationType.SUCCESS, userId: student1.id } });
    await db.notification.create({ data: { title: 'تجديد الاشتراك', message: 'اشتراكك ينتهي خلال 30 يوماً', type: NotificationType.WARNING, userId: student1.id } });
    await db.notification.create({ data: { title: 'إعلان عام', message: 'بدء التسجيل في الامتحان الشهري', type: NotificationType.INFO } });

    // ===== الكوبونات =====
    log.push('🎫 إنشاء الكوبونات...');
    await db.coupon.create({ data: { code: 'MATH50', discount: 50, type: 'percentage', maxUses: 100, expiry: new Date('2026-12-31'), active: true } });
    await db.coupon.create({ data: { code: 'NEW100', discount: 100, type: 'fixed', maxUses: 50, expiry: new Date('2026-09-30'), active: true } });
    await db.coupon.create({ data: { code: 'SUMMER25', discount: 25, type: 'percentage', maxUses: 200, expiry: new Date('2026-08-31'), active: true } });

    // ===== الدرجات =====
    log.push('📊 إنشاء الدرجات...');
    await db.grade.create({ data: { score: 18, totalScore: 20, itemType: 'assignment', itemId: assignment1.id, title: 'واجب النهايات', studentId: student1.id, studentName: student1.name, assignmentId: assignment1.id } });
    await db.grade.create({ data: { score: 17, totalScore: 20, itemType: 'exam', itemId: exam1.id, title: 'امتحان النهايات', studentId: student1.id, studentName: student1.name, examId: exam1.id } });

    // ===== المدفوعات =====
    log.push('💳 إنشاء المدفوعات...');
    await db.payment.create({ data: { amount: 249, subscriptionName: 'الباقة الفصلية', method: 'card', status: 'completed', studentId: student1.id, studentName: student1.name } });
    await db.payment.create({ data: { amount: 99, subscriptionName: 'الباقة الشهرية', method: 'vodafone_cash', status: 'completed', studentId: student2.id, studentName: student2.name } });

    // ===== الفواتير =====
    await db.invoice.create({ data: { amount: 249, subscriptionName: 'الباقة الفصلية', status: 'paid', studentId: student1.id } });

    // ===== الشهادات =====
    log.push('🏆 إنشاء الشهادات...');
    await db.certificate.create({ data: { courseName: 'الأعداد النسبية', grade: 95, studentId: student1.id, studentName: student1.name } });
    await db.certificate.create({ data: { courseName: 'الجبر الأساسي', grade: 88, studentId: student1.id, studentName: student1.name } });

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
  } catch (error) {
    console.error('Seed error:', error);
    return NextResponse.json({
      success: false,
      error: error instanceof Error ? error.message : 'فشل في التعبئة',
    }, { status: 500 });
  }
}
