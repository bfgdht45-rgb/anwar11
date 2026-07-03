import { NextResponse } from 'next/server';
import { db } from '@/lib/db';

// GET /api/assignments?lessonId=xxx
export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const lessonId = searchParams.get('lessonId');
    const where: any = {};
    if (lessonId) where.lessonId = lessonId;

    const assignments = await db.assignment.findMany({
      where, include: { questions: true, lesson: true },
      orderBy: { createdAt: 'desc' },
    });
    return NextResponse.json({ assignments });
  } catch (error) {
    return NextResponse.json({ error: 'فشل في جلب الواجبات' }, { status: 500 });
  }
}
