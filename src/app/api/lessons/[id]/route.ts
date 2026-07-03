import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db';

// GET /api/lessons/[id]
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const lesson = await db.lesson.findUnique({
      where: { id },
      include: {
        teacher: { select: { id: true, name: true, avatar: true, bio: true, rating: true, studentsCount: true, lessonsCount: true, specialties: true } },
        unit: true,
        pdfs: true,
        additionalFiles: true,
        assignment: { include: { questions: true } },
        exam: { include: { questions: true } },
        comments: { include: { user: { select: { id: true, name: true, avatar: true } } }, orderBy: { createdAt: 'desc' } },
      },
    });

    if (!lesson) return NextResponse.json({ error: 'الدرس غير موجود' }, { status: 404 });

    // زيادة المشاهدات
    await db.lesson.update({ where: { id }, data: { views: { increment: 1 } } });

    return NextResponse.json({ lesson });
  } catch (error) {
    console.error('GET /api/lessons/[id] error:', error);
    return NextResponse.json({ error: 'فشل في جلب الدرس' }, { status: 500 });
  }
}

// PUT /api/lessons/[id]
export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const body = await request.json();

    let videoUrl = body.videoUrl;
    if (body.videoSource === 'youtube' && videoUrl && !videoUrl.includes('/embed/')) {
      const watchMatch = videoUrl.match(/[?&]v=([^&]+)/);
      if (watchMatch) videoUrl = `https://www.youtube.com/embed/${watchMatch[1]}`;
    }

    const lesson = await db.lesson.update({
      where: { id },
      data: {
        title: body.title,
        description: body.description,
        videoUrl,
        videoSource: body.videoSource,
        videoDuration: body.videoDuration,
        allowPdfDownload: body.allowPdfDownload,
      },
    });

    return NextResponse.json({ lesson });
  } catch (error) {
    console.error('PUT /api/lessons/[id] error:', error);
    return NextResponse.json({ error: 'فشل في تحديث الدرس' }, { status: 500 });
  }
}

// DELETE /api/lessons/[id]
export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    await db.lesson.delete({ where: { id } });
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('DELETE /api/lessons/[id] error:', error);
    return NextResponse.json({ error: 'فشل في حذف الدرس' }, { status: 500 });
  }
}
