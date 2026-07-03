import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db';

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const studentId = searchParams.get('studentId');
    const where: any = {};
    if (studentId) where.studentId = studentId;

    const payments = await db.payment.findMany({ where, orderBy: { date: 'desc' } });
    return NextResponse.json({ payments });
  } catch (error) {
    return NextResponse.json({ error: 'فشل في جلب المدفوعات' }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();

    const payment = await db.payment.create({
      data: {
        amount: body.amount,
        subscriptionName: body.subscriptionName,
        method: body.method || 'card',
        status: 'completed',
        couponCode: body.couponCode,
        studentId: body.studentId,
        studentName: body.studentName,
      },
    });

    const invoice = await db.invoice.create({
      data: {
        amount: body.amount,
        subscriptionName: body.subscriptionName,
        status: 'paid',
        studentId: body.studentId,
      },
    });

    const expiry = new Date();
    expiry.setFullYear(expiry.getFullYear() + 1);
    await db.user.update({
      where: { id: body.studentId },
      data: {
        subscriptionStatus: 'active',
        subscriptionExpiry: expiry,
      },
    });

    return NextResponse.json({ payment, invoice }, { status: 201 });
  } catch (error) {
    console.error('Payment error:', error);
    return NextResponse.json({ error: 'فشل في تسجيل الدفعة' }, { status: 500 });
  }
}
