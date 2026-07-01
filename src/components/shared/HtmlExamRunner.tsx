'use client';

import { useState, useEffect, useRef } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Clock, AlertTriangle, CheckCircle2, XCircle, RotateCcw, Award } from 'lucide-react';
import { toast } from 'sonner';
import type { Exam, Grade } from '@/lib/types';

interface HtmlExamRunnerProps {
  exam: Exam;
  studentId: string;
  studentName: string;
  onComplete?: (score: number, total: number) => void;
}

export default function HtmlExamRunner({ exam, studentId, studentName, onComplete }: HtmlExamRunnerProps) {
  const [started, setStarted] = useState(false);
  const [finished, setFinished] = useState(false);
  const [result, setResult] = useState<{ score: number; total: number; percentage: number } | null>(null);
  const [timeLeft, setTimeLeft] = useState(exam.durationMinutes * 60);
  const iframeRef = useRef<HTMLIFrameElement>(null);

  // Timer effect - decrement time and handle timeup in callback
  useEffect(() => {
    if (!started || finished) return;
    if (timeLeft <= 0) {
      toast.error('انتهى الوقت!');
      return;
    }
    const timer = setInterval(() => {
      setTimeLeft(prev => {
        if (prev <= 1) {
          clearInterval(timer);
          // Defer state updates outside of setState callback
          setTimeout(() => {
            toast.error('انتهى الوقت!');
            setFinished(true);
            setResult({ score: 0, total: 0, percentage: 0 });
          }, 0);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
    return () => clearInterval(timer);
  }, [started, finished]);

  useEffect(() => {
    const handleMessage = (event: MessageEvent) => {
      if (event.data?.type === 'exam-result') {
        const { score, total, percentage } = event.data;
        setResult({ score, total, percentage });
        setFinished(true);
        onComplete?.(score, total);
      }
    };
    window.addEventListener('message', handleMessage);
    return () => window.removeEventListener('message', handleMessage);
  }, [onComplete]);

  const formatTime = (s: number) => {
    const m = Math.floor(s / 60);
    const sec = s % 60;
    return `${m.toString().padStart(2, '0')}:${sec.toString().padStart(2, '0')}`;
  };

  const handleStart = () => {
    setStarted(true);
    toast.info('بدأ الامتحان. بالتوفيق!');
  };

  const handleReset = () => {
    setStarted(false);
    setFinished(false);
    setResult(null);
    setTimeLeft(exam.durationMinutes * 60);
  };

  if (!started) {
    return (
      <Card className="border-2 border-emerald-200 dark:border-emerald-900">
        <CardHeader className="text-center">
          <div className="w-16 h-16 mx-auto rounded-full bg-emerald-100 dark:bg-emerald-900/30 flex items-center justify-center mb-3">
            <Award className="w-8 h-8 text-emerald-600" />
          </div>
          <CardTitle className="text-2xl">{exam.title}</CardTitle>
          <CardDescription>{exam.description}</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
            <div className="bg-muted/50 rounded-lg p-3 text-center">
              <Clock className="w-5 h-5 mx-auto mb-1 text-emerald-600" />
              <div className="text-sm font-bold">{exam.durationMinutes} دقيقة</div>
              <div className="text-xs text-muted-foreground">المدة</div>
            </div>
            <div className="bg-muted/50 rounded-lg p-3 text-center">
              <CheckCircle2 className="w-5 h-5 mx-auto mb-1 text-emerald-600" />
              <div className="text-sm font-bold">{exam.passingScore}%</div>
              <div className="text-xs text-muted-foreground">للنجاح</div>
            </div>
            <div className="bg-muted/50 rounded-lg p-3 text-center">
              <AlertTriangle className="w-5 h-5 mx-auto mb-1 text-amber-500" />
              <div className="text-sm font-bold">{exam.preventBack ? 'ممنوع' : 'مسموح'}</div>
              <div className="text-xs text-muted-foreground">الرجوع</div>
            </div>
            <div className="bg-muted/50 rounded-lg p-3 text-center">
              <Award className="w-5 h-5 mx-auto mb-1 text-purple-600" />
              <div className="text-sm font-bold">{exam.showGrade ? 'نعم' : 'لا'}</div>
              <div className="text-xs text-muted-foreground">إظهار الدرجة</div>
            </div>
          </div>
          {exam.preventBack && (
            <Alert>
              <AlertTriangle className="w-4 h-4" />
              <AlertDescription>
                تنبيه: هذا الامتحان لا يسمح بالرجوع للأسئلة السابقة. اقرأ كل سؤال بعناية قبل الإجابة.
              </AlertDescription>
            </Alert>
          )}
          <Button size="lg" className="w-full" onClick={handleStart}>
            ابدأ الامتحان الآن
          </Button>
        </CardContent>
      </Card>
    );
  }

  if (finished && result) {
    const passed = result.percentage >= exam.passingScore;
    return (
      <Card className={passed ? 'border-emerald-500' : 'border-rose-500'}>
        <CardHeader className="text-center">
          <div className={`w-20 h-20 mx-auto rounded-full flex items-center justify-center mb-3 ${
            passed ? 'bg-emerald-100 dark:bg-emerald-900/30' : 'bg-rose-100 dark:bg-rose-900/30'
          }`}>
            {passed ? <CheckCircle2 className="w-12 h-12 text-emerald-600" /> : <XCircle className="w-12 h-12 text-rose-600" />}
          </div>
          <CardTitle className="text-3xl">{passed ? '🎉 نجحت!' : 'لم تنجح هذه المرة'}</CardTitle>
          <CardDescription>
            {passed ? 'مبروك! أداؤك ممتاز' : 'لا تستسلم، حاول مرة أخرى بعد المراجعة'}
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="text-center">
            <div className="text-5xl font-bold mb-1">{result.percentage}%</div>
            <div className="text-muted-foreground">
              {result.score} من {result.total} نقطة
            </div>
          </div>
          <Progress value={result.percentage} className="h-3" />
          <div className="grid grid-cols-2 gap-3">
            <div className="bg-emerald-50 dark:bg-emerald-900/20 rounded-lg p-3 text-center">
              <div className="text-2xl font-bold text-emerald-600">{result.score}</div>
              <div className="text-xs text-muted-foreground">إجابات صحيحة</div>
            </div>
            <div className="bg-rose-50 dark:bg-rose-900/20 rounded-lg p-3 text-center">
              <div className="text-2xl font-bold text-rose-600">{result.total - result.score}</div>
              <div className="text-xs text-muted-foreground">إجابات خاطئة</div>
            </div>
          </div>
          {exam.showSolution && (
            <Alert>
              <CheckCircle2 className="w-4 h-4" />
              <AlertDescription>
                يمكنك مراجعة الإجابات الصحيحة والشروحات في الامتحان أدناه.
              </AlertDescription>
            </Alert>
          )}
          <Button variant="outline" className="w-full" onClick={handleReset}>
            <RotateCcw className="w-4 h-4 ml-2" />
            إعادة المحاولة
          </Button>
        </CardContent>
        {/* Show the iframe with solutions */}
        {exam.showSolution && (
          <iframe
            ref={iframeRef}
            srcDoc={exam.htmlContent}
            className="w-full min-h-[600px] border-t"
            sandbox="allow-scripts"
            title="حل الامتحان"
          />
        )}
      </Card>
    );
  }

  return (
    <div className="space-y-4">
      <div className="sticky top-16 z-20 bg-card border rounded-lg p-3 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Clock className={`w-5 h-5 ${timeLeft < 60 ? 'text-rose-500 animate-pulse' : 'text-emerald-600'}`} />
          <span className={`font-mono font-bold ${timeLeft < 60 ? 'text-rose-500' : ''}`}>
            {formatTime(timeLeft)}
          </span>
        </div>
        <Badge variant="outline">الامتحان جارٍ</Badge>
      </div>
      <iframe
        ref={iframeRef}
        srcDoc={exam.htmlContent}
        className="w-full min-h-[800px] rounded-lg border"
        sandbox="allow-scripts"
        title={exam.title}
      />
    </div>
  );
}

// ===== HTML Exam Builder (for Admin/Teacher) =====
export function HtmlExamBuilder({ onSave, initialHtml }: { onSave: (html: string) => void; initialHtml?: string }) {
  const [html, setHtml] = useState(initialHtml || getDefaultHtmlTemplate());
  const [preview, setPreview] = useState(false);

  // حفظ تلقائي على كل تغيير
  useEffect(() => {
    onSave(html);
  }, [html, onSave]);

  const handleSave = () => {
    if (!html.trim()) {
      toast.error('الرجاء إدخال كود HTML');
      return;
    }
    onSave(html);
    toast.success('تم حفظ الامتحان التفاعلي');
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <p className="text-sm text-muted-foreground">
          الصق كود HTML الخاص بالامتحان التفاعلي. يجب أن يحتوي على زر للتصحيح يرسل النتيجة عبر <code className="bg-muted px-1 rounded text-xs">postMessage</code>.
        </p>
        <div className="flex gap-2">
          <Button size="sm" variant="outline" onClick={() => setPreview(!preview)}>
            {preview ? 'تحرير' : 'معاينة'}
          </Button>
          <Button size="sm" onClick={handleSave}>حفظ الامتحان</Button>
        </div>
      </div>

      {preview ? (
        <iframe
          srcDoc={html}
          className="w-full min-h-[600px] rounded-lg border"
          sandbox="allow-scripts"
          title="معاينة الامتحان"
        />
      ) : (
        <textarea
          value={html}
          onChange={e => setHtml(e.target.value)}
          dir="ltr"
          className="w-full min-h-[500px] p-4 font-mono text-sm rounded-lg border bg-card resize-y"
          placeholder="الصق كود HTML هنا..."
          spellCheck={false}
        />
      )}

      <Alert>
        <AlertTriangle className="w-4 h-4" />
        <AlertDescription>
          <strong>ملاحظة:</strong> لإرسال النتيجة تلقائياً للطالب، أضف هذا الكود في زر التصحيح:
          <pre className="mt-2 p-2 bg-muted rounded text-xs overflow-x-auto" dir="ltr">
{`window.parent.postMessage({
  type: 'exam-result',
  score: correctAnswers,
  total: totalQuestions,
  percentage: Math.round((correct/total)*100)
}, '*');`}
          </pre>
        </AlertDescription>
      </Alert>
    </div>
  );
}

function getDefaultHtmlTemplate(): string {
  return `<!DOCTYPE html>
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
<h1>📝 امتحان تفاعلي</h1>
<p>اختر الإجابة الصحيحة لكل سؤال، ثم اضغط على "تصحيح الامتحان"</p>

<div class="question" data-correct="a">
  <h3>السؤال 1: ما هو 2 + 2؟</h3>
  <div class="options">
    <label><input type="radio" name="q1" value="a"> أ) 4</label>
    <label><input type="radio" name="q1" value="b"> ب) 5</label>
    <label><input type="radio" name="q1" value="c"> ج) 6</label>
  </div>
  <div class="explanation">الشرح: 2 + 2 = 4</div>
</div>

<div class="question" data-correct="b">
  <h3>السؤال 2: ما هو 5 × 3؟</h3>
  <div class="options">
    <label><input type="radio" name="q2" value="a"> أ) 10</label>
    <label><input type="radio" name="q2" value="b"> ب) 15</label>
    <label><input type="radio" name="q2" value="c"> ج) 20</label>
  </div>
  <div class="explanation">الشرح: 5 × 3 = 15</div>
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
      if (selected.value === correctAns) {
        correct++;
        selected.parentElement.classList.add('correct');
      } else {
        selected.parentElement.classList.add('wrong');
        options.forEach(opt => {
          const input = opt.querySelector('input');
          if (input.value === correctAns) opt.classList.add('correct');
        });
      }
    }
    if (explanation) explanation.style.display = 'block';
  });
  
  const percentage = Math.round((correct / total) * 100);
  const result = document.getElementById('result');
  result.style.display = 'block';
  result.style.background = percentage >= 60 ? '#d1fae5' : '#fee2e2';
  result.innerHTML = '<strong>نتيجتك:</strong> ' + correct + ' من ' + total + ' (' + percentage + '%)';
  
  // Send to parent
  window.parent.postMessage({
    type: 'exam-result',
    score: correct,
    total: total,
    percentage: percentage
  }, '*');
}
</script>
</body>
</html>`;
}
