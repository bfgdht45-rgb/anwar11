import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db';

export async function POST(request: NextRequest) {
  try {
    const { email, password } = await request.json();

    // استخدام raw SQL بدل Prisma model
    const users = await db.$queryRaw`
      SELECT id, email, password, name, role, avatar, phone, bio, rating,
             "studentsCount", "lessonsCount", "totalEarnings", specialties,
             stage, year, "subscriptionStatus", "subscriptionExpiry",
             "completedLessons", favorites, "createdAt"
      FROM "User"
      WHERE email = ${email.toLowerCase()}
      LIMIT 1
    ` as any[];

    const user = users[0];

    if (!user || user.password !== password) {
      return NextResponse.json({ error: 'البريد الإلكتروني أو كلمة المرور غير صحيحة' }, { status: 401 });
    }

    return NextResponse.json({
      user: {
        id: user.id,
        email: user.email,
        name: user.name,
        role: user.role.toLowerCase(),
        avatar: user.avatar,
        phone: user.phone,
        bio: user.bio,
        rating: user.rating,
        studentsCount: user.studentsCount,
        lessonsCount: user.lessonsCount,
        totalEarnings: user.totalEarnings,
        specialties: user.specialties,
        stage: user.stage,
        year: user.year,
        subscriptionStatus: user.subscriptionStatus,
        subscriptionExpiry: user.subscriptionExpiry,
        completedLessons: user.completedLessons,
        favorites: user.favorites,
        createdAt: user.createdAt,
      }
    });
  } catch (error) {
    console.error('Login error:', error);
    return NextResponse.json({ error: 'فشل تسجيل الدخول: ' + (error instanceof Error ? error.message : '') }, { status: 500 });
  }
}
