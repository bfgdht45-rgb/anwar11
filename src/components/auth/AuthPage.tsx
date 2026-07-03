'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useStore } from '@/lib/store';
import { stages } from '@/lib/data';
import { toast } from 'sonner';
import { Calculator, Mail, Lock, User as UserIcon, Phone, ArrowRight, Sparkles, BookOpen, GraduationCap, Users } from 'lucide-react';
import type { UserRole, EducationalStage, YearLevel } from '@/lib/types';

export default function AuthPage() {
  const { login, register, setView } = useStore();

  // Login state
  const [loginEmail, setLoginEmail] = useState('');
  const [loginPassword, setLoginPassword] = useState('');

  // Register state
  const [regName, setRegName] = useState('');
  const [regEmail, setRegEmail] = useState('');
  const [regPassword, setRegPassword] = useState('');
  const [regPhone, setRegPhone] = useState('');
  const [regRole, setRegRole] = useState<UserRole>('student');
  const [regStage, setRegStage] = useState<EducationalStage>('middle');
  const [regYear, setRegYear] = useState<YearLevel>('first');
  const [regBio, setRegBio] = useState('');

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    const result = await login(loginEmail, loginPassword);
    if (result.success) {
      toast.success(result.message);
    } else {
      toast.error(result.message);
    }
  };

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!regName || !regEmail || !regPassword) {
      toast.error('يرجى ملء جميع الحقول المطلوبة');
      return;
    }
    const result = await register({
      name: regName,
      email: regEmail,
      password: regPassword,
      role: regRole,
      phone: regPhone,
      stage: regRole === 'student' ? regStage : undefined,
      year: regRole === 'student' ? regYear : undefined,
      bio: regRole === 'teacher' ? regBio : undefined,
    });
    if (result.success) {
      toast.success(result.message);
    } else {
      toast.error(result.message);
    }
  };

  const quickLogin = async (role: UserRole) => {
    const creds = {
      admin: { email: 'admin@math.com', password: 'admin123' },
      teacher: { email: 'teacher@math.com', password: 'teacher123' },
      student: { email: 'student@math.com', password: 'student123' },
    }[role];
    const result = await login(creds.email, creds.password);
    if (result.success) toast.success(result.message);
    else toast.error(result.message);
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-emerald-50 via-teal-50 to-cyan-50 dark:from-slate-900 dark:to-slate-800 p-4">
      <div className="absolute inset-0 grid-pattern opacity-30" />
      
      <div className="relative w-full max-w-5xl grid lg:grid-cols-2 gap-6">
        {/* Hero Side */}
        <div className="hidden lg:flex flex-col justify-center p-8">
          <div className="flex items-center gap-3 mb-6">
            <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-emerald-500 to-teal-600 flex items-center justify-center text-white">
              <Calculator className="w-8 h-8" />
            </div>
            <div>
              <h1 className="text-2xl font-bold">أكاديمية الرياضيات</h1>
              <p className="text-sm text-muted-foreground">الإعدادية والثانوية</p>
            </div>
          </div>
          <h2 className="text-4xl font-bold mb-4 leading-tight">
            تعلم الرياضيات
            <span className="text-gradient block">بأمتعة طريقة</span>
          </h2>
          <p className="text-muted-foreground mb-8">
            انضم لآلاف الطلاب الذين حققوا تفوقاً في الرياضيات من خلال منصتنا التعليمية المتكاملة.
          </p>
          <div className="space-y-4">
            {[
              { icon: BookOpen, title: 'دروس شاملة', desc: 'أكثر من 500 درس فيديو' },
              { icon: GraduationCap, title: 'مدرسون خبراء', desc: 'نخبة من أفضل المدرسين' },
              { icon: Users, title: 'مجوعة نشطة', desc: 'آلاف الطلاب يتعلمون معنا' },
            ].map(f => (
              <div key={f.title} className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-lg bg-emerald-100 dark:bg-emerald-900/30 flex items-center justify-center">
                  <f.icon className="w-5 h-5 text-emerald-600" />
                </div>
                <div>
                  <div className="font-semibold">{f.title}</div>
                  <div className="text-sm text-muted-foreground">{f.desc}</div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Auth Side */}
        <Card className="shadow-2xl">
          <CardHeader>
            <div className="lg:hidden flex items-center gap-2 mb-2">
              <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-emerald-500 to-teal-600 flex items-center justify-center text-white">
                <Calculator className="w-6 h-6" />
              </div>
              <h1 className="font-bold text-lg">أكاديمية الرياضيات</h1>
            </div>
            <CardTitle className="text-2xl">مرحباً بك 👋</CardTitle>
            <CardDescription>سجل دخولك أو أنشئ حساب جديد للمتابعة</CardDescription>
          </CardHeader>
          <CardContent>
            <Tabs defaultValue="login">
              <TabsList className="grid w-full grid-cols-2 mb-6">
                <TabsTrigger value="login">تسجيل الدخول</TabsTrigger>
                <TabsTrigger value="register">حساب جديد</TabsTrigger>
              </TabsList>

              {/* Login Tab */}
              <TabsContent value="login">
                <form onSubmit={handleLogin} className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="email">البريد الإلكتروني</Label>
                    <div className="relative">
                      <Mail className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                      <Input
                        id="email"
                        type="email"
                        placeholder="example@email.com"
                        className="pr-10"
                        value={loginEmail}
                        onChange={e => setLoginEmail(e.target.value)}
                        required
                      />
                    </div>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="password">كلمة المرور</Label>
                    <div className="relative">
                      <Lock className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                      <Input
                        id="password"
                        type="password"
                        placeholder="••••••••"
                        className="pr-10"
                        value={loginPassword}
                        onChange={e => setLoginPassword(e.target.value)}
                        required
                      />
                    </div>
                  </div>
                  <Button type="submit" className="w-full" size="lg">
                    تسجيل الدخول
                    <ArrowRight className="w-4 h-4 mr-2" />
                  </Button>
                </form>

                <div className="mt-6 pt-6 border-t">
                  <p className="text-xs text-center text-muted-foreground mb-3">دخول سريع للتجربة</p>
                  <div className="grid grid-cols-3 gap-2">
                    <Button type="button" variant="outline" size="sm" onClick={() => quickLogin('admin')}>
                      👨‍💼 أدمن
                    </Button>
                    <Button type="button" variant="outline" size="sm" onClick={() => quickLogin('teacher')}>
                      👨‍🏫 معلم
                    </Button>
                    <Button type="button" variant="outline" size="sm" onClick={() => quickLogin('student')}>
                      🧑‍🎓 طالب
                    </Button>
                  </div>
                </div>
              </TabsContent>

              {/* Register Tab */}
              <TabsContent value="register">
                <form onSubmit={handleRegister} className="space-y-4">
                  <div className="space-y-2">
                    <Label>نوع الحساب</Label>
                    <div className="grid grid-cols-2 gap-2">
                      <Button
                        type="button"
                        variant={regRole === 'student' ? 'default' : 'outline'}
                        onClick={() => setRegRole('student')}
                      >
                        🧑‍🎓 طالب
                      </Button>
                      <Button
                        type="button"
                        variant={regRole === 'teacher' ? 'default' : 'outline'}
                        onClick={() => setRegRole('teacher')}
                      >
                        👨‍🏫 معلم
                      </Button>
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="name">الاسم الكامل</Label>
                    <div className="relative">
                      <UserIcon className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                      <Input
                        id="name"
                        placeholder="الاسم"
                        className="pr-10"
                        value={regName}
                        onChange={e => setRegName(e.target.value)}
                        required
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-3">
                    <div className="space-y-2">
                      <Label htmlFor="email">البريد</Label>
                      <div className="relative">
                        <Mail className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                        <Input
                          id="email"
                          type="email"
                          placeholder="email@example.com"
                          className="pr-10"
                          value={regEmail}
                          onChange={e => setRegEmail(e.target.value)}
                          required
                        />
                      </div>
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="phone">الهاتف</Label>
                      <div className="relative">
                        <Phone className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                        <Input
                          id="phone"
                          placeholder="01000000000"
                          className="pr-10"
                          value={regPhone}
                          onChange={e => setRegPhone(e.target.value)}
                        />
                      </div>
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="regpassword">كلمة المرور</Label>
                    <div className="relative">
                      <Lock className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                      <Input
                        id="regpassword"
                        type="password"
                        placeholder="••••••••"
                        className="pr-10"
                        value={regPassword}
                        onChange={e => setRegPassword(e.target.value)}
                        required
                      />
                    </div>
                  </div>

                  {regRole === 'student' && (
                    <div className="grid grid-cols-2 gap-3">
                      <div className="space-y-2">
                        <Label>المرحلة</Label>
                        <div className="grid grid-cols-2 gap-1">
                          {stages.map(s => (
                            <Button
                              key={s.id}
                              type="button"
                              size="sm"
                              variant={regStage === s.id ? 'default' : 'outline'}
                              onClick={() => setRegStage(s.id)}
                            >
                              {s.id === 'middle' ? 'إعدادي' : 'ثانوي'}
                            </Button>
                          ))}
                        </div>
                      </div>
                      <div className="space-y-2">
                        <Label>السنة</Label>
                        <div className="grid grid-cols-3 gap-1">
                          {stages.find(s => s.id === regStage)?.years.map(y => (
                            <Button
                              key={y.id}
                              type="button"
                              size="sm"
                              variant={regYear === y.id ? 'default' : 'outline'}
                              onClick={() => setRegYear(y.id)}
                            >
                              {y.id === 'first' ? '1' : y.id === 'second' ? '2' : '3'}
                            </Button>
                          ))}
                        </div>
                      </div>
                    </div>
                  )}

                  {regRole === 'teacher' && (
                    <div className="space-y-2">
                      <Label htmlFor="bio">نبذة تعريفية</Label>
                      <Input
                        id="bio"
                        placeholder="مدرس رياضيات متخصص في..."
                        value={regBio}
                        onChange={e => setRegBio(e.target.value)}
                      />
                    </div>
                  )}

                  <Button type="submit" className="w-full" size="lg">
                    إنشاء الحساب
                    <Sparkles className="w-4 h-4 mr-2" />
                  </Button>
                </form>
              </TabsContent>
            </Tabs>

            <div className="mt-6 text-center">
              <Button variant="link" onClick={() => setView('landing')}>
                العودة للرئيسية
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
