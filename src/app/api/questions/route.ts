import { NextRequest, NextResponse } from 'next/server';
import { query } from '@/lib/db';

// GET /api/questions - جلب كل الأسئلة (لبنك الأسئلة)
export async function GET() {
  try {
    const result = await query(`SELECT * FROM "Question" ORDER BY "createdAt" DESC`);
    return NextResponse.json({ questions: result.rows });
  } catch (error: any) {
    console.error('GET /api/questions error:', error);
    return NextResponse.json({ error: 'فشل في جلب الأسئلة' }, { status: 500 });
  }
}

// POST /api/questions - إضافة سؤال لبنك الأسئلة
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const id = `q-${Date.now()}`;
    const options = body.type === 'MCQ' && body.options ? body.options : [];

    await query(
      `INSERT INTO "Question" ("id", "type", "difficulty", "text", "options", "correctAnswer", "explanation", "points", "imageUrl", "stageId", "yearId", "createdAt")
       VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, NOW())`,
      [id, body.type || 'MCQ', body.difficulty || 'EASY', body.text || 'سؤال بصورة', options, body.correctAnswer || 'إجابة بصرية', body.explanation || null, body.points || 5, body.imageUrl || null, body.stageId || null, body.yearId || null]
    );

    return NextResponse.json({ question: { id, ...body } }, { status: 201 });
  } catch (error: any) {
    console.error('POST /api/questions error:', error);
    return NextResponse.json({ error: 'فشل في إضافة السؤال: ' + error.message }, { status: 500 });
  }
}

// DELETE /api/questions?id=xxx - حذف سؤال
export async function DELETE(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const id = searchParams.get('id');
    if (!id) return NextResponse.json({ error: 'معرف مطلوب' }, { status: 400 });
    await query(`DELETE FROM "Question" WHERE id = $1`, [id]);
    return NextResponse.json({ success: true });
  } catch (error: any) {
    return NextResponse.json({ error: 'فشل الحذف' }, { status: 500 });
  }
}
