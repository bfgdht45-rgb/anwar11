'use client';

import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion';
import { useStore } from '@/lib/store';
import { demoReviews, demoFAQ, demoStats, demoSubscriptions, stages } from '@/lib/data';
import {
  Calculator, Users, BookOpen, Award, Star, Play, ChevronLeft, ChevronRight,
  GraduationCap, Trophy, TrendingUp, Heart, Mail, Phone, MapPin, Facebook,
  Twitter, Youtube, Instagram, Menu, X, Moon, Sun, Sparkles, ArrowLeft,
  MessageCircle, CheckCircle2, Clock, FileText, Video
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

const slides = [
  {
    title: 'تعلم الرياضيات بطريقة تفاعلية وممتعة',
    subtitle: 'منصة متكاملة تربط الطالب بالمعلم بأحدث الأساليب التعليمية',
    badge: 'المنصة الأولى في الوطن العربي',
    icon: '📐',
    gradient: 'from-emerald-600 via-teal-600 to-cyan-600',
  },
  {
    title: 'امتحانات تفاعلية بـ HTML مخصصة',
    subtitle: 'كود HTML الخاص بك يتحول إلى امتحان تفاعلي كامل التصحيح',
    badge: 'ميزة حصرية',
    icon: '💻',
    gradient: 'from-amber-500 via-orange-500 to-red-500',
  },
  {
    title: 'متابعة لحظية لتقدم الطالب',
    subtitle: 'إحصائيات مفصلة، درجات، نسبة إنجاز، وشهادات معتمدة',
    badge: 'تتبع ذكي',
    icon: '📊',
    gradient: 'from-purple-600 via-fuchsia-600 to-pink-600',
  },
];

const statsCards = [
  { label: 'عدد الطلاب', value: demoStats.totalStudents, icon: Users, color: 'text-emerald-600' },
  { label: 'عدد الدروس', value: demoStats.totalLessons, icon: BookOpen, color: 'text-amber-600' },
  { label: 'عدد المعلمين', value: demoStats.totalTeachers, icon: GraduationCap, color: 'text-purple-600' },
  { label: 'عدد الامتحانات', value: demoStats.totalExams, icon: Award, color: 'text-rose-600' },
];

export default function Landing() {
  const { setView, currentUser, logout, theme, toggleTheme, setBrowseContext } = useStore();
  const [currentSlide, setCurrentSlide] = useState(0);
  const [menuOpen, setMenuOpen] = useState(false);

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentSlide(s => (s + 1) % slides.length);
    }, 5000);
    return () => clearInterval(interval);
  }, []);

  const nextSlide = () => setCurrentSlide(s => (s + 1) % slides.length);
  const prevSlide = () => setCurrentSlide(s => (s - 1 + slides.length) % slides.length);

  return (
    <div className="min-h-screen flex flex-col bg-background">
      {/* ===== Header ===== */}
      <header className="sticky top-0 z-50 glass border-b border-border/40">
        <div className="container mx-auto px-4 py-3 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-emerald-500 to-teal-600 flex items-center justify-center text-white">
              <Calculator className="w-6 h-6" />
            </div>
            <div>
              <h1 className="font-bold text-lg leading-tight">أكاديمية الرياضيات</h1>
              <p className="text-xs text-muted-foreground">الإعدادية والثانوية</p>
            </div>
          </div>

          {/* Desktop Nav */}
          <nav className="hidden md:flex items-center gap-1">
            <Button variant="ghost" size="sm" onClick={() => document.getElementById('home')?.scrollIntoView({ behavior: 'smooth' })}>الرئيسية</Button>
            <Button variant="ghost" size="sm" onClick={() => document.getElementById('stages')?.scrollIntoView({ behavior: 'smooth' })}>المراحل</Button>
            <Button variant="ghost" size="sm" onClick={() => document.getElementById('teachers')?.scrollIntoView({ behavior: 'smooth' })}>المدرسون</Button>
            <Button variant="ghost" size="sm" onClick={() => document.getElementById('pricing')?.scrollIntoView({ behavior: 'smooth' })}>الأسعار</Button>
            <Button variant="ghost" size="sm" onClick={() => document.getElementById('faq')?.scrollIntoView({ behavior: 'smooth' })}>الأسئلة</Button>
            <Button variant="ghost" size="sm" onClick={() => document.getElementById('contact')?.scrollIntoView({ behavior: 'smooth' })}>تواصل</Button>
          </nav>

          <div className="flex items-center gap-2">
            <Button variant="ghost" size="icon" onClick={toggleTheme} aria-label="تبديل الوضع">
              {theme === 'light' ? <Moon className="w-5 h-5" /> : <Sun className="w-5 h-5" />}
            </Button>
            {currentUser ? (
              <div className="flex items-center gap-2">
                <Button onClick={() => setView(`${currentUser.role}-dashboard` as any)} size="sm">
                  لوحة التحكم
                </Button>
                <Button variant="outline" size="sm" onClick={logout}>خروج</Button>
              </div>
            ) : (
              <>
                <Button variant="ghost" size="sm" onClick={() => setView('login')} className="hidden sm:inline-flex">تسجيل الدخول</Button>
                <Button size="sm" onClick={() => setView('register')} className="hidden sm:inline-flex">إنشاء حساب</Button>
              </>
            )}
            <Button variant="ghost" size="icon" className="md:hidden" onClick={() => setMenuOpen(!menuOpen)}>
              {menuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </Button>
          </div>
        </div>

        {/* Mobile Menu */}
        <AnimatePresence>
          {menuOpen && (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: 'auto', opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              className="md:hidden overflow-hidden border-t bg-background"
            >
              <div className="p-4 space-y-2">
                {!currentUser && (
                  <div className="flex gap-2 pb-2 border-b">
                    <Button className="flex-1" size="sm" onClick={() => { setView('login'); setMenuOpen(false); }}>دخول</Button>
                    <Button className="flex-1" variant="outline" size="sm" onClick={() => { setView('register'); setMenuOpen(false); }}>حساب جديد</Button>
                  </div>
                )}
                {['home', 'stages', 'teachers', 'pricing', 'faq', 'contact'].map(item => (
                  <Button key={item} variant="ghost" className="w-full justify-start" onClick={() => {
                    document.getElementById(item)?.scrollIntoView({ behavior: 'smooth' });
                    setMenuOpen(false);
                  }}>
                    {item === 'home' ? 'الرئيسية' : item === 'stages' ? 'المراحل' : item === 'teachers' ? 'المدرسون' : item === 'pricing' ? 'الأسعار' : item === 'faq' ? 'الأسئلة' : 'تواصل'}
                  </Button>
                ))}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </header>

      {/* ===== Hero Slider ===== */}
      <section id="home" className="relative">
        <div className="relative h-[500px] md:h-[600px] overflow-hidden">
          <AnimatePresence mode="wait">
            <motion.div
              key={currentSlide}
              initial={{ opacity: 0, x: 50 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -50 }}
              transition={{ duration: 0.6 }}
              className={`absolute inset-0 bg-gradient-to-br ${slides[currentSlide].gradient} flex items-center justify-center`}
            >
              <div className="absolute inset-0 grid-pattern opacity-30" />
              <div className="container mx-auto px-4 relative z-10 text-center text-white">
                <Badge className="mb-4 bg-white/20 backdrop-blur-sm text-white border-white/30 hover:bg-white/30">
                  <Sparkles className="w-3.5 h-3.5 ml-1" />
                  {slides[currentSlide].badge}
                </Badge>
                <div className="text-6xl md:text-8xl mb-6 animate-float">{slides[currentSlide].icon}</div>
                <h2 className="text-3xl md:text-5xl font-bold mb-4 leading-tight">{slides[currentSlide].title}</h2>
                <p className="text-lg md:text-xl mb-8 text-white/90 max-w-2xl mx-auto">{slides[currentSlide].subtitle}</p>
                <div className="flex flex-wrap gap-3 justify-center">
                  <Button size="lg" variant="secondary" onClick={() => setView('register')}>
                    ابدأ التعلم الآن
                    <ArrowLeft className="w-4 h-4 mr-2" />
                  </Button>
                  <Button size="lg" variant="outline" className="bg-white/10 backdrop-blur-sm text-white border-white/30 hover:bg-white/20"
                    onClick={() => document.getElementById('stages')?.scrollIntoView({ behavior: 'smooth' })}>
                    <Play className="w-4 h-4 ml-2" />
                    استكشف المراحل
                  </Button>
                </div>
              </div>
            </motion.div>
          </AnimatePresence>

          {/* Slider Controls */}
          <button onClick={prevSlide} aria-label="السابق"
            className="absolute right-4 top-1/2 -translate-y-1/2 w-10 h-10 rounded-full bg-white/20 backdrop-blur-sm hover:bg-white/30 flex items-center justify-center text-white transition">
            <ChevronRight className="w-6 h-6" />
          </button>
          <button onClick={nextSlide} aria-label="التالي"
            className="absolute left-4 top-1/2 -translate-y-1/2 w-10 h-10 rounded-full bg-white/20 backdrop-blur-sm hover:bg-white/30 flex items-center justify-center text-white transition">
            <ChevronLeft className="w-6 h-6" />
          </button>

          {/* Dots */}
          <div className="absolute bottom-6 left-1/2 -translate-x-1/2 flex gap-2">
            {slides.map((_, i) => (
              <button key={i} onClick={() => setCurrentSlide(i)}
                className={`h-2 rounded-full transition-all ${i === currentSlide ? 'w-8 bg-white' : 'w-2 bg-white/50'}`} />
            ))}
          </div>
        </div>
      </section>

      {/* ===== Stats ===== */}
      <section className="py-16 -mt-12 relative z-10">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {statsCards.map((stat, i) => (
              <motion.div
                key={stat.label}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.1 }}
                viewport={{ once: true }}
              >
                <Card className="text-center hover:shadow-lg transition-shadow">
                  <CardContent className="pt-6">
                    <stat.icon className={`w-10 h-10 mx-auto mb-3 ${stat.color}`} />
                    <div className="text-3xl font-bold mb-1">{stat.value.toLocaleString('ar-EG')}+</div>
                    <div className="text-sm text-muted-foreground">{stat.label}</div>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ===== Stages ===== */}
      <section id="stages" className="py-16 bg-muted/30">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <Badge variant="outline" className="mb-3">المراحل الدراسية</Badge>
            <h2 className="text-3xl md:text-4xl font-bold mb-3">اختر مرحلتك الدراسية</h2>
            <p className="text-muted-foreground max-w-2xl mx-auto">
              نقدم محتوى تعليمي شامل لجميع المراحل، مصمم بعناية وفق المناهج الرسمية بأشراف نخبة من المدرسين
            </p>
          </div>
          <div className="grid md:grid-cols-2 gap-6">
            {stages.map(stage => (
              <Card key={stage.id} className="overflow-hidden hover:shadow-xl transition-all hover:-translate-y-1">
                <div className="bg-gradient-to-br from-emerald-500/10 to-teal-600/10 p-6">
                  <div className="text-5xl mb-4">{stage.icon}</div>
                  <h3 className="text-2xl font-bold mb-2">{stage.name}</h3>
                  <p className="text-muted-foreground mb-4">{stage.nameEn}</p>
                  <div className="grid grid-cols-3 gap-2">
                    {stage.years.map(year => (
                      <Button key={year.id} variant="outline" className="h-auto py-3 flex-col gap-1"
                        onClick={() => setBrowseContext({ stageId: stage.id, yearId: year.id })}>
                        <span className="text-xl">{year.icon}</span>
                        <span className="text-xs">{year.name}</span>
                      </Button>
                    ))}
                  </div>
                </div>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* ===== Top Teachers ===== */}
      <section id="teachers" className="py-16">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <Badge variant="outline" className="mb-3">أفضل المدرسين</Badge>
            <h2 className="text-3xl md:text-4xl font-bold mb-3">نخبة من المعلمين المعتمدين</h2>
            <p className="text-muted-foreground max-w-2xl mx-auto">
              فريق من المدرسين المتخصصين بخبرات تتجاوز 15 عاماً في تدريس الرياضيات
            </p>
          </div>
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {useStore(s => s.users).filter(u => u.role === 'teacher').map(teacher => (
              <Card key={teacher.id} className="overflow-hidden hover:shadow-xl transition-all hover:-translate-y-1 text-center">
                <div className="bg-gradient-to-br from-emerald-500/20 to-teal-600/20 p-6">
                  <Avatar className="w-24 h-24 mx-auto mb-4 text-4xl bg-background">
                    <AvatarFallback className="text-4xl">{teacher.avatar}</AvatarFallback>
                  </Avatar>
                  <h3 className="font-bold text-lg mb-1">{teacher.name}</h3>
                  <div className="flex items-center justify-center gap-1 mb-3">
                    <Star className="w-4 h-4 fill-amber-400 text-amber-400" />
                    <span className="text-sm font-medium">{teacher.rating || 5}</span>
                    <span className="text-xs text-muted-foreground">({teacher.studentsCount} طالب)</span>
                  </div>
                  <p className="text-xs text-muted-foreground mb-3 line-clamp-2">{teacher.bio}</p>
                  <div className="flex flex-wrap gap-1 justify-center">
                    {teacher.specialties?.slice(0, 3).map(spec => (
                      <Badge key={spec} variant="secondary" className="text-xs">{spec}</Badge>
                    ))}
                  </div>
                </div>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* ===== Features ===== */}
      <section className="py-16 bg-muted/30">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <Badge variant="outline" className="mb-3">مميزات المنصة</Badge>
            <h2 className="text-3xl md:text-4xl font-bold mb-3">كل ما تحتاجه في مكان واحد</h2>
          </div>
          <div className="grid md:grid-cols-3 gap-6">
            {[
              { icon: Video, title: 'فيديوهات احترافية', desc: 'فيديوهات بجودة عالية من YouTube، Vimeo، ورفع مباشر، مع منع التحميل لحماية المحتوى', color: 'text-red-500' },
              { icon: FileText, title: 'ملفات PDF تفاعلية', desc: 'عرض ملفات PDF داخل المنصة وإمكانية التحميل حسب صلاحية الأدمن', color: 'text-blue-500' },
              { icon: Award, title: 'امتحانات تفاعلية', desc: 'امتحانات HTML مخصصة بالكود الخاص بك، تصحيح تلقائي، تحديد زمن، ومنع الرجوع', color: 'text-amber-500' },
              { icon: TrendingUp, title: 'متابعة التقدم', desc: 'إحصائيات مفصلة عن نسبة الإنجاز، الدرجات، والواجبات', color: 'text-emerald-500' },
              { icon: Trophy, title: 'شهادات معتمدة', desc: 'شهادات إتمام معتمدة بعد اجتياز الامتحانات بنجاح', color: 'text-purple-500' },
              { icon: Heart, title: 'قائمة المفضلة', desc: 'احفظ الدروس المهمة وراجعها في أي وقت', color: 'text-rose-500' },
            ].map((f, i) => (
              <motion.div key={f.title}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.1 }}
                viewport={{ once: true }}>
                <Card className="h-full hover:shadow-lg transition-shadow">
                  <CardContent className="pt-6">
                    <f.icon className={`w-12 h-12 mb-4 ${f.color}`} />
                    <h3 className="font-bold text-lg mb-2">{f.title}</h3>
                    <p className="text-muted-foreground text-sm">{f.desc}</p>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ===== Reviews ===== */}
      <section className="py-16">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <Badge variant="outline" className="mb-3">آراء الطلاب</Badge>
            <h2 className="text-3xl md:text-4xl font-bold mb-3">ماذا يقول طلابنا؟</h2>
          </div>
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {demoReviews.map((review, i) => (
              <motion.div key={review.id}
                initial={{ opacity: 0, scale: 0.95 }}
                whileInView={{ opacity: 1, scale: 1 }}
                transition={{ delay: i * 0.1 }}
                viewport={{ once: true }}>
                <Card className="h-full">
                  <CardContent className="pt-6">
                    <div className="flex items-center gap-3 mb-4">
                      <Avatar className="text-2xl">
                        <AvatarFallback className="text-2xl">{review.avatar}</AvatarFallback>
                      </Avatar>
                      <div>
                        <div className="font-semibold">{review.studentName}</div>
                        <div className="text-xs text-muted-foreground">{review.stage}</div>
                      </div>
                    </div>
                    <div className="flex gap-0.5 mb-3">
                      {Array.from({ length: 5 }).map((_, idx) => (
                        <Star key={idx} className={`w-4 h-4 ${idx < review.rating ? 'fill-amber-400 text-amber-400' : 'text-muted-foreground'}`} />
                      ))}
                    </div>
                    <p className="text-sm text-muted-foreground leading-relaxed">{review.text}</p>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ===== Pricing ===== */}
      <section id="pricing" className="py-16 bg-muted/30">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <Badge variant="outline" className="mb-3">باقات الاشتراك</Badge>
            <h2 className="text-3xl md:text-4xl font-bold mb-3">اختر الباقة المناسبة لك</h2>
            <p className="text-muted-foreground">باقات مرنة تناسب جميع الاحتياجات والمدفوعات الإلكترونية الآمنة</p>
          </div>
          <div className="grid md:grid-cols-3 gap-6 max-w-5xl mx-auto">
            {demoSubscriptions.map(sub => (
              <Card key={sub.id} className={`relative ${sub.popular ? 'border-emerald-500 shadow-xl scale-105' : ''}`}>
                {sub.popular && (
                  <Badge className="absolute -top-3 right-1/2 translate-x-1/2 bg-emerald-600">الأكثر شيوعاً</Badge>
                )}
                <CardContent className="pt-6">
                  <h3 className="font-bold text-xl mb-1">{sub.name}</h3>
                  <p className="text-muted-foreground text-sm mb-4">{sub.duration}</p>
                  <div className="mb-6">
                    <span className="text-4xl font-bold">{sub.price}</span>
                    <span className="text-muted-foreground"> ج.م</span>
                  </div>
                  <ul className="space-y-2 mb-6">
                    {sub.features.map(f => (
                      <li key={f} className="flex items-start gap-2 text-sm">
                        <CheckCircle2 className="w-4 h-4 text-emerald-500 mt-0.5 shrink-0" />
                        <span>{f}</span>
                      </li>
                    ))}
                  </ul>
                  <Button className="w-full" variant={sub.popular ? 'default' : 'outline'} onClick={() => setView('register')}>
                    اشترك الآن
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* ===== FAQ ===== */}
      <section id="faq" className="py-16">
        <div className="container mx-auto px-4 max-w-3xl">
          <div className="text-center mb-12">
            <Badge variant="outline" className="mb-3">الأسئلة الشائعة</Badge>
            <h2 className="text-3xl md:text-4xl font-bold mb-3">لديك سؤال؟</h2>
          </div>
          <Accordion type="single" collapsible className="space-y-3">
            {demoFAQ.map(faq => (
              <AccordionItem key={faq.id} value={faq.id} className="border rounded-lg px-4 bg-card">
                <AccordionTrigger className="text-right hover:no-underline">
                  {faq.question}
                </AccordionTrigger>
                <AccordionContent className="text-muted-foreground leading-relaxed">
                  {faq.answer}
                </AccordionContent>
              </AccordionItem>
            ))}
          </Accordion>
        </div>
      </section>

      {/* ===== Contact ===== */}
      <section id="contact" className="py-16 bg-muted/30">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <Badge variant="outline" className="mb-3">وسائل التواصل</Badge>
            <h2 className="text-3xl md:text-4xl font-bold mb-3">تواصل معنا</h2>
            <p className="text-muted-foreground">فريق الدعم جاهز لمساعدتك في أي وقت</p>
          </div>
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 max-w-5xl mx-auto">
            {[
              { icon: Phone, title: 'اتصل بنا', value: '01000000000', desc: 'من 9 صباحاً حتى 9 مساءً', link: 'tel:01000000000' },
              { icon: MessageCircle, title: 'واتساب', value: '01000000000', desc: 'راسلنا على واتساب', link: 'https://wa.me/201000000000' },
              { icon: Mail, title: 'البريد الإلكتروني', value: 'info@math.com', desc: 'نرد خلال 24 ساعة', link: 'mailto:info@math.com' },
              { icon: MapPin, title: 'العنوان', value: 'القاهرة، مصر', desc: 'جمهورية مصر العربية', link: '#' },
            ].map(item => (
              <Card key={item.title} className="hover:shadow-lg transition-shadow">
                <CardContent className="pt-6 text-center">
                  <a href={item.link} target={item.link.startsWith('http') ? '_blank' : undefined} rel="noopener noreferrer">
                    <item.icon className="w-10 h-10 mx-auto mb-3 text-emerald-600" />
                    <h3 className="font-bold mb-1">{item.title}</h3>
                    <p className="text-emerald-600 font-medium">{item.value}</p>
                    <p className="text-xs text-muted-foreground mt-1">{item.desc}</p>
                  </a>
                </CardContent>
              </Card>
            ))}
          </div>
          <div className="flex justify-center gap-3 mt-8">
            <Button variant="outline" size="icon" className="rounded-full" asChild>
              <a href="https://facebook.com" target="_blank" rel="noopener noreferrer"><Facebook className="w-5 h-5" /></a>
            </Button>
            <Button variant="outline" size="icon" className="rounded-full" asChild>
              <a href="https://wa.me/201000000000" target="_blank" rel="noopener noreferrer"><MessageCircle className="w-5 h-5" /></a>
            </Button>
            <Button variant="outline" size="icon" className="rounded-full" asChild>
              <a href="https://youtube.com" target="_blank" rel="noopener noreferrer"><Youtube className="w-5 h-5" /></a>
            </Button>
          </div>
        </div>
      </section>

      {/* ===== Footer ===== */}
      <footer className="bg-card border-t mt-auto">
        <div className="container mx-auto px-4 py-10">
          <div className="grid md:grid-cols-4 gap-8">
            <div>
              <div className="flex items-center gap-2 mb-4">
                <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-emerald-500 to-teal-600 flex items-center justify-center text-white">
                  <Calculator className="w-6 h-6" />
                </div>
                <h3 className="font-bold text-lg">أكاديمية الرياضيات</h3>
              </div>
              <p className="text-sm text-muted-foreground">
                منصة تعليمية متكاملة لمادة الرياضيات للمرحلتين الإعدادية والثانوية، نهدف لتبسيط الرياضيات وجعلها ممتعة.
              </p>
            </div>
            <div>
              <h4 className="font-bold mb-3">روابط سريعة</h4>
              <ul className="space-y-2 text-sm text-muted-foreground">
                <li><Button variant="link" className="p-0 h-auto" onClick={() => document.getElementById('home')?.scrollIntoView()}>الرئيسية</Button></li>
                <li><Button variant="link" className="p-0 h-auto" onClick={() => document.getElementById('stages')?.scrollIntoView()}>المراحل</Button></li>
                <li><Button variant="link" className="p-0 h-auto" onClick={() => document.getElementById('pricing')?.scrollIntoView()}>الأسعار</Button></li>
                <li><Button variant="link" className="p-0 h-auto" onClick={() => document.getElementById('faq')?.scrollIntoView()}>الأسئلة</Button></li>
              </ul>
            </div>
            <div>
              <h4 className="font-bold mb-3">المراحل</h4>
              <ul className="space-y-2 text-sm text-muted-foreground">
                <li>الإعدادية - الأولى</li>
                <li>الإعدادية - الثانية</li>
                <li>الثانوية - الأولى</li>
                <li>الثانوية - الثانية</li>
              </ul>
            </div>
            <div>
              <h4 className="font-bold mb-3">طرق الدفع</h4>
              <div className="flex flex-wrap gap-2">
                <Badge variant="secondary">Visa</Badge>
                <Badge variant="secondary">Mastercard</Badge>
                <Badge variant="secondary">PayPal</Badge>
                <Badge variant="secondary">فودافون كاش</Badge>
                <Badge variant="secondary">فوري</Badge>
              </div>
            </div>
          </div>
          <div className="mt-8 pt-6 border-t text-center text-sm text-muted-foreground">
            © {new Date().getFullYear()} أكاديمية الرياضيات. جميع الحقوق محفوظة.
          </div>
        </div>
      </footer>
    </div>
  );
}
