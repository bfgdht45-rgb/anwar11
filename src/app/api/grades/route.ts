import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db';

// GET /api/grades?studentId=xxx
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const studentId = searchParams.get('studentId');
    const where: any = {};
    if (studentId) where.studentId = studentId;

    const grades = await db.grade.findMany({ where, orderBy: { date: 'desc' } });
    return NextResponse.json({ grades });
  } catch (error) {
    return NextResponse.json({ error: 'فشل في جلب الدرجات' }, { status: 500 });
  }
}

// POST /api/grades
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const grade = await db.grade.create({
      data: {
        score: body.score,
        totalScore: body.totalScore,
        itemType: body.itemType,
        itemId: body.itemId,
        title: body.title,
        studentId: body.studentId,
        studentName: body.studentName,
        assignmentId: body.assignmentId,
        examId: body.examId,
      },
    });
    return NextResponse.json({ grade }, { status: 201 });
  } catch (error) {
    return NextResponse.json({ error: 'فشل في حفظ الدرجة' }, { status: 500 });
  }
}
