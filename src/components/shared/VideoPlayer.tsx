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

// تحويل روابط YouTube المختلفة إلى embed URL
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
  const [error, setError] = useState(false);

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
    if (!videoUrl) {
      return (
        <div className="w-full h-full flex items-center justify-center text-white">
          <div className="text-center">
            <AlertCircle className="w-12 h-12 mx-auto mb-2 opacity-50" />
            <p>لم يتم إضافة رابط فيديو لهذا الدرس</p>
          </div>
        </div>
      );
    }

    switch (lesson.videoSource) {
      case 'youtube':
        return (
          <iframe
            src={videoUrl}
            className="w-full h-full"
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
            allowFullScreen
            title={lesson.title}
            onLoad={() => setLoaded(true)}
            onError={() => setError(true)}
          />
        );
      case 'vimeo':
        return (
          <iframe
            src={videoUrl}
            className="w-full h-full"
            allow="autoplay; fullscreen; picture-in-picture"
            allowFullScreen
            title={lesson.title}
            onLoad={() => setLoaded(true)}
          />
        );
      case 'direct':
      case 'cloudflare':
      case 'bunny':
        return (
          <video
            controls
            controlsList="nodownload noplaybackrate"
            disablePictureInPicture
            className="w-full h-full"
            onLoadedData={() => setLoaded(true)}
            onError={() => setError(true)}
            onContextMenu={e => e.preventDefault()}
            autoPlay={false}
          >
            <source src={videoUrl} type="video/mp4" />
            متصفحك لا يدعم تشغيل الفيديو
          </video>
        );
      case 'gdrive':
        return (
          <iframe
            src={videoUrl}
            className="w-full h-full"
            allow="autoplay"
            allowFullScreen
            title={lesson.title}
            onLoad={() => setLoaded(true)}
          />
        );
      default:
        return (
          <div className="w-full h-full flex items-center justify-center text-white">
            <p>مصدر فيديو غير معروف</p>
          </div>
        );
    }
  };

  return (
    <Card className="overflow-hidden">
      <div className="relative aspect-video bg-black">
        {!loaded && !error && (
          <div className="absolute inset-0 flex items-center justify-center bg-gradient-to-br from-emerald-900 to-teal-900">
            <div className="text-center text-white">
              <div className="w-20 h-20 mx-auto mb-3 rounded-full bg-white/20 backdrop-blur-sm flex items-center justify-center animate-pulse">
                <Play className="w-10 h-10 mr-[-3px]" />
              </div>
              <p className="text-sm opacity-80">جاري تحميل الفيديو...</p>
            </div>
          </div>
        )}
        {error && (
          <div className="absolute inset-0 flex items-center justify-center bg-rose-900">
            <div className="text-center text-white p-4">
              <AlertCircle className="w-12 h-12 mx-auto mb-2" />
              <p className="text-sm">تعذر تحميل الفيديو. تأكد من صحة الرابط.</p>
              <p className="text-xs opacity-70 mt-2" dir="ltr">{videoUrl}</p>
            </div>
          </div>
        )}
        {renderVideo()}
        <div className="absolute top-2 right-2 pointer-events-none opacity-30 text-white text-xs">
          © أكاديمية الرياضيات
        </div>
      </div>
      <CardContent className="p-4">
        <div className="flex flex-wrap items-center gap-3">
          <Badge variant="secondary" className="gap-1">
            <Clock className="w-3 h-3" />
            {lesson.videoDuration}
          </Badge>
          <Badge variant="secondary" className="gap-1">
            <Eye className="w-3 h-3" />
            {(lesson.views || 0).toLocaleString('ar-EG')} مشاهدة
          </Badge>
          <Badge variant="outline" className="gap-1">
            <Lock className="w-3 h-3" />
            محمي من التحميل
          </Badge>
          <Badge variant="outline">
            {lesson.videoSource === 'youtube' && 'YouTube'}
            {lesson.videoSource === 'vimeo' && 'Vimeo'}
            {lesson.videoSource === 'direct' && 'رفع مباشر'}
            {lesson.videoSource === 'gdrive' && 'Google Drive'}
            {lesson.videoSource === 'cloudflare' && 'Cloudflare Stream'}
            {lesson.videoSource === 'bunny' && 'Bunny Stream'}
          </Badge>
        </div>
      </CardContent>
    </Card>
  );
}

// ===== PDF Viewer =====
export function PdfViewer({ name, url, allowDownload }: { name: string; url: string; allowDownload: boolean }) {
  const isBase64 = url.startsWith('data:');

  return (
    <Card>
      <CardContent className="p-4">
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center gap-2">
            <div className="w-10 h-10 rounded-lg bg-rose-100 dark:bg-rose-900/30 flex items-center justify-center text-rose-600 font-bold">PDF</div>
            <div className="font-medium text-sm">{name}</div>
          </div>
          <div className="flex gap-2">
            <Button size="sm" variant="outline" asChild>
              <a href={url} target="_blank" rel="noopener noreferrer">فتح الملف</a>
            </Button>
            {allowDownload && (
              <Button size="sm" variant="outline" asChild>
                <a href={url} download={isBase64 ? name : undefined} target="_blank" rel="noopener noreferrer">تحميل</a>
              </Button>
            )}
          </div>
        </div>
        <div className="aspect-[3/4] bg-muted rounded-lg overflow-hidden border flex items-center justify-center">
          {isBase64 ? (
            <iframe src={url} className="w-full h-full" title={name} />
          ) : (
            <object data={url} type="application/pdf" className="w-full h-full" aria-label={name}>
              <div className="text-center p-4">
                <FileText className="w-12 h-12 mx-auto mb-3 text-rose-600" />
                <p className="text-sm font-medium mb-2">المتصفح لا يدعم العرض المباشر لهذا الملف</p>
                <p className="text-xs text-muted-foreground mb-3">لعرض المحتوى، اضغط على زر "فتح الملف" بالأعلى</p>
                <Button size="sm" asChild>
                  <a href={url} target="_blank" rel="noopener noreferrer">فتح الملف في تبويب جديد</a>
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
