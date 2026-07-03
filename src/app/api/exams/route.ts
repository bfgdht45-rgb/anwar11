import { NextResponse } from 'next/server';
import { query } from '@/lib/db';

export async function GET() {
  try {
    const result = await query(`SELECT * FROM "Exam" ORDER BY "createdAt" DESC`);
    const exams = await Promise.all(result.rows.map(async (e: any) => {
      const questions = await query(`SELECT * FROM "Question" WHERE "examId" = $1`, [e.id]);
      return { ...e, questions: questions.rows };
    }));
    return NextResponse.json({ exams });
  } catch (error) {
    console.error('GET /api/exams error:', error);
    return NextResponse.json({ error: 'فشل في جلب الامتحانات' }, { status: 500 });
  }
}

export async function POST(request: any) {
  try {
    const body = await request.json();
    const id = `exam-${Date.now()}`;

    await query(
      `INSERT INTO "Exam" ("id", "title", "description", "durationMinutes", "preventBack", "randomOrder", "showGrade", "showSolution", "passingScore", "isHtmlExam", "htmlContent", "createdAt")
       VALUES ($1, $2, $3, $4, true, false, true, true, $5, $6, $7, NOW())`,
      [id, body.title, body.description || '', body.durationMinutes || 30, body.passingScore || 60, body.isHtmlExam ?? true, body.htmlContent || null]
    );

    return NextResponse.json({ exam: { id, ...body } }, { status: 201 });
  } catch (error: any) {
    console.error('POST /api/exams error:', error);
    return NextResponse.json({ error: 'فشل في إنشاء الامتحان: ' + error.message }, { status: 500 });
  }
}
