'use client';

import { useEffect } from 'react';
import { useStore } from '@/lib/store';
import Landing from '@/components/landing/Landing';
import AuthPage from '@/components/auth/AuthPage';
import AdminDashboard from '@/components/admin/AdminDashboard';
import TeacherDashboard from '@/components/teacher/TeacherDashboard';
import StudentDashboard from '@/components/student/StudentDashboard';
import LessonPage from '@/components/lesson/LessonPage';

export default function Home() {
  const { view, currentUser, theme, setView } = useStore();

  // Apply theme to <html>
  useEffect(() => {
    if (typeof document !== 'undefined') {
      if (theme === 'dark') {
        document.documentElement.classList.add('dark');
      } else {
        document.documentElement.classList.remove('dark');
      }
    }
  }, [theme]);

  // Hydration safety: if user has view=dashboard but no currentUser, go to landing
  useEffect(() => {
    if ((view === 'admin-dashboard' || view === 'teacher-dashboard' || view === 'student-dashboard' || view === 'lesson-page') && !currentUser) {
      setView('landing');
    }
  }, [view, currentUser, setView]);

  // Render based on view
  if (view === 'landing') return <Landing />;
  if (view === 'login' || view === 'register') return <AuthPage />;
  if (view === 'lesson-page' && currentUser) return <LessonPage />;
  if (view === 'admin-dashboard' && currentUser?.role === 'admin') return <AdminDashboard />;
  if (view === 'teacher-dashboard' && currentUser?.role === 'teacher') return <TeacherDashboard />;
  if (view === 'student-dashboard' && currentUser?.role === 'student') return <StudentDashboard />;
  if (view === 'browse') return <Landing />;

  // Fallback
  return <Landing />;
}
