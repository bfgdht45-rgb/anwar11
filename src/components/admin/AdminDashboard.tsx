'use client';

import { useState, useEffect } from 'react';
import { DashboardLayout, StatCard, EmptyState } from '@/components/shared/DashboardLayout';
import { HtmlExamBuilder } from '@/components/shared/HtmlExamRunner';
import { useStore } from '@/lib/store';
import { stages } from '@/lib/data';
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
  LayoutDashboard, Users, GraduationCap, BookOpen, Video, FileText, Award,
  DollarSign, BarChart3, Bell, Ticket, CreditCard, MessageSquare, HelpCircle,
  Database, Shield, Plus, Edit, Trash2, Eye, Search, TrendingUp, Crown, Save,
  CheckCircle2, XCircle, Upload, Play
} from 'lucide-react';
import { LineChart, Line, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts';
import type { Exam, Lesson } from '@/lib/types';

const navItems = [
  { id: 'dashboard', label: 'الرئيسية', icon: LayoutDashboard },
  { id: 'teachers', label: 'المعلمون', icon: GraduationCap },
  { id: 'students', label: 'الطلاب', icon: Users },
  { id: 'lessons', label: 'الدروس', icon: BookOpen },
  { id: 'videos', label: 'الفيديوهات', icon: Video },
  { id: 'pdfs', label: 'ملفات PDF', icon: FileText },
  { id: 'exams', label: 'الامتحانات', icon: Award },
  { id: 'question-bank', label: 'بنك الأسئلة', icon: HelpCircle },
  { id: 'finance', label: 'الأرباح والمالية', icon: DollarSign },
  { id: 'subscriptions', label: 'الاشتراكات', icon: CreditCard },
  { id: 'payments', label: 'المدفوعات', icon: CreditCard },
  { id: 'coupons', label: 'كوبونات الخصم', icon: Ticket },
  { id: 'comments', label: 'التعليقات', icon: MessageSquare },
  { id: 'notifications', label: 'الإشعارات', icon: Bell },
  { id: 'stats', label: 'الإحصائيات', icon: BarChart3 },
  { id: 'backups', label: 'النسخ الاحتياطية', icon: Database },
  { id: 'permissions', label: 'الصلاحيات', icon: Shield },
];

export default function AdminDashboard() {
  const [activeItem, setActiveItem] = useState('dashboard');
  const store = useStore();

  // Fetch data on mount
  useEffect(() => {
    store.fetchLessons();
    store.fetchExams();
    store.fetchUsers();
    store.fetchUnits();
    store.fetchNotifications();
    store.fetchCoupons();
    store.fetchPayments();
    store.fetchStats();
    store.fetchQuestions();
  }, []);

  return (
    <DashboardLayout
      items={navItems}
      activeItem={activeItem}
      onItemChange={setActiveItem}
      title="لوحة تحكم الإدارة"
      roleLabel="مدير النظام"
      roleIcon="👨‍💼"
    >
      {activeItem === 'dashboard' && <AdminOverview />}
      {activeItem === 'teachers' && <ManageTeachers />}
      {activeItem === 'students' && <ManageStudents />}
      {activeItem === 'lessons' && <ManageLessons />}
      {activeItem === 'videos' && <ManageVideos />}
      {activeItem === 'pdfs' && <ManagePDFs />}
      {activeItem === 'exams' && <ManageExams />}
      {activeItem === 'question-bank' && <QuestionBank />}
      {activeItem === 'finance' && <FinanceSection />}
      {activeItem === 'subscriptions' && <SubscriptionsSection />}
      {activeItem === 'payments' && <PaymentsSection />}
      {activeItem === 'coupons' && <CouponsSection />}
      {activeItem === 'comments' && <CommentsSection />}
      {activeItem === 'notifications' && <NotificationsSection />}
      {activeItem === 'stats' && <StatsSection />}
      {activeItem === 'backups' && <BackupsSection />}
      {activeItem === 'permissions' && <PermissionsSection />}
    </DashboardLayout>
  );
}

// ===== Overview =====
function AdminOverview() {
  const { users, lessons, exams, stats } = useStore();
  const teachers = users.filter((u: any) => u.role === 'teacher');
  const students = users.filter((u: any) => u.role === 'student');
  const s = stats || { totalStudents: 0, totalTeachers: 0, totalSubscriptions: 0, totalVideos: 0, totalLessons: 0, totalExams: 0, totalVisits: 0, totalRevenue: 0, monthlyRevenue: [] };

  return (
    <div className="space-y-6">
      <Card className="overflow-hidden border-0 bg-gradient-to-l from-emerald-600 to-teal-700 text-white">
        <CardContent className="p-6 flex items-center justify-between flex-wrap gap-4">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <Crown className="w-5 h-5" />
              <span className="text-sm opacity-90">لوحة تحكم الإدارة</span>
            </div>
            <h2 className="text-2xl font-bold mb-1">مرحباً أيها المدير 👋</h2>
            <p className="opacity-90">إليك ملخص أداء المنصة</p>
          </div>
          <div className="text-left">
            <div className="text-3xl font-bold">{(s.totalRevenue || 0).toLocaleString('ar-EG')}</div>
            <div className="text-sm opacity-90">ج.م إجمالي الأرباح</div>
          </div>
        </CardContent>
      </Card>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <StatCard icon={Users} label="عدد الطلاب" value={s.totalStudents || students.length} color="text-emerald-600" trend="+12%" />
        <StatCard icon={GraduationCap} label="عدد المعلمين" value={s.totalTeachers || teachers.length} color="text-purple-600" />
        <StatCard icon={Video} label="عدد الفيديوهات" value={s.totalVideos || lessons.length} color="text-rose-600" />
        <StatCard icon={BookOpen} label="عدد الدروس" value={s.totalLessons || lessons.length} color="text-blue-600" />
      </div>

      <div className="grid lg:grid-cols-2 gap-4">
        <Card>
          <CardHeader>
            <CardTitle className="text-lg flex items-center gap-2">
              <TrendingUp className="w-5 h-5 text-emerald-600" />
              الأرباح الشهرية
            </CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={250}>
              <LineChart data={s.monthlyRevenue || []}>
                <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                <XAxis dataKey="month" stroke="hsl(var(--muted-foreground))" fontSize={12} />
                <YAxis stroke="hsl(var(--muted-foreground))" fontSize={12} />
                <Tooltip />
                <Line type="monotone" dataKey="revenue" stroke="#0f766e" strokeWidth={3} dot={{ fill: '#0f766e', r: 4 }} />
              </LineChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
        <Card>
          <CardHeader><CardTitle className="text-lg">آخر النشاطات</CardTitle></CardHeader>
          <CardContent className="space-y-3">
            {teachers.slice(0, 3).map((t: any) => (
              <div key={t.id} className="flex items-center gap-3 p-2 rounded-lg hover:bg-muted/50">
                <Avatar className="text-xl"><AvatarFallback className="text-xl">{t.avatar}</AvatarFallback></Avatar>
                <div className="flex-1 min-w-0">
                  <div className="font-medium text-sm truncate">{t.name}</div>
                  <div className="text-xs text-muted-foreground truncate">{t.bio || 'مدرس رياضيات'}</div>
                </div>
                <Badge variant="secondary">{t.studentsCount || 0} طالب</Badge>
              </div>
            ))}
            {teachers.length === 0 && <p className="text-sm text-muted-foreground text-center py-4">لا يوجد معلمين</p>}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

// ===== Manage Teachers =====
function ManageTeachers() {
  const { users, deleteUser, addUser } = useStore();
  const teachers = users.filter((u: any) => u.role === 'teacher');
  const [search, setSearch] = useState('');
  const [showAdd, setShowAdd] = useState(false);
  const [newTeacher, setNewTeacher] = useState({ name: '', email: '', bio: '' });

  const filtered = teachers.filter((t: any) => t.name.includes(search) || t.email.includes(search));

  const handleAdd = async () => {
    if (!newTeacher.name || !newTeacher.email) {
      toast.error('أدخل الاسم والبريد');
      return;
    }
    const success = await addUser({
      name: newTeacher.name,
      email: newTeacher.email,
      password: 'teacher123',
      role: 'teacher',
      avatar: '👨‍🏫',
      bio: newTeacher.bio || 'مدرس رياضيات',
    } as any);
    if (success) {
      toast.success('تم إضافة المعلم. كلمة المرور: teacher123');
      setNewTeacher({ name: '', email: '', bio: '' });
      setShowAdd(false);
    } else {
      toast.error('فشل في الإضافة');
    }
  };

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between flex-wrap gap-2">
          <div>
            <CardTitle>إدارة المعلمين ({teachers.length})</CardTitle>
            <CardDescription>إضافة وتعديل وحذف المعلمين</CardDescription>
          </div>
          <Button onClick={() => setShowAdd(true)}>
            <Plus className="w-4 h-4 ml-2" /> إضافة معلم
          </Button>
        </div>
      </CardHeader>
      <CardContent>
        <div className="mb-4 relative">
          <Search className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
          <Input placeholder="بحث..." className="pr-10" value={search} onChange={e => setSearch(e.target.value)} />
        </div>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>المعلم</TableHead>
              <TableHead>التقييم</TableHead>
              <TableHead>الطلاب</TableHead>
              <TableHead>الدروس</TableHead>
              <TableHead>إجراءات</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filtered.map((t: any) => (
              <TableRow key={t.id}>
                <TableCell>
                  <div className="flex items-center gap-2">
                    <Avatar><AvatarFallback>{t.avatar}</AvatarFallback></Avatar>
                    <div>
                      <div className="font-medium">{t.name}</div>
                      <div className="text-xs text-muted-foreground">{t.email}</div>
                    </div>
                  </div>
                </TableCell>
                <TableCell>⭐ {t.rating || 0}</TableCell>
                <TableCell>{t.studentsCount || 0}</TableCell>
                <TableCell>{t.lessonsCount || 0}</TableCell>
                <TableCell>
                  <Button size="icon" variant="ghost" onClick={async () => {
                    if (confirm(`حذف المعلم ${t.name}؟`)) {
                      await deleteUser(t.id);
                      toast.success('تم الحذف');
                    }
                  }}>
                    <Trash2 className="w-4 h-4 text-rose-500" />
                  </Button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>

        <Dialog open={showAdd} onOpenChange={setShowAdd}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>إضافة معلم جديد</DialogTitle>
              <DialogDescription>كلمة المرور الافتراضية: teacher123</DialogDescription>
            </DialogHeader>
            <div className="space-y-3">
              <div><Label>الاسم</Label><Input value={newTeacher.name} onChange={e => setNewTeacher({ ...newTeacher, name: e.target.value })} /></div>
              <div><Label>البريد الإلكتروني</Label><Input type="email" value={newTeacher.email} onChange={e => setNewTeacher({ ...newTeacher, email: e.target.value })} /></div>
              <div><Label>نبذة تعريفية</Label><Textarea value={newTeacher.bio} onChange={e => setNewTeacher({ ...newTeacher, bio: e.target.value })} /></div>
            </div>
            <DialogFooter>
              <Button variant="outline" onClick={() => setShowAdd(false)}>إلغاء</Button>
              <Button onClick={handleAdd}>إضافة</Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </CardContent>
    </Card>
  );
}

// ===== Manage Students =====
function ManageStudents() {
  const { users, deleteUser, updateUser } = useStore();
  const students = users.filter((u: any) => u.role === 'student');
  const [search, setSearch] = useState('');

  const filtered = students.filter((s: any) => s.name.includes(search) || s.email.includes(search));

  return (
    <Card>
      <CardHeader>
        <CardTitle>إدارة الطلاب ({students.length})</CardTitle>
        <CardDescription>عرض وإدارة حسابات الطلاب</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="mb-4 relative">
          <Search className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
          <Input placeholder="بحث..." className="pr-10" value={search} onChange={e => setSearch(e.target.value)} />
        </div>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>الطالب</TableHead>
              <TableHead>المرحلة</TableHead>
              <TableHead>الاشتراك</TableHead>
              <TableHead>إجراءات</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filtered.map((s: any) => (
              <TableRow key={s.id}>
                <TableCell>
                  <div className="flex items-center gap-2">
                    <Avatar><AvatarFallback>{s.avatar}</AvatarFallback></Avatar>
                    <div>
                      <div className="font-medium">{s.name}</div>
                      <div className="text-xs text-muted-foreground">{s.email}</div>
                    </div>
                  </div>
                </TableCell>
                <TableCell>{s.stage === 'high' ? 'ثانوي' : 'إعدادي'}</TableCell>
                <TableCell>
                  <Badge variant={s.subscriptionStatus === 'active' ? 'default' : 'outline'}>
                    {s.subscriptionStatus === 'active' ? 'نشط' : 'معلق'}
                  </Badge>
                </TableCell>
                <TableCell>
                  <div className="flex gap-1">
                    <Button size="icon" variant="ghost" onClick={async () => {
                      const newStatus = s.subscriptionStatus === 'active' ? 'pending' : 'active';
                      await updateUser(s.id, { subscriptionStatus: newStatus });
                      toast.success(newStatus === 'active' ? 'تم التفعيل' : 'تم الإيقاف');
                    }}>
                      <Shield className="w-4 h-4" />
                    </Button>
                    <Button size="icon" variant="ghost" onClick={async () => {
                      if (confirm(`حذف الطالب ${s.name}؟`)) {
                        await deleteUser(s.id);
                        toast.success('تم الحذف');
                      }
                    }}>
                      <Trash2 className="w-4 h-4 text-rose-500" />
                    </Button>
                  </div>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  );
}

// ===== Manage Lessons =====
function AssignmentMiniBuilder({ onAdd }: { onAdd: (q: any) => void }) {
  const [text, setText] = useState('');
  const [imageFile, setImageFile] = useState<string>('');
  const [imageUrl, setImageUrl] = useState('');
  const [type, setType] = useState('MCQ');
  const [correctAnswer, setCorrectAnswer] = useState('');
  const [points, setPoints] = useState(5);

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = () => {
        setImageFile(reader.result as string);
        setImageUrl(''); // مسح الرابط لو فيه
      };
      reader.readAsDataURL(file);
    }
  };

  const handleAdd = () => {
    const finalImage = imageFile || imageUrl;
    if (!text && !finalImage) {
      toast.error('أدخل نص أو صورة على الأقل');
      return;
    }
    onAdd({
      id: `q-${Date.now()}`,
      text: text || 'سؤال بصورة',
      type,
      difficulty: 'EASY',
      correctAnswer: correctAnswer || 'إجابة بصرية',
      points,
      imageUrl: finalImage || undefined,
      options: type === 'MCQ' ? [] : undefined,
    });
    setText(''); setImageFile(''); setImageUrl(''); setCorrectAnswer(''); setPoints(5);
    toast.success('تم إضافة السؤال');
  };

  return (
    <div className="space-y-2">
      <Textarea placeholder="نص السؤال (اختياري لو فيه صورة)" value={text} onChange={e => setText(e.target.value)} />
      
      <div>
        <Label>رفع صورة من الجهاز (مفضل)</Label>
        <Input type="file" accept="image/*" onChange={handleImageUpload} />
        {imageFile && (
          <div className="relative inline-block mt-2">
            <img src={imageFile} alt="معاينة" className="w-20 h-20 object-cover rounded-lg border" />
            <Button size="icon" variant="destructive" className="absolute -top-2 -right-2 h-5 w-5" onClick={() => setImageFile('')}>
              <Trash2 className="w-3 h-3" />
            </Button>
          </div>
        )}
      </div>

      <div>
        <Label>أو رابط صورة مباشر (يجب أن ينتهي بـ .jpg أو .png)</Label>
        <Input placeholder="https://example.com/image.jpg" dir="ltr" value={imageUrl} onChange={e => setImageUrl(e.target.value)} disabled={!!imageFile} />
        {imageUrl && !imageFile && <img src={imageUrl} alt="معاينة" className="w-20 h-20 object-cover rounded-lg border mt-2" />}
      </div>

      <div className="grid grid-cols-3 gap-2">
        <Select value={type} onValueChange={setType}>
          <SelectTrigger><SelectValue /></SelectTrigger>
          <SelectContent>
            <SelectItem value="MCQ">اختيار من متعدد</SelectItem>
            <SelectItem value="TRUEFALSE">صح / خطأ</SelectItem>
            <SelectItem value="FILL">أكمل</SelectItem>
            <SelectItem value="ESSAY">مقالي</SelectItem>
          </SelectContent>
        </Select>
        <Input placeholder="الإجابة" value={correctAnswer} onChange={e => setCorrectAnswer(e.target.value)} />
        <Input type="number" placeholder="الدرجة" value={points} onChange={e => setPoints(+e.target.value)} />
      </div>
      <Button size="sm" onClick={handleAdd}><Plus className="w-4 h-4 ml-2" /> إضافة السؤال</Button>
    </div>
  );
}

function ManageLessons() {
  const { lessons, deleteLesson, addLesson, updateLesson, openLesson, units, users } = useStore();
  const teachers = users.filter((u: any) => u.role === 'teacher');
  const [showAdd, setShowAdd] = useState(false);
  const [newLesson, setNewLesson] = useState({
    title: '', description: '', videoUrl: '', videoDuration: '',
    unitId: '', teacherId: '', allowPdfDownload: true, videoSource: 'youtube' as string,
  });
  const [pdfs, setPdfs] = useState<{ name: string; url: string }[]>([]);
  const [newPdf, setNewPdf] = useState({ name: '', url: '' });
  const [examHtml, setExamHtml] = useState('');
  const [assignmentQuestions, setAssignmentQuestions] = useState<any[]>([]);

  const defaultUnitId = newLesson.unitId || units[0]?.id || '';
  const defaultTeacherId = newLesson.teacherId || teachers[0]?.id || '';

  const handleAddPdf = () => {
    if (!newPdf.name || !newPdf.url) {
      toast.error('أدخل اسم الملف والرابط');
      return;
    }
    setPdfs([...pdfs, newPdf]);
    setNewPdf({ name: '', url: '' });
    toast.success('تم إضافة الملف للقائمة');
  };

  const handleAdd = async () => {
    if (!newLesson.title || !newLesson.videoUrl) {
      toast.error('أدخل العنوان ورابط الفيديو');
      return;
    }
    if (!defaultUnitId) {
      toast.error('لا توجد وحدات - شغل /api/seed أولاً');
      return;
    }
    if (!defaultTeacherId) {
      toast.error('لا يوجد معلمين - أضف معلم أولاً');
      return;
    }

    const payload: any = {
      unitId: newLesson.unitId || defaultUnitId,
      teacherId: newLesson.teacherId || defaultTeacherId,
      title: newLesson.title,
      description: newLesson.description,
      videoUrl: newLesson.videoUrl,
      videoSource: newLesson.videoSource,
      videoDuration: newLesson.videoDuration || '00:00',
      allowPdfDownload: newLesson.allowPdfDownload,
      pdfs: pdfs.map(p => ({ name: p.name, url: p.url, size: '1.2 MB', pages: 10 })),
      additionalFiles: [],
    };

    if (examHtml.trim()) {
      payload.exam = {
        title: `امتحان: ${newLesson.title}`,
        description: 'امتحان تفاعلي HTML',
        htmlContent: examHtml,
        durationMinutes: 30,
        passingScore: 60,
      };
    }

    if (assignmentQuestions.length > 0) {
      payload.assignment = {
        title: `واجب: ${newLesson.title}`,
        description: 'واجب الدرس',
        totalPoints: assignmentQuestions.reduce((sum, q) => sum + q.points, 0),
        questions: assignmentQuestions,
      };
    }

    const success = await addLesson(payload);
    if (success) {
      toast.success('تم إضافة الدرس بنجاح');
      setShowAdd(false);
      setNewLesson({ title: '', description: '', videoUrl: '', videoDuration: '', unitId: '', teacherId: '', allowPdfDownload: true, videoSource: 'youtube' });
      setPdfs([]);
      setExamHtml('');
      setAssignmentQuestions([]);
    } else {
      toast.error('فشل في إضافة الدرس');
    }
  };

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between flex-wrap gap-2">
          <div>
            <CardTitle>إدارة الدروس ({lessons.length})</CardTitle>
            <CardDescription>إضافة وتعديل وحذف الدروس</CardDescription>
          </div>
          <Button onClick={() => setShowAdd(true)}>
            <Plus className="w-4 h-4 ml-2" /> إضافة درس
          </Button>
        </div>
      </CardHeader>
      <CardContent>
        {lessons.length === 0 ? (
          <EmptyState icon={BookOpen} title="لا توجد دروس بعد" description="أضف أول درس" />
        ) : (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
            {lessons.map((l: any) => (
              <Card key={l.id} className="overflow-hidden">
                <div className="aspect-video bg-muted relative flex items-center justify-center">
                  <Play className="w-10 h-10 text-muted-foreground" />
                  <Badge className="absolute top-2 right-2">{l.videoDuration}</Badge>
                </div>
                <CardContent className="p-3">
                  <h3 className="font-semibold text-sm mb-1 line-clamp-1">{l.title}</h3>
                  <p className="text-xs text-muted-foreground mb-2 line-clamp-2">{l.description}</p>
                  <div className="flex items-center justify-between">
                    <Badge variant="secondary" className="text-xs">{l.views || 0} مشاهدة</Badge>
                    <div className="flex gap-1">
                      <Button size="sm" variant="ghost" onClick={() => openLesson(l.id)}>
                        <Eye className="w-4 h-4 ml-1" /> عرض
                      </Button>
                      <Button size="sm" variant="ghost" onClick={() => {
                        const newTitle = prompt('عنوان الدرس:', l.title);
                        if (newTitle !== null) {
                          updateLesson(l.id, { title: newTitle, description: l.description, videoUrl: l.videoUrl, videoDuration: l.videoDuration, allowPdfDownload: l.allowPdfDownload });
                          toast.success('تم التعديل');
                        }
                      }}>
                        <Edit className="w-4 h-4 ml-1" /> تعديل
                      </Button>
                      <Button size="icon" variant="ghost" onClick={async () => {
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

        <Dialog open={showAdd} onOpenChange={setShowAdd}>
          <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle>إضافة درس جديد</DialogTitle>
              <DialogDescription>أدخل بيانات الدرس كاملة</DialogDescription>
            </DialogHeader>
            <div className="space-y-3">
              <div><Label>عنوان الدرس *</Label><Input value={newLesson.title} onChange={e => setNewLesson({ ...newLesson, title: e.target.value })} /></div>
              <div><Label>الوصف</Label><Textarea value={newLesson.description} onChange={e => setNewLesson({ ...newLesson, description: e.target.value })} /></div>
              <div>
                <Label>المرحلة والصف</Label>
                <Select value={newLesson.unitId || defaultUnitId} onValueChange={v => setNewLesson({ ...newLesson, unitId: v })}>
                  <SelectTrigger><SelectValue placeholder="اختر المرحلة والصف" /></SelectTrigger>
                  <SelectContent className="max-h-[300px]">
                    {units.length === 0 && <SelectItem value="none" disabled>لا توجد مراحل - شغل /api/seed</SelectItem>}
                    {units.map((u: any) => {
                      const stageText = u.stageId === 'high' ? 'ثانوي' : 'إعدادي';
                      const yearText = u.yearId === 'first' ? 'أولى' : u.yearId === 'second' ? 'ثانية' : 'ثالثة';
                      return <SelectItem key={u.id} value={u.id}>{stageText} - {yearText} ({u.title})</SelectItem>;
                    })}
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Label>المعلم</Label>
                <Select value={newLesson.teacherId || defaultTeacherId} onValueChange={v => setNewLesson({ ...newLesson, teacherId: v })}>
                  <SelectTrigger><SelectValue placeholder="اختر المعلم" /></SelectTrigger>
                  <SelectContent>
                    {teachers.length === 0 && <SelectItem value="none" disabled>لا يوجد معلمين</SelectItem>}
                    {teachers.map((t: any) => <SelectItem key={t.id} value={t.id}>{t.avatar} {t.name}</SelectItem>)}
                  </SelectContent>
                </Select>
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <Label>مصدر الفيديو</Label>
                  <Select value={newLesson.videoSource} onValueChange={v => setNewLesson({ ...newLesson, videoSource: v })}>
                    <SelectTrigger><SelectValue /></SelectTrigger>
                    <SelectContent>
                      <SelectItem value="youtube">YouTube</SelectItem>
                      <SelectItem value="vimeo">Vimeo</SelectItem>
                      <SelectItem value="direct">رفع مباشر</SelectItem>
                      <SelectItem value="gdrive">Google Drive</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div><Label>مدة الفيديو</Label><Input value={newLesson.videoDuration} onChange={e => setNewLesson({ ...newLesson, videoDuration: e.target.value })} placeholder="24:35" /></div>
              </div>
              <div><Label>رابط الفيديو *</Label><Input dir="ltr" value={newLesson.videoUrl} onChange={e => setNewLesson({ ...newLesson, videoUrl: e.target.value })} placeholder="https://www.youtube.com/watch?v=..." /></div>

              {/* PDF Section */}
              <div className="border rounded-lg p-3 space-y-2">
                <Label>ملفات PDF</Label>
                <div className="flex gap-2">
                  <Input placeholder="اسم الملف" value={newPdf.name} onChange={e => setNewPdf({ ...newPdf, name: e.target.value })} />
                  <Input placeholder="الرابط" dir="ltr" value={newPdf.url} onChange={e => setNewPdf({ ...newPdf, url: e.target.value })} />
                  <Button size="sm" onClick={handleAddPdf}><Plus className="w-4 h-4" /></Button>
                </div>
                {pdfs.length > 0 && (
                  <div className="space-y-1">
                    {pdfs.map((p, i) => (
                      <div key={i} className="flex items-center gap-2 p-2 rounded bg-muted/50">
                        <FileText className="w-4 h-4 text-rose-500" />
                        <span className="flex-1 text-sm">{p.name}</span>
                        <Button size="icon" variant="ghost" className="h-6 w-6" onClick={() => setPdfs(pdfs.filter((_, idx) => idx !== i))}>
                          <Trash2 className="w-3 h-3 text-rose-500" />
                        </Button>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              {/* PDF Download toggle */}
              <div className="flex items-center gap-2">
                <Switch checked={newLesson.allowPdfDownload} onCheckedChange={c => setNewLesson({ ...newLesson, allowPdfDownload: c })} />
                <Label>السماح للطلاب بتحميل PDF</Label>
              </div>

              {/* Assignment Section */}
              <div className="border rounded-lg p-3">
                <Label>الواجب (اختياري)</Label>
                <p className="text-xs text-muted-foreground mb-2">أضف أسئلة أو صورة للواجب. يمكن إضافة صورة بدون نص.</p>
                {assignmentQuestions.length > 0 && (
                  <div className="space-y-1 mb-2">
                    {assignmentQuestions.map((q, i) => (
                      <div key={i} className="flex items-center gap-2 p-2 rounded bg-muted/50">
                        <Badge>{i + 1}</Badge>
                        {q.imageUrl && <Badge variant="secondary">📷 صورة</Badge>}
                        <span className="flex-1 text-sm line-clamp-1">{q.text}</span>
                        <Badge variant="secondary">{q.points} نقطة</Badge>
                        <Button size="icon" variant="ghost" className="h-6 w-6" onClick={() => setAssignmentQuestions(assignmentQuestions.filter((_, idx) => idx !== i))}>
                          <Trash2 className="w-3 h-3 text-rose-500" />
                        </Button>
                      </div>
                    ))}
                  </div>
                )}
                <AssignmentMiniBuilder onAdd={(q) => setAssignmentQuestions([...assignmentQuestions, q])} />
              </div>

              {/* HTML Exam Section */}
              <div className="border rounded-lg p-3">
                <Label>امتحان HTML تفاعلي (اختياري)</Label>
                <p className="text-xs text-muted-foreground mb-2">اكتب كود HTML للامتحان - سيتم ربطه بالدرس تلقائياً</p>
                <HtmlExamBuilder onSave={setExamHtml} />
              </div>
            </div>
            <DialogFooter>
              <Button variant="outline" onClick={() => setShowAdd(false)}>إلغاء</Button>
              <Button onClick={handleAdd}><Save className="w-4 h-4 ml-2" /> حفظ الدرس</Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </CardContent>
    </Card>
  );
}

// ===== Manage Videos =====
function ManageVideos() {
  const { lessons, openLesson } = useStore();
  return (
    <Card>
      <CardHeader><CardTitle>إدارة الفيديوهات ({lessons.length})</CardTitle></CardHeader>
      <CardContent>
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
            {lessons.map((l: any) => (
              <TableRow key={l.id}>
                <TableCell className="font-medium">{l.title}</TableCell>
                <TableCell><Badge variant="secondary">{l.videoSource}</Badge></TableCell>
                <TableCell>{l.videoDuration}</TableCell>
                <TableCell>{(l.views || 0).toLocaleString('ar-EG')}</TableCell>
                <TableCell>
                  <Button size="sm" variant="ghost" onClick={() => openLesson(l.id)}>
                    <Eye className="w-4 h-4 ml-1" /> عرض
                  </Button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  );
}

// ===== Manage PDFs =====
function ManagePDFs() {
  const { lessons, updateLesson } = useStore();
  const allPdfs = lessons.flatMap((l: any) => (l.pdfs || []).map((p: any) => ({ ...p, lesson: l.title, lessonId: l.id })));
  const [showUpload, setShowUpload] = useState(false);
  const [newPdf, setNewPdf] = useState({ name: '', url: '', lessonId: '' });

  const handleUpload = async () => {
    if (!newPdf.name || !newPdf.url || !newPdf.lessonId) {
      toast.error('املأ كل الحقول');
      return;
    }
    const lesson = lessons.find((l: any) => l.id === newPdf.lessonId) as any;
    if (!lesson) return;
    await updateLesson(lesson.id, {
      pdfs: [...(lesson.pdfs || []), { name: newPdf.name, url: newPdf.url, size: '1.2 MB', pages: 10 }],
    } as any);
    toast.success('تم رفع ملف PDF');
    setNewPdf({ name: '', url: '', lessonId: '' });
    setShowUpload(false);
  };

  const handleDelete = async (lessonId: string, pdfId: string) => {
    const lesson = lessons.find((l: any) => l.id === lessonId) as any;
    if (!lesson) return;
    if (confirm('حذف هذا الملف؟')) {
      await updateLesson(lessonId, { pdfs: (lesson.pdfs || []).filter((p: any) => p.id !== pdfId) } as any);
      toast.success('تم الحذف');
    }
  };

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <div><CardTitle>إدارة ملفات PDF ({allPdfs.length})</CardTitle></div>
          <Button onClick={() => setShowUpload(true)}><Upload className="w-4 h-4 ml-2" /> رفع PDF</Button>
        </div>
      </CardHeader>
      <CardContent>
        {allPdfs.length === 0 ? (
          <EmptyState icon={FileText} title="لا توجد ملفات PDF" />
        ) : (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
            {allPdfs.map((p: any) => (
              <Card key={p.id}>
                <CardContent className="p-4">
                  <div className="flex items-start gap-3">
                    <div className="w-10 h-10 rounded-lg bg-rose-100 dark:bg-rose-900/30 flex items-center justify-center text-rose-600 font-bold text-xs">PDF</div>
                    <div className="flex-1 min-w-0">
                      <div className="font-medium text-sm truncate">{p.name}</div>
                      <div className="text-xs text-muted-foreground">{p.size}</div>
                      <div className="text-xs text-muted-foreground mt-1">في: {p.lesson}</div>
                      <div className="flex gap-1 mt-2">
                        <Button size="sm" variant="outline" onClick={() => window.open(p.url, '_blank')}>
                          <Eye className="w-3.5 h-3.5 ml-1" /> عرض
                        </Button>
                        <Button size="sm" variant="ghost" onClick={() => handleDelete(p.lessonId, p.id)}>
                          <Trash2 className="w-3.5 h-3.5 text-rose-500" />
                        </Button>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}

        <Dialog open={showUpload} onOpenChange={setShowUpload}>
          <DialogContent>
            <DialogHeader><DialogTitle>رفع ملف PDF</DialogTitle></DialogHeader>
            <div className="space-y-3">
              <div>
                <Label>الدرس</Label>
                <Select value={newPdf.lessonId} onValueChange={v => setNewPdf({ ...newPdf, lessonId: v })}>
                  <SelectTrigger><SelectValue placeholder="اختر الدرس" /></SelectTrigger>
                  <SelectContent>
                    {lessons.map((l: any) => <SelectItem key={l.id} value={l.id}>{l.title}</SelectItem>)}
                  </SelectContent>
                </Select>
              </div>
              <div><Label>اسم الملف</Label><Input value={newPdf.name} onChange={e => setNewPdf({ ...newPdf, name: e.target.value })} placeholder="ملخص الدرس.pdf" /></div>
              <div><Label>رابط الملف</Label><Input dir="ltr" value={newPdf.url} onChange={e => setNewPdf({ ...newPdf, url: e.target.value })} placeholder="https://..." /></div>
            </div>
            <DialogFooter>
              <Button variant="outline" onClick={() => setShowUpload(false)}>إلغاء</Button>
              <Button onClick={handleUpload}>رفع</Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </CardContent>
    </Card>
  );
}

// ===== Manage Exams =====
function ManageExams() {
  const { exams, addExam, deleteExam } = useStore();
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
            <CardTitle>إدارة الامتحانات ({exams.length})</CardTitle>
            <Button onClick={() => setShowAdd(true)}><Plus className="w-4 h-4 ml-2" /> امتحان جديد</Button>
          </div>
        </CardHeader>
        <CardContent>
          {exams.length === 0 ? (
            <EmptyState icon={Award} title="لا توجد امتحانات" />
          ) : (
            <div className="grid md:grid-cols-2 gap-4">
              {exams.map((e: any) => (
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
                      <Button size="sm" variant="ghost" onClick={async () => {
                        if (confirm('حذف الامتحان؟')) {
                          await deleteExam(e.id);
                          toast.success('تم الحذف');
                        }
                      }}>
                        <Trash2 className="w-4 h-4 text-rose-500" />
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
              <div className="p-8 text-center text-muted-foreground">هذا امتحان عادي (أسئلة)</div>
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

// ===== Question Bank =====
function QuestionBank() {
  const { questionBank, addQuestion, deleteQuestion, units } = useStore();
  const [showAdd, setShowAdd] = useState(false);
  const [newQ, setNewQ] = useState({ text: '', type: 'MCQ' as any, difficulty: 'EASY', correctAnswer: '', points: 5, stageId: 'high', yearId: 'first', imageUrl: '', imageFile: '' });

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = () => setNewQ({ ...newQ, imageFile: reader.result as string, imageUrl: '' });
      reader.readAsDataURL(file);
    }
  };

  const handleAdd = async () => {
    const finalImage = newQ.imageFile || newQ.imageUrl;
    if (!newQ.text && !finalImage) {
      toast.error('أدخل نص السؤال أو صورة على الأقل');
      return;
    }
    const success = await addQuestion({ ...newQ, text: newQ.text || 'سؤال بصورة', correctAnswer: newQ.correctAnswer || 'إجابة بصرية', imageUrl: finalImage });
    if (success) {
      toast.success('تم إضافة السؤال');
      setNewQ({ text: '', type: 'MCQ', difficulty: 'EASY', correctAnswer: '', points: 5, stageId: 'high', yearId: 'first', imageUrl: '', imageFile: '' });
      setShowAdd(false);
    } else {
      toast.error('فشل في الإضافة');
    }
  };

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle>بنك الأسئلة ({questionBank?.length || 0})</CardTitle>
          <Button onClick={() => setShowAdd(true)}><Plus className="w-4 h-4 ml-2" /> إضافة سؤال</Button>
        </div>
      </CardHeader>
      <CardContent>
        <p className="text-sm text-muted-foreground mb-4">الأسئلة هنا تظهر في الدروس والواجبات حسب التصنيف.</p>

        {questionBank?.length > 0 && (
          <div className="space-y-2 mb-4">
            {questionBank.map((q: any) => (
              <div key={q.id} className="flex items-center gap-2 p-3 rounded-lg border">
                {q.imageUrl && <img src={q.imageUrl.replace(/"/g, '')} alt="سؤال" className="w-12 h-12 object-cover rounded" />}
                <div className="flex-1 min-w-0">
                  <div className="text-sm font-medium line-clamp-1">{q.text}</div>
                  <div className="flex gap-1 mt-1">
                    <Badge variant="secondary">{q.type}</Badge>
                    <Badge variant="secondary">{q.difficulty}</Badge>
                    <Badge variant="secondary">{q.points} نقطة</Badge>
                  </div>
                </div>
                <Button size="icon" variant="ghost" onClick={async () => {
                  await deleteQuestion(q.id);
                  toast.success('تم الحذف');
                }}>
                  <Trash2 className="w-4 h-4 text-rose-500" />
                </Button>
              </div>
            ))}
          </div>
        )}

        <Dialog open={showAdd} onOpenChange={setShowAdd}>
          <DialogContent className="max-w-lg">
            <DialogHeader><DialogTitle>إضافة سؤال لبنك الأسئلة</DialogTitle></DialogHeader>
            <div className="space-y-3">
              <div><Label>نص السؤال</Label><Textarea value={newQ.text} onChange={e => setNewQ({ ...newQ, text: e.target.value })} /></div>

              {/* رفع صورة */}
              <div>
                <Label>رفع صورة من الجهاز (مفضل)</Label>
                <Input type="file" accept="image/*" onChange={handleImageUpload} />
                {newQ.imageFile && (
                  <div className="relative inline-block mt-2">
                    <img src={newQ.imageFile} alt="معاينة" className="w-20 h-20 object-cover rounded-lg border" />
                    <Button size="icon" variant="destructive" className="absolute -top-2 -right-2 h-5 w-5" onClick={() => setNewQ({ ...newQ, imageFile: '' })}>
                      <Trash2 className="w-3 h-3" />
                    </Button>
                  </div>
                )}
                <Label className="mt-2">أو رابط صورة مباشر (يجب أن ينتهي بـ .jpg أو .png)</Label>
                <Input placeholder="https://example.com/image.jpg" dir="ltr" value={newQ.imageUrl} onChange={e => setNewQ({ ...newQ, imageUrl: e.target.value })} disabled={!!newQ.imageFile} />
                {newQ.imageUrl && !newQ.imageFile && <img src={newQ.imageUrl} alt="معاينة" className="w-20 h-20 object-cover rounded-lg border mt-2" />}
              </div>

              <div className="grid grid-cols-2 gap-3">
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
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <Label>المرحلة</Label>
                  <Select value={newQ.stageId} onValueChange={v => setNewQ({ ...newQ, stageId: v })}>
                    <SelectTrigger><SelectValue /></SelectTrigger>
                    <SelectContent>
                      <SelectItem value="middle">إعدادي</SelectItem>
                      <SelectItem value="high">ثانوي</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <Label>السنة</Label>
                  <Select value={newQ.yearId} onValueChange={v => setNewQ({ ...newQ, yearId: v })}>
                    <SelectTrigger><SelectValue /></SelectTrigger>
                    <SelectContent>
                      <SelectItem value="first">الأولى</SelectItem>
                      <SelectItem value="second">الثانية</SelectItem>
                      <SelectItem value="third">الثالثة</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div><Label>الإجابة الصحيحة</Label><Input value={newQ.correctAnswer} onChange={e => setNewQ({ ...newQ, correctAnswer: e.target.value })} /></div>
              <div><Label>الدرجة</Label><Input type="number" value={newQ.points} onChange={e => setNewQ({ ...newQ, points: +e.target.value })} /></div>
            </div>
            <DialogFooter>
              <Button variant="outline" onClick={() => setShowAdd(false)}>إلغاء</Button>
              <Button onClick={handleAdd}>حفظ</Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </CardContent>
    </Card>
  );
}

// ===== Finance =====
function FinanceSection() {
  const { stats } = useStore();
  const s = stats || { totalRevenue: 0, monthlyRevenue: [] };
  return (
    <div className="space-y-4">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <StatCard icon={DollarSign} label="إجمالي الأرباح" value={`${(s.totalRevenue || 0).toLocaleString('ar-EG')} ج.م`} color="text-emerald-600" trend="+18%" />
        <StatCard icon={TrendingUp} label="أرباح الشهر" value={`${((s.monthlyRevenue?.slice(-1)[0]?.revenue) || 0).toLocaleString('ar-EG')} ج.م`} color="text-amber-600" />
        <StatCard icon={CreditCard} label="معاملات" value="142" color="text-purple-600" />
      </div>
      <Card>
        <CardHeader><CardTitle>الأرباح الشهرية</CardTitle></CardHeader>
        <CardContent>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={s.monthlyRevenue || []}>
              <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
              <XAxis dataKey="month" stroke="hsl(var(--muted-foreground))" />
              <YAxis stroke="hsl(var(--muted-foreground))" />
              <Tooltip />
              <Bar dataKey="revenue" fill="#0f766e" radius={[8, 8, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>
    </div>
  );
}

// ===== Subscriptions =====
function SubscriptionsSection() {
  const { users } = useStore();
  const subscribers = users.filter((u: any) => u.role === 'student' && u.subscriptionStatus === 'active');
  return (
    <Card>
      <CardHeader><CardTitle>الاشتراكات النشطة ({subscribers.length})</CardTitle></CardHeader>
      <CardContent>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>الطالب</TableHead>
              <TableHead>تاريخ الانتهاء</TableHead>
              <TableHead>الحالة</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {subscribers.map((s: any) => (
              <TableRow key={s.id}>
                <TableCell>{s.name}</TableCell>
                <TableCell>{s.subscriptionExpiry ? new Date(s.subscriptionExpiry).toLocaleDateString('ar-EG') : '-'}</TableCell>
                <TableCell><Badge>نشط</Badge></TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  );
}

// ===== Payments =====
function PaymentsSection() {
  const { payments } = useStore();
  return (
    <Card>
      <CardHeader><CardTitle>سجل المدفوعات ({payments.length})</CardTitle></CardHeader>
      <CardContent>
        {payments.length === 0 ? (
          <EmptyState icon={CreditCard} title="لا توجد مدفوعات" />
        ) : (
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>الطالب</TableHead>
                <TableHead>المبلغ</TableHead>
                <TableHead>الباقة</TableHead>
                <TableHead>طريقة الدفع</TableHead>
                <TableHead>الحالة</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {payments.map((p: any) => (
                <TableRow key={p.id}>
                  <TableCell>{p.studentName}</TableCell>
                  <TableCell>{p.amount} ج.م</TableCell>
                  <TableCell>{p.subscriptionName}</TableCell>
                  <TableCell><Badge variant="outline">{p.method}</Badge></TableCell>
                  <TableCell><Badge variant={p.status === 'completed' ? 'default' : 'secondary'}>{p.status === 'completed' ? 'مكتمل' : 'معلق'}</Badge></TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        )}
      </CardContent>
    </Card>
  );
}

// ===== Coupons =====
function CouponsSection() {
  const { coupons, addCoupon, deleteCoupon } = useStore();
  const [showAdd, setShowAdd] = useState(false);
  const [newCoupon, setNewCoupon] = useState({ code: '', discount: 10, type: 'percentage', maxUses: 100, expiry: '2026-12-31' });

  const handleAdd = async () => {
    if (!newCoupon.code) { toast.error('أدخل كود الكوبون'); return; }
    const success = await addCoupon({
      code: newCoupon.code,
      discount: newCoupon.discount,
      type: newCoupon.type,
      maxUses: newCoupon.maxUses,
      expiry: newCoupon.expiry,
    } as any);
    if (success) {
      toast.success('تم إضافة الكوبون');
      setShowAdd(false);
      setNewCoupon({ code: '', discount: 10, type: 'percentage', maxUses: 100, expiry: '2026-12-31' });
    }
  };

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle>كوبونات الخصم ({coupons.length})</CardTitle>
          <Button onClick={() => setShowAdd(true)}><Plus className="w-4 h-4 ml-2" /> كوبون جديد</Button>
        </div>
      </CardHeader>
      <CardContent>
        <div className="grid md:grid-cols-3 gap-4">
          {coupons.map((c: any) => (
            <Card key={c.id}>
              <CardContent className="p-4">
                <div className="flex items-center justify-between mb-3">
                  <div className="font-mono font-bold text-lg text-emerald-600">{c.code}</div>
                  <Badge variant={c.active ? 'default' : 'secondary'}>{c.active ? 'نشط' : 'موقوف'}</Badge>
                </div>
                <div className="text-2xl font-bold mb-1">{c.type === 'percentage' ? `${c.discount}%` : `${c.discount} ج.م`}</div>
                <div className="text-xs text-muted-foreground mb-2">{c.type === 'percentage' ? 'نسبة' : 'مبلغ'}</div>
                <div className="text-xs space-y-1">
                  <div>الاستخدام: {c.usedCount}/{c.maxUses}</div>
                  <div>الانتهاء: {new Date(c.expiry).toLocaleDateString('ar-EG')}</div>
                </div>
                <Button size="sm" variant="ghost" className="w-full mt-2 text-rose-500" onClick={async () => {
                  await deleteCoupon(c.id);
                  toast.success('تم الحذف');
                }}>
                  <Trash2 className="w-4 h-4 ml-1" /> حذف
                </Button>
              </CardContent>
            </Card>
          ))}
        </div>

        <Dialog open={showAdd} onOpenChange={setShowAdd}>
          <DialogContent>
            <DialogHeader><DialogTitle>كوبون جديد</DialogTitle></DialogHeader>
            <div className="space-y-3">
              <div><Label>الكود</Label><Input value={newCoupon.code} onChange={e => setNewCoupon({ ...newCoupon, code: e.target.value.toUpperCase() })} placeholder="MATH50" /></div>
              <div><Label>قيمة الخصم</Label><Input type="number" value={newCoupon.discount} onChange={e => setNewCoupon({ ...newCoupon, discount: +e.target.value })} /></div>
              <div>
                <Label>النوع</Label>
                <Select value={newCoupon.type} onValueChange={(v: any) => setNewCoupon({ ...newCoupon, type: v })}>
                  <SelectTrigger><SelectValue /></SelectTrigger>
                  <SelectContent>
                    <SelectItem value="percentage">نسبة %</SelectItem>
                    <SelectItem value="fixed">مبلغ ثابت</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div><Label>أقصى استخدام</Label><Input type="number" value={newCoupon.maxUses} onChange={e => setNewCoupon({ ...newCoupon, maxUses: +e.target.value })} /></div>
              <div><Label>تاريخ الانتهاء</Label><Input type="date" value={newCoupon.expiry} onChange={e => setNewCoupon({ ...newCoupon, expiry: e.target.value })} /></div>
            </div>
            <DialogFooter>
              <Button variant="outline" onClick={() => setShowAdd(false)}>إلغاء</Button>
              <Button onClick={handleAdd}>إضافة</Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </CardContent>
    </Card>
  );
}

// ===== Comments =====
function CommentsSection() {
  const { comments, fetchComments, deleteComment } = useStore() as any;
  useEffect(() => { fetchComments(); }, [fetchComments]);
  return (
    <Card>
      <CardHeader><CardTitle>إدارة التعليقات ({comments.length})</CardTitle></CardHeader>
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
                <p className="text-sm text-muted-foreground">{c.text}</p>
              </div>
              <Button size="icon" variant="ghost" onClick={() => {
                if (confirm('حذف التعليق؟')) { deleteComment(c.id); toast.success('تم الحذف'); }
              }}>
                <Trash2 className="w-4 h-4 text-rose-500" />
              </Button>
            </div>
          ))
        )}
      </CardContent>
    </Card>
  );
}

// ===== Notifications =====
function NotificationsSection() {
  const { notifications, addNotification, markNotificationRead } = useStore();
  const [newNotif, setNewNotif] = useState({ title: '', message: '', type: 'info' as any });

  const handleSend = async () => {
    if (!newNotif.title || !newNotif.message) { toast.error('أدخل العنوان والرسالة'); return; }
    await addNotification({ title: newNotif.title, message: newNotif.message, type: newNotif.type } as any);
    toast.success('تم إرسال الإشعار');
    setNewNotif({ title: '', message: '', type: 'info' });
  };

  return (
    <div className="space-y-4">
      <Card>
        <CardHeader><CardTitle>إرسال إشعار</CardTitle></CardHeader>
        <CardContent className="space-y-3">
          <div><Label>العنوان</Label><Input value={newNotif.title} onChange={e => setNewNotif({ ...newNotif, title: e.target.value })} /></div>
          <div><Label>الرسالة</Label><Textarea value={newNotif.message} onChange={e => setNewNotif({ ...newNotif, message: e.target.value })} /></div>
          <Button onClick={handleSend}><Bell className="w-4 h-4 ml-2" /> إرسال</Button>
        </CardContent>
      </Card>
      <Card>
        <CardHeader><CardTitle>الإشعارات ({notifications.length})</CardTitle></CardHeader>
        <CardContent className="space-y-2">
          {notifications.map((n: any) => (
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
          ))}
        </CardContent>
      </Card>
    </div>
  );
}

// ===== Stats =====
function StatsSection() {
  const { stats } = useStore();
  const s = stats || {};
  return (
    <div className="space-y-4">
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <StatCard icon={Users} label="الطلاب" value={s.totalStudents || 0} color="text-emerald-600" />
        <StatCard icon={Eye} label="الزيارات" value={s.totalVisits || 0} color="text-amber-600" />
        <StatCard icon={Video} label="الفيديوهات" value={s.totalVideos || 0} color="text-rose-600" />
        <StatCard icon={BookOpen} label="الدروس" value={s.totalLessons || 0} color="text-blue-600" />
      </div>
      <Card>
        <CardHeader><CardTitle>توزيع المراحل</CardTitle></CardHeader>
        <CardContent>
          <ResponsiveContainer width="100%" height={300}>
            <PieChart>
              <Pie data={[{ name: 'إعدادي', value: 1450 }, { name: 'ثانوي', value: 1795 }]} dataKey="value" nameKey="name" cx="50%" cy="50%" outerRadius={100} label>
                <Cell fill="#0f766e" />
                <Cell fill="#f59e0b" />
              </Pie>
              <Tooltip />
            </PieChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>
    </div>
  );
}

// ===== Backups =====
function BackupsSection() {
  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle>النسخ الاحتياطية</CardTitle>
          <Button onClick={() => toast.success('سيتم إضافة النسخ الاحتياطي قريباً')}><Database className="w-4 h-4 ml-2" /> نسخ احتياطي</Button>
        </div>
      </CardHeader>
      <CardContent>
        <p className="text-sm text-muted-foreground text-center py-8">قاعدة البيانات محفوظة على Neon - يمكن أخذ نسخة احتياطية من لوحة تحكم Neon مباشرة.</p>
      </CardContent>
    </Card>
  );
}

// ===== Permissions =====
function PermissionsSection() {
  const roles = [
    { name: 'مدير النظام', icon: '👨‍💼', permissions: ['كل الصلاحيات'], color: 'text-emerald-600' },
    { name: 'معلم', icon: '👨‍🏫', permissions: ['إضافة دروس', 'رفع فيديوهات', 'إنشاء واجبات', 'إنشاء امتحانات', 'رؤية نتائج الطلاب', 'الرد على الأسئلة'], color: 'text-purple-600' },
    { name: 'طالب', icon: '🧑‍🎓', permissions: ['مشاهدة الفيديوهات', 'تحميل PDF', 'حل الواجبات', 'حل الامتحانات', 'متابعة الدرجات', 'إضافة مفضلة'], color: 'text-amber-600' },
  ];
  return (
    <div className="grid md:grid-cols-3 gap-4">
      {roles.map(r => (
        <Card key={r.name}>
          <CardHeader>
            <div className="flex items-center gap-3">
              <span className="text-4xl">{r.icon}</span>
              <CardTitle className={`text-lg ${r.color}`}>{r.name}</CardTitle>
            </div>
          </CardHeader>
          <CardContent>
            <ul className="space-y-2">
              {r.permissions.map(p => (
                <li key={p} className="flex items-center gap-2 text-sm">
                  <CheckCircle2 className="w-4 h-4 text-emerald-500" />
                  <span>{p}</span>
                </li>
              ))}
            </ul>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}
