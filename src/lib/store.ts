'use client';

import { create } from 'zustand';
import type { User, Lesson, Exam, Notification, Comment, Grade, Coupon, Payment, Invoice, Certificate, AppStats } from './types';

type View =
  | 'landing'
  | 'login'
  | 'register'
  | 'admin-dashboard'
  | 'teacher-dashboard'
  | 'student-dashboard'
  | 'lesson-page'
  | 'browse';

interface Unit {
  id: string;
  title: string;
  description?: string;
  stageId: string;
  yearId: string;
  order: number;
  color: string;
}

interface AppState {
  currentUser: User | null;
  view: View;

  users: User[];
  lessons: Lesson[];
  exams: Exam[];
  units: Unit[];
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
      const res = await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password }),
      });
      const data = await res.json();
      if (!res.ok) return { success: false, message: data.error || 'فشل تسجيل الدخول' };
      set({ currentUser: data.user, view: `${data.user.role}-dashboard` as View });
      if (typeof window !== 'undefined') {
        localStorage.setItem('currentUser', JSON.stringify(data.user));
      }
      return { success: true, message: `مرحباً ${data.user.name}` };
    } catch {
      return { success: false, message: 'خطأ في الاتصال' };
    }
  },

  register: async (newUser) => {
    try {
      const res = await fetch('/api/auth/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(newUser),
      });
      const data = await res.json();
      if (!res.ok) return { success: false, message: data.error || 'فشل إنشاء الحساب' };
      set({ currentUser: data.user, view: `${data.user.role}-dashboard` as View });
      if (typeof window !== 'undefined') {
        localStorage.setItem('currentUser', JSON.stringify(data.user));
      }
      return { success: true, message: `مرحباً ${data.user.name}` };
    } catch {
      return { success: false, message: 'خطأ في الاتصال' };
    }
  },

  logout: () => {
    set({ currentUser: null, view: 'landing' });
    if (typeof window !== 'undefined') localStorage.removeItem('currentUser');
  },

  setView: (view) => set({ view }),
  toggleTheme: () => {
    const newTheme = get().theme === 'light' ? 'dark' : 'light';
    set({ theme: newTheme });
    if (typeof window !== 'undefined') localStorage.setItem('theme', newTheme);
  },

  fetchLessons: async () => {
    try {
      const res = await fetch('/api/lessons');
      const data = await res.json();
      set({ lessons: data.lessons || [] });
    } catch (e) { console.error('fetchLessons:', e); }
  },

  fetchExams: async () => {
    try {
      const res = await fetch('/api/exams');
      const data = await res.json();
      set({ exams: data.exams || [] });
    } catch (e) { console.error('fetchExams:', e); }
  },

  fetchUsers: async () => {
    try {
      const res = await fetch('/api/users');
      const data = await res.json();
      set({ users: data.users || [] });
    } catch (e) { console.error('fetchUsers:', e); }
  },

  fetchUnits: async () => {
    try {
      const res = await fetch('/api/units');
      const data = await res.json();
      set({ units: data.units || [] });
    } catch (e) { console.error('fetchUnits:', e); }
  },

  fetchNotifications: async () => {
    try {
      const user = get().currentUser;
      const url = user ? `/api/notifications?userId=${user.id}` : '/api/notifications';
      const res = await fetch(url);
      const data = await res.json();
      set({ notifications: data.notifications || [] });
    } catch (e) { console.error('fetchNotifications:', e); }
  },

  fetchComments: async (lessonId) => {
    try {
      const url = lessonId ? `/api/comments?lessonId=${lessonId}` : '/api/comments';
      const res = await fetch(url);
      const data = await res.json();
      set({ comments: data.comments || [] });
    } catch (e) { console.error('fetchComments:', e); }
  },

  fetchGrades: async (studentId) => {
    try {
      const url = studentId ? `/api/grades?studentId=${studentId}` : '/api/grades';
      const res = await fetch(url);
      const data = await res.json();
      set({ grades: data.grades || [] });
    } catch (e) { console.error('fetchGrades:', e); }
  },

  fetchCoupons: async () => {
    try {
      const res = await fetch('/api/coupons');
      const data = await res.json();
      set({ coupons: data.coupons || [] });
    } catch (e) { console.error('fetchCoupons:', e); }
  },

  fetchPayments: async () => {
    try {
      const res = await fetch('/api/payments');
      const data = await res.json();
      set({ payments: data.payments || [] });
    } catch (e) { console.error('fetchPayments:', e); }
  },

  fetchStats: async () => {
    try {
      const res = await fetch('/api/stats');
      const data = await res.json();
      set({ stats: data });
    } catch (e) { console.error('fetchStats:', e); }
  },

  fetchQuestions: async () => {
    try {
      const res = await fetch('/api/questions');
      const data = await res.json();
      set({ questionBank: data.questions || [] });
    } catch (e) { console.error('fetchQuestions:', e); }
  },

  addQuestion: async (question) => {
    try {
      const res = await fetch('/api/questions', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(question),
      });
      const data = await res.json();
      if (data.question) {
        await get().fetchQuestions();
        return true;
      }
      return false;
    } catch { return false; }
  },

  deleteQuestion: async (id) => {
    try {
      await fetch(`/api/questions?id=${id}`, { method: 'DELETE' });
      await get().fetchQuestions();
      return true;
    } catch { return false; }
  },

  openLesson: (lessonId) => set({ currentLessonId: lessonId, view: 'lesson-page' }),

  addLesson: async (lesson) => {
    try {
      const res = await fetch('/api/lessons', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(lesson),
      });
      const data = await res.json();
      if (data.lesson) {
        await get().fetchLessons();
        return true;
      }
      console.error('addLesson error:', data.error);
      return false;
    } catch (e) {
      console.error('addLesson error:', e);
      return false;
    }
  },

  updateLesson: async (lessonId, updates) => {
    try {
      const res = await fetch(`/api/lessons/${lessonId}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(updates),
      });
      await get().fetchLessons();
      return res.ok;
    } catch { return false; }
  },

  deleteLesson: async (lessonId) => {
    try {
      await fetch(`/api/lessons/${lessonId}`, { method: 'DELETE' });
      await get().fetchLessons();
      return true;
    } catch { return false; }
  },

  addExam: async (exam) => {
    try {
      const res = await fetch('/api/exams', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(exam),
      });
      const data = await res.json();
      if (data.exam) {
        await get().fetchExams();
        return true;
      }
      return false;
    } catch { return false; }
  },

  deleteExam: async (examId) => {
    try {
      await fetch(`/api/exams/${examId}`, { method: 'DELETE' });
      await get().fetchExams();
      return true;
    } catch { return false; }
  },

  addComment: async (lessonId, text, rating) => {
    try {
      const user = get().currentUser;
      if (!user) return;
      await fetch('/api/comments', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ text, rating, userId: user.id, lessonId }),
      });
      await get().fetchComments(lessonId);
    } catch (e) { console.error('addComment:', e); }
  },

  addNotification: async (notification) => {
    try {
      await fetch('/api/notifications', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(notification),
      });
      await get().fetchNotifications();
    } catch (e) { console.error('addNotification:', e); }
  },

  markNotificationRead: async (id) => {
    try {
      await fetch(`/api/notifications?id=${id}`, { method: 'PUT' });
      await get().fetchNotifications();
    } catch (e) { console.error('markNotificationRead:', e); }
  },

  addUser: async (user) => {
    try {
      const res = await fetch('/api/users', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(user),
      });
      const data = await res.json();
      if (data.user) {
        await get().fetchUsers();
        return true;
      }
      return false;
    } catch { return false; }
  },

  updateUser: async (userId, updates) => {
    try {
      await fetch(`/api/users/${userId}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(updates),
      });
      await get().fetchUsers();
      // تحديث currentUser لو هو نفسه
      const user = get().currentUser;
      if (user?.id === userId) {
        const updated = { ...user, ...updates };
        set({ currentUser: updated });
        if (typeof window !== 'undefined') localStorage.setItem('currentUser', JSON.stringify(updated));
      }
      return true;
    } catch { return false; }
  },

  deleteUser: async (userId) => {
    try {
      await fetch(`/api/users/${userId}`, { method: 'DELETE' });
      await get().fetchUsers();
      return true;
    } catch { return false; }
  },

  addCoupon: async (coupon) => {
    try {
      const res = await fetch('/api/coupons', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(coupon),
      });
      const data = await res.json();
      if (data.coupon) {
        await get().fetchCoupons();
        return true;
      }
      return false;
    } catch { return false; }
  },

  deleteCoupon: async (id) => {
    try {
      await fetch(`/api/coupons?id=${id}`, { method: 'DELETE' });
      await get().fetchCoupons();
      return true;
    } catch { return false; }
  },

  addGrade: async (grade) => {
    try {
      await fetch('/api/grades', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(grade),
      });
      const user = get().currentUser;
      await get().fetchGrades(user?.id);
    } catch (e) { console.error('addGrade:', e); }
  },

  subscribeStudent: async (subscriptionName, amount, method = 'card', couponCode) => {
    try {
      const user = get().currentUser;
      if (!user) return false;
      const res = await fetch('/api/payments', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          amount, subscriptionName, method, couponCode,
          studentId: user.id, studentName: user.name,
        }),
      });
      const data = await res.json();
      if (data.payment) {
        const expiry = new Date();
        expiry.setFullYear(expiry.getFullYear() + 1);
        const updatedUser = {
          ...user,
          subscriptionStatus: 'active' as const,
          subscriptionExpiry: expiry.toISOString().split('T')[0],
        };
        set({ currentUser: updatedUser });
        if (typeof window !== 'undefined') localStorage.setItem('currentUser', JSON.stringify(updatedUser));
        await get().fetchPayments();
        return true;
      }
      return false;
    } catch { return false; }
  },

  toggleFavorite: async (lessonId) => {
    const user = get().currentUser;
    if (!user || user.role !== 'student') return;
    const favorites = user.favorites || [];
    const updated = favorites.includes(lessonId) ? favorites.filter(id => id !== lessonId) : [...favorites, lessonId];
    await get().updateUser(user.id, { favorites: updated });
  },

  markLessonComplete: async (lessonId) => {
    const user = get().currentUser;
    if (!user || user.role !== 'student') return;
    const completed = user.completedLessons || [];
    if (!completed.includes(lessonId)) {
      await get().updateUser(user.id, { completedLessons: [...completed, lessonId] });
    }
  },
}));

if (typeof window !== 'undefined') {
  const saved = localStorage.getItem('currentUser');
  if (saved) {
    try {
      const user = JSON.parse(saved);
      useStore.setState({ currentUser: user, view: `${user.role}-dashboard` as View });
    } catch {}
  }
}
