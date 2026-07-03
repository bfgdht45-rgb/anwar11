import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db';

// GET /api/exams
export async function GET() {
  try {
    const exams = await db.exam.findMany({
      include: {
        questions: true,
        lesson: { select: { id: true, title: true } },
      },
      orderBy: { createdAt: 'desc' },
    });
    return NextResponse.json({ exams });
  } catch (error) {
    console.error('GET /api/exams error:', error);
    return NextResponse.json({ error: 'فشل في جلب الامتحانات' }, { status: 500 });
  }
}

// POST /api/exams
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();

    const exam = await db.exam.create({
      data: {
        title: body.title,
        description: body.description || '',
        durationMinutes: body.durationMinutes || 30,
        preventBack: body.preventBack ?? true,
        randomOrder: body.randomOrder ?? false,
        showGrade: body.showGrade ?? true,
        showSolution: body.showSolution ?? true,
        passingScore: body.passingScore ?? 60,
        isHtmlExam: body.isHtmlExam ?? false,
        htmlContent: body.htmlContent,
        lessonId: body.lessonId || null,
        questions: body.questions?.length ? {
          create: body.questions.map((q: any) => ({
            type: q.type || 'MCQ',
            difficulty: q.difficulty || 'MEDIUM',
            text: q.text,
            options: q.options || [],
            correctAnswer: q.correctAnswer,
            explanation: q.explanation,
            points: q.points || 5,
          }))
        } : undefined,
      },
      include: { questions: true },
    });

    return NextResponse.json({ exam }, { status: 201 });
  } catch (error) {
    console.error('POST /api/exams error:', error);
    return NextResponse.json({ error: 'فشل في إنشاء الامتحان' }, { status: 500 });
  }
}
