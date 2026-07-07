'use client';

import { useState, useEffect } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Eye, Clock, Lock, Play, FileText, Download } from 'lucide-react';
import type { Lesson } from '@/lib/types';

interface VideoPlayerProps {
  lesson: Lesson;
}

function normalizeYouTubeUrl(url: string): string {
  if (!url) return '';
  if (url.includes('/embed/')) return url;
  const watchMatch = url.match(/[?&]v=([^&]+)/);
  if (watchMatch) return `https://www.youtube.com/embed/${watchMatch[1]}`;
  const shortMatch = url.match(/youtu\.be\/([^?&]+)/);
  if (shortMatch) return `https://www.youtube.com/embed/${shortMatch[1]}`;
  return url;
}

function normalizeVimeoUrl(url: string): string {
  if (!url) return '';
  if (url.includes('player.vimeo.com')) return url;
  const match = url.match(/vimeo\.com\/(\d+)/);
  if (match) return `https://player.vimeo.com/video/${match[1]}`;
  return url;
}

function normalizeGDriveUrl(url: string): string {
  if (!url) return '';
  if (url.includes('/preview')) return url;
  const match = url.match(/\/file\/d\/([^/]+)/);
  if (match) return `https://drive.google.com/file/d/${match[1]}/preview`;
  return url;
}

export function VideoPlayer({ lesson }: VideoPlayerProps) {
  const [loaded, setLoaded] = useState(false);
  const getVideoUrl = () => {
    switch (lesson.videoSource) {
      case 'youtube': return normalizeYouTubeUrl(lesson.videoUrl);
      case 'vimeo': return normalizeVimeoUrl(lesson.videoUrl);
      case 'gdrive': return normalizeGDriveUrl(lesson.videoUrl);
      default: return lesson.videoUrl;
    }
  };
  const videoUrl = getVideoUrl();

  const renderVideo = () => {
    if (!videoUrl) return <div className="w-full h-full flex items-center justify-center text-white"><p>لم يتم إضافة رابط فيديو</p></div>;
    switch (lesson.videoSource) {
      case 'youtube': return <iframe src={videoUrl} className="w-full h-full" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" allowFullScreen title={lesson.title} onLoad={() => setLoaded(true)} />;
      case 'vimeo': return <iframe src={videoUrl} className="w-full h-full" allow="autoplay; fullscreen; picture-in-picture" allowFullScreen title={lesson.title} onLoad={() => setLoaded(true)} />;
      case 'direct': case 'cloudflare': case 'bunny': return <video controls controlsList="nodownload noplaybackrate" disablePictureInPicture className="w-full h-full" onLoadedData={() => setLoaded(true)} onContextMenu={e => e.preventDefault()}><source src={videoUrl} type="video/mp4" /></video>;
      case 'gdrive': return <iframe src={videoUrl} className="w-full h-full" allow="autoplay" allowFullScreen title={lesson.title} onLoad={() => setLoaded(true)} />;
      default: return null;
    }
  };

  return (
    <Card className="overflow-hidden">
      <div className="relative aspect-video bg-black">
        {!loaded && <div className="absolute inset-0 flex items-center justify-center bg-gradient-to-br from-emerald-900 to-teal-900"><div className="text-center text-white"><Play className="w-10 h-10 mx-auto animate-pulse" /><p className="text-sm opacity-80 mt-2">جاري تحميل الفيديو...</p></div></div>}
        {renderVideo()}
      </div>
      <CardContent className="p-4">
        <div className="flex flex-wrap items-center gap-3">
          <Badge variant="secondary" className="gap-1"><Clock className="w-3 h-3" />{lesson.videoDuration}</Badge>
          <Badge variant="secondary" className="gap-1"><Eye className="w-3 h-3" />{(lesson.views || 0).toLocaleString('ar-EG')} مشاهدة</Badge>
          <Badge variant="outline" className="gap-1"><Lock className="w-3 h-3" />محمي</Badge>
        </div>
      </CardContent>
    </Card>
  );
}

export function PdfViewer({ name, url, allowDownload }: { name: string; url: string; allowDownload: boolean }) {
  const [pdfData, setPdfData] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);
  const isBase64 = url.startsWith('data:');

  useEffect(() => {
    if (isBase64) {
      setPdfData(url);
      setLoading(false);
      return;
    }

    let cancelled = false;
    const loadPdf = async () => {
      try {
        const res = await fetch(`/api/pdf-proxy?url=${encodeURIComponent(url)}`);
        if (!res.ok) throw new Error('فشل');
        const blob = await res.blob();
        if (cancelled) return;
        const blobUrl = URL.createObjectURL(blob);
        setPdfData(blobUrl);
        setLoading(false);
      } catch {
        if (cancelled) return;
        setError(true);
        setLoading(false);
      }
    };
    loadPdf();
    return () => { cancelled = true; };
  }, [url, isBase64]);

  return (
    <Card>
      <CardContent className="p-4">
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center gap-2">
            <div className="w-10 h-10 rounded-lg bg-rose-100 dark:bg-rose-900/30 flex items-center justify-center text-rose-600 font-bold">PDF</div>
            <div className="font-medium text-sm">{name}</div>
          </div>
          {allowDownload && pdfData && !loading && !error && (
            <Button size="sm" variant="outline" asChild>
              <a href={pdfData} download={name}>تحميل</a>
            </Button>
          )}
        </div>
        
        <div className="aspect-[3/4] bg-muted rounded-lg overflow-hidden border flex items-center justify-center">
          {loading ? (
            <div className="text-center">
              <div className="w-12 h-12 mx-auto mb-3 rounded-full border-4 border-emerald-200 border-t-emerald-600 animate-spin"></div>
              <p className="text-sm text-muted-foreground">جاري تحميل الملف...</p>
            </div>
          ) : error ? (
            <div className="text-center p-4">
              <FileText className="w-12 h-12 mx-auto mb-3 text-rose-600" />
              <p className="text-sm font-medium mb-2">تعذر تحميل الملف</p>
              <Button size="sm" asChild>
                <a href={url} target="_blank" rel="noopener noreferrer">فتح الرابط مباشرة</a>
              </Button>
            </div>
          ) : pdfData ? (
            <iframe src={pdfData} className="w-full h-full" title={name} />
          ) : null}
        </div>
        
        {!allowDownload && <p className="text-xs text-muted-foreground mt-2 text-center">تم تعطيل التحميل من قبل الإدارة</p>}
      </CardContent>
    </Card>
  );
}
