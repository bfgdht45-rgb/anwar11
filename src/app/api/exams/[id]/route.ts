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

// PUT /api/exams/[id]
export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const body = await request.json();
    const exam = await db.exam.update({
      where: { id },
      data: {
        title: body.title,
        description: body.description,
        durationMinutes: body.durationMinutes,
        preventBack: body.preventBack,
        randomOrder: body.randomOrder,
        showGrade: body.showGrade,
        showSolution: body.showSolution,
        passingScore: body.passingScore,
        isHtmlExam: body.isHtmlExam,
        htmlContent: body.htmlContent,
      },
    });
    return NextResponse.json({ exam });
  } catch (error) {
    return NextResponse.json({ error: 'فشل في تحديث الامتحان' }, { status: 500 });
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
