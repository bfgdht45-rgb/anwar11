import { NextRequest, NextResponse } from 'next/server';
import { query } from '@/lib/db';

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const studentId = searchParams.get('studentId');
    let sql = `SELECT * FROM "Grade"`;
    const params: any[] = [];
    if (studentId) { sql += ` WHERE "studentId" = $1`; params.push(studentId); }
    sql += ` ORDER BY date DESC`;
    const result = await query(sql, params);
    return NextResponse.json({ grades: result.rows });
  } catch (error) {
    return NextResponse.json({ error: 'فشل في جلب الدرجات' }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const id = `grade-${Date.now()}`;
    await query(
      `INSERT INTO "Grade" ("id", "score", "totalScore", "date", "itemType", "itemId", "title", "studentId", "studentName", "assignmentId", "examId") VALUES ($1, $2, $3, NOW(), $4, $5, $6, $7, $8, $9, $10)`,
      [id, body.score, body.totalScore, body.itemType, body.itemId, body.title, body.studentId, body.studentName, body.assignmentId || null, body.examId || null]
    );
    return NextResponse.json({ grade: { id, ...body } }, { status: 201 });
  } catch (error) {
    return NextResponse.json({ error: 'فشل في حفظ الدرجة' }, { status: 500 });
  }
}
