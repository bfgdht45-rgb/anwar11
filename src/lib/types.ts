// ===== Core Types =====
export type UserRole = 'admin' | 'teacher' | 'student';

export interface User {
  id: string;
  name: string;
  email: string;
  password: string;
  role: UserRole;
  avatar: string;
  phone?: string;
  createdAt: string;
  // Student specific
  stage?: EducationalStage;
  year?: YearLevel;
  subscriptionStatus?: 'active' | 'expired' | 'pending';
  subscriptionExpiry?: string;
  completedLessons?: string[];
  favorites?: string[];
  // Teacher specific
  bio?: string;
  rating?: number;
  studentsCount?: number;
  lessonsCount?: number;
  totalEarnings?: number;
  specialties?: string[];
}

export type EducationalStage = 'middle' | 'high';
export type YearLevel = 'first' | 'second' | 'third';

export interface Stage {
  id: EducationalStage;
  name: string;
  nameEn: string;
  icon: string;
  years: Year[];
}

export interface Year {
  id: YearLevel;
  stageId: EducationalStage;
  name: string;
  icon: string;
}

export interface Unit {
  id: string;
  yearId: YearLevel;
  stageId: EducationalStage;
  title: string;
  description: string;
  order: number;
  lessonsCount: number;
  color: string;
}

export interface Lesson {
  id: string;
  unitId: string;
  title: string;
  description: string;
  teacherId: string;
  videoUrl: string;
  videoSource: 'youtube' | 'vimeo' | 'direct' | 'gdrive' | 'cloudflare' | 'bunny';
  videoDuration: string;
  pdfs: PDFFile[];
  additionalFiles: AdditionalFile[];
  assignmentId?: string;
  examId?: string;
  views: number;
  order: number;
  createdAt: string;
  allowPdfDownload: boolean;
}

export interface PDFFile {
  id: string;
  name: string;
  url: string;
  size: string;
  pages: number;
}

export interface AdditionalFile {
  id: string;
  name: string;
  url: string;
  type: string;
}

export type QuestionType = 'mcq' | 'truefalse' | 'fill' | 'essay' | 'image';
export type Difficulty = 'easy' | 'medium' | 'hard';

export interface Question {
  id: string;
  type: QuestionType;
  difficulty: Difficulty;
  text: string;
  options?: string[];
  correctAnswer: string;
  explanation?: string;
  points: number;
  imageUrl?: string;
}

export interface Assignment {
  id: string;
  lessonId?: string;
  title: string;
  description: string;
  questions: Question[];
  dueDate: string;
  totalPoints: number;
  autoGrade: boolean;
}

export interface Exam {
  id: string;
  lessonId?: string;
  title: string;
  description: string;
  durationMinutes: number;
  questions: Question[];
  preventBack: boolean;
  randomOrder: boolean;
  showGrade: boolean;
  showSolution: boolean;
  passingScore: number;
  // HTML-based interactive exam
  htmlContent?: string;
  isHtmlExam?: boolean;
}

export interface QuestionBankItem extends Question {
  stageId: EducationalStage;
  yearId: YearLevel;
  unitId?: string;
  lessonId?: string;
}

export interface Comment {
  id: string;
  lessonId: string;
  userId: string;
  userName: string;
  userAvatar: string;
  text: string;
  rating?: number;
  createdAt: string;
  replies?: Comment[];
}

export interface Review {
  id: string;
  studentName: string;
  avatar: string;
  text: string;
  rating: number;
  stage: string;
}

export interface Notification {
  id: string;
  userId?: string; // if undefined, broadcast
  title: string;
  message: string;
  type: 'info' | 'success' | 'warning' | 'error';
  createdAt: string;
  read: boolean;
}

export interface Coupon {
  id: string;
  code: string;
  discount: number;
  type: 'percentage' | 'fixed';
  maxUses: number;
  usedCount: number;
  expiry: string;
  active: boolean;
}

export interface Subscription {
  id: string;
  name: string;
  price: number;
  duration: string;
  features: string[];
  popular?: boolean;
}

export interface Payment {
  id: string;
  studentId: string;
  studentName: string;
  amount: number;
  subscriptionName: string;
  method: 'card' | 'paypal' | 'fawry' | 'vodafone_cash';
  status: 'completed' | 'pending' | 'failed';
  date: string;
  couponCode?: string;
}

export interface Invoice {
  id: string;
  studentId: string;
  amount: number;
  subscriptionName: string;
  date: string;
  status: 'paid' | 'unpaid';
}

export interface Certificate {
  id: string;
  studentId: string;
  studentName: string;
  courseName: string;
  issueDate: string;
  grade: number;
}

export interface FAQ {
  id: string;
  question: string;
  answer: string;
}

export interface Grade {
  id: string;
  studentId: string;
  studentName: string;
  itemId: string;
  itemType: 'assignment' | 'exam';
  title: string;
  score: number;
  totalScore: number;
  date: string;
}

export interface AppStats {
  totalStudents: number;
  totalTeachers: number;
  totalSubscriptions: number;
  totalVideos: number;
  totalLessons: number;
  totalExams: number;
  totalVisits: number;
  totalRevenue: number;
  monthlyRevenue: { month: string; revenue: number }[];
  weeklyVisits: { day: string; visits: number }[];
}
