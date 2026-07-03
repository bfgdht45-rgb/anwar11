import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db';

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const userId = searchParams.get('userId');
    const where: any = {
      OR: userId ? [{ userId }, { userId: null }] : [{ userId: null }],
    };
    const notifications = await db.notification.findMany({
      where, orderBy: { createdAt: 'desc' },
    });
    return NextResponse.json({ notifications });
  } catch (error) {
    return NextResponse.json({ error: 'فشل في جلب الإشعارات' }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const notification = await db.notification.create({
      data: {
        title: body.title,
        message: body.message,
        type: (body.type || 'INFO').toUpperCase() as any,
        userId: body.userId || null,
      },
    });
    return NextResponse.json({ notification }, { status: 201 });
  } catch (error) {
    return NextResponse.json({ error: 'فشل في إرسال الإشعار' }, { status: 500 });
  }
}

export async function PUT(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const id = searchParams.get('id');
    if (!id) return NextResponse.json({ error: 'معرف الإشعار مطلوب' }, { status: 400 });
    const notification = await db.notification.update({
      where: { id }, data: { read: true },
    });
    return NextResponse.json({ notification });
  } catch (error) {
    return NextResponse.json({ error: 'فشل في تحديث الإشعار' }, { status: 500 });
  }
}
