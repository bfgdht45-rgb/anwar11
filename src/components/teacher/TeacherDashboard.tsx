'use client';

import { useState, useEffect } from 'react';
import { DashboardLayout, StatCard, EmptyState } from '@/components/shared/DashboardLayout';
import { HtmlExamBuilder } from '@/components/shared/HtmlExamRunner';
import { useStore } from '@/lib/store';
import { units as initialUnits, demoStats } from '@/lib/data';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Switch } from '@/components/ui/switch';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { toast } from 'sonner';
import {
  LayoutDashboard, BookOpen, Video, FileText, Award, Users, MessageSquare,
  Bell, Plus, Edit, Trash2, Eye, Star, DollarSign, TrendingUp, Save, Upload,
  Play
} from 'lucide-react';
import { LineChart, Line, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import type { Lesson, Assignment, Exam } from '@/lib/types';

const navItems = [
  { id: 'dashboard', label: 'الرئيسية', icon: LayoutDashboard },
  { id: 'lessons', label: 'دروسي', icon: BookOpen },
  { id: 'add-lesson', label: 'إضافة درس', icon: Plus },
  { id: 'videos', label: 'الفيديوهات', icon: Video },
  { id: 'pdfs', label: 'ملفات PDF', icon: FileText },
  { id: 'assignments', label: 'الواجبات', icon: FileText },
  { id: 'exams', label: 'الامتحانات', icon: Award },
  { id: 'results', label: 'نتائج الطلاب', icon: Users },
  { id: 'questions', label: 'أسئلة الطلاب', icon: MessageSquare },
  { id: 'comments', label: 'التعليقات', icon: MessageSquare },
  { id: 'notifications', label: 'الإشعارات', icon: Bell },
];

export default function TeacherDashboard() {
  const [activeItem, setActiveItem] = useState('dashboard');

  return (
    <DashboardLayout
      items={navItems}
      activeItem={activeItem}
      onItemChange={setActiveItem}
      title="لوحة المعلم"
      roleLabel="مدرس رياضيات"
      roleIcon="👨‍🏫"
    >
      {activeItem === 'dashboard' && <TeacherOverview />}
      {activeItem === 'lessons' && <MyLessons />}
      {activeItem === 'add-lesson' && <AddLesson />}
      {activeItem === 'videos' && <MyVideos />}
      {activeItem === 'pdfs' && <MyPDFs />}
      {activeItem === 'assignments' && <MyAssignments />}
      {activeItem === 'exams' && <MyExams />}
      {activeItem === 'results' && <StudentResults />}
      {activeItem === 'questions' && <StudentQuestions />}
      {activeItem === 'comments' && <TeacherComments />}
      {activeItem === 'notifications' && <TeacherNotifications />}
    </DashboardLayout>
  );
}

function TeacherOverview() {
  const { currentUser, lessons, grades } = useStore();
  const myLessons = lessons.filter(l => l.teacherId === currentUser?.id);
  const myStudents = demoStats.totalStudents;
  const totalViews = myLessons.reduce((sum, l) => sum + l.views, 0);

  const viewsData = [
    { day: 'السبت', views: 120 },
    { day: 'الأحد', views: 145 },
    { day: 'الإثنين', views: 132 },
    { day: 'الثلاثاء', views: 178 },
    { day: 'الأربعاء', views: 169 },
    { day: 'الخميس', views: 192 },
    { day: 'الجمعة', views: 88 },
  ];

  return (
    <div className="space-y-6">
      <Card className="overflow-hidden border-0 bg-gradient-to-l from-purple-600 to-fuchsia-700 text-white">
        <CardContent className="p-6 flex items-center justify-between flex-wrap gap-4">
          <div className="flex items-center gap-4">
            <Avatar className="w-16 h-16 text-3xl bg-white/20">
              <AvatarFallback className="text-3xl bg-white/20">{currentUser?.avatar}</AvatarFallback>
            </Avatar>
            <div>
              <h2 className="text-2xl font-bold mb-1">{currentUser?.name}</h2>
              <p className="opacity-90 text-sm">{currentUser?.bio}</p>
              <div className="flex items-center gap-2 mt-1">
                <Star className="w-4 h-4 fill-amber-300 text-amber-300" />
                <span className="text-sm">{currentUser?.rating} تقييم</span>
              </div>
            </div>
          </div>
          <div className="text-left">
            <div className="text-3xl font-bold">{(currentUser?.totalEarnings || 0).toLocaleString('ar-EG')}</div>
            <div className="text-sm opacity-90">ج.م إجمالي الأرباح</div>
          </div>
        </CardContent>
      </Card>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <StatCard icon={Users} label="عدد الطلاب" value={currentUser?.studentsCount || 0} color="text-emerald-600" />
        <StatCard icon={Eye} label="إجمالي المشاهدات" value={totalViews} color="text-amber-600" trend="+15%" />
        <StatCard icon={BookOpen} label="عدد الدروس" value={myLessons.length} color="text-purple-600" />
        <StatCard icon={DollarSign} label="الأرباح" value={`${(currentUser?.totalEarnings || 0).toLocaleString('ar-EG')} ج.م`} color="text-rose-600" trend="+22%" />
      </div>

      <div className="grid lg:grid-cols-2 gap-4">
        <Card>
          <CardHeader>
            <CardTitle className="text-lg flex items-center gap-2">
              <TrendingUp className="w-5 h-5 text-emerald-600" />
              مشاهدات الأسبوع
            </CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={250}>
              <BarChart data={viewsData}>
                <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                <XAxis dataKey="day" stroke="hsl(var(--muted-foreground))" fontSize={12} />
                <YAxis stroke="hsl(var(--muted-foreground))" fontSize={12} />
                <Tooltip />
                <Bar dataKey="views" fill="#a855f7" radius={[8, 8, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
        <Card>
          <CardHeader><CardTitle className="text-lg">آخر التعليقات</CardTitle></CardHeader>
          <CardContent className="space-y-3">
            {useStore(s => s.comments).slice(0, 4).map(c => (
              <div key={c.id} className="flex items-start gap-3 p-2 rounded-lg hover:bg-muted/50">
                <Avatar className="text-lg"><AvatarFallback className="text-lg">{c.userAvatar}</AvatarFallback></Avatar>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2">
                    <span className="font-medium text-sm">{c.userName}</span>
                    {c.rating && <span className="text-xs">⭐ {c.rating}</span>}
                  </div>
                  <p className="text-xs text-muted-foreground line-clamp-2">{c.text}</p>
                </div>
              </div>
            ))}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

function MyLessons() {
  const { lessons, currentUser, openLesson, deleteLesson } = useStore();
  const myLessons = lessons.filter(l => l.teacherId === currentUser?.id);

  return (
    <Card>
      <CardHeader>
        <CardTitle>دروسي ({myLessons.length})</CardTitle>
      </CardHeader>
      <CardContent>
        {myLessons.length === 0 ? (
          <EmptyState icon={BookOpen} title="لا توجد دروس بعد" description="ابدأ بإضافة أول درس" />
        ) : (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
            {myLessons.map(l => (
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
                    <div className="flex gap-1">
                      <Button size="sm" variant="ghost" onClick={() => openLesson(l.id)}><Eye className="w-4 h-4" /></Button>
                      <Button size="sm" variant="ghost" onClick={() => { deleteLesson(l.id); toast.success('تم الحذف'); }}>
                        <Trash2 className="w-4 h-4 text-rose-500" />
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  );
}

function AddLesson() {
  const { addLesson, currentUser, units } = useStore();
  const [lesson, setLesson] = useState({
    title: '', description: '', videoUrl: '', videoDuration: '',
    unitId: '', videoSource: 'youtube' as Lesson['videoSource'],
    allowPdfDownload: true,
  });
  const [pdfs, setPdfs] = useState<{ name: string; url: string }[]>([]);
  const [newPdf, setNewPdf] = useState({ name: '', url: '' });
  const [examHtml, setExamHtml] = useState('');

  // تحديث unitId الافتراضي - باستخدام derived state بدل useEffect
  const defaultUnitId = lesson.unitId || units[0]?.id || '';

  const handleAddPdf = () => {
    if (!newPdf.name || !newPdf.url) return;
    setPdfs([...pdfs, newPdf]);
    setNewPdf({ name: '', url: '' });
  };

  const handleSave = async () => {
    if (!lesson.title || !lesson.videoUrl) {
      toast.error('أدخل العنوان ورابط الفيديو');
      return;
    }
    if (!lesson.unitId && !defaultUnitId) {
      toast.error('اختر الوحدة');
      return;
    }
    if (!currentUser?.id) {
      toast.error('يجب تسجيل الدخول كمعلم');
      return;
    }
    const success = await addLesson({
      unitId: lesson.unitId || defaultUnitId,
      teacherId: currentUser.id,
      title: lesson.title,
      description: lesson.description,
      videoUrl: lesson.videoUrl,
      videoSource: lesson.videoSource,
      videoDuration: lesson.videoDuration || '00:00',
      pdfs: pdfs.map((p, i) => ({ id: `pdf-${Date.now()}-${i}`, name: p.name, url: p.url, size: '1.2 MB', pages: 10 })),
      additionalFiles: [],
      allowPdfDownload: lesson.allowPdfDownload,
    } as any);
    if (success) {
      toast.success('تم إضافة الدرس بنجاح');
      setLesson({ title: '', description: '', videoUrl: '', videoDuration: '', unitId: '', videoSource: 'youtube', allowPdfDownload: true });
      setPdfs([]);
      setExamHtml('');
    } else {
      toast.error('فشل في إضافة الدرس');
    }
  };

  return (
    <div className="space-y-4">
      <Card>
        <CardHeader><CardTitle>بيانات الدرس</CardTitle></CardHeader>
        <CardContent className="space-y-3">
          <div><Label>عنوان الدرس *</Label><Input value={lesson.title} onChange={e => setLesson({ ...lesson, title: e.target.value })} /></div>
          <div><Label>الوصف</Label><Textarea value={lesson.description} onChange={e => setLesson({ ...lesson, description: e.target.value })} /></div>
          <div className="grid grid-cols-2 gap-3">
            <div>
              <Label>الوحدة</Label>
              <Select value={lesson.unitId || defaultUnitId} onValueChange={v => setLesson({ ...lesson, unitId: v })}>
                <SelectTrigger><SelectValue placeholder="اختر الوحدة" /></SelectTrigger>
                <SelectContent>
                  {units.length === 0 && <SelectItem value="none" disabled>لا توجد وحدات</SelectItem>}
                  {units.map(u => <SelectItem key={u.id} value={u.id}>{u.title}</SelectItem>)}
                </SelectContent>
              </Select>
            </div>
            <div>
              <Label>مصدر الفيديو</Label>
              <Select value={lesson.videoSource} onValueChange={(v: any) => setLesson({ ...lesson, videoSource: v })}>
                <SelectTrigger><SelectValue /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="youtube">YouTube</SelectItem>
                  <SelectItem value="vimeo">Vimeo</SelectItem>
                  <SelectItem value="direct">رفع مباشر</SelectItem>
                  <SelectItem value="gdrive">Google Drive</SelectItem>
                  <SelectItem value="cloudflare">Cloudflare Stream</SelectItem>
                  <SelectItem value="bunny">Bunny Stream</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div><Label>رابط الفيديو *</Label><Input dir="ltr" value={lesson.videoUrl} onChange={e => setLesson({ ...lesson, videoUrl: e.target.value })} /></div>
            <div><Label>مدة الفيديو</Label><Input value={lesson.videoDuration} onChange={e => setLesson({ ...lesson, videoDuration: e.target.value })} placeholder="24:35" /></div>
          </div>
          <div className="flex items-center gap-2">
            <Switch checked={lesson.allowPdfDownload} onCheckedChange={c => setLesson({ ...lesson, allowPdfDownload: c })} />
            <Label>السماح للطلاب بتحميل PDF</Label>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader><CardTitle>ملفات PDF</CardTitle></CardHeader>
        <CardContent className="space-y-3">
          <div className="flex gap-2">
            <Input placeholder="اسم الملف" value={newPdf.name} onChange={e => setNewPdf({ ...newPdf, name: e.target.value })} />
            <Input placeholder="الرابط" dir="ltr" value={newPdf.url} onChange={e => setNewPdf({ ...newPdf, url: e.target.value })} />
            <Button onClick={handleAddPdf}><Plus className="w-4 h-4" /></Button>
          </div>
          <div className="space-y-2">
            {pdfs.map((p, i) => (
              <div key={i} className="flex items-center gap-2 p-2 rounded-lg bg-muted/50">
                <FileText className="w-4 h-4 text-rose-500" />
                <span className="flex-1 text-sm">{p.name}</span>
                <Button size="icon" variant="ghost" onClick={() => setPdfs(pdfs.filter((_, idx) => idx !== i))}>
                  <Trash2 className="w-4 h-4 text-rose-500" />
                </Button>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader><CardTitle>الامتحان التفاعلي (HTML) - اختياري</CardTitle></CardHeader>
        <CardContent>
          <Tabs defaultValue="builder">
            <TabsList className="grid w-full grid-cols-2">
              <TabsTrigger value="builder">محرر الكود</TabsTrigger>
              <TabsTrigger value="preview">معاينة</TabsTrigger>
            </TabsList>
            <TabsContent value="builder">
              <HtmlExamBuilder onSave={setExamHtml} />
            </TabsContent>
            <TabsContent value="preview">
              {examHtml ? (
                <iframe srcDoc={examHtml} className="w-full min-h-[500px] rounded-lg border" sandbox="allow-scripts allow-same-origin allow-forms" title="معاينة" />
              ) : (
                <EmptyState icon={Eye} title="لا توجد معاينة" description="أضف كود HTML أولاً" />
              )}
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>

      <Button size="lg" className="w-full" onClick={handleSave}>
        <Save className="w-4 h-4 ml-2" /> نشر الدرس
      </Button>
    </div>
  );
}

function MyVideos() {
  const { lessons, currentUser } = useStore();
  const myLessons = lessons.filter(l => l.teacherId === currentUser?.id);
  return (
    <Card>
      <CardHeader><CardTitle>الفيديوهات ({myLessons.length})</CardTitle></CardHeader>
      <CardContent>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>الدرس</TableHead>
              <TableHead>المصدر</TableHead>
              <TableHead>المدة</TableHead>
              <TableHead>المشاهدات</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {myLessons.map(l => (
              <TableRow key={l.id}>
                <TableCell className="font-medium">{l.title}</TableCell>
                <TableCell><Badge variant="secondary">{l.videoSource}</Badge></TableCell>
                <TableCell>{l.videoDuration}</TableCell>
                <TableCell>{l.views}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  );
}

function MyPDFs() {
  const { lessons, currentUser } = useStore();
  const myPdfs = lessons.filter(l => l.teacherId === currentUser?.id).flatMap(l => l.pdfs.map(p => ({ ...p, lesson: l.title })));
  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle>ملفات PDF ({myPdfs.length})</CardTitle>
          <Button><Upload className="w-4 h-4 ml-2" /> رفع PDF</Button>
        </div>
      </CardHeader>
      <CardContent>
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
          {myPdfs.map(p => (
            <Card key={p.id}>
              <CardContent className="p-4">
                <div className="flex items-start gap-3">
                  <div className="w-10 h-10 rounded-lg bg-rose-100 dark:bg-rose-900/30 flex items-center justify-center text-rose-600 font-bold text-xs">PDF</div>
                  <div className="flex-1">
                    <div className="font-medium text-sm">{p.name}</div>
                    <div className="text-xs text-muted-foreground">{p.size}</div>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}

function MyAssignments() {
  const { assignments } = useStore();
  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle>الواجبات ({assignments.length})</CardTitle>
          <Button><Plus className="w-4 h-4 ml-2" /> واجب جديد</Button>
        </div>
      </CardHeader>
      <CardContent>
        <div className="grid md:grid-cols-2 gap-4">
          {assignments.map(a => (
            <Card key={a.id}>
              <CardContent className="p-4">
                <div className="flex items-start justify-between mb-2">
                  <h3 className="font-semibold">{a.title}</h3>
                  <Badge variant="secondary">{a.questions.length} سؤال</Badge>
                </div>
                <p className="text-sm text-muted-foreground mb-3">{a.description}</p>
                <div className="flex items-center justify-between text-xs text-muted-foreground">
                  <span>المجموع: {a.totalPoints} نقطة</span>
                  <span>آخر موعد: {a.dueDate}</span>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}

function MyExams() {
  const { exams, addExam, deleteExam } = useStore();
  const [showAdd, setShowAdd] = useState(false);
  const [previewExam, setPreviewExam] = useState<Exam | null>(null);
  const [newExam, setNewExam] = useState({ title: '', description: '', duration: 30 });
  const [htmlContent, setHtmlContent] = useState('');

  const handleAdd = () => {
    if (!newExam.title) {
      toast.error('أدخل عنوان الامتحان');
      return;
    }
    if (!htmlContent) {
      toast.error('أدخل كود HTML');
      return;
    }
    addExam({
      id: `exam-${Date.now()}`,
      title: newExam.title,
      description: newExam.description,
      durationMinutes: newExam.duration,
      preventBack: true, randomOrder: false, showGrade: true, showSolution: true,
      passingScore: 60, questions: [],
      isHtmlExam: true, htmlContent,
    });
    toast.success('تم إنشاء الامتحان التفاعلي');
    setShowAdd(false);
    setNewExam({ title: '', description: '', duration: 30 });
    setHtmlContent('');
  };

  return (
    <div className="space-y-4">
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle>الامتحانات ({exams.length})</CardTitle>
            <Button onClick={() => setShowAdd(true)}><Plus className="w-4 h-4 ml-2" /> امتحان HTML جديد</Button>
          </div>
        </CardHeader>
        <CardContent>
          <div className="grid md:grid-cols-2 gap-4">
            {exams.map(e => (
              <Card key={e.id}>
                <CardContent className="p-4">
                  <div className="flex items-start justify-between mb-2">
                    <div className="flex items-center gap-2">
                      <Award className="w-5 h-5 text-amber-600" />
                      <h3 className="font-semibold">{e.title}</h3>
                    </div>
                    {e.isHtmlExam && <Badge>HTML</Badge>}
                  </div>
                  <p className="text-sm text-muted-foreground mb-3">{e.description}</p>
                  <div className="flex gap-2 text-xs mb-3">
                    <Badge variant="secondary">⏱ {e.durationMinutes} د</Badge>
                    <Badge variant="secondary">🎯 {e.passingScore}%</Badge>
                  </div>
                  <div className="flex gap-2">
                    <Button size="sm" variant="outline" className="flex-1" onClick={() => setPreviewExam(e)}>
                      <Eye className="w-4 h-4 ml-1" /> معاينة
                    </Button>
                    <Button size="sm" variant="ghost" className="text-rose-500" onClick={() => { deleteExam(e.id); toast.success('تم الحذف'); }}>
                      <Trash2 className="w-4 h-4 ml-1" /> حذف
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Dialog معاينة الامتحان */}
      <Dialog open={!!previewExam} onOpenChange={(open) => !open && setPreviewExam(null)}>
        <DialogContent className="max-w-4xl max-h-[90vh] overflow-hidden flex flex-col">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <Award className="w-5 h-5 text-amber-600" />
              {previewExam?.title}
            </DialogTitle>
            <DialogDescription>{previewExam?.description}</DialogDescription>
          </DialogHeader>
          <div className="flex-1 overflow-hidden">
            {previewExam?.isHtmlExam && previewExam?.htmlContent ? (
              <iframe
                srcDoc={previewExam.htmlContent}
                className="w-full h-[70vh] rounded-lg border"
                sandbox="allow-scripts allow-same-origin allow-forms"
                title={previewExam.title}
              />
            ) : (
              <div className="p-8 text-center text-muted-foreground">
                هذا الامتحان ليس امتحان HTML تفاعلي
              </div>
            )}
          </div>
        </DialogContent>
      </Dialog>

      <Dialog open={showAdd} onOpenChange={setShowAdd}>
        <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>إنشاء امتحان HTML تفاعلي</DialogTitle>
            <DialogDescription>أدخل بيانات الامتحان وكود HTML</DialogDescription>
          </DialogHeader>
          <div className="space-y-3">
            <div><Label>عنوان الامتحان</Label><Input value={newExam.title} onChange={e => setNewExam({ ...newExam, title: e.target.value })} /></div>
            <div><Label>الوصف</Label><Textarea value={newExam.description} onChange={e => setNewExam({ ...newExam, description: e.target.value })} /></div>
            <div><Label>المدة (دقيقة)</Label><Input type="number" value={newExam.duration} onChange={e => setNewExam({ ...newExam, duration: +e.target.value })} /></div>
            <HtmlExamBuilder onSave={setHtmlContent} />
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setShowAdd(false)}>إلغاء</Button>
            {htmlContent && (
              <Button variant="outline" onClick={() => {
                const newWindow = window.open('', '_blank');
                if (newWindow) {
                  newWindow.document.write(htmlContent);
                  newWindow.document.close();
                }
              }}>
                <Eye className="w-4 h-4 ml-2" /> معاينة سريعة
              </Button>
            )}
            <Button onClick={handleAdd}>حفظ</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}

function StudentResults() {
  const { grades } = useStore();
  return (
    <Card>
      <CardHeader><CardTitle>نتائج الطلاب</CardTitle></CardHeader>
      <CardContent>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>الطالب</TableHead>
              <TableHead>النوع</TableHead>
              <TableHead>العنوان</TableHead>
              <TableHead>الدرجة</TableHead>
              <TableHead>التاريخ</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {grades.map(g => (
              <TableRow key={g.id}>
                <TableCell>{g.studentName}</TableCell>
                <TableCell><Badge variant="secondary">{g.itemType === 'exam' ? 'امتحان' : 'واجب'}</Badge></TableCell>
                <TableCell>{g.title}</TableCell>
                <TableCell>
                  <Badge variant={g.score / g.totalScore >= 0.6 ? 'default' : 'destructive'}>
                    {g.score}/{g.totalScore}
                  </Badge>
                </TableCell>
                <TableCell>{g.date}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  );
}

function StudentQuestions() {
  const [questions, setQuestions] = useState([
    { id: 'q1', student: 'أحمد محمود', avatar: '🧑‍🎓', question: 'ما الفرق بين النهاية اليمنى واليسرى؟', date: '2026-06-28', answered: false, answer: '' },
    { id: 'q2', student: 'سارة أحمد', avatar: '👩‍🎓', question: 'كيف نحل معادلة من الدرجة الثانية؟', date: '2026-06-27', answered: true, answer: 'نستخدم القانون العام: x = (-b ± √(b²-4ac)) / 2a' },
  ]);
  const [answers, setAnswers] = useState<Record<string, string>>({});

  const handleAnswer = (id: string) => {
    if (!answers[id]?.trim()) {
      toast.error('اكتب الرد أولاً');
      return;
    }
    setQuestions(qs => qs.map(q => q.id === id ? { ...q, answered: true, answer: answers[id] } : q));
    setAnswers({ ...answers, [id]: '' });
    toast.success('تم إرسال الرد');
  };

  return (
    <Card>
      <CardHeader><CardTitle>أسئلة الطلاب ({questions.length})</CardTitle></CardHeader>
      <CardContent className="space-y-3">
        {questions.map(q => (
          <div key={q.id} className="p-3 rounded-lg border">
            <div className="flex items-start gap-3">
              <Avatar><AvatarFallback>{q.avatar}</AvatarFallback></Avatar>
              <div className="flex-1">
                <div className="flex items-center gap-2 mb-1">
                  <span className="font-medium">{q.student}</span>
                  <Badge variant={q.answered ? 'default' : 'secondary'}>{q.answered ? 'تم الرد' : 'بانتظار الرد'}</Badge>
                  <span className="text-xs text-muted-foreground">{q.date}</span>
                </div>
                <p className="text-sm mb-3">{q.question}</p>
                {q.answered && q.answer && (
                  <div className="p-2 rounded-lg bg-emerald-50 dark:bg-emerald-900/20 mb-2">
                    <div className="text-xs text-emerald-600 font-medium mb-1">ردك:</div>
                    <div className="text-sm">{q.answer}</div>
                  </div>
                )}
                {!q.answered && (
                  <div className="flex gap-2">
                    <Input
                      placeholder="اكتب ردك..."
                      value={answers[q.id] || ''}
                      onChange={e => setAnswers({ ...answers, [q.id]: e.target.value })}
                    />
                    <Button onClick={() => handleAnswer(q.id)}>إرسال</Button>
                  </div>
                )}
              </div>
            </div>
          </div>
        ))}
      </CardContent>
    </Card>
  );
}

function TeacherComments() {
  const { comments, addComment, currentUser } = useStore();
  const [replyTo, setReplyTo] = useState<string | null>(null);
  const [replyText, setReplyText] = useState('');

  const handleReply = (lessonId: string, commentId: string) => {
    if (!replyText.trim()) {
      toast.error('اكتب الرد');
      return;
    }
    addComment(lessonId, `رد على التعليق: ${replyText}`, undefined);
    setReplyText('');
    setReplyTo(null);
    toast.success('تم إرسال الرد');
  };

  return (
    <Card>
      <CardHeader><CardTitle>التعليقات على دروسي ({comments.length})</CardTitle></CardHeader>
      <CardContent className="space-y-3">
        {comments.map(c => (
          <div key={c.id} className="flex items-start gap-3 p-3 rounded-lg border">
            <Avatar><AvatarFallback>{c.userAvatar}</AvatarFallback></Avatar>
            <div className="flex-1">
              <div className="flex items-center gap-2 mb-1">
                <span className="font-medium">{c.userName}</span>
                {c.rating && <Badge variant="secondary">⭐ {c.rating}</Badge>}
                <span className="text-xs text-muted-foreground">{c.createdAt}</span>
              </div>
              <p className="text-sm text-muted-foreground mb-2">{c.text}</p>
              {replyTo === c.id ? (
                <div className="flex gap-2 mt-2">
                  <Input
                    placeholder="اكتب ردك..."
                    value={replyText}
                    onChange={e => setReplyText(e.target.value)}
                    autoFocus
                  />
                  <Button size="sm" onClick={() => handleReply(c.lessonId, c.id)}>إرسال</Button>
                  <Button size="sm" variant="outline" onClick={() => { setReplyTo(null); setReplyText(''); }}>إلغاء</Button>
                </div>
              ) : (
                <Button size="sm" variant="ghost" onClick={() => setReplyTo(c.id)}>
                  <MessageSquare className="w-3.5 h-3.5 ml-1" /> رد
                </Button>
              )}
            </div>
          </div>
        ))}
      </CardContent>
    </Card>
  );
}

function TeacherNotifications() {
  const { notifications, addNotification, currentUser } = useStore();
  const [msg, setMsg] = useState('');

  const handleSend = () => {
    if (!msg) return;
    addNotification({
      id: `n-${Date.now()}`,
      userId: undefined, // broadcast to students
      title: `رسالة من ${currentUser?.name}`,
      message: msg,
      type: 'info',
      createdAt: new Date().toISOString().split('T')[0],
      read: false,
    });
    toast.success('تم إرسال الإشعار للطلاب');
    setMsg('');
  };

  return (
    <div className="space-y-4">
      <Card>
        <CardHeader><CardTitle>إرسال إشعار للطلاب</CardTitle></CardHeader>
        <CardContent className="space-y-3">
          <Textarea placeholder="اكتب رسالتك للطلاب..." value={msg} onChange={e => setMsg(e.target.value)} />
          <Button onClick={handleSend}><Bell className="w-4 h-4 ml-2" /> إرسال</Button>
        </CardContent>
      </Card>
      <Card>
        <CardHeader><CardTitle>الإشعارات السابقة</CardTitle></CardHeader>
        <CardContent className="space-y-2">
          {notifications.map(n => (
            <div key={n.id} className="p-3 rounded-lg border">
              <div className="font-medium text-sm">{n.title}</div>
              <p className="text-sm text-muted-foreground">{n.message}</p>
              <div className="text-xs text-muted-foreground mt-1">{n.createdAt}</div>
            </div>
          ))}
        </CardContent>
      </Card>
    </div>
  );
}
