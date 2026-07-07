'use client';

import { useState, Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { FileText, Download, ArrowRight, Loader2, AlertCircle } from 'lucide-react';

function PDFViewerContent() {
  const searchParams = useSearchParams();
  const url = searchParams.get('url');
  const name = searchParams.get('name') || 'ملف PDF';
  const download = searchParams.get('download') === 'true';

  if (!url) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-muted/30 p-4">
        <Card className="w-full max-w-md">
          <CardContent className="pt-6 text-center">
            <AlertCircle className="w-12 h-12 mx-auto mb-3 text-rose-600" />
            <h2 className="text-lg font-bold mb-1">تعذر تحميل الملف</h2>
            <p className="text-sm text-muted-foreground mb-4">قد يكون الرابط غير صحيح أو الملف محمي.</p>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-muted/30">
      <header className="sticky top-0 z-40 h-16 bg-card border-b flex items-center justify-between px-4">
        <Button variant="ghost" onClick={() => window.history.back()}>
          <ArrowRight className="w-4 h-4 ml-2" /> العودة
        </Button>
        <div className="flex items-center gap-2">
          <FileText className="w-5 h-5 text-rose-600" />
          <h1 className="font-bold text-sm truncate max-w-xs md:max-w-md">{name}</h1>
        </div>
        {download && (
          <Button size="sm" variant="outline" asChild>
            <a href={url} target="_blank" rel="noopener noreferrer">
              <Download className="w-4 h-4 ml-2" /> تحميل
            </a>
          </Button>
        )}
      </header>
      
      <div className="w-full h-[calc(100vh-4rem)]">
        <iframe src={url} className="w-full h-full border-0" title={name} />
      </div>
    </div>
  );
}

export default function PDFViewerPage() {
  return (
    <Suspense fallback={<div className="min-h-screen flex items-center justify-center"><Loader2 className="w-8 h-8 animate-spin" /></div>}>
      <PDFViewerContent />
    </Suspense>
  );
}
