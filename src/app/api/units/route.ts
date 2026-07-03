import { NextResponse } from 'next/server';
import { query } from '@/lib/db';

export async function GET() {
  try {
    const result = await query(`SELECT * FROM "Unit" ORDER BY "stageId" ASC, "yearId" ASC, "order" ASC`);
    return NextResponse.json({ units: result.rows });
  } catch (error) {
    console.error('GET /api/units error:', error);
    return NextResponse.json({ error: 'فشل في جلب الوحدات' }, { status: 500 });
  }
}
