export type UserRole = 'admin' | 'teacher' | 'student' | 'company';

export type MasterOption = 'GL' | 'IA' | 'RSD' | 'SIC';

export type TeacherGrade = 'Professor' | 'Associate Professor' | 'Assistant Professor';

export interface User {
  id: string;
  email: string;
  firstName: string;
  lastName: string;
  role: UserRole;
}

export interface Teacher extends User {
  role: 'teacher';
  recruitmentDate: string;
  grade: TeacherGrade;
  department: string;
}

export interface Student extends User {
  role: 'student';
  universityEmail: string;
  masterOption: MasterOption;
  masterOneAverage: number;
  currentSemester: number;
}

export interface Company extends User {
  role: 'company';
  companyName: string;
  industry: string;
  address: string;
}

export interface Admin extends User {
  role: 'admin';
  department: string;
  position: string;
}