import { NextResponse } from 'next/server';
import { db } from '@/lib/db';

export async function GET() {
  try {
    const units = await db.$queryRawUnsafe(`SELECT * FROM "Unit" ORDER BY "stageId" ASC, "yearId" ASC, "order" ASC`) as any[];
    return NextResponse.json({ units });
  } catch (error) {
    console.error('GET /api/units error:', error);
    return NextResponse.json({ error: 'فشل في جلب الوحدات' }, { status: 500 });
  }
}
