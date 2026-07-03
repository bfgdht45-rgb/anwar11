import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db';

// GET /api/exams/[id]
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const exam = await db.exam.findUnique({
      where: { id },
      include: { questions: true, lesson: true },
    });
    if (!exam) return NextResponse.json({ error: 'الامتحان غير موجود' }, { status: 404 });
    return NextResponse.json({ exam });
  } catch (error) {
    return NextResponse.json({ error: 'فشل في جلب الامتحان' }, { status: 500 });
  }
}

// DELETE /api/exams/[id]
export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    await db.exam.delete({ where: { id } });
    return NextResponse.json({ success: true });
  } catch (error) {
    return NextResponse.json({ error: 'فشل في حذف الامتحان' }, { status: 500 });
  }
}
