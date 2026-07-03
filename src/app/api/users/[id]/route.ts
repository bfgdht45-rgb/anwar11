import { NextRequest, NextResponse } from 'next/server';
import { query } from '@/lib/db';

export async function PUT(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params;
    const body = await request.json();

    // بناء الـ query ديناميكياً
    const fields: string[] = [];
    const values: any[] = [];
    let idx = 1;

    if (body.name !== undefined) { fields.push(`name = $${idx++}`); values.push(body.name); }
    if (body.email !== undefined) { fields.push(`email = $${idx++}`); values.push(body.email); }
    if (body.phone !== undefined) { fields.push(`phone = $${idx++}`); values.push(body.phone); }
    if (body.bio !== undefined) { fields.push(`bio = $${idx++}`); values.push(body.bio); }
    if (body.subscriptionStatus !== undefined) { fields.push(`"subscriptionStatus" = $${idx++}`); values.push(body.subscriptionStatus); }
    if (body.subscriptionExpiry !== undefined) { fields.push(`"subscriptionExpiry" = $${idx++}`); values.push(body.subscriptionExpiry ? new Date(body.subscriptionExpiry) : null); }
    if (body.completedLessons !== undefined) { fields.push(`"completedLessons" = $${idx++}`); values.push(body.completedLessons); }
    if (body.favorites !== undefined) { fields.push(`favorites = $${idx++}`); values.push(body.favorites); }
    if (body.rating !== undefined) { fields.push(`rating = $${idx++}`); values.push(body.rating); }
    if (body.studentsCount !== undefined) { fields.push(`"studentsCount" = $${idx++}`); values.push(body.studentsCount); }
    if (body.lessonsCount !== undefined) { fields.push(`"lessonsCount" = $${idx++}`); values.push(body.lessonsCount); }
    if (body.totalEarnings !== undefined) { fields.push(`"totalEarnings" = $${idx++}`); values.push(body.totalEarnings); }
    if (body.specialties !== undefined) { fields.push(`specialties = $${idx++}`); values.push(body.specialties); }
    if (body.stage !== undefined) { fields.push(`stage = $${idx++}`); values.push(body.stage); }
    if (body.year !== undefined) { fields.push(`year = $${idx++}`); values.push(body.year); }

    if (fields.length === 0) {
      return NextResponse.json({ error: 'لا توجد بيانات للتحديث' }, { status: 400 });
    }

    fields.push(`"updatedAt" = NOW()`);
    values.push(id);

    await query(`UPDATE "User" SET ${fields.join(', ')} WHERE id = $${idx}`, values);
    return NextResponse.json({ success: true });
  } catch (error: any) {
    console.error('PUT /api/users/[id] error:', error);
    return NextResponse.json({ error: 'فشل في التحديث: ' + error.message }, { status: 500 });
  }
}

export async function DELETE(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params;
    await query(`DELETE FROM "User" WHERE id = $1`, [id]);
    return NextResponse.json({ success: true });
  } catch (error) {
    return NextResponse.json({ error: 'فشل الحذف' }, { status: 500 });
  }
}
