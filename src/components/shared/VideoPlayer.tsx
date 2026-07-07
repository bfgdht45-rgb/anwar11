'use client';

import { useState } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Eye, Clock, Lock, Play, FileText } from 'lucide-react';
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
  const isBase64 = url.startsWith('data:');
  const proxyUrl = `/api/pdf-proxy?url=${encodeURIComponent(url)}`;

  return (
    <Card>
      <CardContent className="p-4">
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center gap-2">
            <div className="w-10 h-10 rounded-lg bg-rose-100 dark:bg-rose-900/30 flex items-center justify-center text-rose-600 font-bold">PDF</div>
            <div className="font-medium text-sm">{name}</div>
          </div>
          <div className="flex gap-2">
            {!isBase64 && (
              <Button size="sm" variant="outline" asChild>
                <a href={proxyUrl} target="_blank" rel="noopener noreferrer">فتح في صفحة كاملة</a>
              </Button>
            )}
            {allowDownload && (
              <Button size="sm" variant="outline" asChild>
                <a href={url} download={isBase64 ? name : undefined} target="_blank" rel="noopener noreferrer">تحميل</a>
              </Button>
            )}
          </div>
        </div>
        <div className="aspect-[3/4] bg-muted rounded-lg overflow-hidden border">
          {isBase64 ? (
            <iframe src={url} className="w-full h-full" title={name} />
          ) : (
            <object data={proxyUrl} type="application/pdf" className="w-full h-full">
              <div className="w-full h-full flex flex-col items-center justify-center p-4 text-center">
                <FileText className="w-12 h-12 mx-auto mb-3 text-rose-600" />
                <p className="text-sm font-medium mb-2">المتصفح لا يدعم العرض المباشر</p>
                <p className="text-xs text-muted-foreground mb-3">لعرض محتوى الملف، اضغط على زر "فتح في صفحة كاملة"</p>
                <Button size="sm" asChild>
                  <a href={proxyUrl} target="_blank" rel="noopener noreferrer">فتح الملف</a>
                </Button>
              </div>
            </object>
          )}
        </div>
        {!allowDownload && <p className="text-xs text-muted-foreground mt-2 text-center">تم تعطيل التحميل من قبل الإدارة</p>}
      </CardContent>
    </Card>
  );
}
