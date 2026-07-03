import { NextRequest, NextResponse } from 'next/server';
import { query } from '@/lib/db';

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const role = searchParams.get('role');

    let sql = `SELECT id, email, name, role, avatar, phone, bio, rating,
               "studentsCount", "lessonsCount", "totalEarnings", specialties,
               stage, year, "subscriptionStatus", "subscriptionExpiry",
               "completedLessons", favorites, "createdAt" FROM "User"`;
    const params: any[] = [];
    if (role) {
      sql += ` WHERE role = $1`;
      params.push(role.toUpperCase());
    }
    sql += ` ORDER BY "createdAt" DESC`;

    const result = await query(sql, params);
    const users = result.rows.map((u: any) => ({ ...u, role: u.role.toLowerCase() }));
    return NextResponse.json({ users });
  } catch (error) {
    console.error('GET /api/users error:', error);
    return NextResponse.json({ error: 'فشل في جلب المستخدمين' }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const id = `user-${Date.now()}`;
    const role = (body.role || 'student').toUpperCase();

    await query(
      `INSERT INTO "User" ("id", "email", "password", "name", "role", "avatar", "phone", "bio", "specialties", "stage", "year", "subscriptionStatus", "completedLessons", "favorites", "createdAt", "updatedAt")
       VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, ARRAY[]::TEXT[], ARRAY[]::TEXT[], NOW(), NOW())`,
      [id, body.email.toLowerCase(), body.password || '123456', body.name, role, body.avatar || '🧑',
       body.phone || null, body.bio || null, body.specialties || [], body.stage || null, body.year || null,
       role === 'STUDENT' ? 'pending' : null]
    );

    return NextResponse.json({ user: { id, email: body.email, name: body.name, role: role.toLowerCase() } }, { status: 201 });
  } catch (error: any) {
    console.error('POST /api/users error:', error);
    return NextResponse.json({ error: 'فشل في إنشاء المستخدم' }, { status: 500 });
  }
}
