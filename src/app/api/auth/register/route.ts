import { NextRequest, NextResponse } from 'next/server';
import { query } from '@/lib/db';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();

    // التحقق من عدم وجود المستخدم
    const existing = await query('SELECT id FROM "User" WHERE email = $1', [body.email.toLowerCase()]);
    if (existing.rows.length > 0) {
      return NextResponse.json({ error: 'البريد الإلكتروني مستخدم بالفعل' }, { status: 400 });
    }

    const id = `user-${Date.now()}`;
    const role = (body.role || 'student').toUpperCase();
    const avatar = body.role === 'teacher' ? '👨‍🏫' : '🧑‍🎓';
    const subStatus = body.role === 'student' ? 'pending' : null;

    await query(
      `INSERT INTO "User" ("id", "email", "password", "name", "role", "avatar", "phone", "bio", "rating", "studentsCount", "lessonsCount", "totalEarnings", "specialties", "stage", "year", "subscriptionStatus", "completedLessons", "favorites", "createdAt", "updatedAt")
       VALUES ($1, $2, $3, $4, $5, $6, $7, $8, 0, 0, 0, 0, $9, $10, $11, $12, ARRAY[]::TEXT[], ARRAY[]::TEXT[], NOW(), NOW())`,
      [id, body.email.toLowerCase(), body.password, body.name, role, avatar, body.phone || null, body.bio || null,
       body.specialties || [], body.stage || null, body.year || null, subStatus]
    );

    return NextResponse.json({
      user: {
        id, email: body.email, name: body.name, role: body.role, avatar,
        stage: body.stage, year: body.year, subscriptionStatus: subStatus,
        completedLessons: [], favorites: [], createdAt: new Date(),
      }
    }, { status: 201 });
  } catch (error) {
    console.error('Register error:', error);
    return NextResponse.json({ error: 'فشل في إنشاء الحساب: ' + (error instanceof Error ? error.message : '') }, { status: 500 });
  }
}
