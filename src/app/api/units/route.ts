import { NextResponse } from 'next/server';
import { db } from '@/lib/db';

// GET /api/units - جلب كل الوحدات
export async function GET() {
  try {
    const units = await db.unit.findMany({
      orderBy: [{ stageId: 'asc' }, { yearId: 'asc' }, { order: 'asc' }],
    });
    return NextResponse.json({ units });
  } catch (error) {
    console.error('GET /api/units error:', error);
    return NextResponse.json({ error: 'فشل في جلب الوحدات' }, { status: 500 });
  }
}
