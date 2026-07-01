'use client';

import { useState } from 'react';
import { DashboardLayout, StatCard, EmptyState } from '@/components/shared/DashboardLayout';
import { HtmlExamBuilder } from '@/components/shared/HtmlExamRunner';
import { useStore } from '@/lib/store';
import { demoStats, stages, units as initialUnits } from '@/lib/data';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Switch } from '@/components/ui/switch';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { toast } from 'sonner';
import {
  LayoutDashboard, Users, GraduationCap, BookOpen, Video, FileText, Award,
  DollarSign, BarChart3, Bell, Ticket, CreditCard, MessageSquare, HelpCircle,
  Database, Shield, Plus, Edit, Trash2, Eye, Search, TrendingUp, Crown, Save,
  CheckCircle2, XCircle, Upload
} from 'lucide-react';
import { LineChart, Line, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts';
import type { Exam } from '@/lib/types';

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
  const { users, lessons, exams } = useStore();
  const teachers = users.filter(u => u.role === 'teacher');
  const students = users.filter(u => u.role === 'student');

  return (
    <div className="space-y-6">
      {/* Welcome Banner */}
      <Card className="overflow-hidden border-0 bg-gradient-to-l from-emerald-600 to-teal-700 text-white">
        <CardContent className="p-6 flex items-center justify-between flex-wrap gap-4">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <Crown className="w-5 h-5" />
              <span className="text-sm opacity-90">لوحة تحكم الإدارة</span>
            </div>
            <h2 className="text-2xl font-bold mb-1">مرحباً أيها المدير 👋</h2>
            <p className="opacity-90">إليك ملخص أداء المنصة اليوم</p>
          </div>
          <div className="text-left">
            <div className="text-3xl font-bold">{demoStats.totalRevenue.toLocaleString('ar-EG')}</div>
            <div className="text-sm opacity-90">ج.م إجمالي الأرباح</div>
          </div>
        </CardContent>
      </Card>

      {/* Main Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <StatCard icon={Users} label="عدد الطلاب" value={demoStats.totalStudents} color="text-emerald-600" trend="+12%" />
        <StatCard icon={GraduationCap} label="عدد المعلمين" value={demoStats.totalTeachers} color="text-purple-600" />
        <StatCard icon={CreditCard} label="الاشتراكات النشطة" value={demoStats.totalSubscriptions} color="text-amber-600" trend="+8%" />
        <StatCard icon={Video} label="عدد الفيديوهات" value={demoStats.totalVideos} color="text-rose-600" />
      </div>
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <StatCard icon={BookOpen} label="عدد الدروس" value={demoStats.totalLessons} color="text-blue-600" />
        <StatCard icon={Award} label="عدد الامتحانات" value={demoStats.totalExams} color="text-indigo-600" />
        <StatCard icon={Eye} label="عدد الزيارات" value={demoStats.totalVisits} color="text-cyan-600" trend="+24%" />
        <StatCard icon={DollarSign} label="إجمالي الأرباح" value={`${demoStats.totalRevenue.toLocaleString('ar-EG')} ج.م`} color="text-emerald-600" trend="+18%" />
      </div>

      {/* Charts */}
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
              <LineChart data={demoStats.monthlyRevenue}>
                <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                <XAxis dataKey="month" stroke="hsl(var(--muted-foreground))" fontSize={12} />
                <YAxis stroke="hsl(var(--muted-foreground))" fontSize={12} />
                <Tooltip contentStyle={{ background: 'hsl(var(--card))', border: '1px solid hsl(var(--border))', borderRadius: '8px' }} />
                <Line type="monotone" dataKey="revenue" stroke="#0f766e" strokeWidth={3} dot={{ fill: '#0f766e', r: 4 }} />
              </LineChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle className="text-lg flex items-center gap-2">
              <BarChart3 className="w-5 h-5 text-amber-600" />
              الزيارات الأسبوعية
            </CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={250}>
              <BarChart data={demoStats.weeklyVisits}>
                <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                <XAxis dataKey="day" stroke="hsl(var(--muted-foreground))" fontSize={12} />
                <YAxis stroke="hsl(var(--muted-foreground))" fontSize={12} />
                <Tooltip contentStyle={{ background: 'hsl(var(--card))', border: '1px solid hsl(var(--border))', borderRadius: '8px' }} />
                <Bar dataKey="visits" fill="#f59e0b" radius={[8, 8, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </div>

      {/* Recent Activity */}
      <div className="grid lg:grid-cols-2 gap-4">
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">أحدث المعلمين</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            {teachers.slice(0, 5).map(t => (
              <div key={t.id} className="flex items-center gap-3 p-2 rounded-lg hover:bg-muted/50">
                <Avatar className="text-xl"><AvatarFallback className="text-xl">{t.avatar}</AvatarFallback></Avatar>
                <div className="flex-1 min-w-0">
                  <div className="font-medium text-sm truncate">{t.name}</div>
                  <div className="text-xs text-muted-foreground truncate">{t.bio}</div>
                </div>
                <Badge variant="secondary">{t.studentsCount} طالب</Badge>
              </div>
            ))}
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">أحدث الطلاب</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            {students.slice(0, 5).map(s => (
              <div key={s.id} className="flex items-center gap-3 p-2 rounded-lg hover:bg-muted/50">
                <Avatar className="text-xl"><AvatarFallback className="text-xl">{s.avatar}</AvatarFallback></Avatar>
                <div className="flex-1 min-w-0">
                  <div className="font-medium text-sm truncate">{s.name}</div>
                  <div className="text-xs text-muted-foreground truncate">{s.email}</div>
                </div>
                <Badge variant={s.subscriptionStatus === 'active' ? 'default' : 'outline'}>
                  {s.subscriptionStatus === 'active' ? 'نشط' : 'معلق'}
                </Badge>
              </div>
            ))}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

// ===== Manage Teachers =====
function ManageTeachers() {
  const { users, deleteUser, addUser, updateUser } = useStore();
  const teachers = users.filter(u => u.role === 'teacher');
  const [search, setSearch] = useState('');
  const [showAdd, setShowAdd] = useState(false);
  const [viewTeacher, setViewTeacher] = useState<User | null>(null);
  const [editTeacher, setEditTeacher] = useState<User | null>(null);
  const [newTeacher, setNewTeacher] = useState({ name: '', email: '', bio: '' });

  const filtered = teachers.filter(t => t.name.includes(search) || t.email.includes(search));

  const handleAdd = () => {
    if (!newTeacher.name || !newTeacher.email) {
      toast.error('أدخل الاسم والبريد الإلكتروني');
      return;
    }
    addUser({
      id: `teacher-${Date.now()}`,
      name: newTeacher.name,
      email: newTeacher.email,
      password: 'teacher123',
      role: 'teacher',
      avatar: '👨‍🏫',
      bio: newTeacher.bio || 'مدرس رياضيات',
      rating: 0, studentsCount: 0, lessonsCount: 0, totalEarnings: 0,
      specialties: [], createdAt: new Date().toISOString().split('T')[0],
    });
    toast.success('تم إضافة المعلم بنجاح. كلمة المرور الافتراضية: teacher123');
    setNewTeacher({ name: '', email: '', bio: '' });
    setShowAdd(false);
  };

  const handleEdit = () => {
    if (!editTeacher) return;
    updateUser(editTeacher.id, {
      name: editTeacher.name,
      email: editTeacher.email,
      bio: editTeacher.bio,
      phone: editTeacher.phone,
    });
    toast.success('تم تحديث بيانات المعلم');
    setEditTeacher(null);
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
            <Plus className="w-4 h-4 ml-2" />
            إضافة معلم
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
              <TableHead>الأرباح</TableHead>
              <TableHead>إجراءات</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filtered.map(t => (
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
                <TableCell>{(t.totalEarnings || 0).toLocaleString('ar-EG')} ج.م</TableCell>
                <TableCell>
                  <div className="flex gap-1">
                    <Button size="icon" variant="ghost" onClick={() => setViewTeacher(t)} title="عرض">
                      <Eye className="w-4 h-4" />
                    </Button>
                    <Button size="icon" variant="ghost" onClick={() => setEditTeacher(t)} title="تعديل">
                      <Edit className="w-4 h-4" />
                    </Button>
                    <Button size="icon" variant="ghost" onClick={() => {
                      if (confirm(`هل تريد حذف المعلم ${t.name}؟`)) {
                        deleteUser(t.id);
                        toast.success('تم حذف المعلم');
                      }
                    }} title="حذف">
                      <Trash2 className="w-4 h-4 text-rose-500" />
                    </Button>
                  </div>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>

        {/* Dialog عرض المعلم */}
        <Dialog open={!!viewTeacher} onOpenChange={(open) => !open && setViewTeacher(null)}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>تفاصيل المعلم</DialogTitle>
            </DialogHeader>
            {viewTeacher && (
              <div className="space-y-3">
                <div className="flex items-center gap-3">
                  <Avatar className="w-16 h-16 text-3xl"><AvatarFallback className="text-3xl">{viewTeacher.avatar}</AvatarFallback></Avatar>
                  <div>
                    <div className="font-bold text-lg">{viewTeacher.name}</div>
                    <div className="text-sm text-muted-foreground">{viewTeacher.email}</div>
                    <div className="text-sm text-muted-foreground">{viewTeacher.phone || 'لا يوجد رقم'}</div>
                  </div>
                </div>
                <div className="p-3 rounded-lg bg-muted/50">
                  <div className="text-sm font-medium mb-1">النبذة التعريفية</div>
                  <div className="text-sm text-muted-foreground">{viewTeacher.bio}</div>
                </div>
                <div className="grid grid-cols-3 gap-2">
                  <div className="p-2 rounded-lg bg-muted/50 text-center">
                    <div className="font-bold">{viewTeacher.rating || 0}</div>
                    <div className="text-xs text-muted-foreground">التقييم</div>
                  </div>
                  <div className="p-2 rounded-lg bg-muted/50 text-center">
                    <div className="font-bold">{viewTeacher.studentsCount || 0}</div>
                    <div className="text-xs text-muted-foreground">طالب</div>
                  </div>
                  <div className="p-2 rounded-lg bg-muted/50 text-center">
                    <div className="font-bold">{viewTeacher.lessonsCount || 0}</div>
                    <div className="text-xs text-muted-foreground">درس</div>
                  </div>
                </div>
                {viewTeacher.specialties && viewTeacher.specialties.length > 0 && (
                  <div>
                    <div className="text-sm font-medium mb-1">التخصصات</div>
                    <div className="flex flex-wrap gap-1">
                      {viewTeacher.specialties.map(s => <Badge key={s} variant="secondary">{s}</Badge>)}
                    </div>
                  </div>
                )}
              </div>
            )}
          </DialogContent>
        </Dialog>

        {/* Dialog تعديل المعلم */}
        <Dialog open={!!editTeacher} onOpenChange={(open) => !open && setEditTeacher(null)}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>تعديل بيانات المعلم</DialogTitle>
            </DialogHeader>
            {editTeacher && (
              <div className="space-y-3">
                <div><Label>الاسم</Label><Input value={editTeacher.name} onChange={e => setEditTeacher({ ...editTeacher, name: e.target.value })} /></div>
                <div><Label>البريد الإلكتروني</Label><Input value={editTeacher.email} onChange={e => setEditTeacher({ ...editTeacher, email: e.target.value })} /></div>
                <div><Label>الهاتف</Label><Input value={editTeacher.phone || ''} onChange={e => setEditTeacher({ ...editTeacher, phone: e.target.value })} /></div>
                <div><Label>النبذة</Label><Textarea value={editTeacher.bio || ''} onChange={e => setEditTeacher({ ...editTeacher, bio: e.target.value })} /></div>
              </div>
            )}
            <DialogFooter>
              <Button variant="outline" onClick={() => setEditTeacher(null)}>إلغاء</Button>
              <Button onClick={handleEdit}>حفظ</Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>

        <Dialog open={showAdd} onOpenChange={setShowAdd}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>إضافة معلم جديد</DialogTitle>
              <DialogDescription>أدخل بيانات المعلم الجديد. كلمة المرور الافتراضية: teacher123</DialogDescription>
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
  const students = users.filter(u => u.role === 'student');
  const [search, setSearch] = useState('');
  const [viewStudent, setViewStudent] = useState<User | null>(null);

  const filtered = students.filter(s => s.name.includes(search) || s.email.includes(search));

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
              <TableHead>السنة</TableHead>
              <TableHead>الاشتراك</TableHead>
              <TableHead>الدروس المكتملة</TableHead>
              <TableHead>إجراءات</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filtered.map(s => (
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
                <TableCell>{s.year === 'first' ? 'الأولى' : s.year === 'second' ? 'الثانية' : 'الثالثة'}</TableCell>
                <TableCell>
                  <Badge variant={s.subscriptionStatus === 'active' ? 'default' : 'outline'}>
                    {s.subscriptionStatus === 'active' ? 'نشط' : 'معلق'}
                  </Badge>
                </TableCell>
                <TableCell>{s.completedLessons?.length || 0}</TableCell>
                <TableCell>
                  <div className="flex gap-1">
                    <Button size="icon" variant="ghost" onClick={() => setViewStudent(s)} title="عرض">
                      <Eye className="w-4 h-4" />
                    </Button>
                    <Button size="icon" variant="ghost" onClick={() => {
                      const newStatus = s.subscriptionStatus === 'active' ? 'pending' : 'active';
                      updateUser(s.id, { subscriptionStatus: newStatus });
                      toast.success(newStatus === 'active' ? 'تم تفعيل الاشتراك' : 'تم إيقاف الاشتراك');
                    }} title="تبديل الاشتراك">
                      <Shield className="w-4 h-4" />
                    </Button>
                    <Button size="icon" variant="ghost" onClick={() => {
                      if (confirm(`هل تريد حذف الطالب ${s.name}؟`)) {
                        deleteUser(s.id);
                        toast.success('تم حذف الطالب');
                      }
                    }} title="حذف">
                      <Trash2 className="w-4 h-4 text-rose-500" />
                    </Button>
                  </div>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>

        <Dialog open={!!viewStudent} onOpenChange={(open) => !open && setViewStudent(null)}>
          <DialogContent>
            <DialogHeader><DialogTitle>تفاصيل الطالب</DialogTitle></DialogHeader>
            {viewStudent && (
              <div className="space-y-3">
                <div className="flex items-center gap-3">
                  <Avatar className="w-16 h-16 text-3xl"><AvatarFallback className="text-3xl">{viewStudent.avatar}</AvatarFallback></Avatar>
                  <div>
                    <div className="font-bold text-lg">{viewStudent.name}</div>
                    <div className="text-sm text-muted-foreground">{viewStudent.email}</div>
                    <div className="text-sm text-muted-foreground">{viewStudent.phone || 'لا يوجد'}</div>
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-2">
                  <div className="p-2 rounded-lg bg-muted/50 text-center">
                    <div className="font-bold">{viewStudent.stage === 'high' ? 'ثانوي' : 'إعدادي'}</div>
                    <div className="text-xs text-muted-foreground">المرحلة</div>
                  </div>
                  <div className="p-2 rounded-lg bg-muted/50 text-center">
                    <div className="font-bold">{viewStudent.year === 'first' ? 'الأولى' : viewStudent.year === 'second' ? 'الثانية' : 'الثالثة'}</div>
                    <div className="text-xs text-muted-foreground">السنة</div>
                  </div>
                  <div className="p-2 rounded-lg bg-muted/50 text-center">
                    <div className="font-bold">{viewStudent.completedLessons?.length || 0}</div>
                    <div className="text-xs text-muted-foreground">دروس مكتملة</div>
                  </div>
                  <div className="p-2 rounded-lg bg-muted/50 text-center">
                    <div className="font-bold">{viewStudent.favorites?.length || 0}</div>
                    <div className="text-xs text-muted-foreground">مفضلة</div>
                  </div>
                </div>
                <div className="p-3 rounded-lg bg-muted/50">
                  <div className="text-sm font-medium">حالة الاشتراك</div>
                  <div className="flex items-center gap-2 mt-1">
                    <Badge variant={viewStudent.subscriptionStatus === 'active' ? 'default' : 'outline'}>
                      {viewStudent.subscriptionStatus === 'active' ? '✓ نشط' : '⚠ معلق'}
                    </Badge>
                    {viewStudent.subscriptionExpiry && (
                      <span className="text-xs text-muted-foreground">ينتهي: {viewStudent.subscriptionExpiry}</span>
                    )}
                  </div>
                </div>
              </div>
            )}
          </DialogContent>
        </Dialog>
      </CardContent>
    </Card>
  );
}

// ===== Manage Lessons =====
function ManageLessons() {
  const { lessons, deleteLesson, addLesson, updateLesson, currentUser, openLesson } = useStore();
  const [showAdd, setShowAdd] = useState(false);
  const [editLesson, setEditLesson] = useState<Lesson | null>(null);
  const [newLesson, setNewLesson] = useState({
    title: '', description: '', videoUrl: '', videoDuration: '',
    unitId: initialUnits[0].id, allowPdfDownload: true, videoSource: 'youtube' as Lesson['videoSource'],
  });

  const handleAdd = () => {
    if (!newLesson.title || !newLesson.videoUrl) {
      toast.error('أدخل العنوان ورابط الفيديو');
      return;
    }
    addLesson({
      id: `lesson-${Date.now()}`,
      unitId: newLesson.unitId,
      title: newLesson.title,
      description: newLesson.description,
      teacherId: currentUser?.id || 'teacher-1',
      videoUrl: newLesson.videoUrl,
      videoSource: newLesson.videoSource,
      videoDuration: newLesson.videoDuration || '00:00',
      pdfs: [], additionalFiles: [],
      views: 0, order: lessons.length + 1,
      createdAt: new Date().toISOString().split('T')[0],
      allowPdfDownload: newLesson.allowPdfDownload,
    });
    toast.success('تم إضافة الدرس');
    setShowAdd(false);
    setNewLesson({ title: '', description: '', videoUrl: '', videoDuration: '', unitId: initialUnits[0].id, allowPdfDownload: true, videoSource: 'youtube' });
  };

  const handleEdit = () => {
    if (!editLesson) return;
    updateLesson(editLesson.id, {
      title: editLesson.title,
      description: editLesson.description,
      videoUrl: editLesson.videoUrl,
      videoDuration: editLesson.videoDuration,
      allowPdfDownload: editLesson.allowPdfDownload,
    });
    toast.success('تم تحديث الدرس');
    setEditLesson(null);
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
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
          {lessons.map(l => (
            <Card key={l.id} className="overflow-hidden">
              <div className="aspect-video bg-muted relative">
                <div className="absolute inset-0 flex items-center justify-center">
                  <Video className="w-10 h-10 text-muted-foreground" />
                </div>
                <Badge className="absolute top-2 right-2">{l.videoDuration}</Badge>
              </div>
              <CardContent className="p-3">
                <h3 className="font-semibold text-sm mb-1 line-clamp-1">{l.title}</h3>
                <p className="text-xs text-muted-foreground mb-2 line-clamp-2">{l.description}</p>
                <div className="flex items-center justify-between">
                  <Badge variant="secondary" className="text-xs">{l.views} مشاهدة</Badge>
                  <div className="flex gap-1">
                    <Button size="icon" variant="ghost" className="h-7 w-7" onClick={() => openLesson(l.id)} title="عرض">
                      <Eye className="w-3.5 h-3.5" />
                    </Button>
                    <Button size="icon" variant="ghost" className="h-7 w-7" onClick={() => setEditLesson(l)} title="تعديل">
                      <Edit className="w-3.5 h-3.5" />
                    </Button>
                    <Button size="icon" variant="ghost" className="h-7 w-7" onClick={() => {
                      if (confirm(`هل تريد حذف الدرس "${l.title}"؟`)) {
                        deleteLesson(l.id);
                        toast.success('تم حذف الدرس');
                      }
                    }} title="حذف">
                      <Trash2 className="w-3.5 h-3.5 text-rose-500" />
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Dialog إضافة درس */}
        <Dialog open={showAdd} onOpenChange={setShowAdd}>
          <DialogContent className="max-w-lg">
            <DialogHeader>
              <DialogTitle>إضافة درس جديد</DialogTitle>
            </DialogHeader>
            <div className="space-y-3 max-h-[60vh] overflow-y-auto">
              <div><Label>عنوان الدرس</Label><Input value={newLesson.title} onChange={e => setNewLesson({ ...newLesson, title: e.target.value })} /></div>
              <div><Label>الوصف</Label><Textarea value={newLesson.description} onChange={e => setNewLesson({ ...newLesson, description: e.target.value })} /></div>
              <div>
                <Label>الوحدة</Label>
                <Select value={newLesson.unitId} onValueChange={v => setNewLesson({ ...newLesson, unitId: v })}>
                  <SelectTrigger><SelectValue /></SelectTrigger>
                  <SelectContent>{initialUnits.map(u => <SelectItem key={u.id} value={u.id}>{u.title}</SelectItem>)}</SelectContent>
                </Select>
              </div>
              <div>
                <Label>مصدر الفيديو</Label>
                <Select value={newLesson.videoSource} onValueChange={(v: any) => setNewLesson({ ...newLesson, videoSource: v })}>
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
              <div><Label>رابط الفيديو (Embed URL)</Label><Input dir="ltr" value={newLesson.videoUrl} onChange={e => setNewLesson({ ...newLesson, videoUrl: e.target.value })} placeholder="https://www.youtube.com/embed/..." /></div>
              <div><Label>مدة الفيديو</Label><Input value={newLesson.videoDuration} onChange={e => setNewLesson({ ...newLesson, videoDuration: e.target.value })} placeholder="24:35" /></div>
              <div className="flex items-center gap-2">
                <Switch checked={newLesson.allowPdfDownload} onCheckedChange={c => setNewLesson({ ...newLesson, allowPdfDownload: c })} />
                <Label>السماح بتحميل PDF</Label>
              </div>
            </div>
            <DialogFooter>
              <Button variant="outline" onClick={() => setShowAdd(false)}>إلغاء</Button>
              <Button onClick={handleAdd}>إضافة</Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>

        {/* Dialog تعديل درس */}
        <Dialog open={!!editLesson} onOpenChange={(open) => !open && setEditLesson(null)}>
          <DialogContent className="max-w-lg">
            <DialogHeader><DialogTitle>تعديل الدرس</DialogTitle></DialogHeader>
            {editLesson && (
              <div className="space-y-3 max-h-[60vh] overflow-y-auto">
                <div><Label>عنوان الدرس</Label><Input value={editLesson.title} onChange={e => setEditLesson({ ...editLesson, title: e.target.value })} /></div>
                <div><Label>الوصف</Label><Textarea value={editLesson.description} onChange={e => setEditLesson({ ...editLesson, description: e.target.value })} /></div>
                <div><Label>رابط الفيديو</Label><Input dir="ltr" value={editLesson.videoUrl} onChange={e => setEditLesson({ ...editLesson, videoUrl: e.target.value })} /></div>
                <div><Label>مدة الفيديو</Label><Input value={editLesson.videoDuration} onChange={e => setEditLesson({ ...editLesson, videoDuration: e.target.value })} /></div>
                <div className="flex items-center gap-2">
                  <Switch checked={editLesson.allowPdfDownload} onCheckedChange={c => setEditLesson({ ...editLesson, allowPdfDownload: c })} />
                  <Label>السماح بتحميل PDF</Label>
                </div>
              </div>
            )}
            <DialogFooter>
              <Button variant="outline" onClick={() => setEditLesson(null)}>إلغاء</Button>
              <Button onClick={handleEdit}>حفظ</Button>
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
      <CardHeader>
        <CardTitle>إدارة الفيديوهات ({lessons.length})</CardTitle>
        <CardDescription>كل الفيديوهات على المنصة</CardDescription>
      </CardHeader>
      <CardContent>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>الدرس</TableHead>
              <TableHead>المصدر</TableHead>
              <TableHead>المدة</TableHead>
              <TableHead>المشاهدات</TableHead>
              <TableHead>إجراءات</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {lessons.map(l => (
              <TableRow key={l.id}>
                <TableCell className="font-medium">{l.title}</TableCell>
                <TableCell><Badge variant="secondary">{l.videoSource}</Badge></TableCell>
                <TableCell>{l.videoDuration}</TableCell>
                <TableCell>{l.views.toLocaleString('ar-EG')}</TableCell>
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
  const allPdfs = lessons.flatMap(l => l.pdfs.map(p => ({ ...p, lesson: l.title, lessonId: l.id })));
  const [showUpload, setShowUpload] = useState(false);
  const [newPdf, setNewPdf] = useState({ name: '', url: '', lessonId: lessons[0]?.id || '' });

  const handleUpload = () => {
    if (!newPdf.name || !newPdf.url || !newPdf.lessonId) {
      toast.error('املأ كل الحقول');
      return;
    }
    const lesson = lessons.find(l => l.id === newPdf.lessonId);
    if (!lesson) return;
    updateLesson(lesson.id, {
      pdfs: [...lesson.pdfs, {
        id: `pdf-${Date.now()}`,
        name: newPdf.name,
        url: newPdf.url,
        size: '1.2 MB',
        pages: 10,
      }],
    });
    toast.success('تم رفع ملف PDF');
    setNewPdf({ name: '', url: '', lessonId: lessons[0]?.id || '' });
    setShowUpload(false);
  };

  const handleDelete = (lessonId: string, pdfId: string) => {
    const lesson = lessons.find(l => l.id === lessonId);
    if (!lesson) return;
    if (confirm('هل تريد حذف هذا الملف؟')) {
      updateLesson(lessonId, { pdfs: lesson.pdfs.filter(p => p.id !== pdfId) });
      toast.success('تم حذف الملف');
    }
  };

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <div>
            <CardTitle>إدارة ملفات PDF ({allPdfs.length})</CardTitle>
            <CardDescription>كل ملفات PDF على المنصة</CardDescription>
          </div>
          <Button onClick={() => setShowUpload(true)}><Upload className="w-4 h-4 ml-2" /> رفع PDF</Button>
        </div>
      </CardHeader>
      <CardContent>
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
          {allPdfs.map(p => (
            <Card key={p.id}>
              <CardContent className="p-4">
                <div className="flex items-start gap-3">
                  <div className="w-10 h-10 rounded-lg bg-rose-100 dark:bg-rose-900/30 flex items-center justify-center text-rose-600 font-bold text-xs">PDF</div>
                  <div className="flex-1 min-w-0">
                    <div className="font-medium text-sm truncate">{p.name}</div>
                    <div className="text-xs text-muted-foreground">{p.size} • {p.pages} صفحة</div>
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

        <Dialog open={showUpload} onOpenChange={setShowUpload}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>رفع ملف PDF جديد</DialogTitle>
              <DialogDescription>أدخل بيانات الملف</DialogDescription>
            </DialogHeader>
            <div className="space-y-3">
              <div>
                <Label>الدرس</Label>
                <Select value={newPdf.lessonId} onValueChange={v => setNewPdf({ ...newPdf, lessonId: v })}>
                  <SelectTrigger><SelectValue /></SelectTrigger>
                  <SelectContent>
                    {lessons.map(l => <SelectItem key={l.id} value={l.id}>{l.title}</SelectItem>)}
                  </SelectContent>
                </Select>
              </div>
              <div><Label>اسم الملف</Label><Input value={newPdf.name} onChange={e => setNewPdf({ ...newPdf, name: e.target.value })} placeholder="ملخص الدرس.pdf" /></div>
              <div><Label>رابط الملف (URL)</Label><Input dir="ltr" value={newPdf.url} onChange={e => setNewPdf({ ...newPdf, url: e.target.value })} placeholder="https://..." /></div>
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

// ===== Manage Exams (including HTML) =====
function ManageExams() {
  const { exams, addExam, deleteExam } = useStore();
  const [showAdd, setShowAdd] = useState(false);
  const [previewExam, setPreviewExam] = useState<Exam | null>(null);
  const [examType, setExamType] = useState<'html' | 'questions'>('html');
  const [newExam, setNewExam] = useState({
    title: '', description: '', duration: 30, passingScore: 60,
    preventBack: true, randomOrder: false, showGrade: true, showSolution: true,
  });
  const [htmlContent, setHtmlContent] = useState('');

  const handleSave = () => {
    if (!newExam.title) {
      toast.error('أدخل عنوان الامتحان');
      return;
    }
    if (examType === 'html' && !htmlContent) {
      toast.error('أدخل كود HTML للامتحان');
      return;
    }
    const exam: Exam = {
      id: `exam-${Date.now()}`,
      title: newExam.title,
      description: newExam.description,
      durationMinutes: newExam.duration,
      preventBack: newExam.preventBack,
      randomOrder: newExam.randomOrder,
      showGrade: newExam.showGrade,
      showSolution: newExam.showSolution,
      passingScore: newExam.passingScore,
      questions: [],
      isHtmlExam: examType === 'html',
      htmlContent: examType === 'html' ? htmlContent : undefined,
    };
    addExam(exam);
    toast.success('تم إنشاء الامتحان');
    setShowAdd(false);
    setNewExam({ title: '', description: '', duration: 30, passingScore: 60, preventBack: true, randomOrder: false, showGrade: true, showSolution: true });
    setHtmlContent('');
  };

  return (
    <div className="space-y-4">
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between flex-wrap gap-2">
            <div>
              <CardTitle>إدارة الامتحانات ({exams.length})</CardTitle>
              <CardDescription>إنشاء امتحانات تفاعلية HTML أو أسئلة عادية</CardDescription>
            </div>
            <Button onClick={() => setShowAdd(true)}>
              <Plus className="w-4 h-4 ml-2" /> امتحان جديد
            </Button>
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
                    {e.isHtmlExam && <Badge>HTML تفاعلي</Badge>}
                  </div>
                  <p className="text-sm text-muted-foreground mb-3 line-clamp-2">{e.description}</p>
                  <div className="flex flex-wrap gap-2 text-xs">
                    <Badge variant="secondary">⏱ {e.durationMinutes} دقيقة</Badge>
                    <Badge variant="secondary">🎯 {e.passingScore}% للنجاح</Badge>
                    {e.preventBack && <Badge variant="secondary">🚫 منع الرجوع</Badge>}
                    {e.randomOrder && <Badge variant="secondary">🔀 ترتيب عشوائي</Badge>}
                  </div>
                  <div className="flex gap-2 mt-3">
                    <Button size="sm" variant="outline" className="flex-1" onClick={() => setPreviewExam(e)}>
                      <Eye className="w-4 h-4 ml-1" /> معاينة
                    </Button>
                    <Button size="sm" variant="ghost" onClick={() => { deleteExam(e.id); toast.success('تم الحذف'); }}>
                      <Trash2 className="w-4 h-4 text-rose-500" />
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
                <HelpCircle className="w-12 h-12 mx-auto mb-3 opacity-50" />
                هذا الامتحان ليس امتحان HTML تفاعلي
              </div>
            )}
          </div>
        </DialogContent>
      </Dialog>

      <Dialog open={showAdd} onOpenChange={setShowAdd}>
        <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>إنشاء امتحان جديد</DialogTitle>
            <DialogDescription>اختر نوع الامتحان وأدخل بياناته</DialogDescription>
          </DialogHeader>
          <div className="space-y-4">
            <div>
              <Label>نوع الامتحان</Label>
              <div className="grid grid-cols-2 gap-2 mt-2">
                <Button variant={examType === 'html' ? 'default' : 'outline'} onClick={() => setExamType('html')}>
                  💻 امتحان HTML تفاعلي
                </Button>
                <Button variant={examType === 'questions' ? 'default' : 'outline'} onClick={() => setExamType('questions')}>
                  📝 أسئلة عادية
                </Button>
              </div>
            </div>
            <div><Label>عنوان الامتحان</Label><Input value={newExam.title} onChange={e => setNewExam({ ...newExam, title: e.target.value })} /></div>
            <div><Label>الوصف</Label><Textarea value={newExam.description} onChange={e => setNewExam({ ...newExam, description: e.target.value })} /></div>
            <div className="grid grid-cols-2 gap-3">
              <div><Label>المدة (دقيقة)</Label><Input type="number" value={newExam.duration} onChange={e => setNewExam({ ...newExam, duration: +e.target.value })} /></div>
              <div><Label>درجة النجاح (%)</Label><Input type="number" value={newExam.passingScore} onChange={e => setNewExam({ ...newExam, passingScore: +e.target.value })} /></div>
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div className="flex items-center gap-2">
                <Switch checked={newExam.preventBack} onCheckedChange={c => setNewExam({ ...newExam, preventBack: c })} />
                <Label>منع الرجوع</Label>
              </div>
              <div className="flex items-center gap-2">
                <Switch checked={newExam.randomOrder} onCheckedChange={c => setNewExam({ ...newExam, randomOrder: c })} />
                <Label>ترتيب عشوائي</Label>
              </div>
              <div className="flex items-center gap-2">
                <Switch checked={newExam.showGrade} onCheckedChange={c => setNewExam({ ...newExam, showGrade: c })} />
                <Label>إظهار الدرجة</Label>
              </div>
              <div className="flex items-center gap-2">
                <Switch checked={newExam.showSolution} onCheckedChange={c => setNewExam({ ...newExam, showSolution: c })} />
                <Label>إظهار الحل</Label>
              </div>
            </div>
            {examType === 'html' && (
              <HtmlExamBuilder onSave={setHtmlContent} />
            )}
            {examType === 'questions' && (
              <div className="p-4 bg-muted/30 rounded-lg text-center text-muted-foreground">
                <HelpCircle className="w-8 h-8 mx-auto mb-2" />
                محرر الأسئلة العادية - يمكن إضافته من بنك الأسئلة
              </div>
            )}
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setShowAdd(false)}>إلغاء</Button>
            <Button onClick={handleSave}><Save className="w-4 h-4 ml-2" /> حفظ الامتحان</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}

// ===== Question Bank =====
function QuestionBank() {
  const { questionBank, addQuestion, deleteQuestion } = useStore();
  const [showAdd, setShowAdd] = useState(false);
  const [newQ, setNewQ] = useState({
    text: '', type: 'mcq' as 'mcq' | 'truefalse' | 'fill' | 'essay' | 'image',
    difficulty: 'easy' as 'easy' | 'medium' | 'hard',
    correctAnswer: '', options: ['', '', '', ''],
    points: 5, stageId: 'high', yearId: 'first',
  });

  const handleAdd = () => {
    if (!newQ.text || !newQ.correctAnswer) {
      toast.error('أدخل السؤال والإجابة');
      return;
    }
    addQuestion({
      id: `qb-${Date.now()}`,
      type: newQ.type,
      difficulty: newQ.difficulty,
      text: newQ.text,
      options: newQ.type === 'mcq' ? newQ.options.filter(o => o) : undefined,
      correctAnswer: newQ.correctAnswer,
      points: newQ.points,
      stageId: newQ.stageId as any,
      yearId: newQ.yearId as any,
    });
    toast.success('تم إضافة السؤال');
    setNewQ({ text: '', type: 'mcq', difficulty: 'easy', correctAnswer: '', options: ['', '', '', ''], points: 5, stageId: 'high', yearId: 'first' });
    setShowAdd(false);
  };

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <div>
            <CardTitle>بنك الأسئلة ({questionBank.length})</CardTitle>
            <CardDescription>إدارة وتصنيف الأسئلة</CardDescription>
          </div>
          <Button onClick={() => setShowAdd(true)}><Plus className="w-4 h-4 ml-2" /> إضافة سؤال</Button>
        </div>
      </CardHeader>
      <CardContent>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>السؤال</TableHead>
              <TableHead>النوع</TableHead>
              <TableHead>الصعوبة</TableHead>
              <TableHead>المرحلة</TableHead>
              <TableHead>السنة</TableHead>
              <TableHead>الدرجة</TableHead>
              <TableHead>إجراءات</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {questionBank.map(q => (
              <TableRow key={q.id}>
                <TableCell className="max-w-xs truncate">{q.text}</TableCell>
                <TableCell>
                  <Badge variant="secondary">
                    {q.type === 'mcq' ? 'اختيار' : q.type === 'truefalse' ? 'صح/خطأ' : q.type === 'fill' ? 'أكمل' : q.type === 'essay' ? 'مقالي' : 'صورة'}
                  </Badge>
                </TableCell>
                <TableCell>
                  <Badge variant={q.difficulty === 'easy' ? 'default' : q.difficulty === 'medium' ? 'secondary' : 'destructive'}>
                    {q.difficulty === 'easy' ? 'سهل' : q.difficulty === 'medium' ? 'متوسط' : 'صعب'}
                  </Badge>
                </TableCell>
                <TableCell>{q.stageId === 'high' ? 'ثانوي' : 'إعدادي'}</TableCell>
                <TableCell>{q.yearId === 'first' ? '1' : q.yearId === 'second' ? '2' : '3'}</TableCell>
                <TableCell>{q.points}</TableCell>
                <TableCell>
                  <Button size="icon" variant="ghost" onClick={() => {
                    if (confirm('حذف السؤال؟')) {
                      deleteQuestion(q.id);
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
            <DialogHeader><DialogTitle>إضافة سؤال جديد</DialogTitle></DialogHeader>
            <div className="space-y-3 max-h-[60vh] overflow-y-auto">
              <div><Label>نص السؤال</Label><Textarea value={newQ.text} onChange={e => setNewQ({ ...newQ, text: e.target.value })} /></div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <Label>النوع</Label>
                  <Select value={newQ.type} onValueChange={(v: any) => setNewQ({ ...newQ, type: v })}>
                    <SelectTrigger><SelectValue /></SelectTrigger>
                    <SelectContent>
                      <SelectItem value="mcq">اختيار من متعدد</SelectItem>
                      <SelectItem value="truefalse">صح / خطأ</SelectItem>
                      <SelectItem value="fill">أكمل الفراغ</SelectItem>
                      <SelectItem value="essay">مقالي</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <Label>الصعوبة</Label>
                  <Select value={newQ.difficulty} onValueChange={(v: any) => setNewQ({ ...newQ, difficulty: v })}>
                    <SelectTrigger><SelectValue /></SelectTrigger>
                    <SelectContent>
                      <SelectItem value="easy">سهل</SelectItem>
                      <SelectItem value="medium">متوسط</SelectItem>
                      <SelectItem value="hard">صعب</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
              {newQ.type === 'mcq' && (
                <div className="space-y-2">
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
              <div className="grid grid-cols-3 gap-3">
                <div><Label>الدرجة</Label><Input type="number" value={newQ.points} onChange={e => setNewQ({ ...newQ, points: +e.target.value })} /></div>
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

// ===== Finance =====
function FinanceSection() {
  return (
    <div className="space-y-4">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <StatCard icon={DollarSign} label="إجمالي الأرباح" value={`${demoStats.totalRevenue.toLocaleString('ar-EG')} ج.م`} color="text-emerald-600" trend="+18%" />
        <StatCard icon={TrendingUp} label="أرباح الشهر" value={`${demoStats.monthlyRevenue[demoStats.monthlyRevenue.length - 1].revenue.toLocaleString('ar-EG')} ج.م`} color="text-amber-600" trend="+12%" />
        <StatCard icon={CreditCard} label="معاملات الشهر" value={142} color="text-purple-600" />
      </div>
      <Card>
        <CardHeader><CardTitle>الأرباح الشهرية</CardTitle></CardHeader>
        <CardContent>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={demoStats.monthlyRevenue}>
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
  const subscribers = users.filter(u => u.role === 'student' && u.subscriptionStatus === 'active');
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
            {subscribers.map(s => (
              <TableRow key={s.id}>
                <TableCell>{s.name}</TableCell>
                <TableCell>{s.subscriptionExpiry}</TableCell>
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
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>الطالب</TableHead>
              <TableHead>المبلغ</TableHead>
              <TableHead>الباقة</TableHead>
              <TableHead>طريقة الدفع</TableHead>
              <TableHead>التاريخ</TableHead>
              <TableHead>الحالة</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {payments.map(p => (
              <TableRow key={p.id}>
                <TableCell>{p.studentName}</TableCell>
                <TableCell>{p.amount} ج.م</TableCell>
                <TableCell>{p.subscriptionName}</TableCell>
                <TableCell>
                  <Badge variant="outline">{p.method}</Badge>
                </TableCell>
                <TableCell>{p.date}</TableCell>
                <TableCell>
                  <Badge variant={p.status === 'completed' ? 'default' : p.status === 'pending' ? 'secondary' : 'destructive'}>
                    {p.status === 'completed' ? 'مكتمل' : p.status === 'pending' ? 'معلق' : 'فشل'}
                  </Badge>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  );
}

// ===== Coupons =====
function CouponsSection() {
  const { coupons, deleteCoupon, addCoupon } = useStore();
  const [showAdd, setShowAdd] = useState(false);
  const [newCoupon, setNewCoupon] = useState({ code: '', discount: 10, type: 'percentage' as 'percentage' | 'fixed', maxUses: 100, expiry: '2026-12-31' });

  const handleAdd = () => {
    addCoupon({
      id: `cp-${Date.now()}`,
      code: newCoupon.code,
      discount: newCoupon.discount,
      type: newCoupon.type,
      maxUses: newCoupon.maxUses,
      usedCount: 0,
      expiry: newCoupon.expiry,
      active: true,
    });
    toast.success('تم إضافة الكوبون');
    setShowAdd(false);
    setNewCoupon({ code: '', discount: 10, type: 'percentage', maxUses: 100, expiry: '2026-12-31' });
  };

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <div><CardTitle>كوبونات الخصم ({coupons.length})</CardTitle></div>
          <Button onClick={() => setShowAdd(true)}><Plus className="w-4 h-4 ml-2" /> كوبون جديد</Button>
        </div>
      </CardHeader>
      <CardContent>
        <div className="grid md:grid-cols-3 gap-4">
          {coupons.map(c => (
            <Card key={c.id}>
              <CardContent className="p-4">
                <div className="flex items-center justify-between mb-3">
                  <div className="font-mono font-bold text-lg text-emerald-600">{c.code}</div>
                  <Badge variant={c.active ? 'default' : 'secondary'}>
                    {c.active ? 'نشط' : 'موقوف'}
                  </Badge>
                </div>
                <div className="text-2xl font-bold mb-1">
                  {c.type === 'percentage' ? `${c.discount}%` : `${c.discount} ج.م`}
                </div>
                <div className="text-xs text-muted-foreground mb-2">خصم {c.type === 'percentage' ? 'نسبة' : 'مبلغ ثابت'}</div>
                <div className="text-xs space-y-1">
                  <div>الاستخدام: {c.usedCount}/{c.maxUses}</div>
                  <div>الانتهاء: {c.expiry}</div>
                </div>
                <Button size="sm" variant="ghost" className="w-full mt-2 text-rose-500" onClick={() => { deleteCoupon(c.id); toast.success('تم الحذف'); }}>
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
                    <SelectItem value="percentage">نسبة مئوية %</SelectItem>
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
  const { comments, deleteComment } = useStore();
  return (
    <Card>
      <CardHeader><CardTitle>إدارة التعليقات ({comments.length})</CardTitle></CardHeader>
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
              <p className="text-sm text-muted-foreground">{c.text}</p>
            </div>
            <Button size="icon" variant="ghost" onClick={() => {
              if (confirm('حذف التعليق؟')) {
                deleteComment(c.id);
                toast.success('تم حذف التعليق');
              }
            }}>
              <Trash2 className="w-4 h-4 text-rose-500" />
            </Button>
          </div>
        ))}
      </CardContent>
    </Card>
  );
}

// ===== Notifications =====
function NotificationsSection() {
  const { notifications, addNotification, markNotificationRead } = useStore();
  const [newNotif, setNewNotif] = useState({ title: '', message: '', type: 'info' as 'info' | 'success' | 'warning' | 'error' });

  const handleSend = () => {
    if (!newNotif.title || !newNotif.message) {
      toast.error('أدخل العنوان والرسالة');
      return;
    }
    addNotification({
      id: `n-${Date.now()}`,
      title: newNotif.title,
      message: newNotif.message,
      type: newNotif.type,
      createdAt: new Date().toISOString().split('T')[0],
      read: false,
    });
    toast.success('تم إرسال الإشعار لجميع المستخدمين');
    setNewNotif({ title: '', message: '', type: 'info' });
  };

  return (
    <div className="space-y-4">
      <Card>
        <CardHeader><CardTitle>إرسال إشعار جديد</CardTitle></CardHeader>
        <CardContent className="space-y-3">
          <div><Label>العنوان</Label><Input value={newNotif.title} onChange={e => setNewNotif({ ...newNotif, title: e.target.value })} /></div>
          <div><Label>الرسالة</Label><Textarea value={newNotif.message} onChange={e => setNewNotif({ ...newNotif, message: e.target.value })} /></div>
          <div>
            <Label>النوع</Label>
            <Select value={newNotif.type} onValueChange={(v: any) => setNewNotif({ ...newNotif, type: v })}>
              <SelectTrigger><SelectValue /></SelectTrigger>
              <SelectContent>
                <SelectItem value="info">معلومة</SelectItem>
                <SelectItem value="success">نجاح</SelectItem>
                <SelectItem value="warning">تحذير</SelectItem>
                <SelectItem value="error">خطأ</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <Button onClick={handleSend}><Bell className="w-4 h-4 ml-2" /> إرسال الإشعار</Button>
        </CardContent>
      </Card>

      <Card>
        <CardHeader><CardTitle>الإشعارات السابقة ({notifications.length})</CardTitle></CardHeader>
        <CardContent className="space-y-2">
          {notifications.map(n => (
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
    </div>
  );
}

// ===== Stats =====
function StatsSection() {
  return (
    <div className="space-y-4">
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <StatCard icon={Users} label="إجمالي الطلاب" value={demoStats.totalStudents} color="text-emerald-600" />
        <StatCard icon={Eye} label="إجمالي الزيارات" value={demoStats.totalVisits} color="text-amber-600" />
        <StatCard icon={Video} label="إجمالي الفيديوهات" value={demoStats.totalVideos} color="text-rose-600" />
        <StatCard icon={BookOpen} label="إجمالي الدروس" value={demoStats.totalLessons} color="text-blue-600" />
      </div>
      <Card>
        <CardHeader><CardTitle>توزيع المراحل</CardTitle></CardHeader>
        <CardContent>
          <ResponsiveContainer width="100%" height={300}>
            <PieChart>
              <Pie data={[
                { name: 'إعدادي', value: 1450 },
                { name: 'ثانوي', value: 1795 },
              ]} dataKey="value" nameKey="name" cx="50%" cy="50%" outerRadius={100} label>
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
  const { exportBackup, importBackup } = useStore();
  const [backups, setBackups] = useState<{ id: string; date: string; size: string; data: string }[]>([
    { id: 'b1', date: '2026-06-28 12:00', size: '45 MB', data: '' },
    { id: 'b2', date: '2026-06-27 12:00', size: '44 MB', data: '' },
    { id: 'b3', date: '2026-06-26 12:00', size: '43 MB', data: '' },
  ]);
  const [showRestore, setShowRestore] = useState(false);
  const [restoreData, setRestoreData] = useState('');

  const handleBackup = () => {
    const data = exportBackup();
    const newBackup = {
      id: `b-${Date.now()}`,
      date: new Date().toLocaleString('ar-EG'),
      size: `${(data.length / 1024).toFixed(1)} KB`,
      data,
    };
    setBackups([newBackup, ...backups]);
    // تحميل الملف
    const blob = new Blob([data], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `backup-${new Date().toISOString().split('T')[0]}.json`;
    a.click();
    URL.revokeObjectURL(url);
    toast.success('تم إنشاء نسخة احتياطية وتحميلها');
  };

  const handleDownload = (b: { data: string; date: string; id: string }) => {
    if (!b.data) {
      toast.info('لا توجد بيانات في هذه النسخة');
      return;
    }
    const blob = new Blob([b.data], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `backup-${b.id}.json`;
    a.click();
    URL.revokeObjectURL(url);
    toast.success('تم تحميل النسخة');
  };

  const handleRestore = (b: { data: string }) => {
    if (!b.data) {
      toast.error('لا توجد بيانات للاستعادة');
      return;
    }
    if (confirm('هل تريد استعادة هذه النسخة؟ سيتم استبدال كل البيانات الحالية.')) {
      const success = importBackup(b.data);
      if (success) {
        toast.success('تم استعادة النسخة بنجاح');
      } else {
        toast.error('فشل في الاستعادة - ملف تالف');
      }
    }
  };

  const handleRestoreFromText = () => {
    if (!restoreData) {
      toast.error('الصق بيانات النسخة الاحتياطية');
      return;
    }
    if (confirm('هل تريد استعادة هذه النسخة؟')) {
      const success = importBackup(restoreData);
      if (success) {
        toast.success('تم الاستعادة بنجاح');
        setShowRestore(false);
        setRestoreData('');
      } else {
        toast.error('البيانات غير صالحة');
      }
    }
  };

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <div><CardTitle>النسخ الاحتياطية</CardTitle></div>
          <div className="flex gap-2">
            <Button variant="outline" onClick={() => setShowRestore(true)}>
              <Upload className="w-4 h-4 ml-2" /> استعادة من ملف
            </Button>
            <Button onClick={handleBackup}>
              <Database className="w-4 h-4 ml-2" /> نسخ احتياطي الآن
            </Button>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>التاريخ</TableHead>
              <TableHead>الحجم</TableHead>
              <TableHead>إجراءات</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {backups.map(b => (
              <TableRow key={b.id}>
                <TableCell>{b.date}</TableCell>
                <TableCell>{b.size}</TableCell>
                <TableCell>
                  <Button size="sm" variant="ghost" onClick={() => handleDownload(b)}>تحميل</Button>
                  <Button size="sm" variant="ghost" onClick={() => handleRestore(b)}>استعادة</Button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>

        <Dialog open={showRestore} onOpenChange={setShowRestore}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>استعادة من ملف</DialogTitle>
              <DialogDescription>الصق محتوى ملف النسخة الاحتياطية (JSON)</DialogDescription>
            </DialogHeader>
            <Textarea
              rows={10}
              dir="ltr"
              placeholder='{"users":[...],"lessons":[...],...}'
              value={restoreData}
              onChange={e => setRestoreData(e.target.value)}
              className="font-mono text-xs"
            />
            <DialogFooter>
              <Button variant="outline" onClick={() => setShowRestore(false)}>إلغاء</Button>
              <Button onClick={handleRestoreFromText}>استعادة</Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
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
