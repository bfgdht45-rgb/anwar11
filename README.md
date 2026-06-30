# 📐 أكاديمية الرياضيات - منصة تعليمية احترافية

منصة تعليمية متكاملة لمادة الرياضيات للمرحلتين الإعدادية والثانوية، مبنية بأحدث التقنيات مع دعم كامل للغة العربية واتجاه RTL.

![Next.js](https://img.shields.io/badge/Next.js-16-black)
![TypeScript](https://img.shields.io/badge/TypeScript-5-blue)
![Tailwind CSS](https://img.shields.io/badge/Tailwind-4-06B6D4)
![License](https://img.shields.io/badge/License-MIT-green)

## ✨ المميزات الرئيسية

### 👥 ثلاثة أنواع حسابات
- **مدير النظام (Admin)**: 17 قسم لإدارة كاملة للمنصة
- **معلم (Teacher)**: 11 قسم لإدارة الدروس والطلاب
- **طالب (Student)**: 10 أقسام للتعلم والمتابعة

### 🎯 الميزات التعليمية
- 📹 فيديوهات من 6 مصادر (YouTube, Vimeo, رفع مباشر, Google Drive, Cloudflare Stream, Bunny Stream) مع منع التحميل
- 📄 ملفات PDF قابلة للعرض والتحميل (حسب الصلاحية)
- 📝 واجبات بـ 5 أنواع أسئلة (MCQ، صح/خطأ، أكمل، مقالي، صورة)
- 💻 **امتحانات تفاعلية HTML** - محرر كود مدمج لإنشاء امتحانات مخصصة
- 📊 متابعة الدرجات ونسبة الإنجاز
- 🏆 شهادات إتمام معتمدة
- ⭐ قائمة المفضلة
- 💬 نظام تعليقات مع تقييم

### 🛠️ ميزات إدارية
- 📊 لوحة تحكم احترافية مع رسوم بيانية
- 👨‍🏫 إدارة المعلمين والطلاب
- 📚 إدارة الدروس والوحدات
- 💳 نظام اشتراكات ومدفوعات إلكترونية
- 🎟️ كوبونات خصم
- 🔔 نظام إشعارات
- 🗄️ بنك أسئلة
- 📈 إحصائيات تفصيلية

## 🚀 التقنيات المستخدمة

- **Framework**: Next.js 16 (App Router)
- **Language**: TypeScript 5
- **Styling**: Tailwind CSS 4 + shadcn/ui
- **State Management**: Zustand
- **Animations**: Framer Motion
- **Charts**: Recharts
- **Icons**: Lucide React
- **Fonts**: Cairo + Tajawal (Google Fonts)

## 📦 التثبيت والتشغيل

### المتطلبات
- Node.js 18+ أو Bun
- npm/yarn/bun

### الخطوات

```bash
# 1. استنساخ المشروع
git clone https://github.com/USERNAME/REPO_NAME.git
cd REPO_NAME

# 2. تثبيت الحزم
npm install
# أو
bun install

# 3. إنشاء ملف البيئة
cp .env.example .env
# قم بتعديل DATABASE_URL حسب احتياجك

# 4. تشغيل قاعدة البيانات (Prisma)
npx prisma db push

# 5. تشغيل المشروع محلياً
npm run dev
# أو
bun run dev
```

افتح المتصفح على `http://localhost:3000`

## 🔑 بيانات الدخول للتجربة

| النوع | البريد الإلكتروني | كلمة المرور |
|------|-------------------|-------------|
| 👨‍💼 أدمن | admin@math.com | admin123 |
| 👨‍🏫 معلم | teacher@math.com | teacher123 |
| 🧑‍🎓 طالب | student@math.com | student123 |

> أو استخدم أزرار "دخول سريع" في صفحة تسجيل الدخول

## 🌐 النشر على Vercel

### الطريقة الأولى: عبر الموقع

1. ارفع المشروع على GitHub
2. اذهب إلى [vercel.com](https://vercel.com)
3. اضغط "New Project" واختر المستودع
4. أضف متغيرات البيئة:
   - `DATABASE_URL` - رابط قاعدة البيانات
5. اضغط "Deploy"

### الطريقة الثانية: عبر Vercel CLI

```bash
# تثبيت Vercel CLI
npm i -g vercel

# تسجيل الدخول
vercel login

# النشر
vercel
```

> ⚠️ **ملاحظة**: للحصول على قاعدة بيانات سحابية، استخدم:
> - [Vercel Postgres](https://vercel.com/docs/storage/vercel-postgres)
> - [PlanetScale](https://planetscale.com)
> - [Supabase](https://supabase.com)
> - [Neon](https://neon.tech)

## 📁 بنية المشروع

```
src/
├── app/                    # Next.js App Router
│   ├── layout.tsx          # Layout الرئيسي (RTL + خطوط)
│   ├── page.tsx            # الموجه الرئيسي
│   └── globals.css         # الأنماط العامة
├── components/
│   ├── admin/              # لوحة الأدمن
│   ├── teacher/            # لوحة المعلم
│   ├── student/            # لوحة الطالب
│   ├── auth/               # المصادقة
│   ├── landing/            # الصفحة الرئيسية
│   ├── lesson/             # صفحة الدرس
│   └── shared/             # مكونات مشتركة
├── lib/
│   ├── types.ts            # أنواع TypeScript
│   ├── data.ts             # بيانات تجريبية
│   └── store.ts            # Zustand store
└── components/ui/          # مكونات shadcn/ui
```

## 🎨 التخصيص

### تغيير الألوان
عدّل المتغيرات في `src/app/globals.css`:
```css
:root {
  --primary: oklch(0.45 0.13 165);  /* الأخضر الزمردي */
  --accent: oklch(0.93 0.05 80);    /* الذهبي */
}
```

### إضافة محتوى
عدّل البيانات التجريبية في `src/lib/data.ts` أو اربط قاعدة بيانات حقيقية عبر Prisma.

## 📝 الترخيص

MIT License - حر للاستخدام التعليمي والتجاري.

## 🤞 الدعم

لأي استفسار أو مشكلة، تواصل عبر:
- 📧 البريد: info@math.com
- 📱 الهاتف: 01000000000
