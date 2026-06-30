'use client';

import { useState } from 'react';
import { DashboardLayout, StatCard, EmptyState } from '@/components/shared/DashboardLayout';
import { useStore } from '@/lib/store';
import { stages, units as initialUnits, demoSubscriptions, demoInvoices } from '@/lib/data';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Progress } from '@/components/ui/progress';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { toast } from 'sonner';
import {
  LayoutDashboard, BookOpen, Award, CreditCard, FileText, Bell, Trophy,
  Heart, CheckCircle2, Clock, Play, Download, Star, Calendar, TrendingUp,
  AlertCircle
} from 'lucide-react';

const navItems = [
  { id: 'dashboard', label: 'الرئيسية', icon: LayoutDashboard },
  { id: 'lessons', label: 'الدروس', icon: BookOpen },
  { id: 'assignments', label: 'الواجبات', icon: FileText },
  { id: 'exams', label: 'الامتحانات', icon: Award },
  { id: 'grades', label: 'الدرجات', icon: TrendingUp },
  { id: 'subscription', label: 'الاشتراك', icon: CreditCard },
  { id: 'invoices', label: 'الفواتير', icon: FileText },
  { id: 'certificates', label: 'الشهادات', icon: Trophy },
  { id: 'favorites', label: 'المفضلة', icon: Heart },
  { id: 'notifications', label: 'الإشعارات', icon: Bell },
];

export default function StudentDashboard() {
  const [activeItem, setActiveItem] = useState('dashboard');

  return (
    <DashboardLayout
      items={navItems}
      activeItem={activeItem}
      onItemChange={setActiveItem}
      title="لوحة الطالب"
      roleLabel="طالب"
      roleIcon="🧑‍🎓"
    >
      {activeItem === 'dashboard' && <StudentOverview />}
      {activeItem === 'lessons' && <BrowseLessons />}
      {activeItem === 'assignments' && <MyAssignments />}
      {activeItem === 'exams' && <MyExams />}
      {activeItem === 'grades' && <MyGrades />}
      {activeItem === 'subscription' && <MySubscription />}
      {activeItem === 'invoices' && <MyInvoices />}
      {activeItem === 'certificates' && <MyCertificates />}
      {activeItem === 'favorites' && <MyFavorites />}
      {activeItem === 'notifications' && <MyNotifications />}
    </DashboardLayout>
  );
}

function StudentOverview() {
  const { currentUser, lessons, openLesson } = useStore();
  const completed = currentUser?.completedLessons || [];
  const completionRate = lessons.length > 0 ? Math.round((completed.length / lessons.length) * 100) : 0;

  return (
    <div className="space-y-6">
      <Card className="overflow-hidden border-0 bg-gradient-to-l from-emerald-600 to-teal-700 text-white">
        <CardContent className="p-6 flex items-center justify-between flex-wrap gap-4">
          <div className="flex items-center gap-4">
            <Avatar className="w-16 h-16 text-3xl bg-white/20">
              <AvatarFallback className="text-3xl bg-white/20">{currentUser?.avatar}</AvatarFallback>
            </Avatar>
            <div>
              <h2 className="text-2xl font-bold mb-1">مرحباً، {currentUser?.name} 👋</h2>
              <p className="opacity-90 text-sm">
                {currentUser?.stage === 'high' ? 'المرحلة الثانوية' : 'المرحلة الإعدادية'} - {currentUser?.year === 'first' ? 'الأولى' : currentUser?.year === 'second' ? 'الثانية' : 'الثالثة'}
              </p>
              <Badge className="mt-2 bg-white/20 text-white border-white/30">
                {currentUser?.subscriptionStatus === 'active' ? '✓ اشتراك نشط' : '⚠ اشتراك معلق'}
              </Badge>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Progress Card */}
      <Card>
        <CardContent className="p-6">
          <div className="flex items-center justify-between mb-3">
            <div>
              <h3 className="font-bold text-lg">نسبة تقدمك في الدروس</h3>
              <p className="text-sm text-muted-foreground">أكملت {completed.length} من {lessons.length} درس</p>
            </div>
            <div className="text-3xl font-bold text-emerald-600">{completionRate}%</div>
          </div>
          <Progress value={completionRate} className="h-3" />
        </CardContent>
      </Card>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <StatCard icon={CheckCircle2} label="دروس مكتملة" value={completed.length} color="text-emerald-600" />
        <StatCard icon={Clock} label="دروس متبقية" value={Math.max(0, lessons.length - completed.length)} color="text-amber-600" />
        <StatCard icon={Award} label="امتحانات مجتازة" value={1} color="text-purple-600" />
        <StatCard icon={Trophy} label="شهادات" value={2} color="text-rose-600" />
      </div>

      <div className="grid lg:grid-cols-2 gap-4">
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">تابع التعلم</CardTitle>
            <CardDescription>أحدث الدروس</CardDescription>
          </CardHeader>
          <CardContent className="space-y-3">
            {lessons.slice(0, 3).map(l => (
              <div key={l.id} className="flex items-center gap-3 p-2 rounded-lg hover:bg-muted/50 cursor-pointer" onClick={() => openLesson(l.id)}>
                <div className="w-14 h-14 rounded-lg bg-emerald-100 dark:bg-emerald-900/30 flex items-center justify-center shrink-0">
                  <Play className="w-6 h-6 text-emerald-600" />
                </div>
                <div className="flex-1 min-w-0">
                  <div className="font-medium text-sm truncate">{l.title}</div>
                  <div className="text-xs text-muted-foreground flex items-center gap-2">
                    <Clock className="w-3 h-3" /> {l.videoDuration}
                    <span>•</span>
                    <span>{l.views} مشاهدة</span>
                  </div>
                </div>
                {completed.includes(l.id) && <CheckCircle2 className="w-5 h-5 text-emerald-500 shrink-0" />}
              </div>
            ))}
          </CardContent>
        </Card>

        <Card>
          <CardHeader><CardTitle className="text-lg">إشعارات حديثة</CardTitle></CardHeader>
          <CardContent className="space-y-2">
            {useStore(s => s.notifications).slice(0, 4).map(n => (
              <div key={n.id} className={`p-3 rounded-lg border ${!n.read ? 'bg-emerald-50 dark:bg-emerald-900/20' : ''}`}>
                <div className="flex items-start gap-2">
                  <AlertCircle className={`w-4 h-4 mt-0.5 ${n.type === 'success' ? 'text-emerald-500' : n.type === 'warning' ? 'text-amber-500' : 'text-blue-500'}`} />
                  <div className="flex-1">
                    <div className="font-medium text-sm">{n.title}</div>
                    <p className="text-xs text-muted-foreground">{n.message}</p>
                  </div>
                </div>
              </div>
            ))}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

function BrowseLessons() {
  const { lessons, openLesson, currentUser, toggleFavorite, markLessonComplete } = useStore();
  const [selectedStage, setSelectedStage] = useState(currentUser?.stage || 'high');
  const [selectedYear, setSelectedYear] = useState(currentUser?.year || 'second');

  const yearUnits = initialUnits.filter(u => u.stageId === selectedStage && u.yearId === selectedYear);
  const completed = currentUser?.completedLessons || [];
  const favorites = currentUser?.favorites || [];

  return (
    <div className="space-y-4">
      <Card>
        <CardContent className="p-4">
          <div className="flex flex-wrap gap-2 items-center">
            <Label>المرحلة:</Label>
            <div className="flex gap-1">
              {stages.map(s => (
                <Button key={s.id} size="sm" variant={selectedStage === s.id ? 'default' : 'outline'} onClick={() => setSelectedStage(s.id)}>
                  {s.name}
                </Button>
              ))}
            </div>
            <Label className="mr-2">السنة:</Label>
            <div className="flex gap-1">
              {stages.find(s => s.id === selectedStage)?.years.map(y => (
                <Button key={y.id} size="sm" variant={selectedYear === y.id ? 'default' : 'outline'} onClick={() => setSelectedYear(y.id)}>
                  {y.name}
                </Button>
              ))}
            </div>
          </div>
        </CardContent>
      </Card>

      {yearUnits.map(unit => {
        const unitLessons = lessons.filter(l => l.unitId === unit.id);
        if (unitLessons.length === 0) {
          // Show sample lessons for demo purposes
          return (
            <Card key={unit.id}>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <div className="w-8 h-8 rounded-lg flex items-center justify-center text-white text-sm" style={{ background: unit.color }}>
                    {unit.order}
                  </div>
                  {unit.title}
                </CardTitle>
                <CardDescription>{unit.description}</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {lessons.slice(0, 2).map(l => (
                    <Card key={l.id} className="overflow-hidden hover:shadow-lg transition-shadow">
                      <div className="aspect-video bg-gradient-to-br from-emerald-500/20 to-purple-500/20 relative flex items-center justify-center">
                        <Play className="w-12 h-12 text-emerald-600" />
                        <Badge className="absolute top-2 right-2">{l.videoDuration}</Badge>
                      </div>
                      <CardContent className="p-3">
                        <h3 className="font-semibold mb-1 line-clamp-1">{l.title}</h3>
                        <p className="text-xs text-muted-foreground mb-2 line-clamp-2">{l.description}</p>
                        <div className="flex items-center justify-between">
                          <Badge variant="secondary">👁 {l.views}</Badge>
                          <Button size="sm" onClick={() => openLesson(l.id)}>عرض الدرس</Button>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </CardContent>
            </Card>
          );
        }
        return (
          <Card key={unit.id}>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-lg flex items-center justify-center text-white text-sm" style={{ background: unit.color }}>
                  {unit.order}
                </div>
                {unit.title}
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
                {unitLessons.map(l => (
                  <Card key={l.id} className="overflow-hidden hover:shadow-lg transition-shadow">
                    <div className="aspect-video bg-gradient-to-br from-emerald-500/20 to-purple-500/20 relative flex items-center justify-center">
                      <Play className="w-12 h-12 text-emerald-600" />
                      <Badge className="absolute top-2 right-2">{l.videoDuration}</Badge>
                      {completed.includes(l.id) && (
                        <Badge className="absolute top-2 left-2 bg-emerald-500">✓ مكتمل</Badge>
                      )}
                    </div>
                    <CardContent className="p-3">
                      <h3 className="font-semibold mb-1 line-clamp-1">{l.title}</h3>
                      <p className="text-xs text-muted-foreground mb-2 line-clamp-2">{l.description}</p>
                      <div className="flex items-center justify-between">
                        <Badge variant="secondary">👁 {l.views}</Badge>
                        <div className="flex gap-1">
                          <Button size="icon" variant="ghost" onClick={() => toggleFavorite(l.id)}>
                            <Heart className={`w-4 h-4 ${favorites.includes(l.id) ? 'fill-rose-500 text-rose-500' : ''}`} />
                          </Button>
                          <Button size="sm" onClick={() => openLesson(l.id)}>عرض</Button>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </CardContent>
          </Card>
        );
      })}
    </div>
  );
}

function MyAssignments() {
  const { assignments, addGrade, currentUser } = useStore();
  const [answers, setAnswers] = useState<Record<string, string>>({});

  const handleSubmit = (assignmentId: string) => {
    const assignment = assignments.find(a => a.id === assignmentId);
    if (!assignment) return;
    let score = 0;
    assignment.questions.forEach(q => {
      if (answers[`${assignmentId}-${q.id}`] === q.correctAnswer) score += q.points;
    });
    addGrade({
      id: `g-${Date.now()}`,
      studentId: currentUser?.id || '',
      studentName: currentUser?.name || '',
      itemId: assignmentId,
      itemType: 'assignment',
      title: assignment.title,
      score,
      totalScore: assignment.totalPoints,
      date: new Date().toISOString().split('T')[0],
    });
    toast.success(`تم تسليم الواجب. درجتك: ${score}/${assignment.totalPoints}`);
    setAnswers({});
  };

  return (
    <div className="space-y-4">
      {assignments.map(a => (
        <Card key={a.id}>
          <CardHeader>
            <div className="flex items-center justify-between">
              <div>
                <CardTitle>{a.title}</CardTitle>
                <CardDescription>{a.description}</CardDescription>
              </div>
              <div className="text-left">
                <div className="text-2xl font-bold text-emerald-600">{a.totalPoints}</div>
                <div className="text-xs text-muted-foreground">نقطة</div>
              </div>
            </div>
          </CardHeader>
          <CardContent className="space-y-4">
            {a.questions.map((q, i) => (
              <div key={q.id} className="p-4 rounded-lg border">
                <div className="flex items-start gap-2 mb-3">
                  <Badge>{i + 1}</Badge>
                  <Badge variant="secondary">{q.points} نقطة</Badge>
                  <p className="flex-1 font-medium">{q.text}</p>
                </div>
                {q.type === 'mcq' && (
                  <div className="grid gap-2">
                    {q.options?.map(opt => (
                      <label key={opt} className="flex items-center gap-2 p-2 rounded-lg hover:bg-muted/50 cursor-pointer">
                        <input
                          type="radio"
                          name={q.id}
                          value={opt}
                          checked={answers[`${a.id}-${q.id}`] === opt}
                          onChange={e => setAnswers({ ...answers, [`${a.id}-${q.id}`]: e.target.value })}
                          className="w-4 h-4"
                        />
                        <span className="text-sm">{opt}</span>
                      </label>
                    ))}
                  </div>
                )}
                {q.type === 'truefalse' && (
                  <div className="flex gap-2">
                    {['true', 'false'].map(opt => (
                      <Button
                        key={opt}
                        size="sm"
                        variant={answers[`${a.id}-${q.id}`] === opt ? 'default' : 'outline'}
                        onClick={() => setAnswers({ ...answers, [`${a.id}-${q.id}`]: opt })}
                      >
                        {opt === 'true' ? 'صحيح' : 'خطأ'}
                      </Button>
                    ))}
                  </div>
                )}
                {q.type === 'fill' && (
                  <Input
                    placeholder="اكتب إجابتك..."
                    value={answers[`${a.id}-${q.id}`] || ''}
                    onChange={e => setAnswers({ ...answers, [`${a.id}-${q.id}`]: e.target.value })}
                  />
                )}
                {q.type === 'essay' && (
                  <textarea
                    className="w-full p-3 rounded-lg border bg-card text-sm"
                    rows={3}
                    placeholder="اكتب إجابتك..."
                    value={answers[`${a.id}-${q.id}`] || ''}
                    onChange={e => setAnswers({ ...answers, [`${a.id}-${q.id}`]: e.target.value })}
                  />
                )}
                {q.type === 'image' && (
                  <div className="border-2 border-dashed rounded-lg p-6 text-center text-muted-foreground">
                    <Upload className="w-8 h-8 mx-auto mb-2" />
                    اسحب صورة هنا أو اضغط للرفع
                  </div>
                )}
              </div>
            ))}
            <Button className="w-full" onClick={() => handleSubmit(a.id)}>
              تسليم الواجب
            </Button>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}

import { Upload } from 'lucide-react';

function MyExams() {
  const { exams, openLesson } = useStore();
  return (
    <div className="space-y-4">
      {exams.map(e => (
        <Card key={e.id}>
          <CardHeader>
            <div className="flex items-center justify-between">
              <div>
                <CardTitle className="flex items-center gap-2">
                  <Award className="w-5 h-5 text-amber-600" />
                  {e.title}
                  {e.isHtmlExam && <Badge>HTML تفاعلي</Badge>}
                </CardTitle>
                <CardDescription>{e.description}</CardDescription>
              </div>
              <div className="text-left">
                <div className="text-2xl font-bold text-amber-600">{e.durationMinutes}</div>
                <div className="text-xs text-muted-foreground">دقيقة</div>
              </div>
            </div>
          </CardHeader>
          <CardContent>
            <div className="flex flex-wrap gap-2 mb-4">
              <Badge variant="secondary">🎯 درجة النجاح: {e.passingScore}%</Badge>
              {e.preventBack && <Badge variant="secondary">🚫 منع الرجوع</Badge>}
              {e.randomOrder && <Badge variant="secondary">🔀 ترتيب عشوائي</Badge>}
              {e.showGrade && <Badge variant="secondary">📊 إظهار الدرجة</Badge>}
              {e.showSolution && <Badge variant="secondary">✅ إظهار الحل</Badge>}
            </div>
            <Button onClick={() => openLesson(e.lessonId || 'lesson-1')}>
              ابدأ الامتحان
            </Button>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}

function MyGrades() {
  const { grades, currentUser } = useStore();
  const myGrades = grades.filter(g => g.studentId === currentUser?.id);
  return (
    <Card>
      <CardHeader><CardTitle>درجاتي</CardTitle></CardHeader>
      <CardContent>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>النوع</TableHead>
              <TableHead>العنوان</TableHead>
              <TableHead>الدرجة</TableHead>
              <TableHead>النسبة</TableHead>
              <TableHead>التاريخ</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {myGrades.map(g => {
              const pct = Math.round((g.score / g.totalScore) * 100);
              return (
                <TableRow key={g.id}>
                  <TableCell><Badge variant="secondary">{g.itemType === 'exam' ? 'امتحان' : 'واجب'}</Badge></TableCell>
                  <TableCell className="font-medium">{g.title}</TableCell>
                  <TableCell><Badge variant={pct >= 60 ? 'default' : 'destructive'}>{g.score}/{g.totalScore}</Badge></TableCell>
                  <TableCell>
                    <div className="flex items-center gap-2">
                      <Progress value={pct} className="w-20 h-2" />
                      <span className="text-sm">{pct}%</span>
                    </div>
                  </TableCell>
                  <TableCell>{g.date}</TableCell>
                </TableRow>
              );
            })}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  );
}

function MySubscription() {
  const { currentUser } = useStore();
  const daysLeft = currentUser?.subscriptionExpiry
    ? Math.ceil((new Date(currentUser.subscriptionExpiry).getTime() - Date.now()) / (1000 * 60 * 60 * 24))
    : 0;

  return (
    <div className="space-y-4">
      <Card className="overflow-hidden border-0 bg-gradient-to-l from-emerald-600 to-teal-700 text-white">
        <CardContent className="p-6">
          <div className="flex items-center justify-between flex-wrap gap-4">
            <div>
              <div className="text-sm opacity-90 mb-1">حالة الاشتراك</div>
              <div className="text-3xl font-bold mb-2">
                {currentUser?.subscriptionStatus === 'active' ? '✓ نشط' : '⚠ معلق'}
              </div>
              <div className="text-sm opacity-90">
                ينتهي في: {currentUser?.subscriptionExpiry}
              </div>
            </div>
            <div className="text-left">
              <div className="text-5xl font-bold">{daysLeft}</div>
              <div className="text-sm opacity-90">يوم متبقي</div>
            </div>
          </div>
        </CardContent>
      </Card>

      <div>
        <h3 className="font-bold text-lg mb-3">جدد اشتراكك</h3>
        <div className="grid md:grid-cols-3 gap-4">
          {demoSubscriptions.map(sub => (
            <Card key={sub.id} className={sub.popular ? 'border-emerald-500 shadow-lg scale-105' : ''}>
              {sub.popular && <Badge className="mb-2">الأكثر شيوعاً</Badge>}
              <CardContent className="pt-6">
                <h3 className="font-bold text-xl">{sub.name}</h3>
                <div className="my-3">
                  <span className="text-3xl font-bold">{sub.price}</span>
                  <span className="text-muted-foreground"> ج.م</span>
                </div>
                <ul className="space-y-2 mb-4 text-sm">
                  {sub.features.map(f => (
                    <li key={f} className="flex items-start gap-2">
                      <CheckCircle2 className="w-4 h-4 text-emerald-500 mt-0.5 shrink-0" />
                      <span>{f}</span>
                    </li>
                  ))}
                </ul>
                <Button className="w-full">اشترك</Button>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </div>
  );
}

function MyInvoices() {
  const { currentUser } = useStore();
  const myInvoices = demoInvoices.filter(i => i.studentId === currentUser?.id);
  return (
    <Card>
      <CardHeader><CardTitle>الفواتير</CardTitle></CardHeader>
      <CardContent>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>الباقة</TableHead>
              <TableHead>المبلغ</TableHead>
              <TableHead>التاريخ</TableHead>
              <TableHead>الحالة</TableHead>
              <TableHead>إجراءات</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {myInvoices.map(inv => (
              <TableRow key={inv.id}>
                <TableCell>{inv.subscriptionName}</TableCell>
                <TableCell>{inv.amount} ج.م</TableCell>
                <TableCell>{inv.date}</TableCell>
                <TableCell>
                  <Badge variant={inv.status === 'paid' ? 'default' : 'destructive'}>
                    {inv.status === 'paid' ? 'مدفوع' : 'غير مدفوع'}
                  </Badge>
                </TableCell>
                <TableCell>
                  <Button size="sm" variant="ghost"><Download className="w-4 h-4 ml-1" /> تحميل</Button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  );
}

function MyCertificates() {
  const { currentUser, certificates } = useStore();
  const myCerts = certificates.filter(c => c.studentId === currentUser?.id);

  return (
    <div className="grid md:grid-cols-2 gap-4">
      {myCerts.map(cert => (
        <Card key={cert.id} className="overflow-hidden border-2 border-amber-200 dark:border-amber-900">
          <div className="bg-gradient-to-l from-amber-500/10 to-yellow-500/10 p-6 text-center">
            <Trophy className="w-16 h-16 mx-auto mb-3 text-amber-500" />
            <div className="text-sm text-muted-foreground mb-1">شهادة إتمام</div>
            <h3 className="font-bold text-xl mb-2">{cert.courseName}</h3>
            <div className="text-sm text-muted-foreground">يُمنح هذا الشهادة إلى</div>
            <div className="font-bold text-lg my-1">{cert.studentName}</div>
            <Badge variant="secondary" className="mt-2">التقدير: {cert.grade}%</Badge>
            <div className="text-xs text-muted-foreground mt-3">تاريخ الإصدار: {cert.issueDate}</div>
            <Button size="sm" variant="outline" className="mt-3">
              <Download className="w-4 h-4 ml-1" /> تحميل الشهادة
            </Button>
          </div>
        </Card>
      ))}
      {myCerts.length === 0 && (
        <Card className="md:col-span-2">
          <CardContent>
            <EmptyState icon={Trophy} title="لا توجد شهادات بعد" description="أكمل الدروس والامتحانات للحصول على شهادات" />
          </CardContent>
        </Card>
      )}
    </div>
  );
}

function MyFavorites() {
  const { lessons, currentUser, openLesson, toggleFavorite } = useStore();
  const favorites = currentUser?.favorites || [];
  const myFavorites = lessons.filter(l => favorites.includes(l.id));

  return (
    <Card>
      <CardHeader><CardTitle>المفضلة ({myFavorites.length})</CardTitle></CardHeader>
      <CardContent>
        {myFavorites.length === 0 ? (
          <EmptyState icon={Heart} title="لا توجد دروس في المفضلة" description="أضف دروساً للمفضلة للوصول السريع" />
        ) : (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
            {myFavorites.map(l => (
              <Card key={l.id} className="overflow-hidden">
                <div className="aspect-video bg-gradient-to-br from-rose-500/20 to-purple-500/20 relative flex items-center justify-center">
                  <Play className="w-12 h-12 text-rose-600" />
                  <button
                    onClick={() => toggleFavorite(l.id)}
                    className="absolute top-2 left-2 w-8 h-8 rounded-full bg-white/80 dark:bg-black/50 flex items-center justify-center"
                  >
                    <Heart className="w-4 h-4 fill-rose-500 text-rose-500" />
                  </button>
                </div>
                <CardContent className="p-3">
                  <h3 className="font-semibold text-sm mb-1 line-clamp-1">{l.title}</h3>
                  <p className="text-xs text-muted-foreground mb-2 line-clamp-2">{l.description}</p>
                  <Button size="sm" className="w-full" onClick={() => openLesson(l.id)}>عرض الدرس</Button>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  );
}

function MyNotifications() {
  const { notifications, markNotificationRead, currentUser } = useStore();
  const myNotifs = notifications.filter(n => !n.userId || n.userId === currentUser?.id);

  return (
    <Card>
      <CardHeader><CardTitle>الإشعارات ({myNotifs.filter(n => !n.read).length} غير مقروء)</CardTitle></CardHeader>
      <CardContent className="space-y-2">
        {myNotifs.map(n => (
          <div key={n.id} className={`p-3 rounded-lg border ${!n.read ? 'bg-emerald-50 dark:bg-emerald-900/20' : ''}`}>
            <div className="flex items-start justify-between gap-2">
              <div className="flex-1">
                <div className="flex items-center gap-2 mb-1">
                  <Badge variant={
                    n.type === 'success' ? 'default' :
                    n.type === 'warning' ? 'secondary' :
                    n.type === 'error' ? 'destructive' : 'outline'
                  }>{n.type}</Badge>
                  <span className="font-medium text-sm">{n.title}</span>
                  {!n.read && <span className="w-2 h-2 rounded-full bg-emerald-500" />}
                </div>
                <p className="text-sm text-muted-foreground">{n.message}</p>
                <div className="text-xs text-muted-foreground mt-1">{n.createdAt}</div>
              </div>
              {!n.read && (
                <Button size="sm" variant="ghost" onClick={() => markNotificationRead(n.id)}>
                  <CheckCircle2 className="w-4 h-4" />
                </Button>
              )}
            </div>
          </div>
        ))}
      </CardContent>
    </Card>
  );
}
