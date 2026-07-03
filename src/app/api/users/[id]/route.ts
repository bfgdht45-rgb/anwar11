import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db';

// PUT /api/users/[id] - تحديث مستخدم
export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const body = await request.json();

    const user = await db.user.update({
      where: { id },
      data: {
        name: body.name,
        email: body.email,
        phone: body.phone,
        bio: body.bio,
        rating: body.rating,
        studentsCount: body.studentsCount,
        lessonsCount: body.lessonsCount,
        totalEarnings: body.totalEarnings,
        specialties: body.specialties,
        stage: body.stage,
        year: body.year,
        subscriptionStatus: body.subscriptionStatus,
        subscriptionExpiry: body.subscriptionExpiry ? new Date(body.subscriptionExpiry) : undefined,
        completedLessons: body.completedLessons,
        favorites: body.favorites,
      },
    });

    return NextResponse.json({ user: { ...user, role: user.role.toLowerCase() } });
  } catch (error) {
    console.error('PUT /api/users/[id] error:', error);
    return NextResponse.json({ error: 'فشل في تحديث المستخدم' }, { status: 500 });
  }
}

// DELETE /api/users/[id]
export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    await db.user.delete({ where: { id } });
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('DELETE /api/users/[id] error:', error);
    return NextResponse.json({ error: 'فشل في حذف المستخدم' }, { status: 500 });
  }
}
