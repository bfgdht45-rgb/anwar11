'use client';

import { useState } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Eye, Clock, Lock, Play } from 'lucide-react';
import type { Lesson } from '@/lib/types';

interface VideoPlayerProps {
  lesson: Lesson;
}

export function VideoPlayer({ lesson }: VideoPlayerProps) {
  const [loaded, setLoaded] = useState(false);

  const renderVideo = () => {
    switch (lesson.videoSource) {
      case 'youtube':
        return (
          <iframe
            src={lesson.videoUrl}
            className="w-full h-full"
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
            allowFullScreen
            title={lesson.title}
            onLoad={() => setLoaded(true)}
            sandbox="allow-scripts allow-same-origin allow-presentation"
          />
        );
      case 'vimeo':
        return (
          <iframe
            src={lesson.videoUrl}
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
            onContextMenu={e => e.preventDefault()}
          >
            <source src={lesson.videoUrl} type="video/mp4" />
            متصفحك لا يدعم تشغيل الفيديو
          </video>
        );
      case 'gdrive':
        return (
          <iframe
            src={lesson.videoUrl}
            className="w-full h-full"
            allow="autoplay"
            allowFullScreen
            title={lesson.title}
            onLoad={() => setLoaded(true)}
          />
        );
      default:
        return null;
    }
  };

  return (
    <Card className="overflow-hidden">
      <div className="relative aspect-video bg-black">
        {!loaded && (
          <div className="absolute inset-0 flex items-center justify-center bg-gradient-to-br from-emerald-900 to-teal-900">
            <div className="text-center text-white">
              <div className="w-20 h-20 mx-auto mb-3 rounded-full bg-white/20 backdrop-blur-sm flex items-center justify-center animate-pulse">
                <Play className="w-10 h-10 mr-[-3px]" />
              </div>
              <p className="text-sm opacity-80">جاري تحميل الفيديو...</p>
            </div>
          </div>
        )}
        {renderVideo()}
        {/* Watermark to prevent screen recording */}
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
            {lesson.views.toLocaleString('ar-EG')} مشاهدة
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
  return (
    <Card>
      <CardContent className="p-4">
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center gap-2">
            <div className="w-10 h-10 rounded-lg bg-rose-100 dark:bg-rose-900/30 flex items-center justify-center text-rose-600 font-bold">
              PDF
            </div>
            <div>
              <div className="font-medium text-sm">{name}</div>
            </div>
          </div>
          <div className="flex gap-2">
            <Button size="sm" variant="outline" asChild>
              <a href={url} target="_blank" rel="noopener noreferrer">
                <Eye className="w-4 h-4 ml-1" /> فتح
              </a>
            </Button>
            {allowDownload && (
              <Button size="sm" variant="outline" asChild>
                <a href={url} download={name} target="_blank" rel="noopener noreferrer">
                  تحميل
                </a>
              </Button>
            )}
          </div>
        </div>
        <div className="aspect-[3/4] bg-muted rounded-lg overflow-hidden border">
          <iframe
            src={url}
            className="w-full h-full"
            title={name}
          />
        </div>
        {!allowDownload && (
          <p className="text-xs text-muted-foreground mt-2 text-center">
            تم تعطيل التحميل من قبل الإدارة
          </p>
        )}
      </CardContent>
    </Card>
  );
}
