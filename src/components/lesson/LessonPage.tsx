'use client';

import { useState } from 'react';
import { useStore } from '@/lib/store';
import { VideoPlayer, PdfViewer } from '@/components/shared/VideoPlayer';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { toast } from 'sonner';
import {
  ArrowRight, Eye, Clock, FileText, Award, MessageSquare, Heart,
  CheckCircle2, Play, Star, Send, BookOpen, Download
} from 'lucide-react';
import HtmlExamRunner from '@/components/shared/HtmlExamRunner';

export default function LessonPage() {
  const {
    lessons, currentLessonId, currentUser, setView, addComment,
    toggleFavorite, markLessonComplete, comments, assignments, exams,
    users, addGrade
  } = useStore();

  const [tab, setTab] = useState('content');
  const [commentText, setCommentText] = useState('');
  const [commentRating, setCommentRating] = useState(5);

  if (!currentLessonId) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Button onClick={() => setView('student-dashboard')}>العودة</Button>
      </div>
    );
  }

  const lesson = lessons.find(l => l.id === currentLessonId);
  if (!lesson) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <p className="mb-4">الدرس غير موجود</p>
          <Button onClick={() => setView('student-dashboard')}>العودة</Button>
        </div>
      </div>
    );
  }

  const teacher = users.find(u => u.id === lesson.teacherId);
  const lessonComments = comments.filter(c => c.lessonId === lesson.id);
  const assignment = assignments.find(a => a.id === lesson.assignmentId);
  const exam = exams.find(e => e.id === lesson.examId) || exams.find(e => e.isHtmlExam);
  const isFavorite = currentUser?.favorites?.includes(lesson.id);
  const isCompleted = currentUser?.completedLessons?.includes(lesson.id);

  const handleComment = () => {
    if (!commentText.trim()) {
      toast.error('اكتب تعليقاً');
      return;
    }
    addComment(lesson.id, commentText, commentRating);
    setCommentText('');
    setCommentRating(5);
    toast.success('تم إضافة تعليقك');
  };

  return (
    <div className="min-h-screen bg-muted/30">
      {/* Top Bar */}
      <header className="sticky top-0 z-40 h-16 bg-card border-b flex items-center justify-between px-4">
        <Button variant="ghost" onClick={() => setView(`${currentUser?.role}-dashboard` as any)}>
          <ArrowRight className="w-4 h-4 ml-2" />
          العودة
        </Button>
        <div className="flex items-center gap-2">
          <Button variant="ghost" size="icon" onClick={() => toggleFavorite(lesson.id)}>
            <Heart className={`w-5 h-5 ${isFavorite ? 'fill-rose-500 text-rose-500' : ''}`} />
          </Button>
          <Button onClick={() => { markLessonComplete(lesson.id); toast.success('تم وضع علامة مكتمل'); }}>
            <CheckCircle2 className="w-4 h-4 ml-2" />
            {isCompleted ? 'مكتمل' : 'وضع علامة مكتمل'}
          </Button>
        </div>
      </header>

      <div className="container mx-auto px-4 py-6 max-w-7xl">
        <div className="grid lg:grid-cols-3 gap-6">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-6">
            {/* Lesson Title */}
            <div>
              <div className="flex items-center gap-2 mb-2">
                <Badge variant="secondary">{lesson.videoSource}</Badge>
                <Badge variant="outline" className="gap-1"><Clock className="w-3 h-3" />{lesson.videoDuration}</Badge>
                <Badge variant="outline" className="gap-1"><Eye className="w-3 h-3" />{lesson.views.toLocaleString('ar-EG')}</Badge>
              </div>
              <h1 className="text-2xl md:text-3xl font-bold mb-2">{lesson.title}</h1>
              <p className="text-muted-foreground">{lesson.description}</p>
            </div>

            {/* Video */}
            <VideoPlayer lesson={lesson} />

            {/* Tabs */}
            <Tabs value={tab} onValueChange={setTab}>
              <TabsList className="grid w-full grid-cols-5">
                <TabsTrigger value="content">المحتوى</TabsTrigger>
                <TabsTrigger value="pdfs">PDF ({lesson.pdfs.length})</TabsTrigger>
                <TabsTrigger value="files">ملفات ({lesson.additionalFiles.length})</TabsTrigger>
                <TabsTrigger value="assignment">واجب</TabsTrigger>
                <TabsTrigger value="exam">امتحان</TabsTrigger>
              </TabsList>

              {/* Content Tab */}
              <TabsContent value="content" className="space-y-4">
                <Card>
                  <CardHeader><CardTitle className="text-lg">عن الدرس</CardTitle></CardHeader>
                  <CardContent>
                    <p className="text-muted-foreground leading-relaxed mb-4">
                      {lesson.description}
                    </p>
                    <p className="text-muted-foreground leading-relaxed">
                      في هذا الدرس سنتناول المفاهيم الأساسية بأسلوب مبسط مع أمثلة عملية وتمارين متنوعة. سيتعلم الطالب كيفية تطبيق القواعد الرياضية وحل المسائل بشكل منهجي ومنظم، مع التركيز على فهم المبادئ بدلاً من الحفظ.
                    </p>
                  </CardContent>
                </Card>
              </TabsContent>

              {/* PDFs Tab */}
              <TabsContent value="pdfs" className="space-y-4">
                {lesson.pdfs.length === 0 ? (
                  <Card><CardContent className="pt-6 text-center text-muted-foreground">لا توجد ملفات PDF</CardContent></Card>
                ) : (
                  lesson.pdfs.map(pdf => (
                    <PdfViewer key={pdf.id} name={pdf.name} url={pdf.url} allowDownload={lesson.allowPdfDownload} />
                  ))
                )}
              </TabsContent>

              {/* Files Tab */}
              <TabsContent value="files" className="space-y-4">
                {lesson.additionalFiles.length === 0 ? (
                  <Card><CardContent className="pt-6 text-center text-muted-foreground">لا توجد ملفات إضافية</CardContent></Card>
                ) : (
                  lesson.additionalFiles.map(file => (
                    <Card key={file.id}>
                      <CardContent className="p-4 flex items-center gap-3">
                        <div className="w-10 h-10 rounded-lg bg-blue-100 dark:bg-blue-900/30 flex items-center justify-center">
                          <FileText className="w-5 h-5 text-blue-600" />
                        </div>
                        <div className="flex-1">
                          <div className="font-medium text-sm">{file.name}</div>
                          <div className="text-xs text-muted-foreground">{file.type}</div>
                        </div>
                        <Button size="sm" variant="outline">
                          <Download className="w-4 h-4 ml-1" /> تحميل
                        </Button>
                      </CardContent>
                    </Card>
                  ))
                )}
              </TabsContent>

              {/* Assignment Tab */}
              <TabsContent value="assignment">
                {assignment ? (
                  <Card>
                    <CardHeader>
                      <div className="flex items-center justify-between">
                        <CardTitle className="flex items-center gap-2">
                          <FileText className="w-5 h-5 text-emerald-600" />
                          {assignment.title}
                        </CardTitle>
                        <Badge variant="secondary">{assignment.totalPoints} نقطة</Badge>
                      </div>
                      <CardDescription>{assignment.description}</CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      {assignment.questions.map((q, i) => (
                        <div key={q.id} className="p-4 rounded-lg border">
                          <div className="flex items-start gap-2 mb-3">
                            <Badge>{i + 1}</Badge>
                            <p className="flex-1 font-medium">{q.text}</p>
                          </div>
                          {q.type === 'mcq' && (
                            <div className="grid gap-2">
                              {q.options?.map(opt => (
                                <label key={opt} className="flex items-center gap-2 p-2 rounded-lg hover:bg-muted/50 cursor-pointer">
                                  <input type="radio" name={q.id} value={opt} className="w-4 h-4" />
                                  <span className="text-sm">{opt}</span>
                                </label>
                              ))}
                            </div>
                          )}
                          {q.type === 'truefalse' && (
                            <div className="flex gap-2">
                              <Button size="sm" variant="outline">صحيح</Button>
                              <Button size="sm" variant="outline">خطأ</Button>
                            </div>
                          )}
                          {q.type === 'fill' && <Input placeholder="اكتب إجابتك..." />}
                          {q.type === 'essay' && <Textarea rows={3} placeholder="اكتب إجابتك..." />}
                        </div>
                      ))}
                      <Button className="w-full">تسليم الواجب</Button>
                    </CardContent>
                  </Card>
                ) : (
                  <Card><CardContent className="pt-6 text-center text-muted-foreground">لا يوجد واجب لهذا الدرس</CardContent></Card>
                )}
              </TabsContent>

              {/* Exam Tab */}
              <TabsContent value="exam">
                {exam ? (
                  exam.isHtmlExam ? (
                    <HtmlExamRunner
                      exam={exam}
                      studentId={currentUser?.id || ''}
                      studentName={currentUser?.name || ''}
                      onComplete={(score, total) => {
                        addGrade({
                          id: `g-${Date.now()}`,
                          studentId: currentUser?.id || '',
                          studentName: currentUser?.name || '',
                          itemId: exam.id,
                          itemType: 'exam',
                          title: exam.title,
                          score,
                          totalScore: total,
                          date: new Date().toISOString().split('T')[0],
                        });
                        toast.success('تم حفظ نتيجتك');
                      }}
                    />
                  ) : (
                    <Card>
                      <CardHeader>
                        <CardTitle className="flex items-center gap-2">
                          <Award className="w-5 h-5 text-amber-600" />
                          {exam.title}
                        </CardTitle>
                        <CardDescription>{exam.description}</CardDescription>
                      </CardHeader>
                      <CardContent className="space-y-4">
                        {exam.questions.map((q, i) => (
                          <div key={q.id} className="p-4 rounded-lg border">
                            <div className="flex items-start gap-2 mb-3">
                              <Badge>{i + 1}</Badge>
                              <Badge variant="secondary">{q.points} نقطة</Badge>
                              <p className="flex-1 font-medium">{q.text}</p>
                            </div>
                            {q.type === 'mcq' && (
                              <div className="grid gap-2">
                                {q.options?.map(opt => (
                                  <label key={opt} className="flex items-center gap-2 p-2 rounded-lg hover:bg-muted/50 cursor-pointer">
                                    <input type="radio" name={q.id} value={opt} className="w-4 h-4" />
                                    <span className="text-sm">{opt}</span>
                                  </label>
                                ))}
                              </div>
                            )}
                            {q.type === 'truefalse' && (
                              <div className="flex gap-2">
                                <Button size="sm" variant="outline">صحيح</Button>
                                <Button size="sm" variant="outline">خطأ</Button>
                              </div>
                            )}
                            {q.type === 'fill' && <Input placeholder="اكتب إجابتك..." />}
                          </div>
                        ))}
                        <Button className="w-full" size="lg">تسليم الامتحان</Button>
                      </CardContent>
                    </Card>
                  )
                ) : (
                  <Card><CardContent className="pt-6 text-center text-muted-foreground">لا يوجد امتحان لهذا الدرس</CardContent></Card>
                )}
              </TabsContent>
            </Tabs>

            {/* Comments */}
            <Card>
              <CardHeader>
                <CardTitle className="text-lg flex items-center gap-2">
                  <MessageSquare className="w-5 h-5" />
                  التعليقات ({lessonComments.length})
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {/* Add Comment */}
                <div className="space-y-3">
                  <div>
                    <Label>تقييمك</Label>
                    <div className="flex gap-1 mt-1">
                      {[1, 2, 3, 4, 5].map(n => (
                        <button key={n} onClick={() => setCommentRating(n)}>
                          <Star className={`w-6 h-6 ${n <= commentRating ? 'fill-amber-400 text-amber-400' : 'text-muted-foreground'}`} />
                        </button>
                      ))}
                    </div>
                  </div>
                  <Textarea
                    placeholder="اكتب تعليقك..."
                    value={commentText}
                    onChange={e => setCommentText(e.target.value)}
                    rows={3}
                  />
                  <Button onClick={handleComment}>
                    <Send className="w-4 h-4 ml-2" />
                    إرسال التعليق
                  </Button>
                </div>

                <div className="space-y-3 pt-3 border-t">
                  {lessonComments.map(c => (
                    <div key={c.id} className="flex items-start gap-3">
                      <Avatar><AvatarFallback>{c.userAvatar}</AvatarFallback></Avatar>
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-1">
                          <span className="font-medium">{c.userName}</span>
                          {c.rating && (
                            <div className="flex gap-0.5">
                              {Array.from({ length: 5 }).map((_, i) => (
                                <Star key={i} className={`w-3 h-3 ${i < c.rating! ? 'fill-amber-400 text-amber-400' : 'text-muted-foreground'}`} />
                              ))}
                            </div>
                          )}
                          <span className="text-xs text-muted-foreground">{c.createdAt}</span>
                        </div>
                        <p className="text-sm text-muted-foreground">{c.text}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Sidebar */}
          <div className="space-y-4">
            {/* Teacher */}
            {teacher && (
              <Card>
                <CardHeader><CardTitle className="text-lg">المدرس</CardTitle></CardHeader>
                <CardContent>
                  <div className="flex items-center gap-3 mb-3">
                    <Avatar className="w-14 h-14 text-2xl"><AvatarFallback className="text-2xl">{teacher.avatar}</AvatarFallback></Avatar>
                    <div>
                      <div className="font-bold">{teacher.name}</div>
                      <div className="flex items-center gap-1">
                        <Star className="w-3 h-3 fill-amber-400 text-amber-400" />
                        <span className="text-sm">{teacher.rating}</span>
                      </div>
                    </div>
                  </div>
                  <p className="text-sm text-muted-foreground mb-3">{teacher.bio}</p>
                  <div className="grid grid-cols-2 gap-2 text-center text-sm">
                    <div className="p-2 rounded-lg bg-muted/50">
                      <div className="font-bold">{teacher.studentsCount}</div>
                      <div className="text-xs text-muted-foreground">طالب</div>
                    </div>
                    <div className="p-2 rounded-lg bg-muted/50">
                      <div className="font-bold">{teacher.lessonsCount}</div>
                      <div className="text-xs text-muted-foreground">درس</div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            )}

            {/* Quick Actions */}
            <Card>
              <CardHeader><CardTitle className="text-lg">إجراءات سريعة</CardTitle></CardHeader>
              <CardContent className="space-y-2">
                <Button variant="outline" className="w-full justify-start" onClick={() => setTab('pdfs')}>
                  <FileText className="w-4 h-4 ml-2" />
                  ملفات PDF ({lesson.pdfs.length})
                </Button>
                <Button variant="outline" className="w-full justify-start" onClick={() => setTab('assignment')}>
                  <BookOpen className="w-4 h-4 ml-2" />
                  الواجب
                </Button>
                <Button variant="outline" className="w-full justify-start" onClick={() => setTab('exam')}>
                  <Award className="w-4 h-4 ml-2" />
                  الامتحان
                </Button>
                <Button variant="outline" className="w-full justify-start" onClick={() => toggleFavorite(lesson.id)}>
                  <Heart className={`w-4 h-4 ml-2 ${isFavorite ? 'fill-rose-500 text-rose-500' : ''}`} />
                  {isFavorite ? 'إزالة من المفضلة' : 'إضافة للمفضلة'}
                </Button>
              </CardContent>
            </Card>

            {/* Related Lessons */}
            <Card>
              <CardHeader><CardTitle className="text-lg">دروس ذات صلة</CardTitle></CardHeader>
              <CardContent className="space-y-2">
                {lessons.filter(l => l.id !== lesson.id).slice(0, 3).map(l => (
                  <div key={l.id} className="flex items-center gap-2 p-2 rounded-lg hover:bg-muted/50 cursor-pointer"
                    onClick={() => useStore.getState().openLesson(l.id)}>
                    <div className="w-10 h-10 rounded-lg bg-emerald-100 dark:bg-emerald-900/30 flex items-center justify-center shrink-0">
                      <Play className="w-4 h-4 text-emerald-600" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="text-sm font-medium line-clamp-1">{l.title}</div>
                      <div className="text-xs text-muted-foreground">{l.videoDuration}</div>
                    </div>
                  </div>
                ))}
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}
