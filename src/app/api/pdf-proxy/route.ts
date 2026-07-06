import { NextRequest, NextResponse } from 'next/server';

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const url = searchParams.get('url');
  if (!url) return NextResponse.json({ error: 'URL required' }, { status: 400 });
  try {
    const response = await fetch(url);
    if (!response.ok) return NextResponse.json({ error: 'Failed' }, { status: response.status });
    const blob = await response.blob();
    return new NextResponse(blob, { headers: { 'Content-Type': 'application/pdf', 'Content-Disposition': 'inline', 'Cache-Control': 'public, max-age=3600' } });
  } catch (error) {
    return NextResponse.json({ error: 'Failed' }, { status: 500 });
  }
}
