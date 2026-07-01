# 📐 أكاديمية الرياضيات - منصة تعليمية احترافية

منصة تعليمية متكاملة لمادة الرياضيات للمرحلتين الإعدادية والثانوية.

## ✨ المميزات

- 👥 **3 أنواع حسابات**: أدمن، معلم، طالب
- 📹 **6 مصادر فيديو**: YouTube, Vimeo, رفع مباشر, Google Drive, Cloudflare Stream, Bunny Stream
- 📝 **امتحانات HTML تفاعلية**: اكتب كود HTML الخاص بك
- 💳 **نظام دفع إلكتروني**: بطاقة، PayPal، فودافون كاش، فوري
- 🏆 **شهادات معتمدة**
- 📊 **إحصائيات ومتابعة**
- 🔄 **Backend حقيقي**: PostgreSQL + Prisma + API Routes

## 🚀 التقنيات

- Next.js 16 + TypeScript
- Tailwind CSS 4 + shadcn/ui
- PostgreSQL + Prisma ORM
- Zustand + TanStack Query

## 📦 التثبيت

```bash
# 1. استنساخ المشروع
git clone https://github.com/bfgdht45-rgb/anwar11.git
cd anwar11

# 2. تثبيت الحزم
npm install

# 3. إعداد قاعدة البيانات
cp .env.example .env
# عدّل DATABASE_URL في .env برابط PostgreSQL الخاص بك

# 4. توليد Prisma Client
npx prisma generate

# 5. إنشاء الجداول في قاعدة البيانات
npx prisma db push

# 6. تعبئة البيانات الأولية (مستخدمين، دروس، امتحانات)
npm run db:seed

# 7. تشغيل المشروع
npm run dev
```

## 🔑 بيانات الدخول

| النوع | البريد | كلمة المرور |
|------|--------|------------|
| 👨‍💼 أدمن | admin@math.com | admin123 |
| 👨‍🏫 معلم | teacher@math.com | teacher123 |
| 🧑‍🎓 طالب | student@math.com | student123 |

## 🌐 النشر على Vercel

1. ارفع المشروع على GitHub
2. اذهب لـ [vercel.com/new](https://vercel.com/new)
3. اختر الـ repository
4. أضف Environment Variable:
   - `DATABASE_URL` = رابط PostgreSQL
5. اضغط **Deploy**
6. بعد النشر، شغّل seed script:
   ```bash
   npx prisma generate
   npx prisma db push
   npm run db:seed
   ```

## 📊 قاعدة البيانات

استخدم أحد المزودين التاليين (مجاني):
- [Vercel Postgres](https://vercel.com/docs/storage/vercel-postgres)
- [Neon](https://neon.tech)
- [Supabase](https://supabase.com)

## 📁 بنية المشروع

```
src/
├── app/
│   ├── api/              # API Routes (Backend)
│   │   ├── lessons/      # دروس
│   │   ├── exams/        # امتحانات
│   │   ├── users/        # مستخدمين
│   │   ├── auth/         # مصادقة
│   │   ├── comments/     # تعليقات
│   │   ├── grades/       # درجات
│   │   ├── payments/     # مدفوعات
│   │   ├── notifications/# إشعارات
│   │   ├── coupons/      # كوبونات
│   │   └── stats/        # إحصائيات
│   ├── layout.tsx
│   └── page.tsx
├── components/
│   ├── admin/            # لوحة الأدمن
│   ├── teacher/          # لوحة المعلم
│   ├── student/          # لوحة الطالب
│   ├── auth/             # مصادقة
│   ├── landing/          # الصفحة الرئيسية
│   ├── lesson/           # صفحة الدرس
│   └── shared/           # مكونات مشتركة
└── lib/
    ├── types.ts
    ├── store.ts          # Zustand (يتصل بـ API)
    └── db.ts             # Prisma client

scripts/
└── seed.ts               # تعبئة البيانات الأولية

prisma/
└── schema.prisma         # مخطط قاعدة البيانات
```

## 🎯 ملاحظات مهمة

- ✅ البيانات محفوظة في PostgreSQL (مش localStorage)
- ✅ كل المستخدمين يشفون نفس البيانات
- ✅ لما الأدمن يضيف درس، كل الطلاب يشوفوه فوراً
- ✅ لما المعلم يضيف امتحان، كل الطلاب يشوفوه
- ✅ النظام يدعم تعدد المستخدمين بشكل كامل

## 📝 الترخيص

MIT License
