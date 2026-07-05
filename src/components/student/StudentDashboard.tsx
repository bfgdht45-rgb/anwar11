'use client';

import { useState, useEffect } from 'react';
import { DashboardLayout, StatCard, EmptyState } from '@/components/shared/DashboardLayout';
import { useStore } from '@/lib/store';
import { stages, demoSubscriptions } from '@/lib/data';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Progress } from '@/components/ui/progress';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { toast } from 'sonner';
import {
  LayoutDashboard, BookOpen, Award, CreditCard, FileText, Bell, Trophy,
  Heart, CheckCircle2, Clock, Play, Download, Star, Calendar, TrendingUp,
  AlertCircle, Upload, MessageSquare
} from 'lucide-react';

const navItems = [
  { id: 'dashboard', label: 'الرئيسية', icon: LayoutDashboard },
  { id: 'lessons', label: 'الدروس', icon: BookOpen },
  { id: 'assignments', label: 'الواجبات', icon: FileText },
  { id: 'exams', label: 'الامتحانات', icon: Award },
  { id: 'grades', label: 'الدرجات', icon: TrendingUp },
  { id: 'subscription', label: 'الاشتراك', icon: CreditCard },
  { id: 'certificates', label: 'الشهادات', icon: Trophy },
  { id: 'favorites', label: 'المفضلة', icon: Heart },
  { id: 'notifications', label: 'الإشعارات', icon: Bell },
];

export default function StudentDashboard() {
  const [activeItem, setActiveItem] = useState('dashboard');
  const store = useStore();

  useEffect(() => {
    store.fetchLessons();
    store.fetchExams();
    store.fetchNotifications();
    store.fetchGrades(store.currentUser?.id);
  }, []);

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
      {activeItem === 'certificates' && <MyCertificates />}
      {activeItem === 'favorites' && <MyFavorites />}
      {activeItem === 'notifications' && <MyNotifications />}
    </DashboardLayout>
  );
}

function StudentOverview() {
  const { currentUser, lessons, exams } = useStore();
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
        <StatCard icon={Award} label="امتحانات" value={exams?.length || 0} color="text-purple-600" />
        <StatCard icon={Trophy} label="شهادات" value={0} color="text-rose-600" />
      </div>
    </div>
  );
}

function BrowseLessons() {
  const { lessons, openLesson, currentUser, toggleFavorite } = useStore();

  // تثبيت الفلتر على مرحلة الطالب فقط - لا يمكن تغييرها
  const selectedStage = currentUser?.stage || 'high';
  const selectedYear = currentUser?.year || 'second';

  // فلترة الدروس حسب مرحلة الطالب فقط
  const filteredLessons = lessons.filter((l: any) => {
    const unit = l.unit;
    if (!unit) return true;
    return unit.stageId === selectedStage && unit.yearId === selectedYear;
  });

  const completed = currentUser?.completedLessons || [];
  const favorites = currentUser?.favorites || [];

  return (
    <div className="space-y-4">
      <Card>
        <CardContent className="p-4">
          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            <Badge variant="secondary">
              {selectedStage === 'high' ? 'المرحلة الثانوية' : 'المرحلة الإعدادية'}
            </Badge>
            <span>السنة:</span>
            <Badge variant="secondary">
              {selectedYear === 'first' ? 'الأولى' : selectedYear === 'second' ? 'الثانية' : 'الثالثة'}
            </Badge>
            <span className="mr-auto">دروس مرحلتك فقط</span>
          </div>
        </CardContent>
      </Card>

      {filteredLessons.length === 0 ? (
        <Card>
          <CardContent className="pt-6">
            <EmptyState icon={BookOpen} title="لا توجد دروس لهذه المرحلة" description="جرّب مرحلة أو سنة تانية" />
          </CardContent>
        </Card>
      ) : (
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
          {filteredLessons.map((l: any) => (
            <Card key={l.id} className="overflow-hidden hover:shadow-lg transition-shadow">
              <div className="aspect-video bg-gradient-to-br from-emerald-500/20 to-purple-500/20 relative flex items-center justify-center">
                <Play className="w-12 h-12 text-emerald-600" />
                <Badge className="absolute top-2 right-2">{l.videoDuration}</Badge>
                {completed.includes(l.id) && <Badge className="absolute top-2 left-2 bg-emerald-500">✓ مكتمل</Badge>}
              </div>
              <CardContent className="p-3">
                <h3 className="font-semibold mb-1 line-clamp-1">{l.title}</h3>
                <p className="text-xs text-muted-foreground mb-2 line-clamp-2">{l.description}</p>
                <div className="flex items-center justify-between">
                  <Badge variant="secondary">👁 {l.views || 0}</Badge>
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
      )}
    </div>
  );
}

function MyAssignments() {
  const { lessons, currentUser, addGrade } = useStore();
  const [answers, setAnswers] = useState<Record<string, string>>({});

  // جلب كل الواجبات من كل الدروس
  const allAssignments = lessons
    .filter((l: any) => l.assignment)
    .map((l: any) => ({ ...l.assignment, lessonTitle: l.title, lessonId: l.id }));

  const handleSubmit = async (assignment: any) => {
    let score = 0;
    (assignment.questions || []).forEach((q: any) => {
      if (answers[`${assignment.id}-${q.id}`] === q.correctAnswer) score += q.points;
    });
    await addGrade({
      score,
      totalScore: assignment.totalPoints,
      itemType: 'assignment',
      itemId: assignment.id,
      title: assignment.title,
      studentId: currentUser?.id,
      studentName: currentUser?.name,
      assignmentId: assignment.id,
    } as any);
    toast.success(`تم تسليم الواجب. درجتك: ${score}/${assignment.totalPoints}`);
    setAnswers({});
  };

  return (
    <div className="space-y-4">
      {allAssignments.length === 0 ? (
        <Card>
          <CardContent className="pt-6">
            <EmptyState icon={FileText} title="لا توجد واجبات" description="الواجبات هتظهر هنا لما المعلم يضيفها" />
          </CardContent>
        </Card>
      ) : (
        allAssignments.map((assignment: any) => (
          <Card key={assignment.id}>
            <CardHeader>
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle>{assignment.title}</CardTitle>
                  <CardDescription>في درس: {assignment.lessonTitle}</CardDescription>
                </div>
                <Badge variant="secondary">{assignment.totalPoints} نقطة</Badge>
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              {(assignment.questions || []).map((q: any, i: number) => (
                <div key={q.id} className="p-4 rounded-lg border">
                  <div className="flex items-start gap-2 mb-3">
                    <Badge>{i + 1}</Badge>
                    <Badge variant="secondary">{q.points} نقطة</Badge>
                    <p className="flex-1 font-medium">{q.text}</p>
                  </div>
                  {q.imageUrl && (
                    <div className="mb-3">
                      <img src={q.imageUrl.replace(/"/g, '')} alt="سؤال" className="max-w-full rounded-lg border" />
                    </div>
                  )}
                  {q.type === 'MCQ' && (
                    <div className="grid gap-2">
                      {(q.options || []).map((opt: string) => (
                        <label key={opt} className="flex items-center gap-2 p-2 rounded-lg hover:bg-muted/50 cursor-pointer">
                          <input
                            type="radio"
                            name={q.id}
                            value={opt}
                            checked={answers[`${assignment.id}-${q.id}`] === opt}
                            onChange={e => setAnswers({ ...answers, [`${assignment.id}-${q.id}`]: e.target.value })}
                            className="w-4 h-4"
                          />
                          <span className="text-sm">{opt}</span>
                        </label>
                      ))}
                    </div>
                  )}
                  {q.type === 'TRUEFALSE' && (
                    <div className="flex gap-2">
                      {['true', 'false'].map(opt => (
                        <Button
                          key={opt}
                          size="sm"
                          variant={answers[`${assignment.id}-${q.id}`] === opt ? 'default' : 'outline'}
                          onClick={() => setAnswers({ ...answers, [`${assignment.id}-${q.id}`]: opt })}
                        >
                          {opt === 'true' ? 'صحيح' : 'خطأ'}
                        </Button>
                      ))}
                    </div>
                  )}
                  {q.type === 'FILL' && (
                    <Input
                      placeholder="اكتب إجابتك..."
                      value={answers[`${assignment.id}-${q.id}`] || ''}
                      onChange={e => setAnswers({ ...answers, [`${assignment.id}-${q.id}`]: e.target.value })}
                    />
                  )}
                  {q.type === 'ESSAY' && (
                    <textarea
                      className="w-full p-3 rounded-lg border bg-card text-sm"
                      rows={3}
                      placeholder="اكتب إجابتك..."
                      value={answers[`${assignment.id}-${q.id}`] || ''}
                      onChange={e => setAnswers({ ...answers, [`${assignment.id}-${q.id}`]: e.target.value })}
                    />
                  )}
                </div>
              ))}
              <Button className="w-full" onClick={() => handleSubmit(assignment)}>تسليم الواجب</Button>
            </CardContent>
          </Card>
        ))
      )}
    </div>
  );
}

function MyExams() {
  const { exams, openLesson } = useStore();
  const [activeExam, setActiveExam] = useState<any>(null);

  return (
    <div className="space-y-4">
      {exams.length === 0 ? (
        <Card>
          <CardContent className="pt-6">
            <EmptyState icon={Award} title="لا توجد امتحانات" />
          </CardContent>
        </Card>
      ) : (
        exams.map((e: any) => (
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
                {e.showGrade && <Badge variant="secondary">📊 إظهار الدرجة</Badge>}
              </div>
              <Button onClick={() => e.lessonId ? openLesson(e.lessonId) : setActiveExam(e)}>
                {e.isHtmlExam ? 'ابدأ الامتحان التفاعلي' : 'ابدأ الامتحان'}
              </Button>
            </CardContent>
          </Card>
        ))
      )}

      {activeExam?.isHtmlExam && (
        <Dialog open={!!activeExam} onOpenChange={(open) => !open && setActiveExam(null)}>
          <DialogContent className="max-w-4xl max-h-[90vh] overflow-hidden flex flex-col">
            <DialogHeader>
              <DialogTitle>{activeExam.title}</DialogTitle>
              <DialogDescription>{activeExam.description}</DialogDescription>
            </DialogHeader>
            <div className="flex-1 overflow-hidden">
              <iframe srcDoc={activeExam.htmlContent} className="w-full h-[70vh] rounded-lg border" sandbox="allow-scripts allow-same-origin allow-forms" title="امتحان" />
            </div>
          </DialogContent>
        </Dialog>
      )}
    </div>
  );
}

function MyGrades() {
  const { grades } = useStore();
  return (
    <Card>
      <CardHeader><CardTitle>درجاتي ({grades.length})</CardTitle></CardHeader>
      <CardContent>
        {grades.length === 0 ? (
          <EmptyState icon={TrendingUp} title="لا توجد درجات بعد" />
        ) : (
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
              {grades.map((g: any) => {
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
                    <TableCell>{new Date(g.date).toLocaleDateString('ar-EG')}</TableCell>
                  </TableRow>
                );
              })}
            </TableBody>
          </Table>
        )}
      </CardContent>
    </Card>
  );
}

function MySubscription() {
  const { currentUser, subscribeStudent } = useStore();
  const [showPayment, setShowPayment] = useState<typeof demoSubscriptions[number] | null>(null);
  const [paymentMethod, setPaymentMethod] = useState('card');
  const [couponCode, setCouponCode] = useState('');
  const [processing, setProcessing] = useState(false);
  const daysLeft = currentUser?.subscriptionExpiry
    ? Math.ceil((new Date(currentUser.subscriptionExpiry).getTime() - Date.now()) / (1000 * 60 * 60 * 24))
    : 0;

  const handlePay = async () => {
    if (!showPayment) return;
    setProcessing(true);
    const success = await subscribeStudent(showPayment.name, showPayment.price, paymentMethod, couponCode);
    setProcessing(false);
    if (success) {
      setShowPayment(null);
      setCouponCode('');
      toast.success(`تم الاشتراك في ${showPayment.name} بنجاح! 🎉`);
    } else {
      toast.error('فشل في الدفع');
    }
  };

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
                ينتهي في: {currentUser?.subscriptionExpiry ? new Date(currentUser.subscriptionExpiry).toLocaleDateString('ar-EG') : '-'}
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
                <Button className="w-full" onClick={() => setShowPayment(sub)}>اشترك</Button>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>

      <Dialog open={!!showPayment} onOpenChange={(open) => !open && setShowPayment(null)}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>إتمام عملية الدفع</DialogTitle>
            <DialogDescription>{showPayment?.name} - {showPayment?.price} ج.م</DialogDescription>
          </DialogHeader>
          <div className="space-y-3">
            <div>
              <Label>طريقة الدفع</Label>
              <Select value={paymentMethod} onValueChange={setPaymentMethod}>
                <SelectTrigger><SelectValue /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="card">💳 بطاقة ائتمانية</SelectItem>
                  <SelectItem value="paypal">💰 PayPal</SelectItem>
                  <SelectItem value="vodafone_cash">📱 فودافون كاش</SelectItem>
                  <SelectItem value="fawry">🏪 فوري</SelectItem>
                </SelectContent>
              </Select>
            </div>
            {paymentMethod === 'card' && (
              <>
                <div><Label>رقم البطاقة</Label><Input dir="ltr" placeholder="4242 4242 4242 4242" /></div>
                <div className="grid grid-cols-2 gap-2">
                  <div><Label>تاريخ الانتهاء</Label><Input dir="ltr" placeholder="MM/YY" /></div>
                  <div><Label>CVV</Label><Input dir="ltr" placeholder="123" /></div>
                </div>
              </>
            )}
            <div><Label>كوبون خصم (اختياري)</Label><Input value={couponCode} onChange={e => setCouponCode(e.target.value)} placeholder="MATH50" /></div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setShowPayment(null)}>إلغاء</Button>
            <Button onClick={handlePay} disabled={processing}>
              {processing ? 'جاري المعالجة...' : `ادفع ${showPayment?.price} ج.م`}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}

function MyCertificates() {
  const { currentUser } = useStore();
  return (
    <Card>
      <CardHeader><CardTitle>الشهادات</CardTitle></CardHeader>
      <CardContent>
        <EmptyState icon={Trophy} title="لا توجد شهادات بعد" description="أكمل الدروس والامتحانات للحصول على شهادات" />
      </CardContent>
    </Card>
  );
}

function MyFavorites() {
  const { lessons, currentUser, openLesson, toggleFavorite } = useStore();
  const favorites = currentUser?.favorites || [];
  const myFavorites = lessons.filter((l: any) => favorites.includes(l.id));

  return (
    <Card>
      <CardHeader><CardTitle>المفضلة ({myFavorites.length})</CardTitle></CardHeader>
      <CardContent>
        {myFavorites.length === 0 ? (
          <EmptyState icon={Heart} title="لا توجد دروس في المفضلة" />
        ) : (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
            {myFavorites.map((l: any) => (
              <Card key={l.id} className="overflow-hidden">
                <div className="aspect-video bg-gradient-to-br from-rose-500/20 to-purple-500/20 relative flex items-center justify-center">
                  <Play className="w-12 h-12 text-rose-600" />
                  <button onClick={() => toggleFavorite(l.id)} className="absolute top-2 left-2 w-8 h-8 rounded-full bg-white/80 dark:bg-black/50 flex items-center justify-center">
                    <Heart className="w-4 h-4 fill-rose-500 text-rose-500" />
                  </button>
                </div>
                <CardContent className="p-3">
                  <h3 className="font-semibold text-sm mb-1 line-clamp-1">{l.title}</h3>
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
  const { notifications, markNotificationRead } = useStore();
  return (
    <Card>
      <CardHeader><CardTitle>الإشعارات ({notifications.length})</CardTitle></CardHeader>
      <CardContent className="space-y-2">
        {notifications.length === 0 ? (
          <EmptyState icon={Bell} title="لا توجد إشعارات" />
        ) : (
          notifications.map((n: any) => (
            <div key={n.id} className={`p-3 rounded-lg border ${!n.read ? 'bg-emerald-50 dark:bg-emerald-900/20' : ''}`}>
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <div className="font-medium text-sm">{n.title}</div>
                  <p className="text-sm text-muted-foreground">{n.message}</p>
                </div>
                {!n.read && <Button size="sm" variant="ghost" onClick={() => markNotificationRead(n.id)}>
                  <CheckCircle2 className="w-4 h-4" />
                </Button>}
              </div>
            </div>
          ))
        )}
      </CardContent>
    </Card>
  );
}
