import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db';

// GET /api/users
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const role = searchParams.get('role');

    let query = `SELECT id, email, name, role, avatar, phone, bio, rating,
                 "studentsCount", "lessonsCount", "totalEarnings", specialties,
                 stage, year, "subscriptionStatus", "subscriptionExpiry",
                 "completedLessons", favorites, "createdAt" FROM "User"`;
    if (role) {
      query += ` WHERE role = '${role.toUpperCase()}'`;
    }
    query += ` ORDER BY "createdAt" DESC`;

    const users = await db.$queryRawUnsafe(query) as any[];
    const normalizedUsers = users.map(u => ({ ...u, role: u.role.toLowerCase() }));
    return NextResponse.json({ users: normalizedUsers });
  } catch (error) {
    console.error('GET /api/users error:', error);
    return NextResponse.json({ error: 'فشل في جلب المستخدمين' }, { status: 500 });
  }
}

// POST /api/users
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const id = `user-${Date.now()}`;
    const role = (body.role || 'student').toUpperCase();
    const specialties = body.specialties?.length ? `ARRAY[${body.specialties.map((s: string) => `'${s}'`).join(',')}]::TEXT[]` : 'ARRAY[]::TEXT[]';
    const subStatus = role === 'STUDENT' ? 'pending' : null;

    await db.$executeRawUnsafe(`
      INSERT INTO "User" ("id", "email", "password", "name", "role", "avatar", "phone", "bio", "rating", "studentsCount", "lessonsCount", "totalEarnings", "specialties", "stage", "year", "subscriptionStatus", "completedLessons", "favorites", "createdAt", "updatedAt")
      VALUES ('${id}', '${body.email.toLowerCase()}', '${body.password || '123456'}', '${body.name.replace(/'/g, "''")}', '${role}', '${body.avatar || '🧑'}', ${body.phone ? `'${body.phone}'` : 'NULL'}, ${body.bio ? `'${body.bio.replace(/'/g, "''")}'` : 'NULL'}, 0, 0, 0, 0, ${specialties}, ${body.stage ? `'${body.stage}'` : 'NULL'}, ${body.year ? `'${body.year}'` : 'NULL'}, ${subStatus ? `'${subStatus}'` : 'NULL'}, ARRAY[]::TEXT[], ARRAY[]::TEXT[], NOW(), NOW())
    `);

    return NextResponse.json({ user: { id, email: body.email, name: body.name, role: role.toLowerCase() } }, { status: 201 });
  } catch (error: any) {
    console.error('POST /api/users error:', error);
    return NextResponse.json({ error: 'فشل في إنشاء المستخدم - ربما البريد مستخدم' }, { status: 500 });
  }
}
