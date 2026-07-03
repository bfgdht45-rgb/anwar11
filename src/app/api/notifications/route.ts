import { NextRequest, NextResponse } from 'next/server';
import { query } from '@/lib/db';

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const userId = searchParams.get('userId');
    let sql = `SELECT * FROM "Notification" WHERE "userId" IS NULL`;
    const params: any[] = [];
    if (userId) {
      sql = `SELECT * FROM "Notification" WHERE "userId" = $1 OR "userId" IS NULL`;
      params.push(userId);
    }
    sql += ` ORDER BY "createdAt" DESC`;
    const result = await query(sql, params);
    return NextResponse.json({ notifications: result.rows });
  } catch (error) {
    return NextResponse.json({ error: 'فشل في جلب الإشعارات' }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const id = `notif-${Date.now()}`;
    await query(
      `INSERT INTO "Notification" ("id", "title", "message", "type", "userId", "read", "createdAt") VALUES ($1, $2, $3, $4, $5, false, NOW())`,
      [id, body.title, body.message, (body.type || 'INFO').toUpperCase(), body.userId || null]
    );
    return NextResponse.json({ notification: { id, ...body } }, { status: 201 });
  } catch (error) {
    return NextResponse.json({ error: 'فشل في إرسال الإشعار' }, { status: 500 });
  }
}

export async function PUT(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const id = searchParams.get('id');
    if (!id) return NextResponse.json({ error: 'معرف مطلوب' }, { status: 400 });
    await query(`UPDATE "Notification" SET read = true WHERE id = $1`, [id]);
    return NextResponse.json({ success: true });
  } catch (error) {
    return NextResponse.json({ error: 'فشل التحديث' }, { status: 500 });
  }
}
