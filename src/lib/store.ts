'use client';

import { create } from 'zustand';
import type { User, Lesson, Exam, Notification, Comment, Grade, Coupon, Payment, Invoice, Certificate, AppStats } from './types';

type View =
  | 'landing' | 'login' | 'register'
  | 'admin-dashboard' | 'teacher-dashboard' | 'student-dashboard'
  | 'lesson-page' | 'browse';

interface AppState {
  currentUser: User | null;
  view: View;
  users: User[];
  lessons: Lesson[];
  exams: Exam[];
  units: any[];
  notifications: Notification[];
  comments: Comment[];
  coupons: Coupon[];
  payments: Payment[];
  invoices: Invoice[];
  certificates: Certificate[];
  grades: Grade[];
  stats: AppStats | null;
  questionBank: any[];
  loading: boolean;
  currentLessonId: string | null;
  theme: 'light' | 'dark';

  login: (email: string, password: string) => Promise<{ success: boolean; message: string }>;
  register: (user: Partial<User> & { password: string }) => Promise<{ success: boolean; message: string }>;
  logout: () => void;
  setView: (view: View) => void;
  toggleTheme: () => void;
  fetchLessons: () => Promise<void>;
  fetchExams: () => Promise<void>;
  fetchUsers: () => Promise<void>;
  fetchUnits: () => Promise<void>;
  fetchNotifications: () => Promise<void>;
  fetchComments: (lessonId?: string) => Promise<void>;
  fetchGrades: (studentId?: string) => Promise<void>;
  fetchCoupons: () => Promise<void>;
  fetchPayments: () => Promise<void>;
  fetchStats: () => Promise<void>;
  fetchQuestions: () => Promise<void>;
  addQuestion: (question: any) => Promise<boolean>;
  deleteQuestion: (id: string) => Promise<boolean>;
  openLesson: (lessonId: string) => void;
  addLesson: (lesson: any) => Promise<boolean>;
  updateLesson: (lessonId: string, updates: any) => Promise<boolean>;
  deleteLesson: (lessonId: string) => Promise<boolean>;
  addExam: (exam: any) => Promise<boolean>;
  deleteExam: (examId: string) => Promise<boolean>;
  addComment: (lessonId: string, text: string, rating?: number) => Promise<void>;
  addNotification: (notification: any) => Promise<void>;
  markNotificationRead: (id: string) => Promise<void>;
  addUser: (user: any) => Promise<boolean>;
  updateUser: (userId: string, updates: any) => Promise<boolean>;
  deleteUser: (userId: string) => Promise<boolean>;
  addCoupon: (coupon: any) => Promise<boolean>;
  deleteCoupon: (id: string) => Promise<boolean>;
  addGrade: (grade: any) => Promise<void>;
  submitAssignmentAnswer: (data: any) => Promise<boolean>;
  fetchStudentAnswers: (assignmentId?: string) => Promise<any[]>;
  subscribeStudent: (subscriptionName: string, amount: number, method?: string, couponCode?: string) => Promise<boolean>;
  toggleFavorite: (lessonId: string) => Promise<void>;
  markLessonComplete: (lessonId: string) => Promise<void>;
}

export const useStore = create<AppState>((set, get) => ({
  currentUser: null,
  view: 'landing',
  users: [],
  lessons: [],
  exams: [],
  units: [],
  notifications: [],
  comments: [],
  coupons: [],
  payments: [],
  invoices: [],
  certificates: [],
  grades: [],
  stats: null,
  questionBank: [],
  loading: false,
  currentLessonId: null,
  theme: typeof window !== 'undefined' ? (localStorage.getItem('theme') as 'light' | 'dark' || 'light') : 'light',

  login: async (email, password) => {
    try {
      const res = await fetch('/api/auth/login', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ email, password }) });
      const data = await res.json();
      if (!res.ok) return { success: false, message: data.error || 'فشل تسجيل الدخول' };
      set({ currentUser: data.user, view: `${data.user.role}-dashboard` as View });
      if (typeof window !== 'undefined') localStorage.setItem('currentUser', JSON.stringify(data.user));
      return { success: true, message: `مرحباً ${data.user.name}` };
    } catch { return { success: false, message: 'خطأ في الاتصال' }; }
  },

  register: async (newUser) => {
    try {
      const res = await fetch('/api/auth/register', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(newUser) });
      const data = await res.json();
      if (!res.ok) return { success: false, message: data.error || 'فشل إنشاء الحساب' };
      set({ currentUser: data.user, view: `${data.user.role}-dashboard` as View });
      if (typeof window !== 'undefined') localStorage.setItem('currentUser', JSON.stringify(data.user));
      return { success: true, message: `مرحباً ${data.user.name}` };
    } catch { return { success: false, message: 'خطأ في الاتصال' }; }
  },

  logout: () => { set({ currentUser: null, view: 'landing' }); if (typeof window !== 'undefined') localStorage.removeItem('currentUser'); },
  setView: (view) => set({ view }),
  toggleTheme: () => { const n = get().theme === 'light' ? 'dark' : 'light'; set({ theme: n }); if (typeof window !== 'undefined') localStorage.setItem('theme', n); },

  fetchLessons: async () => { try { const res = await fetch('/api/lessons'); const data = await res.json(); set({ lessons: data.lessons || [] }); } catch (e) {} },
  fetchExams: async () => { try { const res = await fetch('/api/exams'); const data = await res.json(); set({ exams: data.exams || [] }); } catch (e) {} },
  fetchUsers: async () => { try { const res = await fetch('/api/users'); const data = await res.json(); set({ users: data.users || [] }); } catch (e) {} },
  fetchUnits: async () => { try { const res = await fetch('/api/units'); const data = await res.json(); set({ units: data.units || [] }); } catch (e) {} },
  fetchNotifications: async () => { try { const user = get().currentUser; const url = user ? `/api/notifications?userId=${user.id}` : '/api/notifications'; const res = await fetch(url); const data = await res.json(); set({ notifications: data.notifications || [] }); } catch (e) {} },
  fetchComments: async (lessonId) => { try { const url = lessonId ? `/api/comments?lessonId=${lessonId}` : '/api/comments'; const res = await fetch(url); const data = await res.json(); set({ comments: data.comments || [] }); } catch (e) {} },
  fetchGrades: async (studentId) => { try { const url = studentId ? `/api/grades?studentId=${studentId}` : '/api/grades'; const res = await fetch(url); const data = await res.json(); set({ grades: data.grades || [] }); } catch (e) {} },
  fetchCoupons: async () => { try { const res = await fetch('/api/coupons'); const data = await res.json(); set({ coupons: data.coupons || [] }); } catch (e) {} },
  fetchPayments: async () => { try { const res = await fetch('/api/payments'); const data = await res.json(); set({ payments: data.payments || [] }); } catch (e) {} },
  fetchStats: async () => { try { const res = await fetch('/api/stats'); const data = await res.json(); set({ stats: data }); } catch (e) {} },
  fetchQuestions: async () => { try { const res = await fetch('/api/questions'); const data = await res.json(); set({ questionBank: data.questions || [] }); } catch (e) {} },

  addQuestion: async (q) => { try { const res = await fetch('/api/questions', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(q) }); const data = await res.json(); if (data.question) { await get().fetchQuestions(); return true; } return false; } catch { return false; } },
  deleteQuestion: async (id) => { try { await fetch(`/api/questions?id=${id}`, { method: 'DELETE' }); await get().fetchQuestions(); return true; } catch { return false; } },

  openLesson: (lessonId) => set({ currentLessonId: lessonId, view: 'lesson-page' }),
  addLesson: async (lesson) => { try { const res = await fetch('/api/lessons', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(lesson) }); const data = await res.json(); if (data.lesson) { await get().fetchLessons(); return true; } return false; } catch (e) { return false; } },
  updateLesson: async (id, updates) => { try { await fetch(`/api/lessons/${id}`, { method: 'PUT', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(updates) }); await get().fetchLessons(); return true; } catch { return false; } },
  deleteLesson: async (id) => { try { await fetch(`/api/lessons/${id}`, { method: 'DELETE' }); await get().fetchLessons(); return true; } catch { return false; } },

  addExam: async (exam) => { try { const res = await fetch('/api/exams', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(exam) }); const data = await res.json(); if (data.exam) { await get().fetchExams(); return true; } return false; } catch { return false; } },
  deleteExam: async (id) => { try { await fetch(`/api/exams/${id}`, { method: 'DELETE' }); await get().fetchExams(); return true; } catch { return false; } },

  addComment: async (lessonId, text, rating) => { try { const user = get().currentUser; if (!user) return; await fetch('/api/comments', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ text, rating, userId: user.id, lessonId }) }); await get().fetchComments(lessonId); } catch (e) {} },
  addNotification: async (n) => { try { await fetch('/api/notifications', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(n) }); await get().fetchNotifications(); } catch (e) {} },
  markNotificationRead: async (id) => { try { await fetch(`/api/notifications?id=${id}`, { method: 'PUT' }); await get().fetchNotifications(); } catch (e) {} },

  addUser: async (user) => { try { const res = await fetch('/api/users', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(user) }); const data = await res.json(); if (data.user) { await get().fetchUsers(); return true; } return false; } catch { return false; } },
  updateUser: async (id, updates) => { try { await fetch(`/api/users/${id}`, { method: 'PUT', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(updates) }); await get().fetchUsers(); const u = get().currentUser; if (u?.id === id) { const updated = { ...u, ...updates }; set({ currentUser: updated }); if (typeof window !== 'undefined') localStorage.setItem('currentUser', JSON.stringify(updated)); } return true; } catch { return false; } },
  deleteUser: async (id) => { try { await fetch(`/api/users/${id}`, { method: 'DELETE' }); await get().fetchUsers(); return true; } catch { return false; } },

  addCoupon: async (c) => { try { const res = await fetch('/api/coupons', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(c) }); const data = await res.json(); if (data.coupon) { await get().fetchCoupons(); return true; } return false; } catch { return false; } },
  deleteCoupon: async (id) => { try { await fetch(`/api/coupons?id=${id}`, { method: 'DELETE' }); await get().fetchCoupons(); return true; } catch { return false; } },

  addGrade: async (grade) => { try { await fetch('/api/grades', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(grade) }); const u = get().currentUser; await get().fetchGrades(u?.id); } catch (e) {} },

  submitAssignmentAnswer: async (data) => { try { await fetch('/api/answers', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(data) }); return true; } catch (e) { return false; } },
  fetchStudentAnswers: async (assignmentId) => { try { const url = assignmentId ? `/api/answers?assignmentId=${assignmentId}` : '/api/answers'; const res = await fetch(url); const data = await res.json(); return data.answers || []; } catch (e) { return []; } },

  subscribeStudent: async (name, amount, method = 'card', coupon) => { try { const u = get().currentUser; if (!u) return false; const res = await fetch('/api/payments', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ amount, subscriptionName: name, method, couponCode: coupon, studentId: u.id, studentName: u.name }) }); const data = await res.json(); if (data.payment) { const exp = new Date(); exp.setFullYear(exp.getFullYear() + 1); const updated = { ...u, subscriptionStatus: 'active' as const, subscriptionExpiry: exp.toISOString().split('T')[0] }; set({ currentUser: updated }); if (typeof window !== 'undefined') localStorage.setItem('currentUser', JSON.stringify(updated)); await get().fetchPayments(); return true; } return false; } catch { return false; } },

  toggleFavorite: async (lessonId) => { const u = get().currentUser; if (!u || u.role !== 'student') return; const fav = u.favorites || []; const up = fav.includes(lessonId) ? fav.filter(id => id !== lessonId) : [...fav, lessonId]; await get().updateUser(u.id, { favorites: up }); },
  markLessonComplete: async (lessonId) => { const u = get().currentUser; if (!u || u.role !== 'student') return; const c = u.completedLessons || []; if (!c.includes(lessonId)) { await get().updateUser(u.id, { completedLessons: [...c, lessonId] }); } },
}));

if (typeof window !== 'undefined') {
  const saved = localStorage.getItem('currentUser');
  if (saved) { try { const u = JSON.parse(saved); useStore.setState({ currentUser: u, view: `${u.role}-dashboard` as View }); } catch {} }
}
