import { NextRequest, NextResponse } from 'next/server';
import { query } from '@/lib/db';

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const lessonId = searchParams.get('lessonId');
    let sql = `SELECT c.*, u.name as "userName", u.avatar as "userAvatar" FROM "Comment" c LEFT JOIN "User" u ON c."userId" = u.id`;
    const params: any[] = [];
    if (lessonId) { sql += ` WHERE c."lessonId" = $1`; params.push(lessonId); }
    sql += ` ORDER BY c."createdAt" DESC`;
    const result = await query(sql, params);
    return NextResponse.json({ comments: result.rows });
  } catch (error) {
    return NextResponse.json({ error: 'فشل في جلب التعليقات' }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const id = `comment-${Date.now()}`;
    await query(
      `INSERT INTO "Comment" ("id", "text", "rating", "userId", "lessonId", "createdAt") VALUES ($1, $2, $3, $4, $5, NOW())`,
      [id, body.text, body.rating || null, body.userId, body.lessonId]
    );
    return NextResponse.json({ comment: { id, ...body } }, { status: 201 });
  } catch (error) {
    return NextResponse.json({ error: 'فشل في إضافة التعليق' }, { status: 500 });
  }
}

export async function DELETE(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const id = searchParams.get('id');
    if (!id) return NextResponse.json({ error: 'معرف مطلوب' }, { status: 400 });
    await query(`DELETE FROM "Comment" WHERE id = $1`, [id]);
    return NextResponse.json({ success: true });
  } catch (error) {
    return NextResponse.json({ error: 'فشل الحذف' }, { status: 500 });
  }
}
