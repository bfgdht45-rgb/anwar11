import { NextRequest, NextResponse } from 'next/server';
import { query } from '@/lib/db';

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const assignmentId = searchParams.get('assignmentId');
    const studentId = searchParams.get('studentId');
    let sql = `SELECT * FROM "StudentAnswer" WHERE 1=1`;
    const params: any[] = [];
    let idx = 1;
    if (assignmentId) { sql += ` AND "assignmentId" = $${idx++}`; params.push(assignmentId); }
    if (studentId) { sql += ` AND "studentId" = $${idx++}`; params.push(studentId); }
    sql += ` ORDER BY "createdAt" DESC`;
    const result = await query(sql, params);
    return NextResponse.json({ answers: result.rows });
  } catch (error) {
    return NextResponse.json({ answers: [] });
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const id = `answer-${Date.now()}`;
    await query(
      `INSERT INTO "StudentAnswer" ("id", "studentId", "studentName", "assignmentId", "questionId", "textAnswer", "imageAnswer", "createdAt") VALUES ($1, $2, $3, $4, $5, $6, $7, NOW())`,
      [id, body.studentId, body.studentName, body.assignmentId, body.questionId, body.textAnswer || null, body.imageAnswer || null]
    );
    return NextResponse.json({ success: true, id }, { status: 201 });
  } catch (error) {
    return NextResponse.json({ error: 'فشل الحفظ' }, { status: 500 });
  }
}

export async function PUT(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const id = searchParams.get('id');
    const body = await request.json();
    if (!id) return NextResponse.json({ error: 'معرف مطلوب' }, { status: 400 });
    await query(`UPDATE "StudentAnswer" SET "grade" = $1, "feedback" = $2 WHERE "id" = $3`, [body.grade || null, body.feedback || null, id]);
    return NextResponse.json({ success: true });
  } catch (error) {
    return NextResponse.json({ error: 'فشل التحديث' }, { status: 500 });
  }
}
