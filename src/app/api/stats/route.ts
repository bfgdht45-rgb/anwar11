import { NextResponse } from 'next/server';
import { db } from '@/lib/db';

export async function GET() {
  try {
    const [totalStudents, totalTeachers, totalLessons, totalExams] = await Promise.all([
      db.user.count({ where: { role: 'STUDENT' } }),
      db.user.count({ where: { role: 'TEACHER' } }),
      db.lesson.count(),
      db.exam.count(),
    ]);

    const activeSubscriptions = await db.user.count({ where: { subscriptionStatus: 'active' } });
    const totalViews = await db.lesson.aggregate({ _sum: { views: true } });
    const totalPayments = await db.payment.aggregate({ _sum: { amount: true } });

    return NextResponse.json({
      totalStudents, totalTeachers, totalSubscriptions: activeSubscriptions,
      totalVideos: totalLessons, totalLessons, totalExams,
      totalVisits: totalViews._sum.views || 0,
      totalRevenue: totalPayments._sum.amount || 0,
      monthlyRevenue: [
        { month: 'يناير', revenue: 28500 },
        { month: 'فبراير', revenue: 32100 },
        { month: 'مارس', revenue: 35800 },
        { month: 'أبريل', revenue: 38900 },
        { month: 'مايو', revenue: 42100 },
        { month: 'يونيو', revenue: 48500 },
      ],
    });
  } catch (error) {
    return NextResponse.json({
      totalStudents: 0, totalTeachers: 0, totalSubscriptions: 0,
      totalVideos: 0, totalLessons: 0, totalExams: 0,
      totalVisits: 0, totalRevenue: 0,
      monthlyRevenue: [],
    });
  }
}
