import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { UserRole } from '@prisma/client';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();

    const existing = await db.user.findUnique({ where: { email: body.email.toLowerCase() } });
    if (existing) {
      return NextResponse.json({ error: 'البريد الإلكتروني مستخدم بالفعل' }, { status: 400 });
    }

    const user = await db.user.create({
      data: {
        email: body.email.toLowerCase(),
        password: body.password,
        name: body.name,
        role: (body.role?.toUpperCase() || 'STUDENT') as UserRole,
        avatar: body.role === 'teacher' ? '👨‍🏫' : '🧑‍🎓',
        phone: body.phone,
        bio: body.bio,
        stage: body.stage,
        year: body.year,
        subscriptionStatus: body.role === 'student' ? 'pending' : null,
      },
    });

    return NextResponse.json({
      user: {
        id: user.id, email: user.email, name: user.name,
        role: user.role.toLowerCase(), avatar: user.avatar,
        stage: user.stage, year: user.year,
        subscriptionStatus: user.subscriptionStatus,
        completedLessons: user.completedLessons, favorites: user.favorites,
        createdAt: user.createdAt,
      }
    }, { status: 201 });
  } catch (error) {
    console.error('Register error:', error);
    return NextResponse.json({ error: 'فشل في إنشاء الحساب' }, { status: 500 });
  }
}
