import { NextResponse } from 'next/server';
import { db } from '@/lib/db';

export async function GET() {
  try {
    const exams = await db.$queryRawUnsafe(`SELECT * FROM "Exam" ORDER BY "createdAt" DESC`) as any[];

    const examsWithQuestions = await Promise.all((exams || []).map(async (e: any) => {
      const questions = await db.$queryRawUnsafe(`SELECT * FROM "Question" WHERE "examId" = '${e.id}'`) as any[];
      return { ...e, questions };
    }));

    return NextResponse.json({ exams: examsWithQuestions });
  } catch (error) {
    console.error('GET /api/exams error:', error);
    return NextResponse.json({ error: 'فشل في جلب الامتحانات' }, { status: 500 });
  }
}

export async function POST(request: any) {
  try {
    const body = await request.json();
    const id = `exam-${Date.now()}`;
    const escapedHtml = (body.htmlContent || '').replace(/'/g, "''");

    await db.$executeRawUnsafe(`
      INSERT INTO "Exam" ("id", "title", "description", "durationMinutes", "preventBack", "randomOrder", "showGrade", "showSolution", "passingScore", "isHtmlExam", "htmlContent", "createdAt")
      VALUES ('${id}', '${body.title.replace(/'/g, "''")}', '${(body.description || '').replace(/'/g, "''")}', ${body.durationMinutes || 30}, true, false, true, true, ${body.passingScore || 60}, ${body.isHtmlExam ?? true}, '${escapedHtml}', NOW())
    `);

    return NextResponse.json({ exam: { id, ...body } }, { status: 201 });
  } catch (error: any) {
    console.error('POST /api/exams error:', error);
    return NextResponse.json({ error: 'فشل في إنشاء الامتحان: ' + error.message }, { status: 500 });
  }
}
