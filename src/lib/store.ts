'use client';

import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import type { User, Lesson, Assignment, Exam, Notification } from './types';
import {
  demoUsers, demoLessons, demoAssignments, demoExams,
  demoNotifications, demoComments, demoCoupons, demoPayments,
  demoInvoices, demoCertificates, demoGrades, questionBank
} from './data';

type View =
  | 'landing'
  | 'login'
  | 'register'
  | 'admin-dashboard'
  | 'teacher-dashboard'
  | 'student-dashboard'
  | 'lesson-page'
  | 'browse';

interface AppState {
  // Auth
  currentUser: User | null;
  users: User[];
  view: View;
  
  // Data stores (so changes persist in session)
  lessons: Lesson[];
  assignments: Assignment[];
  exams: Exam[];
  notifications: Notification[];
  comments: typeof demoComments;
  coupons: typeof demoCoupons;
  payments: typeof demoPayments;
  invoices: typeof demoInvoices;
  certificates: typeof demoCertificates;
  grades: typeof demoGrades;
  questionBank: typeof questionBank;
  
  // Navigation context
  currentLessonId: string | null;
  currentBrowseContext: { stageId?: string; yearId?: string; unitId?: string } | null;
  
  // Theme
  theme: 'light' | 'dark';
  
  // Actions
  login: (email: string, password: string) => { success: boolean; message: string };
  register: (user: Partial<User> & { password: string }) => { success: boolean; message: string };
  logout: () => void;
  setView: (view: View) => void;
  toggleTheme: () => void;
  
  // Lesson
  openLesson: (lessonId: string) => void;
  addLesson: (lesson: Lesson) => void;
  updateLesson: (lessonId: string, updates: Partial<Lesson>) => void;
  deleteLesson: (lessonId: string) => void;
  
  // Assignment
  addAssignment: (assignment: Assignment) => void;
  
  // Exam
  addExam: (exam: Exam) => void;
  updateExam: (examId: string, updates: Partial<Exam>) => void;
  deleteExam: (examId: string) => void;
  
  // Comments
  addComment: (lessonId: string, text: string, rating?: number) => void;
  
  // Notifications
  addNotification: (notification: Notification) => void;
  markNotificationRead: (id: string) => void;
  
  // Users management
  addUser: (user: User) => void;
  updateUser: (userId: string, updates: Partial<User>) => void;
  deleteUser: (userId: string) => void;
  
  // Coupons
  addCoupon: (coupon: typeof demoCoupons[number]) => void;
  updateCoupon: (id: string, updates: Partial<typeof demoCoupons[number]>) => void;
  deleteCoupon: (id: string) => void;
  
  // Grades
  addGrade: (grade: typeof demoGrades[number]) => void;
  
  // Question Bank
  addQuestion: (question: typeof questionBank[number]) => void;
  deleteQuestion: (id: string) => void;
  
  // Comments management
  deleteComment: (id: string) => void;
  
  // Payments
  addPayment: (payment: typeof demoPayments[number]) => void;
  
  // Certificates
  addCertificate: (cert: typeof demoCertificates[number]) => void;
  
  // Subscriptions - student subscribes
  subscribeStudent: (subscriptionName: string, amount: number) => void;
  
  // Backup
  exportBackup: () => string;
  importBackup: (data: string) => boolean;
  
  // Favorites (student)
  toggleFavorite: (lessonId: string) => void;
  markLessonComplete: (lessonId: string) => void;
  
  // Browse navigation
  setBrowseContext: (ctx: { stageId?: string; yearId?: string; unitId?: string }) => void;
}

export const useStore = create<AppState>()(
  persist(
    (set, get) => ({
      currentUser: null,
      users: demoUsers,
      view: 'landing',
      lessons: demoLessons,
      assignments: demoAssignments,
      exams: demoExams,
      notifications: demoNotifications,
      comments: demoComments,
      coupons: demoCoupons,
      payments: demoPayments,
      invoices: demoInvoices,
      certificates: demoCertificates,
      grades: demoGrades,
      questionBank: questionBank,
      currentLessonId: null,
      currentBrowseContext: null,
      theme: 'light',

      login: (email, password) => {
        const user = get().users.find(
          u => u.email.toLowerCase() === email.toLowerCase() && u.password === password
        );
        if (user) {
          set({ currentUser: user, view: `${user.role}-dashboard` as View });
          return { success: true, message: `مرحباً ${user.name}` };
        }
        return { success: false, message: 'البريد الإلكتروني أو كلمة المرور غير صحيحة' };
      },

      register: (newUser) => {
        const exists = get().users.find(u => u.email === newUser.email);
        if (exists) {
          return { success: false, message: 'البريد الإلكتروني مستخدم بالفعل' };
        }
        const user: User = {
          id: `${newUser.role}-${Date.now()}`,
          name: newUser.name || '',
          email: newUser.email || '',
          password: newUser.password,
          role: newUser.role || 'student',
          avatar: newUser.role === 'teacher' ? '👨‍🏫' : '🧑‍🎓',
          createdAt: new Date().toISOString().split('T')[0],
          ...(newUser.role === 'student' && {
            stage: newUser.stage,
            year: newUser.year,
            subscriptionStatus: 'pending',
            completedLessons: [],
            favorites: [],
          }),
          ...(newUser.role === 'teacher' && {
            bio: newUser.bio || 'مدرس رياضيات',
            rating: 0,
            studentsCount: 0,
            lessonsCount: 0,
            totalEarnings: 0,
            specialties: newUser.specialties || [],
          }),
        };
        set(state => ({ users: [...state.users, user], currentUser: user, view: `${user.role}-dashboard` as View }));
        return { success: true, message: `تم إنشاء الحساب بنجاح. مرحباً ${user.name}` };
      },

      logout: () => set({ currentUser: null, view: 'landing' }),
      setView: (view) => set({ view }),
      toggleTheme: () => set(state => ({ theme: state.theme === 'light' ? 'dark' : 'light' })),

      openLesson: (lessonId) => set({ currentLessonId: lessonId, view: 'lesson-page' }),
      addLesson: (lesson) => set(state => ({ lessons: [...state.lessons, lesson] })),
      updateLesson: (lessonId, updates) => set(state => ({
        lessons: state.lessons.map(l => l.id === lessonId ? { ...l, ...updates } : l),
      })),
      deleteLesson: (lessonId) => set(state => ({
        lessons: state.lessons.filter(l => l.id !== lessonId),
      })),

      addAssignment: (assignment) => set(state => ({ assignments: [...state.assignments, assignment] })),
      addExam: (exam) => set(state => ({ exams: [...state.exams, exam] })),
      updateExam: (examId, updates) => set(state => ({
        exams: state.exams.map(e => e.id === examId ? { ...e, ...updates } : e),
      })),
      deleteExam: (examId) => set(state => ({ exams: state.exams.filter(e => e.id !== examId) })),

      addComment: (lessonId, text, rating) => {
        const user = get().currentUser;
        if (!user) return;
        const comment = {
          id: `c-${Date.now()}`,
          lessonId, userId: user.id, userName: user.name, userAvatar: user.avatar,
          text, rating, createdAt: new Date().toISOString().split('T')[0],
          replies: [],
        };
        set(state => ({ comments: [...state.comments, comment] }));
      },

      addNotification: (notification) => set(state => ({ notifications: [...state.notifications, notification] })),
      markNotificationRead: (id) => set(state => ({
        notifications: state.notifications.map(n => n.id === id ? { ...n, read: true } : n),
      })),

      addUser: (user) => set(state => ({ users: [...state.users, user] })),
      updateUser: (userId, updates) => set(state => ({
        users: state.users.map(u => u.id === userId ? { ...u, ...updates } : u),
        currentUser: get().currentUser?.id === userId ? { ...get().currentUser!, ...updates } : get().currentUser,
      })),
      deleteUser: (userId) => set(state => ({ users: state.users.filter(u => u.id !== userId) })),

      addCoupon: (coupon) => set(state => ({ coupons: [...state.coupons, coupon] })),
      updateCoupon: (id, updates) => set(state => ({
        coupons: state.coupons.map(c => c.id === id ? { ...c, ...updates } : c),
      })),
      deleteCoupon: (id) => set(state => ({ coupons: state.coupons.filter(c => c.id !== id) })),

      addGrade: (grade) => set(state => ({ grades: [...state.grades, grade] })),

      addQuestion: (question) => set(state => ({ questionBank: [...state.questionBank, question] })),
      deleteQuestion: (id) => set(state => ({ questionBank: state.questionBank.filter(q => q.id !== id) })),

      deleteComment: (id) => set(state => ({ comments: state.comments.filter(c => c.id !== id) })),

      addPayment: (payment) => set(state => ({ payments: [...state.payments, payment] })),
      addCertificate: (cert) => set(state => ({ certificates: [...state.certificates, cert] })),

      subscribeStudent: (subscriptionName, amount) => {
        const user = get().currentUser;
        if (!user || user.role !== 'student') return;
        const payment = {
          id: `pay-${Date.now()}`,
          studentId: user.id,
          studentName: user.name,
          amount,
          subscriptionName,
          method: 'card' as const,
          status: 'completed' as const,
          date: new Date().toISOString().split('T')[0],
        };
        const invoice = {
          id: `inv-${Date.now()}`,
          studentId: user.id,
          amount,
          subscriptionName,
          date: new Date().toISOString().split('T')[0],
          status: 'paid' as const,
        };
        const expiry = new Date();
        expiry.setFullYear(expiry.getFullYear() + 1);
        set(state => ({
          payments: [...state.payments, payment],
          invoices: [...state.invoices, invoice],
        }));
        get().updateUser(user.id, {
          subscriptionStatus: 'active',
          subscriptionExpiry: expiry.toISOString().split('T')[0],
        });
      },

      exportBackup: () => {
        const s = get();
        return JSON.stringify({
          users: s.users, lessons: s.lessons, assignments: s.assignments,
          exams: s.exams, notifications: s.notifications, comments: s.comments,
          coupons: s.coupons, payments: s.payments, invoices: s.invoices,
          certificates: s.certificates, grades: s.grades, questionBank: s.questionBank,
        }, null, 2);
      },

      importBackup: (data) => {
        try {
          const parsed = JSON.parse(data);
          set({
            users: parsed.users || demoUsers,
            lessons: parsed.lessons || demoLessons,
            assignments: parsed.assignments || demoAssignments,
            exams: parsed.exams || demoExams,
            notifications: parsed.notifications || demoNotifications,
            comments: parsed.comments || demoComments,
            coupons: parsed.coupons || demoCoupons,
            payments: parsed.payments || demoPayments,
            invoices: parsed.invoices || demoInvoices,
            certificates: parsed.certificates || demoCertificates,
            grades: parsed.grades || demoGrades,
            questionBank: parsed.questionBank || questionBank,
          });
          return true;
        } catch {
          return false;
        }
      },

      toggleFavorite: (lessonId) => {
        const user = get().currentUser;
        if (!user || user.role !== 'student') return;
        const favorites = user.favorites || [];
        const updated = favorites.includes(lessonId)
          ? favorites.filter(id => id !== lessonId)
          : [...favorites, lessonId];
        get().updateUser(user.id, { favorites: updated });
      },

      markLessonComplete: (lessonId) => {
        const user = get().currentUser;
        if (!user || user.role !== 'student') return;
        const completed = user.completedLessons || [];
        if (!completed.includes(lessonId)) {
          get().updateUser(user.id, { completedLessons: [...completed, lessonId] });
        }
      },

      setBrowseContext: (ctx) => set({ currentBrowseContext: ctx, view: 'browse' }),
    }),
    {
      name: 'math-academy-storage',
      partialize: (state) => ({
        currentUser: state.currentUser,
        users: state.users,
        lessons: state.lessons,
        assignments: state.assignments,
        exams: state.exams,
        notifications: state.notifications,
        comments: state.comments,
        coupons: state.coupons,
        payments: state.payments,
        invoices: state.invoices,
        certificates: state.certificates,
        grades: state.grades,
        theme: state.theme,
      }),
    }
  )
);
