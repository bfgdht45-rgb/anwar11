import { NextRequest, NextResponse } from 'next/server';
import { query } from '@/lib/db';

export async function GET() {
  try {
    const result = await query(`SELECT * FROM "Coupon" ORDER BY expiry DESC`);
    return NextResponse.json({ coupons: result.rows });
  } catch (error) {
    return NextResponse.json({ error: 'فشل في جلب الكوبونات' }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const id = `coupon-${Date.now()}`;
    await query(
      `INSERT INTO "Coupon" ("id", "code", "discount", "type", "maxUses", "usedCount", "expiry", "active") VALUES ($1, $2, $3, $4, $5, 0, $6, true)`,
      [id, body.code.toUpperCase(), body.discount, body.type, body.maxUses || 100, new Date(body.expiry)]
    );
    return NextResponse.json({ coupon: { id, ...body } }, { status: 201 });
  } catch (error) {
    return NextResponse.json({ error: 'فشل في إنشاء الكوبون' }, { status: 500 });
  }
}

export async function DELETE(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const id = searchParams.get('id');
    if (!id) return NextResponse.json({ error: 'معرف مطلوب' }, { status: 400 });
    await query(`DELETE FROM "Coupon" WHERE id = $1`, [id]);
    return NextResponse.json({ success: true });
  } catch (error) {
    return NextResponse.json({ error: 'فشل الحذف' }, { status: 500 });
  }
}
