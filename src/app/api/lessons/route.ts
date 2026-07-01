import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { Prisma } from '@prisma/client';

// GET /api/lessons - جلب كل الدروس
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const teacherId = searchParams.get('teacherId');
    const unitId = searchParams.get('unitId');

    const where: Prisma.LessonWhereInput = {};
    if (teacherId) where.teacherId = teacherId;
    if (unitId) where.unitId = unitId;

    const lessons = await db.lesson.findMany({
      where,
      include: {
        teacher: { select: { id: true, name: true, avatar: true, bio: true, rating: true, studentsCount: true, lessonsCount: true, specialties: true } },
        unit: true,
        pdfs: true,
        additionalFiles: true,
        assignment: { include: { questions: true } },
        exam: { include: { questions: true } },
        comments: { include: { user: { select: { id: true, name: true, avatar: true } } }, orderBy: { createdAt: 'desc' } },
      },
      orderBy: { order: 'asc' },
    });

    return NextResponse.json({ lessons });
  } catch (error) {
    console.error('GET /api/lessons error:', error);
    return NextResponse.json({ error: 'فشل في جلب الدروس' }, { status: 500 });
  }
}

// POST /api/lessons - إنشاء درس جديد
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();

    const lesson = await db.lesson.create({
      data: {
        title: body.title,
        description: body.description || '',
        teacherId: body.teacherId,
        unitId: body.unitId,
        videoUrl: body.videoUrl,
        videoSource: body.videoSource || 'youtube',
        videoDuration: body.videoDuration || '00:00',
        order: body.order || 0,
        allowPdfDownload: body.allowPdfDownload ?? false,
        pdfs: body.pdfs?.length ? { create: body.pdfs } : undefined,
        additionalFiles: body.additionalFiles?.length ? { create: body.additionalFiles } : undefined,
      },
      include: {
        pdfs: true,
        additionalFiles: true,
      },
    });

    return NextResponse.json({ lesson }, { status: 201 });
  } catch (error) {
    console.error('POST /api/lessons error:', error);
    return NextResponse.json({ error: 'فشل في إنشاء الدرس' }, { status: 500 });
  }
}
