import React from 'react';
import { useAuthStore } from '../../store/authStore';
import { AdminDashboard } from './AdminDashboard';
import { TeacherDashboard } from './TeacherDashboard';
import { StudentDashboard } from './StudentDashboard';
import { CompanyDashboard } from './CompanyDashboard';

export function DashboardPage() {
  const user = useAuthStore((state) => state.user);

  if (!user) {
    return null;
  }

  const dashboards = {
    admin: AdminDashboard,
    teacher: TeacherDashboard,
    student: StudentDashboard,
    company: CompanyDashboard,
  };

  const DashboardComponent = dashboards[user.role];

  return <DashboardComponent />;
}