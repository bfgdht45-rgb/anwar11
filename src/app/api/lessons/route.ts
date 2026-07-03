import { NextResponse } from 'next/server';
import { query } from '@/lib/db';

export async function GET() {
  try {
    // جلب كل الدروس
    const lessonsResult = await query(`
      SELECT l.*, u.name as "teacherName", u.avatar as "teacherAvatar", u.bio as "teacherBio",
             u.rating as "teacherRating", u."studentsCount" as "teacherStudentsCount",
             u."lessonsCount" as "teacherLessonsCount", u.specialties as "teacherSpecialties",
             un.title as "unitTitle", un."stageId", un."yearId"
      FROM "Lesson" l
      LEFT JOIN "User" u ON l."teacherId" = u.id
      LEFT JOIN "Unit" un ON l."unitId" = un.id
      ORDER BY l."order" ASC
    `);

    // جلب العلاقات لكل درس
    const lessons = await Promise.all(lessonsResult.rows.map(async (l: any) => {
      const [pdfs, files, comments, assignments, exams] = await Promise.all([
        query(`SELECT * FROM "PDFFile" WHERE "lessonId" = $1`, [l.id]),
        query(`SELECT * FROM "AdditionalFile" WHERE "lessonId" = $1`, [l.id]),
        query(`SELECT c.*, u.name as "userName", u.avatar as "userAvatar" FROM "Comment" c LEFT JOIN "User" u ON c."userId" = u.id WHERE c."lessonId" = $1 ORDER BY c."createdAt" DESC`, [l.id]),
        query(`SELECT * FROM "Assignment" WHERE "lessonId" = $1 LIMIT 1`, [l.id]),
        query(`SELECT * FROM "Exam" WHERE "lessonId" = $1 LIMIT 1`, [l.id]),
      ]);

      let assignment = null;
      if (assignments.rows[0]) {
        const questions = await query(`SELECT * FROM "Question" WHERE "assignmentId" = $1`, [assignments.rows[0].id]);
        assignment = { ...assignments.rows[0], questions: questions.rows };
      }

      let exam = null;
      if (exams.rows[0]) {
        const questions = await query(`SELECT * FROM "Question" WHERE "examId" = $1`, [exams.rows[0].id]);
        exam = { ...exams.rows[0], questions: questions.rows };
      }

      return {
        ...l,
        teacher: {
          id: l.teacherId,
          name: l.teacherName,
          avatar: l.teacherAvatar,
          bio: l.teacherBio,
          rating: l.teacherRating,
          studentsCount: l.teacherStudentsCount,
          lessonsCount: l.teacherLessonsCount,
          specialties: l.teacherSpecialties,
        },
        unit: { id: l.unitId, title: l.unitTitle, stageId: l.stageId, yearId: l.yearId },
        pdfs: pdfs.rows,
        additionalFiles: files.rows,
        comments: comments.rows,
        assignment,
        exam,
      };
    }));

    return NextResponse.json({ lessons });
  } catch (error: any) {
    console.error('GET /api/lessons error:', error);
    return NextResponse.json({ error: 'فشل في جلب الدروس: ' + error.message }, { status: 500 });
  }
}

export async function POST(request: any) {
  try {
    const body = await request.json();
    const id = `lesson-${Date.now()}`;

    // تحويل رابط YouTube
    let videoUrl = body.videoUrl || '';
    if (body.videoSource === 'youtube' && videoUrl && !videoUrl.includes('/embed/')) {
      const watchMatch = videoUrl.match(/[?&]v=([^&]+)/);
      if (watchMatch) videoUrl = `https://www.youtube.com/embed/${watchMatch[1]}`;
      else {
        const shortMatch = videoUrl.match(/youtu\.be\/([^?&]+)/);
        if (shortMatch) videoUrl = `https://www.youtube.com/embed/${shortMatch[1]}`;
      }
    }

    await query(
      `INSERT INTO "Lesson" ("id", "title", "description", "teacherId", "unitId", "videoUrl", "videoSource", "videoDuration", "views", "order", "allowPdfDownload", "createdAt", "updatedAt")
       VALUES ($1, $2, $3, $4, $5, $6, $7, $8, 0, 0, $9, NOW(), NOW())`,
      [id, body.title, body.description || '', body.teacherId, body.unitId, videoUrl, body.videoSource || 'youtube', body.videoDuration || '00:00', body.allowPdfDownload ?? false]
    );

    // إضافة PDFs
    if (body.pdfs?.length) {
      for (const p of body.pdfs) {
        await query(
          `INSERT INTO "PDFFile" ("id", "name", "url", "size", "pages", "lessonId") VALUES ($1, $2, $3, $4, $5, $6)`,
          [`pdf-${Date.now()}-${Math.random()}`, p.name, p.url, p.size || '1 MB', p.pages || 1, id]
        );
      }
    }

    // إنشاء امتحان HTML
    if (body.exam?.htmlContent) {
      const examId = `exam-${Date.now()}`;
      await query(
        `INSERT INTO "Exam" ("id", "title", "description", "durationMinutes", "preventBack", "randomOrder", "showGrade", "showSolution", "passingScore", "isHtmlExam", "htmlContent", "lessonId", "createdAt")
         VALUES ($1, $2, $3, $4, true, false, true, true, $5, true, $6, $7, NOW())`,
        [examId, body.exam.title || `امتحان: ${body.title}`, body.exam.description || '', body.exam.durationMinutes || 30, body.exam.passingScore || 60, body.exam.htmlContent, id]
      );
    }

    return NextResponse.json({ lesson: { id, ...body } }, { status: 201 });
  } catch (error: any) {
    console.error('POST /api/lessons error:', error);
    return NextResponse.json({ error: 'فشل في إنشاء الدرس: ' + error.message }, { status: 500 });
  }
}
