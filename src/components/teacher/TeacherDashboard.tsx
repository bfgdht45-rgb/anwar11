'use client';

import { useState, useEffect } from 'react';
import { DashboardLayout, StatCard, EmptyState } from '@/components/shared/DashboardLayout';
import { HtmlExamBuilder } from '@/components/shared/HtmlExamRunner';
import { useStore } from '@/lib/store';
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
import { toast } from 'sonner';
import {
  LayoutDashboard, BookOpen, Video, FileText, Award, Users, MessageSquare,
  Bell, Plus, Edit, Trash2, Eye, Star, DollarSign, TrendingUp, Save, Upload,
  Play
} from 'lucide-react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import type { Lesson, Exam } from '@/lib/types';

const navItems = [
  { id: 'dashboard', label: 'الرئيسية', icon: LayoutDashboard },
  { id: 'lessons', label: 'دروسي', icon: BookOpen },
  { id: 'add-lesson', label: 'إضافة درس', icon: Plus },
  { id: 'videos', label: 'الفيديوهات', icon: Video },
  { id: 'pdfs', label: 'ملفات PDF', icon: FileText },
  { id: 'exams', label: 'الامتحانات', icon: Award },
  { id: 'results', label: 'نتائج الطلاب', icon: Users },
  { id: 'comments', label: 'التعليقات', icon: MessageSquare },
  { id: 'notifications', label: 'الإشعارات', icon: Bell },
];

export default function TeacherDashboard() {
  const [activeItem, setActiveItem] = useState('dashboard');
  const store = useStore();

  useEffect(() => {
    store.fetchLessons();
    store.fetchExams();
    store.fetchUsers();
    store.fetchUnits();
    store.fetchNotifications();
    store.fetchGrades();
  }, []);

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
      {activeItem === 'exams' && <MyExams />}
      {activeItem === 'results' && <StudentResults />}
      {activeItem === 'comments' && <TeacherComments />}
      {activeItem === 'notifications' && <TeacherNotifications />}
    </DashboardLayout>
  );
}

function TeacherOverview() {
  const { currentUser, lessons } = useStore();
  const myLessons = lessons.filter((l: any) => l.teacherId === currentUser?.id);
  const totalViews = myLessons.reduce((sum: number, l: any) => sum + (l.views || 0), 0);

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
                <span className="text-sm">{currentUser?.rating || 0} تقييم</span>
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
    </div>
  );
}

function MyLessons() {
  const { lessons, currentUser, openLesson, deleteLesson, updateLesson } = useStore();
  const myLessons = lessons.filter((l: any) => l.teacherId === currentUser?.id);

  return (
    <Card>
      <CardHeader><CardTitle>دروسي ({myLessons.length})</CardTitle></CardHeader>
      <CardContent>
        {myLessons.length === 0 ? (
          <EmptyState icon={BookOpen} title="لا توجد دروس بعد" description="ابدأ بإضافة أول درس" />
        ) : (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
            {myLessons.map((l: any) => (
              <Card key={l.id} className="overflow-hidden hover:shadow-lg transition-shadow">
                <div className="aspect-video bg-gradient-to-br from-emerald-500/20 to-purple-500/20 relative flex items-center justify-center">
                  <Play className="w-12 h-12 text-emerald-600" />
                  <Badge className="absolute top-2 right-2">{l.videoDuration}</Badge>
                </div>
                <CardContent className="p-3">
                  <h3 className="font-semibold mb-1 line-clamp-1">{l.title}</h3>
                  <p className="text-xs text-muted-foreground mb-2 line-clamp-2">{l.description}</p>
                  <div className="flex items-center justify-between">
                    <Badge variant="secondary">👁 {l.views || 0}</Badge>
                    <div className="flex gap-1">
                      <Button size="sm" variant="ghost" onClick={() => openLesson(l.id)}><Eye className="w-4 h-4 ml-1" /> عرض</Button>
                      <Button size="sm" variant="ghost" onClick={() => {
                        const newTitle = prompt('عنوان الدرس:', l.title);
                        if (newTitle !== null) {
                          updateLesson(l.id, { title: newTitle, description: l.description, videoUrl: l.videoUrl, videoDuration: l.videoDuration, allowPdfDownload: l.allowPdfDownload });
                          toast.success('تم التعديل');
                        }
                      }}>
                        <Edit className="w-4 h-4 ml-1" /> تعديل
                      </Button>
                      <Button size="sm" variant="ghost" onClick={async () => {
                        if (confirm(`حذف الدرس "${l.title}"؟`)) {
                          await deleteLesson(l.id);
                          toast.success('تم الحذف');
                        }
                      }}>
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

function AssignmentBuilder({ questions, setQuestions }: { questions: any[]; setQuestions: (q: any[]) => void }) {
  const [newQ, setNewQ] = useState({
    text: '', type: 'MCQ', difficulty: 'EASY', correctAnswer: '', points: 5,
    options: ['', '', '', ''], imageUrl: '',
  });

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = () => {
        const result = reader.result as string;
        setNewQ({ ...newQ, imageUrl: result });
      };
      reader.readAsDataURL(file);
    }
  };

  const addQuestion = () => {
    if (!newQ.text && !newQ.imageUrl) {
      toast.error('أدخل نص السؤال أو صورة على الأقل');
      return;
    }
    const q = {
      id: `q-${Date.now()}`,
      ...newQ,
      text: newQ.text || 'سؤال بصورة',
      correctAnswer: newQ.correctAnswer || 'إجابة بصرية',
      options: newQ.type === 'MCQ' ? newQ.options.filter(o => o) : undefined,
    };
    setQuestions([...questions, q]);
    setNewQ({ text: '', type: 'MCQ', difficulty: 'EASY', correctAnswer: '', points: 5, options: ['', '', '', ''], imageUrl: '' });
    toast.success('تم إضافة السؤال');
  };

  return (
    <div className="space-y-3">
      {questions.length > 0 && (
        <div className="space-y-2">
          {questions.map((q, i) => (
            <div key={q.id} className="flex items-center gap-2 p-2 rounded-lg bg-muted/50">
              <Badge>{i + 1}</Badge>
              <span className="flex-1 text-sm line-clamp-1">{q.text}</span>
              {q.imageUrl && <Badge variant="secondary">📷 صورة</Badge>}
              <Badge variant="secondary">{q.type}</Badge>
              <Badge variant="secondary">{q.points} نقطة</Badge>
              <Button size="icon" variant="ghost" className="h-6 w-6" onClick={() => setQuestions(questions.filter((_, idx) => idx !== i))}>
                <Trash2 className="w-3 h-3 text-rose-500" />
              </Button>
            </div>
          ))}
        </div>
      )}

      <div className="border rounded-lg p-3 space-y-2">
        <div><Label>نص السؤال</Label><Textarea value={newQ.text} onChange={e => setNewQ({ ...newQ, text: e.target.value })} /></div>

        {/* رفع صورة للسؤال */}
        <div>
          <Label>صورة للسؤال (اختياري - رفع ملف أو رابط مباشر)</Label>
          <div className="space-y-2">
            <div className="flex gap-2 items-center">
              <Input type="file" accept="image/*" onChange={handleImageUpload} className="flex-1" />
              {newQ.imageUrl && (
                <div className="relative">
                  <img src={newQ.imageUrl} alt="معاينة" className="w-16 h-16 object-cover rounded-lg border" />
                  <Button size="icon" variant="destructive" className="absolute -top-2 -right-2 h-5 w-5" onClick={() => setNewQ({ ...newQ, imageUrl: '' })}>
                    <Trash2 className="w-3 h-3" />
                  </Button>
                </div>
              )}
            </div>
            <div className="flex gap-2 items-center">
              <Input placeholder="أو الصق رابط صورة مباشر: https://..." dir="ltr" value={newQ.imageUrl.startsWith('data:') ? '' : newQ.imageUrl} onChange={e => setNewQ({ ...newQ, imageUrl: e.target.value })} />
            </div>
          </div>
        </div>
        <div className="grid grid-cols-3 gap-2">
          <div>
            <Label>النوع</Label>
            <Select value={newQ.type} onValueChange={(v: any) => setNewQ({ ...newQ, type: v })}>
              <SelectTrigger><SelectValue /></SelectTrigger>
              <SelectContent>
                <SelectItem value="MCQ">اختيار من متعدد</SelectItem>
                <SelectItem value="TRUEFALSE">صح / خطأ</SelectItem>
                <SelectItem value="FILL">أكمل الفراغ</SelectItem>
                <SelectItem value="ESSAY">مقالي</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div>
            <Label>الصعوبة</Label>
            <Select value={newQ.difficulty} onValueChange={(v: any) => setNewQ({ ...newQ, difficulty: v })}>
              <SelectTrigger><SelectValue /></SelectTrigger>
              <SelectContent>
                <SelectItem value="EASY">سهل</SelectItem>
                <SelectItem value="MEDIUM">متوسط</SelectItem>
                <SelectItem value="HARD">صعب</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div><Label>الدرجة</Label><Input type="number" value={newQ.points} onChange={e => setNewQ({ ...newQ, points: +e.target.value })} /></div>
        </div>

        {newQ.type === 'MCQ' && (
          <div className="space-y-1">
            <Label>الاختيارات</Label>
            {newQ.options.map((opt, i) => (
              <Input key={i} placeholder={`الاختيار ${i + 1}`} value={opt}
                onChange={e => {
                  const opts = [...newQ.options];
                  opts[i] = e.target.value;
                  setNewQ({ ...newQ, options: opts });
                }} />
            ))}
          </div>
        )}

        <div><Label>الإجابة الصحيحة</Label><Input value={newQ.correctAnswer} onChange={e => setNewQ({ ...newQ, correctAnswer: e.target.value })} /></div>
        <Button size="sm" onClick={addQuestion}><Plus className="w-4 h-4 ml-2" /> إضافة السؤال</Button>
      </div>
    </div>
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
  const [assignmentQuestions, setAssignmentQuestions] = useState<any[]>([]);

  const defaultUnitId = lesson.unitId || units[0]?.id || '';

  const handleAddPdf = () => {
    if (!newPdf.name || !newPdf.url) {
      toast.error('أدخل اسم الملف والرابط');
      return;
    }
    setPdfs([...pdfs, newPdf]);
    setNewPdf({ name: '', url: '' });
    toast.success('تم إضافة الملف للقائمة');
  };

  const handlePdfUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = () => {
        setPdfs([...pdfs, { name: file.name, url: reader.result as string }]);
        toast.success('تم رفع الملف');
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSave = async () => {
    if (!lesson.title || !lesson.videoUrl) {
      toast.error('أدخل العنوان ورابط الفيديو');
      return;
    }
    if (!defaultUnitId) {
      toast.error('لا توجد وحدات - شغل /api/seed أولاً');
      return;
    }
    if (!currentUser?.id) {
      toast.error('يجب تسجيل الدخول كمعلم');
      return;
    }

    const payload: any = {
      unitId: lesson.unitId || defaultUnitId,
      teacherId: currentUser.id,
      title: lesson.title,
      description: lesson.description,
      videoUrl: lesson.videoUrl,
      videoSource: lesson.videoSource,
      videoDuration: lesson.videoDuration || '00:00',
      allowPdfDownload: lesson.allowPdfDownload,
      pdfs: pdfs.map(p => ({ name: p.name, url: p.url, size: '1.2 MB', pages: 10 })),
      additionalFiles: [],
    };

    if (examHtml.trim()) {
      payload.exam = {
        title: `امتحان: ${lesson.title}`,
        description: 'امتحان تفاعلي HTML',
        htmlContent: examHtml,
        durationMinutes: 30,
        passingScore: 60,
      };
    }

    if (assignmentQuestions.length > 0) {
      payload.assignment = {
        title: `واجب: ${lesson.title}`,
        description: 'واجب الدرس',
        totalPoints: assignmentQuestions.reduce((sum, q) => sum + q.points, 0),
        questions: assignmentQuestions,
      };
    }

    const success = await addLesson(payload);
    if (success) {
      toast.success('تم إضافة الدرس بنجاح');
      setLesson({ title: '', description: '', videoUrl: '', videoDuration: '', unitId: '', videoSource: 'youtube', allowPdfDownload: true });
      setPdfs([]);
      setExamHtml('');
      setAssignmentQuestions([]);
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
              <Label>المرحلة والصف</Label>
              <Select value={lesson.unitId || defaultUnitId} onValueChange={v => setLesson({ ...lesson, unitId: v })}>
                <SelectTrigger><SelectValue placeholder="اختر المرحلة والصف" /></SelectTrigger>
                <SelectContent className="max-h-[300px]">
                  {units.length === 0 && <SelectItem value="none" disabled>لا توجد مراحل</SelectItem>}
                  {units.map((u: any) => {
                    const stageText = u.stageId === 'high' ? 'ثانوي' : 'إعدادي';
                    const yearText = u.yearId === 'first' ? 'أولى' : u.yearId === 'second' ? 'ثانية' : 'ثالثة';
                    return <SelectItem key={u.id} value={u.id}>{stageText} - {yearText} ({u.title})</SelectItem>;
                  })}
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
                </SelectContent>
              </Select>
            </div>
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div><Label>رابط الفيديو *</Label><Input dir="ltr" value={lesson.videoUrl} onChange={e => setLesson({ ...lesson, videoUrl: e.target.value })} placeholder="https://www.youtube.com/watch?v=..." /></div>
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
          <div className="mt-2">
            <Label className="text-xs">أو ارفع ملف PDF من جهازك (يتم عرضه داخل الدرس مباشرة)</Label>
            <Input type="file" accept=".pdf" onChange={handlePdfUpload} className="mt-1" />
          </div>
          {pdfs.length > 0 && (
            <div className="space-y-2">
              {pdfs.map((p, i) => (
                <div key={i} className="flex items-center gap-2 p-2 rounded-lg bg-muted/50">
                  <FileText className="w-4 h-4 text-rose-500" />
                  <span className="flex-1 text-sm">{p.name}</span>
                  <Button size="icon" variant="ghost" className="h-6 w-6" onClick={() => setPdfs(pdfs.filter((_, idx) => idx !== i))}>
                    <Trash2 className="w-3 h-3 text-rose-500" />
                  </Button>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>

      <Card>
        <CardHeader><CardTitle>الواجب (اختياري)</CardTitle></CardHeader>
        <CardContent className="space-y-3">
          <p className="text-sm text-muted-foreground">أضف أسئلة للواجب. سيتم تصحيحها تلقائياً للطالب.</p>
          <AssignmentBuilder questions={assignmentQuestions} setQuestions={setAssignmentQuestions} />
        </CardContent>
      </Card>

      <Card>
        <CardHeader><CardTitle>الامتحان التفاعلي (HTML) - اختياري</CardTitle></CardHeader>
        <CardContent>
          <HtmlExamBuilder onSave={setExamHtml} />
        </CardContent>
      </Card>

      <Button size="lg" className="w-full" onClick={handleSave}>
        <Save className="w-4 h-4 ml-2" /> نشر الدرس
      </Button>
    </div>
  );
}

function MyVideos() {
  const { lessons, currentUser, openLesson } = useStore();
  const myLessons = lessons.filter((l: any) => l.teacherId === currentUser?.id);
  return (
    <Card>
      <CardHeader><CardTitle>الفيديوهات ({myLessons.length})</CardTitle></CardHeader>
      <CardContent>
        {myLessons.length === 0 ? (
          <EmptyState icon={Video} title="لا توجد فيديوهات" />
        ) : (
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>الدرس</TableHead>
                <TableHead>المصدر</TableHead>
                <TableHead>المدة</TableHead>
                <TableHead>المشاهدات</TableHead>
                <TableHead>إجراء</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {myLessons.map((l: any) => (
                <TableRow key={l.id}>
                  <TableCell className="font-medium">{l.title}</TableCell>
                  <TableCell><Badge variant="secondary">{l.videoSource}</Badge></TableCell>
                  <TableCell>{l.videoDuration}</TableCell>
                  <TableCell>{l.views || 0}</TableCell>
                  <TableCell>
                    <Button size="sm" variant="ghost" onClick={() => openLesson(l.id)}>
                      <Eye className="w-4 h-4 ml-1" /> عرض
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        )}
      </CardContent>
    </Card>
  );
}

function MyPDFs() {
  const { lessons, currentUser } = useStore();
  const myPdfs = lessons.filter((l: any) => l.teacherId === currentUser?.id).flatMap((l: any) => (l.pdfs || []).map((p: any) => ({ ...p, lesson: l.title })));
  return (
    <Card>
      <CardHeader><CardTitle>ملفات PDF ({myPdfs.length})</CardTitle></CardHeader>
      <CardContent>
        {myPdfs.length === 0 ? (
          <EmptyState icon={FileText} title="لا توجد ملفات PDF" />
        ) : (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
            {myPdfs.map((p: any) => (
              <Card key={p.id}>
                <CardContent className="p-4">
                  <div className="flex items-start gap-3">
                    <div className="w-10 h-10 rounded-lg bg-rose-100 dark:bg-rose-900/30 flex items-center justify-center text-rose-600 font-bold text-xs">PDF</div>
                    <div className="flex-1">
                      <div className="font-medium text-sm">{p.name}</div>
                      <div className="text-xs text-muted-foreground">{p.size}</div>
                      <div className="text-xs text-muted-foreground mt-1">في: {p.lesson}</div>
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

function MyExams() {
  const { exams, addExam, deleteExam, currentUser } = useStore();
  // عرض كل الامتحانات + اللي عملها المعلم
  const myExams = exams; // كل الامتحانات متاحة للمعلم
  const [showAdd, setShowAdd] = useState(false);
  const [previewExam, setPreviewExam] = useState<Exam | null>(null);
  const [newExam, setNewExam] = useState({ title: '', description: '', duration: 30 });
  const [htmlContent, setHtmlContent] = useState('');

  const handleAdd = async () => {
    if (!newExam.title) { toast.error('أدخل عنوان الامتحان'); return; }
    if (!htmlContent) { toast.error('أدخل كود HTML'); return; }
    const success = await addExam({
      title: newExam.title,
      description: newExam.description,
      durationMinutes: newExam.duration,
      isHtmlExam: true,
      htmlContent,
    } as any);
    if (success) {
      toast.success('تم إنشاء الامتحان');
      setShowAdd(false);
      setNewExam({ title: '', description: '', duration: 30 });
      setHtmlContent('');
    } else {
      toast.error('فشل في الإنشاء');
    }
  };

  return (
    <div className="space-y-4">
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle>الامتحانات ({myExams.length})</CardTitle>
            <Button onClick={() => setShowAdd(true)}><Plus className="w-4 h-4 ml-2" /> امتحان HTML جديد</Button>
          </div>
        </CardHeader>
        <CardContent>
          {myExams.length === 0 ? (
            <EmptyState icon={Award} title="لا توجد امتحانات" />
          ) : (
            <div className="grid md:grid-cols-2 gap-4">
              {myExams.map((e: any) => (
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
                      <Button size="sm" variant="ghost" className="text-rose-500" onClick={async () => {
                        if (confirm('حذف الامتحان؟')) {
                          await deleteExam(e.id);
                          toast.success('تم الحذف');
                        }
                      }}>
                        <Trash2 className="w-4 h-4 ml-1" /> حذف
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </CardContent>
      </Card>

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
              <iframe srcDoc={previewExam.htmlContent} className="w-full h-[70vh] rounded-lg border" sandbox="allow-scripts allow-same-origin allow-forms" title="معاينة" />
            ) : (
              <div className="p-8 text-center text-muted-foreground">هذا امتحان عادي</div>
            )}
          </div>
        </DialogContent>
      </Dialog>

      <Dialog open={showAdd} onOpenChange={setShowAdd}>
        <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto">
          <DialogHeader><DialogTitle>إنشاء امتحان HTML تفاعلي</DialogTitle></DialogHeader>
          <div className="space-y-3">
            <div><Label>عنوان الامتحان</Label><Input value={newExam.title} onChange={e => setNewExam({ ...newExam, title: e.target.value })} /></div>
            <div><Label>الوصف</Label><Textarea value={newExam.description} onChange={e => setNewExam({ ...newExam, description: e.target.value })} /></div>
            <div><Label>المدة (دقيقة)</Label><Input type="number" value={newExam.duration} onChange={e => setNewExam({ ...newExam, duration: +e.target.value })} /></div>
            <HtmlExamBuilder onSave={setHtmlContent} />
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setShowAdd(false)}>إلغاء</Button>
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
      <CardHeader><CardTitle>نتائج الطلاب ({grades.length})</CardTitle></CardHeader>
      <CardContent>
        {grades.length === 0 ? (
          <EmptyState icon={Users} title="لا توجد نتائج بعد" />
        ) : (
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
              {grades.map((g: any) => (
                <TableRow key={g.id}>
                  <TableCell>{g.studentName}</TableCell>
                  <TableCell><Badge variant="secondary">{g.itemType === 'exam' ? 'امتحان' : 'واجب'}</Badge></TableCell>
                  <TableCell className="font-medium">{g.title}</TableCell>
                  <TableCell><Badge variant={g.score / g.totalScore >= 0.6 ? 'default' : 'destructive'}>{g.score}/{g.totalScore}</Badge></TableCell>
                  <TableCell>{new Date(g.date).toLocaleDateString('ar-EG')}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        )}
      </CardContent>
    </Card>
  );
}

function TeacherComments() {
  const { comments, fetchComments, addComment } = useStore() as any;
  const [replyTo, setReplyTo] = useState<string | null>(null);
  const [replyText, setReplyText] = useState('');

  useEffect(() => { fetchComments(); }, [fetchComments]);

  const handleReply = async (lessonId: string, commentId: string) => {
    if (!replyText.trim()) { toast.error('اكتب الرد'); return; }
    await addComment(lessonId, `رد: ${replyText}`, undefined);
    setReplyText('');
    setReplyTo(null);
    toast.success('تم إرسال الرد');
  };

  return (
    <Card>
      <CardHeader><CardTitle>التعليقات ({comments.length})</CardTitle></CardHeader>
      <CardContent className="space-y-3">
        {comments.length === 0 ? (
          <EmptyState icon={MessageSquare} title="لا توجد تعليقات" />
        ) : (
          comments.map((c: any) => (
            <div key={c.id} className="flex items-start gap-3 p-3 rounded-lg border">
              <Avatar><AvatarFallback>{c.user?.avatar || '👤'}</AvatarFallback></Avatar>
              <div className="flex-1">
                <div className="flex items-center gap-2 mb-1">
                  <span className="font-medium">{c.user?.name || 'مستخدم'}</span>
                  {c.rating && <Badge variant="secondary">⭐ {c.rating}</Badge>}
                </div>
                <p className="text-sm text-muted-foreground mb-2">{c.text}</p>
                {replyTo === c.id ? (
                  <div className="flex gap-2 mt-2">
                    <Input placeholder="اكتب ردك..." value={replyText} onChange={e => setReplyText(e.target.value)} autoFocus />
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
          ))
        )}
      </CardContent>
    </Card>
  );
}

function TeacherNotifications() {
  const { notifications, addNotification, currentUser } = useStore();
  const [msg, setMsg] = useState('');

  const handleSend = async () => {
    if (!msg) { toast.error('اكتب رسالة'); return; }
    await addNotification({ title: `رسالة من ${currentUser?.name}`, message: msg, type: 'info' } as any);
    toast.success('تم إرسال الإشعار');
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
        <CardHeader><CardTitle>الإشعارات السابقة ({notifications.length})</CardTitle></CardHeader>
        <CardContent className="space-y-2">
          {notifications.map((n: any) => (
            <div key={n.id} className="p-3 rounded-lg border">
              <div className="font-medium text-sm">{n.title}</div>
              <p className="text-sm text-muted-foreground">{n.message}</p>
            </div>
          ))}
        </CardContent>
      </Card>
    </div>
  );
}
