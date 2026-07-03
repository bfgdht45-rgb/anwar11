import { NextRequest, NextResponse } from 'next/server';
import { query } from '@/lib/db';

export async function GET(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params;
    const result = await query(`SELECT * FROM "Lesson" WHERE id = $1`, [id]);
    if (!result.rows[0]) return NextResponse.json({ error: 'الدرس غير موجود' }, { status: 404 });
    await query(`UPDATE "Lesson" SET views = views + 1 WHERE id = $1`, [id]);
    return NextResponse.json({ lesson: result.rows[0] });
  } catch (error) {
    return NextResponse.json({ error: 'فشل في جلب الدرس' }, { status: 500 });
  }
}

export async function PUT(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params;
    const body = await request.json();
    await query(
      `UPDATE "Lesson" SET title = $1, description = $2, "videoUrl" = $3, "videoSource" = $4, "videoDuration" = $5, "allowPdfDownload" = $6, "updatedAt" = NOW() WHERE id = $7`,
      [body.title, body.description, body.videoUrl, body.videoSource, body.videoDuration, body.allowPdfDownload, id]
    );
    return NextResponse.json({ success: true });
  } catch (error) {
    return NextResponse.json({ error: 'فشل في التحديث' }, { status: 500 });
  }
}

export async function DELETE(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params;
    await query(`DELETE FROM "Lesson" WHERE id = $1`, [id]);
    return NextResponse.json({ success: true });
  } catch (error) {
    return NextResponse.json({ error: 'فشل الحذف' }, { status: 500 });
  }
}
