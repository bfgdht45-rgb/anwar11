import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db';

// GET /api/coupons
export async function GET() {
  try {
    const coupons = await db.coupon.findMany({ orderBy: { expiry: 'desc' } });
    return NextResponse.json({ coupons });
  } catch (error) {
    return NextResponse.json({ error: 'فشل في جلب الكوبونات' }, { status: 500 });
  }
}

// POST /api/coupons
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const coupon = await db.coupon.create({
      data: {
        code: body.code.toUpperCase(),
        discount: body.discount,
        type: body.type,
        maxUses: body.maxUses || 100,
        expiry: new Date(body.expiry),
        active: true,
      },
    });
    return NextResponse.json({ coupon }, { status: 201 });
  } catch (error) {
    return NextResponse.json({ error: 'فشل في إنشاء الكوبون' }, { status: 500 });
  }
}

// DELETE /api/coupons?id=xxx
export async function DELETE(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const id = searchParams.get('id');
    if (!id) return NextResponse.json({ error: 'معرف الكوبون مطلوب' }, { status: 400 });
    await db.coupon.delete({ where: { id } });
    return NextResponse.json({ success: true });
  } catch (error) {
    return NextResponse.json({ error: 'فشل في حذف الكوبون' }, { status: 500 });
  }
}
