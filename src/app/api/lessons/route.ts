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

    // تحويل رابط YouTube تلقائياً إلى embed
    let videoUrl = body.videoUrl || '';
    if (body.videoSource === 'youtube' && videoUrl && !videoUrl.includes('/embed/')) {
      const watchMatch = videoUrl.match(/[?&]v=([^&]+)/);
      if (watchMatch) videoUrl = `https://www.youtube.com/embed/${watchMatch[1]}`;
      else {
        const shortMatch = videoUrl.match(/youtu\.be\/([^?&]+)/);
        if (shortMatch) videoUrl = `https://www.youtube.com/embed/${shortMatch[1]}`;
      }
    } else if (body.videoSource === 'vimeo' && videoUrl && !videoUrl.includes('player.vimeo.com')) {
      const match = videoUrl.match(/vimeo\.com\/(\d+)/);
      if (match) videoUrl = `https://player.vimeo.com/video/${match[1]}`;
    } else if (body.videoSource === 'gdrive' && videoUrl && !videoUrl.includes('/preview')) {
      const match = videoUrl.match(/\/file\/d\/([^/]+)/);
      if (match) videoUrl = `https://drive.google.com/file/d/${match[1]}/preview`;
    }

    // إنشاء الدرس مع PDFs والملفات الإضافية
    const lesson = await db.lesson.create({
      data: {
        title: body.title,
        description: body.description || '',
        teacherId: body.teacherId,
        unitId: body.unitId,
        videoUrl,
        videoSource: body.videoSource || 'youtube',
        videoDuration: body.videoDuration || '00:00',
        order: body.order || 0,
        allowPdfDownload: body.allowPdfDownload ?? false,
        pdfs: body.pdfs?.length ? {
          create: body.pdfs.map((p: any) => ({
            name: p.name,
            url: p.url,
            size: p.size || '1 MB',
            pages: p.pages || 1,
          }))
        } : undefined,
        additionalFiles: body.additionalFiles?.length ? {
          create: body.additionalFiles.map((f: any) => ({
            name: f.name,
            url: f.url,
            type: f.type || 'file',
          }))
        } : undefined,
      },
      include: {
        pdfs: true,
        additionalFiles: true,
        teacher: { select: { id: true, name: true, avatar: true, bio: true, rating: true, studentsCount: true, lessonsCount: true, specialties: true } },
        unit: true,
      },
    });

    // إنشاء واجب لو فيه أسئلة
    if (body.assignment?.questions?.length) {
      const assignment = await db.assignment.create({
        data: {
          title: body.assignment.title || `واجب: ${body.title}`,
          description: body.assignment.description || '',
          totalPoints: body.assignment.totalPoints || 20,
          autoGrade: true,
          lessonId: lesson.id,
          questions: {
            create: body.assignment.questions.map((q: any) => ({
              type: q.type || 'MCQ',
              difficulty: q.difficulty || 'MEDIUM',
              text: q.text,
              options: q.options || [],
              correctAnswer: q.correctAnswer,
              explanation: q.explanation,
              points: q.points || 5,
            })),
          },
        },
      });
      await db.lesson.update({ where: { id: lesson.id }, data: { assignmentId: assignment.id } });
    }

    // إنشاء امتحان HTML لو فيه htmlContent
    if (body.exam?.htmlContent) {
      const exam = await db.exam.create({
        data: {
          title: body.exam.title || `امتحان: ${body.title}`,
          description: body.exam.description || '',
          durationMinutes: body.exam.durationMinutes || 30,
          preventBack: body.exam.preventBack ?? true,
          randomOrder: body.exam.randomOrder ?? false,
          showGrade: body.exam.showGrade ?? true,
          showSolution: body.exam.showSolution ?? true,
          passingScore: body.exam.passingScore ?? 60,
          isHtmlExam: true,
          htmlContent: body.exam.htmlContent,
          lessonId: lesson.id,
        },
      });
      await db.lesson.update({ where: { id: lesson.id }, data: { examId: exam.id } });
    }

    // إعادة جلب الدرس بكل العلاقات
    const fullLesson = await db.lesson.findUnique({
      where: { id: lesson.id },
      include: {
        teacher: { select: { id: true, name: true, avatar: true, bio: true, rating: true, studentsCount: true, lessonsCount: true, specialties: true } },
        unit: true,
        pdfs: true,
        additionalFiles: true,
        assignment: { include: { questions: true } },
        exam: { include: { questions: true } },
        comments: { include: { user: { select: { id: true, name: true, avatar: true } } } },
      },
    });

    return NextResponse.json({ lesson: fullLesson }, { status: 201 });
  } catch (error) {
    console.error('POST /api/lessons error:', error);
    return NextResponse.json({ error: 'فشل في إنشاء الدرس: ' + (error instanceof Error ? error.message : '') }, { status: 500 });
  }
}
