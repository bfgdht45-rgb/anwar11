import { NextRequest, NextResponse } from 'next/server';
import { query } from '@/lib/db';

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const studentId = searchParams.get('studentId');
    let sql = `SELECT * FROM "Payment"`;
    const params: any[] = [];
    if (studentId) { sql += ` WHERE "studentId" = $1`; params.push(studentId); }
    sql += ` ORDER BY date DESC`;
    const result = await query(sql, params);
    return NextResponse.json({ payments: result.rows });
  } catch (error) {
    return NextResponse.json({ error: 'فشل في جلب المدفوعات' }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const payId = `pay-${Date.now()}`;
    const invId = `inv-${Date.now()}`;

    await query(
      `INSERT INTO "Payment" ("id", "amount", "subscriptionName", "method", "status", "date", "couponCode", "studentId", "studentName") VALUES ($1, $2, $3, $4, 'completed', NOW(), $5, $6, $7)`,
      [payId, body.amount, body.subscriptionName, body.method || 'card', body.couponCode || null, body.studentId, body.studentName]
    );

    await query(
      `INSERT INTO "Invoice" ("id", "amount", "subscriptionName", "date", "status", "studentId") VALUES ($1, $2, $3, NOW(), 'paid', $4)`,
      [invId, body.amount, body.subscriptionName, body.studentId]
    );

    const expiry = new Date();
    expiry.setFullYear(expiry.getFullYear() + 1);
    await query(
      `UPDATE "User" SET "subscriptionStatus" = 'active', "subscriptionExpiry" = $1 WHERE id = $2`,
      [expiry, body.studentId]
    );

    return NextResponse.json({ payment: { id: payId }, invoice: { id: invId } }, { status: 201 });
  } catch (error) {
    console.error('Payment error:', error);
    return NextResponse.json({ error: 'فشل في تسجيل الدفعة' }, { status: 500 });
  }
}
