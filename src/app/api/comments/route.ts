import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db';

// GET /api/comments?lessonId=xxx
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const lessonId = searchParams.get('lessonId');
    const where: any = {};
    if (lessonId) where.lessonId = lessonId;

    const comments = await db.comment.findMany({
      where,
      include: { user: { select: { id: true, name: true, avatar: true } } },
      orderBy: { createdAt: 'desc' },
    });
    return NextResponse.json({ comments });
  } catch (error) {
    return NextResponse.json({ error: 'فشل في جلب التعليقات' }, { status: 500 });
  }
}

// POST /api/comments
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const comment = await db.comment.create({
      data: {
        text: body.text,
        rating: body.rating,
        userId: body.userId,
        lessonId: body.lessonId,
      },
      include: { user: { select: { id: true, name: true, avatar: true } } },
    });
    return NextResponse.json({ comment }, { status: 201 });
  } catch (error) {
    return NextResponse.json({ error: 'فشل في إضافة التعليق' }, { status: 500 });
  }
}

// DELETE /api/comments
export async function DELETE(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const id = searchParams.get('id');
    if (!id) return NextResponse.json({ error: 'معرف التعليق مطلوب' }, { status: 400 });
    await db.comment.delete({ where: { id } });
    return NextResponse.json({ success: true });
  } catch (error) {
    return NextResponse.json({ error: 'فشل في حذف التعليق' }, { status: 500 });
  }
}
