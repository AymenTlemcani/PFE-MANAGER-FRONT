export type UserRole = "Administrator" | "Teacher" | "Student" | "Company";
export type MasterOption = "GL" | "IA" | "RSD" | "SIC";
export type TeacherGrade = "MAA" | "MAB" | "MCA" | "MCB" | "PR";

// Base User interface
export interface BaseUser {
  user_id: number;
  email: string;
  role: UserRole;
  is_active: boolean;
  must_change_password: boolean;
  profile_picture_url: string | null;
  language_preference: "French" | "English";
  date_of_birth: string | null;
  last_login: string | null;
  created_at: string;
  updated_at: string;
}

// Role-specific interfaces
export interface Administrator extends BaseUser {
  role: "Administrator";
  administrator: {
    admin_id: number;
    user_id: number;
    name: string;
    surname: string;
    created_at: string;
    updated_at: string;
  };
}

export interface Teacher extends BaseUser {
  role: "Teacher";
  teacher: {
    teacher_id: number;
    user_id: number;
    name: string;
    surname: string;
    recruitment_date: string;
    grade: TeacherGrade;
    is_responsible: boolean;
    research_domain: string | null;
    created_at: string;
    updated_at: string;
  };
}

export interface Student {
  student_id: number;
  user_id: number;
  name: string;
  surname: string;
  master_option: "GL" | "IA" | "RSD" | "SIC";
  overall_average: number;
  admission_year: number;
  // ...other existing fields...
}

export interface Company extends BaseUser {
  role: "Company";
  company: {
    company_id: number;
    user_id: number;
    company_name: string;
    contact_name: string;
    contact_surname: string;
    industry: string;
    address: string;
    created_at: string;
    updated_at: string;
  };
}

// Union type for all possible user types
export type User = Administrator | Teacher | Student | Company;

export interface ProfileUpdateData {
  name?: string;
  email?: string;
  // Add other updatable profile fields
}

export interface ApiError {
  response?: {
    data?: {
      message?: string;
    };
    status?: number;
  };
  message: string;
}

export interface AuthResponse {
  user: User;
  token: string;
  must_change_password: boolean;
}
