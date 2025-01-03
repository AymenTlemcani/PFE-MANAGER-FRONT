import { useAuthStore } from "../../store/authStore";
import { AdminDashboard } from "./AdminDashboard";
import { TeacherDashboard } from "./TeacherDashboard";
import { StudentDashboard } from "./StudentDashboard";
import { CompanyDashboard } from "./CompanyDashboard";

export function DashboardPage() {
  const user = useAuthStore((state) => state.user);

  if (!user) return null;

  const DashboardComponent = {
    Administrator: AdminDashboard,
    Teacher: TeacherDashboard,
    Student: StudentDashboard,
    Company: CompanyDashboard,
  }[user.role];

  return <DashboardComponent />;
}
