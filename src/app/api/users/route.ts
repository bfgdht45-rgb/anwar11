import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db';

// GET /api/users
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const role = searchParams.get('role');
    const where: any = {};
    if (role) where.role = role.toUpperCase();

    const users = await db.user.findMany({
      where,
      select: {
        id: true,
        email: true,
        name: true,
        role: true,
        avatar: true,
        phone: true,
        bio: true,
        rating: true,
        studentsCount: true,
        lessonsCount: true,
        totalEarnings: true,
        specialties: true,
        stage: true,
        year: true,
        subscriptionStatus: true,
        subscriptionExpiry: true,
        completedLessons: true,
        favorites: true,
        createdAt: true,
      },
      orderBy: { createdAt: 'desc' },
    });
    // تحويل role لحروف صغيرة للتوافق مع الـ frontend
    const normalizedUsers = users.map(u => ({ ...u, role: u.role.toLowerCase() }));
    return NextResponse.json({ users: normalizedUsers });
  } catch (error) {
    console.error('GET /api/users error:', error);
    return NextResponse.json({ error: 'فشل في جلب المستخدمين' }, { status: 500 });
  }
}

// POST /api/users - إضافة مستخدم (للأدمن)
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const user = await db.user.create({
      data: {
        email: body.email,
        password: body.password || '123456',
        name: body.name,
        role: body.role?.toUpperCase() || 'STUDENT',
        avatar: body.avatar || '🧑',
        phone: body.phone,
        bio: body.bio,
        specialties: body.specialties || [],
        stage: body.stage,
        year: body.year,
      },
    });
    return NextResponse.json({ user: { ...user, password: undefined } }, { status: 201 });
  } catch (error) {
    console.error('POST /api/users error:', error);
    return NextResponse.json({ error: 'فشل في إنشاء المستخدم - ربما البريد مستخدم' }, { status: 500 });
  }
}
