import type {
  User, Stage, Unit, Lesson, Assignment, Exam, QuestionBankItem,
  Comment, Review, Notification, Coupon, Subscription, Payment,
  Invoice, Certificate, FAQ, Grade, AppStats
} from './types';

// ===== Demo Users =====
export const demoUsers: User[] = [
  {
    id: 'admin-1',
    name: 'مدير المنصة',
    email: 'admin@math.com',
    password: 'admin123',
    role: 'admin',
    avatar: '👨‍💼',
    phone: '01000000001',
    createdAt: '2024-01-01',
  },
  {
    id: 'teacher-1',
    name: 'أ. محمد عبد الله',
    email: 'teacher@math.com',
    password: 'teacher123',
    role: 'teacher',
    avatar: '👨‍🏫',
    phone: '01000000002',
    bio: 'مدرس رياضيات للمرحلة الثانوية بخبرة 15 عاماً، خبير في الجبر والتفاضل والتكامل',
    rating: 4.9,
    studentsCount: 1240,
    lessonsCount: 86,
    totalEarnings: 184500,
    specialties: ['الجبر', 'التفاضل', 'التكامل', 'الهندسة التحليلية'],
    createdAt: '2024-01-05',
  },
  {
    id: 'teacher-2',
    name: 'أ. فاطمة الزهراء',
    email: 'fatima@math.com',
    password: 'teacher123',
    role: 'teacher',
    avatar: '👩‍🏫',
    bio: 'مدرسة رياضيات للمرحلة الإعدادية، متخصصة في الهندسة والقياس',
    rating: 4.8,
    studentsCount: 980,
    lessonsCount: 64,
    totalEarnings: 142000,
    specialties: ['الهندسة', 'القياس', 'الإحصاء'],
    createdAt: '2024-02-10',
  },
  {
    id: 'student-1',
    name: 'أحمد محمود',
    email: 'student@math.com',
    password: 'student123',
    role: 'student',
    avatar: '🧑‍🎓',
    phone: '01000000003',
    stage: 'high',
    year: 'second',
    subscriptionStatus: 'active',
    subscriptionExpiry: '2026-08-30',
    completedLessons: ['lesson-1', 'lesson-2', 'lesson-3'],
    favorites: ['lesson-1'],
    createdAt: '2024-09-01',
  },
  {
    id: 'student-2',
    name: 'سارة أحمد',
    email: 'sara@math.com',
    password: 'student123',
    role: 'student',
    avatar: '👩‍🎓',
    phone: '01000000004',
    stage: 'middle',
    year: 'third',
    subscriptionStatus: 'active',
    subscriptionExpiry: '2026-07-15',
    completedLessons: ['lesson-1'],
    favorites: [],
    createdAt: '2024-09-15',
  },
];

// ===== Educational Stages =====
export const stages: Stage[] = [
  {
    id: 'middle',
    name: 'المرحلة الإعدادية',
    nameEn: 'Middle School',
    icon: '🎓',
    years: [
      { id: 'first', stageId: 'middle', name: 'الأولى الإعدادية', icon: '1️⃣' },
      { id: 'second', stageId: 'middle', name: 'الثانية الإعدادية', icon: '2️⃣' },
      { id: 'third', stageId: 'middle', name: 'الثالثة الإعدادية', icon: '3️⃣' },
    ],
  },
  {
    id: 'high',
    name: 'المرحلة الثانوية',
    nameEn: 'High School',
    icon: '🏫',
    years: [
      { id: 'first', stageId: 'high', name: 'الأولى الثانوية', icon: '1️⃣' },
      { id: 'second', stageId: 'high', name: 'الثانية الثانوية', icon: '2️⃣' },
      { id: 'third', stageId: 'high', name: 'الثالثة الثانوية', icon: '3️⃣' },
    ],
  },
];

// ===== Units =====
export const units: Unit[] = [
  // Middle - First Year
  {
    id: 'unit-m-1-1', yearId: 'first', stageId: 'middle', order: 1,
    title: 'الأعداد النسبية',
    description: 'دراسة الأعداد النسبية وعملياتها',
    lessonsCount: 5, color: 'oklch(0.65 0.16 165)',
  },
  {
    id: 'unit-m-1-2', yearId: 'first', stageId: 'middle', order: 2,
    title: 'الجبر والمعادلات',
    description: 'حل المعادلات من الدرجة الأولى',
    lessonsCount: 6, color: 'oklch(0.7 0.17 50)',
  },
  // Middle - Second Year
  {
    id: 'unit-m-2-1', yearId: 'second', stageId: 'middle', order: 1,
    title: 'النسبة والتناسب',
    description: 'تطبيقات النسبة والتناسب في الحياة',
    lessonsCount: 4, color: 'oklch(0.6 0.15 290)',
  },
  {
    id: 'unit-m-2-2', yearId: 'second', stageId: 'middle', order: 2,
    title: 'الهندسة',
    description: 'أساسيات الهندسة والمضلعات',
    lessonsCount: 5, color: 'oklch(0.55 0.15 220)',
  },
  // Middle - Third Year
  {
    id: 'unit-m-3-1', yearId: 'third', stageId: 'middle', order: 1,
    title: 'الإحصاء',
    description: 'مبادئ الإحصاء وتمثيل البيانات',
    lessonsCount: 4, color: 'oklch(0.65 0.16 165)',
  },
  // High - First Year
  {
    id: 'unit-h-1-1', yearId: 'first', stageId: 'high', order: 1,
    title: 'الجبر',
    description: 'الجبر الخطي والمعادلات',
    lessonsCount: 7, color: 'oklch(0.7 0.17 50)',
  },
  // High - Second Year
  {
    id: 'unit-h-2-1', yearId: 'second', stageId: 'high', order: 1,
    title: 'التفاضل',
    description: 'مبادئ التفاضل والتطبيقات',
    lessonsCount: 8, color: 'oklch(0.6 0.15 290)',
  },
  {
    id: 'unit-h-2-2', yearId: 'second', stageId: 'high', order: 2,
    title: 'الهندسة التحليلية',
    description: 'الإحداثيات والمستقيمات والدوائر',
    lessonsCount: 6, color: 'oklch(0.55 0.15 220)',
  },
  // High - Third Year
  {
    id: 'unit-h-3-1', yearId: 'third', stageId: 'high', order: 1,
    title: 'التكامل',
    description: 'التكامل المحدود وغير المحدود',
    lessonsCount: 9, color: 'oklch(0.65 0.16 165)',
  },
  {
    id: 'unit-h-3-2', yearId: 'third', stageId: 'high', order: 2,
    title: 'التفاضل المتقدم',
    description: 'نظرية النهايات والاشتقاق',
    lessonsCount: 7, color: 'oklch(0.7 0.17 50)',
  },
];

// ===== Sample Lessons =====
export const demoLessons: Lesson[] = [
  {
    id: 'lesson-1',
    unitId: 'unit-h-2-1',
    title: 'مدخل إلى التفاضل - النهايات',
    description: 'في هذا الدرس سنتعرف على مفهوم النهايات وأهميتها في حساب التفاضل، وكيفية حساب نهاية الدوال المختلفة باستخدام القواعد الأساسية. سيشمل الدرس أمثلة محلولة بالتفصيل وتمارين متنوعة.',
    teacherId: 'teacher-1',
    videoUrl: 'https://www.youtube.com/embed/M7lc1UVf-VE',
    videoSource: 'youtube',
    videoDuration: '24:35',
    pdfs: [
      { id: 'pdf-1', name: 'ملخص النهايات.pdf', url: '#', size: '2.4 MB', pages: 12 },
      { id: 'pdf-2', name: 'تمارين محلولة.pdf', url: '#', size: '1.8 MB', pages: 8 },
    ],
    additionalFiles: [
      { id: 'file-1', name: 'جدول النهايات الأساسية.png', url: '#', type: 'image' },
    ],
    assignmentId: 'assign-1',
    examId: 'exam-html-1',
    views: 1240,
    order: 1,
    createdAt: '2024-10-15',
    allowPdfDownload: true,
  },
  {
    id: 'lesson-2',
    unitId: 'unit-h-2-1',
    title: 'قواعد الاشتقاق',
    description: 'نتعرف في هذا الدرس على قواعد اشتقاق الدوال الأساسية: قاعدة القوة، قاعدة الجمع، قاعدة الضرب، قاعدة القسمة، والقاعدة السلسلية. مع أمثلة تطبيقية شاملة.',
    teacherId: 'teacher-1',
    videoUrl: 'https://www.youtube.com/embed/M7lc1UVf-VE',
    videoSource: 'youtube',
    videoDuration: '32:18',
    pdfs: [{ id: 'pdf-3', name: 'قواعد الاشتقاق.pdf', url: '#', size: '3.1 MB', pages: 15 }],
    additionalFiles: [],
    assignmentId: 'assign-2',
    views: 980,
    order: 2,
    createdAt: '2024-10-20',
    allowPdfDownload: true,
  },
  {
    id: 'lesson-3',
    unitId: 'unit-h-2-2',
    title: 'معادلة المستقيم',
    description: 'دراسة معادلة المستقيم بأشكالها المختلفة: الميل والمقطع، نقطتان، الصورة العامة. وحساب الميل والمسافة بين نقطة ومستقيم.',
    teacherId: 'teacher-1',
    videoUrl: 'https://player.vimeo.com/video/76979871',
    videoSource: 'vimeo',
    videoDuration: '28:42',
    pdfs: [{ id: 'pdf-4', name: 'الهندسة التحليلية.pdf', url: '#', size: '2.7 MB', pages: 14 }],
    additionalFiles: [],
    views: 760,
    order: 1,
    createdAt: '2024-10-25',
    allowPdfDownload: false,
  },
  {
    id: 'lesson-4',
    unitId: 'unit-m-1-1',
    title: 'الأعداد النسبية وعملياتها',
    description: 'تعريف الأعداد النسبية، تمثيلها على المستقيم العددي، وإجراء العمليات الحسابية عليها من جمع وطرح وضرب وقسمة.',
    teacherId: 'teacher-2',
    videoUrl: 'https://www.youtube.com/embed/M7lc1UVf-VE',
    videoSource: 'youtube',
    videoDuration: '20:15',
    pdfs: [{ id: 'pdf-5', name: 'الأعداد النسبية.pdf', url: '#', size: '1.5 MB', pages: 7 }],
    additionalFiles: [],
    views: 540,
    order: 1,
    createdAt: '2024-11-01',
    allowPdfDownload: true,
  },
];

// ===== Sample Assignments =====
export const demoAssignments: Assignment[] = [
  {
    id: 'assign-1',
    lessonId: 'lesson-1',
    title: 'واجب النهايات',
    description: 'حل التمارين التالية على نهاية الدوال',
    dueDate: '2026-07-15',
    totalPoints: 20,
    autoGrade: true,
    questions: [
      {
        id: 'q1', type: 'mcq', difficulty: 'easy', points: 4,
        text: 'ما هي قيمة lim(x→2) (x² + 3x)؟',
        options: ['10', '8', '12', '14'],
        correctAnswer: '10',
        explanation: 'نعوض بـ x=2: 4 + 6 = 10',
      },
      {
        id: 'q2', type: 'truefalse', difficulty: 'easy', points: 4,
        text: 'نهاية الدالة 1/x عند x→0 تساوي صفر.',
        correctAnswer: 'false',
        explanation: 'النهاية لا توجد (تؤول إلى المالانهاية)',
      },
      {
        id: 'q3', type: 'fill', difficulty: 'medium', points: 4,
        text: 'lim(x→3) (x² - 9)/(x - 3) = ?',
        correctAnswer: '6',
        explanation: 'نحلل: (x-3)(x+3)/(x-3) = x+3 = 6',
      },
      {
        id: 'q4', type: 'mcq', difficulty: 'medium', points: 4,
        text: 'إذا كانت f(x) = sin(x)، فإن lim(x→0) f(x)/x = ؟',
        options: ['0', '1', '∞', 'غير معرف'],
        correctAnswer: '1',
        explanation: 'هذه نهاية شهيرة تساوي 1',
      },
      {
        id: 'q5', type: 'essay', difficulty: 'hard', points: 4,
        text: 'اثبت باستخدام تعريف النهاية أن lim(x→2) (3x) = 6.',
        correctAnswer: 'باستخدام تعريف إبسلون-دلتا، لأي ε>0 نختار δ=ε/3، فإذا كان |x-2|<δ فإن |3x-6|=3|x-2|<3δ=ε.',
      },
    ],
  },
  {
    id: 'assign-2',
    lessonId: 'lesson-2',
    title: 'تمارين قواعد الاشتقاق',
    description: 'تطبيق قواعد الاشتقاق المختلفة',
    dueDate: '2026-07-20',
    totalPoints: 16,
    autoGrade: true,
    questions: [
      {
        id: 'q6', type: 'mcq', difficulty: 'easy', points: 4,
        text: 'مشتقة الدالة f(x) = x⁵ هي:',
        options: ['5x⁴', 'x⁴', '5x', 'x⁵/5'],
        correctAnswer: '5x⁴',
        explanation: 'باستخدام قاعدة القوة: n·x^(n-1) = 5x⁴',
      },
      {
        id: 'q7', type: 'fill', difficulty: 'medium', points: 4,
        text: 'إذا كانت f(x) = x²·sin(x)، فإن f\'(x) = __________',
        correctAnswer: '2x·sin(x) + x²·cos(x)',
        explanation: 'باستخدام قاعدة الضرب: (fg)\' = f\'g + fg\'',
      },
      {
        id: 'q8', type: 'truefalse', difficulty: 'easy', points: 4,
        text: 'مشتقة الدالة الثابتة تساوي صفر.',
        correctAnswer: 'true',
      },
      {
        id: 'q9', type: 'mcq', difficulty: 'hard', points: 4,
        text: 'مشتقة الدالة f(x) = ln(x²+1) هي:',
        options: ['2x/(x²+1)', '1/(x²+1)', '2x', 'ln(2x)'],
        correctAnswer: '2x/(x²+1)',
        explanation: 'باستخدام القاعدة السلسلية: f\'(g(x))·g\'(x)',
      },
    ],
  },
];

// ===== Sample Exams (including HTML exam) =====
export const demoExams: Exam[] = [
  {
    id: 'exam-1',
    lessonId: 'lesson-1',
    title: 'امتحان النهايات',
    description: 'امتحان شامل على نهاية الدوال',
    durationMinutes: 30,
    preventBack: true,
    randomOrder: true,
    showGrade: true,
    showSolution: true,
    passingScore: 60,
    questions: [
      {
        id: 'eq1', type: 'mcq', difficulty: 'easy', points: 5,
        text: 'lim(x→1) (x³ - 1)/(x - 1) = ?',
        options: ['1', '2', '3', '0'],
        correctAnswer: '3',
        explanation: 'التحليل: (x-1)(x²+x+1)/(x-1) = x²+x+1 = 3',
      },
      {
        id: 'eq2', type: 'mcq', difficulty: 'medium', points: 5,
        text: 'lim(x→0) (1 - cos(x))/x² = ?',
        options: ['0', '1/2', '1', '∞'],
        correctAnswer: '1/2',
        explanation: 'باستخدام متسلسلة تايلور أو قاعدة لوبيتال',
      },
      {
        id: 'eq3', type: 'truefalse', difficulty: 'easy', points: 5,
        text: 'إذا ولت f(x) إلى L، فإن f(x) - L تؤول إلى صفر.',
        correctAnswer: 'true',
      },
      {
        id: 'eq4', type: 'fill', difficulty: 'hard', points: 5,
        text: 'lim(x→∞) (3x² + 2x)/(x² - 1) = ?',
        correctAnswer: '3',
        explanation: 'بقسمة البسط والمقام على x²',
      },
    ],
  },
  // HTML Interactive Exam Sample
  {
    id: 'exam-html-1',
    title: 'امتحان تفاعلي - الجبر (HTML)',
    description: 'امتحان تفاعلي مخصص بالكود HTML',
    durationMinutes: 45,
    preventBack: false,
    randomOrder: false,
    showGrade: true,
    showSolution: true,
    passingScore: 50,
    isHtmlExam: true,
    htmlContent: `<!DOCTYPE html>
<html dir="rtl" lang="ar">
<head>
<meta charset="UTF-8">
<style>
  body { font-family: 'Cairo', system-ui, sans-serif; padding: 24px; background: #f8fafc; color: #1e293b; }
  h1 { color: #0f766e; border-bottom: 3px solid #0f766e; padding-bottom: 12px; }
  .question { background: white; padding: 20px; border-radius: 12px; margin-bottom: 16px; box-shadow: 0 1px 3px rgba(0,0,0,0.1); }
  .question h3 { color: #134e4a; margin-bottom: 12px; }
  .options label { display: block; padding: 10px 14px; margin: 6px 0; background: #f1f5f9; border-radius: 8px; cursor: pointer; transition: all 0.2s; }
  .options label:hover { background: #e0f2fe1; }
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
    
    options.forEach(opt => {
      opt.classList.remove('correct', 'wrong');
    });
    
    if (selected) {
      if (selected.value === correctAns) {
        correct++;
        selected.parentElement.classList.add('correct');
      } else {
        selected.parentElement.classList.add('wrong');
        // Highlight correct answer
        options.forEach(opt => {
          const input = opt.querySelector('input');
          if (input.value === correctAns) {
            opt.classList.add('correct');
          }
        });
      }
    } else {
      // Show correct answer if nothing selected
      options.forEach(opt => {
        const input = opt.querySelector('input');
        if (input.value === correctAns) {
          opt.classList.add('correct');
        }
      });
    }
    
    if (explanation) explanation.style.display = 'block';
  });
  
  const percentage = Math.round((correct / total) * 100);
  const result = document.getElementById('result');
  result.style.display = 'block';
  
  let color, message;
  if (percentage >= 80) {
    color = '#d1fae5'; message = '🎉 ممتاز! نتيجة رائعة';
  } else if (percentage >= 60) {
    color = '#dbeafe'; message = '👍 جيد، تحتاج لمزيد من المراجعة';
  } else {
    color = '#fee2e2'; message = '💪 تحتاج لمراجعة الدرس مرة أخرى';
  }
  
  result.style.background = color;
  result.innerHTML = '<strong>' + message + '</strong><br>نتيجتك: ' + correct + ' من ' + total + ' (' + percentage + '%)';
  
  // Send score to parent window
  window.parent.postMessage({
    type: 'exam-result',
    score: correct,
    total: total,
    percentage: percentage
  }, '*');
}
</script>
</body>
</html>`,
  },
];

// ===== Question Bank =====
export const questionBank: QuestionBankItem[] = [
  // ... can be expanded
  { id: 'qb-1', type: 'mcq', difficulty: 'easy', points: 5, stageId: 'high', yearId: 'second',
    text: 'مشتقة sin(x) هي:', options: ['cos(x)', '-cos(x)', '-sin(x)', 'tan(x)'],
    correctAnswer: 'cos(x)', explanation: 'قاعدة مشتقة الجيب' },
  { id: 'qb-2', type: 'mcq', difficulty: 'medium', points: 5, stageId: 'high', yearId: 'second',
    text: '∫x dx = ?', options: ['x²/2 + C', 'x² + C', '2x + C', '1/x + C'],
    correctAnswer: 'x²/2 + C', explanation: 'قاعدة التكامل الأساسية' },
  { id: 'qb-3', type: 'truefalse', difficulty: 'easy', points: 5, stageId: 'middle', yearId: 'first',
    text: 'العدد صفر عدد نسبي.', correctAnswer: 'true' },
];

// ===== Comments =====
export const demoComments: Comment[] = [
  {
    id: 'c1', lessonId: 'lesson-1', userId: 'student-1', userName: 'أحمد محمود', userAvatar: '🧑‍🎓',
    text: 'شرح ممتاز! فهمت النهايات أخيراً. شكراً أستاذ محمد 🙏',
    rating: 5, createdAt: '2024-10-16',
  },
  {
    id: 'c2', lessonId: 'lesson-1', userId: 'student-2', userName: 'سارة أحمد', userAvatar: '👩‍🎓',
    text: 'الأمثلة كانت واضحة جداً، لكن أتمنى لو كانت هناك تمارين أكثر على النهاية عند المالانهاية.',
    rating: 4, createdAt: '2024-10-17',
  },
  {
    id: 'c3', lessonId: 'lesson-1', userId: 'teacher-1', userName: 'أ. محمد عبد الله', userAvatar: '👨‍🏫',
    text: 'شكراً سارة، سأضيف تمارين إضافية في الدرس القادم إن شاء الله.',
    createdAt: '2024-10-17',
  },
];

// ===== Reviews =====
export const demoReviews: Review[] = [
  { id: 'r1', studentName: 'محمد علي', avatar: '🧑', text: 'المنصة غيّرت طريقة فهمي للرياضيات تماماً. الشرح مبسط والامتحانات التفاعلية رائعة!', rating: 5, stage: 'الثالثة الثانوية' },
  { id: 'r2', studentName: 'فاطمة حسن', avatar: '👩', text: 'أحببت نظام المتابعة والشهادات. أصبحت أكثر التزاماً بدراستي.', rating: 5, stage: 'الثانية الثانوية' },
  { id: 'r3', studentName: 'يوسف إبراهيم', avatar: '👦', text: 'المدرسون محترفون والفيديوهات بجودة عالية. أنصح كل طلاب الرياضيات بالاشتراك.', rating: 5, stage: 'الثالثة الإعدادية' },
  { id: 'r4', studentName: 'مريم خالد', avatar: '👧', text: 'الأسعار مناسبة جداً مقارنة بالمحتوى. بنك الأسئلة ساعدني كثيراً في المراجعة.', rating: 4, stage: 'الأولى الثانوية' },
];

// ===== Notifications =====
export const demoNotifications: Notification[] = [
  { id: 'n1', userId: 'student-1', title: 'درس جديد', message: 'تم إضافة درس جديد: قواعد الاشتقاق', type: 'info', createdAt: '2026-06-28', read: false },
  { id: 'n2', userId: 'student-1', title: 'نتيجة الواجب', message: 'تم تصحيح واجبك. حصلت على 18/20', type: 'success', createdAt: '2026-06-27', read: false },
  { id: 'n3', userId: 'student-1', title: 'تجديد الاشتراك', message: 'اشتراكك ينتهي خلال 30 يوماً', type: 'warning', createdAt: '2026-06-25', read: true },
  { id: 'n4', title: 'إعلان عام', message: 'بدء التسجيل في الامتحان الشهري', type: 'info', createdAt: '2026-06-24', read: false },
];

// ===== Coupons =====
export const demoCoupons: Coupon[] = [
  { id: 'cp1', code: 'MATH50', discount: 50, type: 'percentage', maxUses: 100, usedCount: 23, expiry: '2026-12-31', active: true },
  { id: 'cp2', code: 'NEW100', discount: 100, type: 'fixed', maxUses: 50, usedCount: 12, expiry: '2026-09-30', active: true },
  { id: 'cp3', code: 'SUMMER25', discount: 25, type: 'percentage', maxUses: 200, usedCount: 87, expiry: '2026-08-31', active: true },
];

// ===== Subscriptions =====
export const demoSubscriptions: Subscription[] = [
  {
    id: 'sub-1', name: 'الباقة الشهرية', price: 99, duration: 'شهر واحد',
    features: ['الوصول لجميع الدروس', 'الواجبات والامتحانات', 'متابعة الدرجات', 'شهادات الإتمام'],
  },
  {
    id: 'sub-2', name: 'الباقة الفصلية', price: 249, duration: '3 أشهر',
    features: ['كل مزايا الباقة الشهرية', 'تحميل ملفات PDF', 'بنك الأسئلة الكامل', 'دعم فني مميز', 'مجموعة واتساب'],
    popular: true,
  },
  {
    id: 'sub-3', name: 'الباقة السنوية', price: 899, duration: 'سنة كاملة',
    features: ['كل مزايا الباقة الفصلية', 'حصص مباشرة شهرية', 'متابعة فردية', 'خصومات على الكتب', 'أولوية في الدعم'],
  },
];

// ===== Payments =====
export const demoPayments: Payment[] = [
  { id: 'pay-1', studentId: 'student-1', studentName: 'أحمد محمود', amount: 249, subscriptionName: 'الباقة الفصلية', method: 'card', status: 'completed', date: '2026-06-01' },
  { id: 'pay-2', studentId: 'student-2', studentName: 'سارة أحمد', amount: 99, subscriptionName: 'الباقة الشهرية', method: 'vodafone_cash', status: 'completed', date: '2026-06-15' },
  { id: 'pay-3', studentId: 'student-1', studentName: 'أحمد محمود', amount: 899, subscriptionName: 'الباقة السنوية', method: 'paypal', status: 'pending', date: '2026-06-28' },
];

// ===== Invoices =====
export const demoInvoices: Invoice[] = [
  { id: 'inv-1', studentId: 'student-1', amount: 249, subscriptionName: 'الباقة الفصلية', date: '2026-06-01', status: 'paid' },
  { id: 'inv-2', studentId: 'student-1', amount: 899, subscriptionName: 'الباقة السنوية', date: '2026-06-28', status: 'unpaid' },
];

// ===== Certificates =====
export const demoCertificates: Certificate[] = [
  { id: 'cert-1', studentId: 'student-1', studentName: 'أحمد محمود', courseName: 'الأعداد النسبية', issueDate: '2026-06-15', grade: 95 },
  { id: 'cert-2', studentId: 'student-1', studentName: 'أحمد محمود', courseName: 'الجبر الأساسي', issueDate: '2026-06-20', grade: 88 },
];

// ===== FAQ =====
export const demoFAQ: FAQ[] = [
  { id: 'f1', question: 'كيف أشترك في المنصة؟', answer: 'يمكنك التسجيل مجاناً ثم اختيار الباقة المناسبة لك من صفحة الاشتراكات. بعد إتمام الدفع ستحصل على وصول كامل لجميع الدروس.' },
  { id: 'f2', question: 'هل توجد فترة تجريبية مجانية؟', answer: 'نعم، نقدم 7 أيام تجربة مجانية لجميع الباقات، يمكنك فيها الاطلاع على المحتوى وتجربة المنصة قبل الاشتراك.' },
  { id: 'f3', question: 'ما طرق الدفع المتاحة؟', answer: 'نقبل البطاقات الائتمانية (Visa/Mastercard)، PayPal، فودافون كاش، فوري، ومحفظة إتم.' },
  { id: 'f4', question: 'هل يمكنني تحميل الفيديوهات؟', answer: 'لا يمكن تحميل الفيديوهات لحماية حقوق الملكية، لكن يمكنك مشاهدتها في أي وقت من خلال المنصة، وكذلك تحميل ملفات PDF إن سمح الأدمن.' },
  { id: 'f5', question: 'كيف أحصل على شهادة إتمام؟', answer: 'بعد إكمال جميع دروس الوحدة واجتياز الامتحان النهائي بنسبة 60% على الأقل، ستصلك شهادة إتمام معتمدة تلقائياً.' },
  { id: 'f6', question: 'هل المنصة متوافقة مع الموبايل؟', answer: 'نعم، المنصة تعمل على جميع الأجهزة (كمبيوتر، تابلت، موبايل) وتتكيف مع جميع أحجام الشاشات.' },
];

// ===== Grades =====
export const demoGrades: Grade[] = [
  { id: 'g1', studentId: 'student-1', studentName: 'أحمد محمود', itemId: 'assign-1', itemType: 'assignment', title: 'واجب النهايات', score: 18, totalScore: 20, date: '2026-06-15' },
  { id: 'g2', studentId: 'student-1', studentName: 'أحمد محمود', itemId: 'exam-1', itemType: 'exam', title: 'امتحان النهايات', score: 17, totalScore: 20, date: '2026-06-18' },
  { id: 'g3', studentId: 'student-2', studentName: 'سارة أحمد', itemId: 'assign-1', itemType: 'assignment', title: 'واجب النهايات', score: 15, totalScore: 20, date: '2026-06-16' },
];

// ===== App Stats =====
export const demoStats: AppStats = {
  totalStudents: 3245,
  totalTeachers: 18,
  totalSubscriptions: 2890,
  totalVideos: 486,
  totalLessons: 524,
  totalExams: 124,
  totalVisits: 89520,
  totalRevenue: 458900,
  monthlyRevenue: [
    { month: 'يناير', revenue: 28500 },
    { month: 'فبراير', revenue: 32100 },
    { month: 'مارس', revenue: 35800 },
    { month: 'أبريل', revenue: 38900 },
    { month: 'مايو', revenue: 42100 },
    { month: 'يونيو', revenue: 48500 },
  ],
  weeklyVisits: [
    { day: 'السبت', visits: 1200 },
    { day: 'الأحد', visits: 1450 },
    { day: 'الإثنين', visits: 1320 },
    { day: 'الثلاثاء', visits: 1580 },
    { day: 'الأربعاء', visits: 1690 },
    { day: 'الخميس', visits: 1820 },
    { day: 'الجمعة', visits: 980 },
  ],
};

// ===== Helper =====
export const getStageName = (stage: string) => stages.find(s => s.id === stage)?.name || '';
export const getYearName = (stage: string, year: string) =>
  stages.find(s => s.id === stage)?.years.find(y => y.id === year)?.name || '';

export const getTeacherName = (id: string, users: User[]) => users.find(u => u.id === id)?.name || '';
export const getTeacherAvatar = (id: string, users: User[]) => users.find(u => u.id === id)?.avatar || '👨‍🏫';
