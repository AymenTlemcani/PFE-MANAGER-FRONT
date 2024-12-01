import { User, Teacher, Student, Company, Admin, TeacherGrade, MasterOption } from '../types';

// Mock user data for different roles
const mockUsers: Record<string, User> = {
  'admin@pfe.com': {
    id: '1',
    email: 'admin@pfe.com',
    firstName: 'Admin',
    lastName: 'User',
    role: 'admin',
    department: 'Computer Science',
    position: 'Department Head'
  } as Admin,
  
  'teacher@pfe.com': {
    id: '2',
    email: 'teacher@pfe.com',
    firstName: 'Teacher',
    lastName: 'Smith',
    role: 'teacher',
    recruitmentDate: '2018-09-01',
    grade: 'Professor' as TeacherGrade,
    department: 'Computer Science'
  } as Teacher,
  
  'student@pfe.com': {
    id: '3',
    email: 'student@pfe.com',
    firstName: 'Student',
    lastName: 'Johnson',
    role: 'student',
    universityEmail: 'johnson.s@university.edu',
    masterOption: 'GL' as MasterOption,
    masterOneAverage: 15.75,
    currentSemester: 3
  } as Student,
  
  'company@pfe.com': {
    id: '4',
    email: 'company@pfe.com',
    firstName: 'Company',
    lastName: 'Rep',
    role: 'company',
    companyName: 'Tech Solutions Inc.',
    industry: 'Software Development',
    address: '123 Tech Street, Innovation City'
  } as Company
};

export async function login(email: string, password: string): Promise<User> {
  // Simulate API call delay
  await new Promise(resolve => setTimeout(resolve, 500));

  const user = mockUsers[email];
  if (!user || password !== 'password') {
    throw new Error('Invalid email or password');
  }

  return user;
}

// Type guard functions to check user roles
export function isTeacher(user: User): user is Teacher {
  return user.role === 'teacher';
}

export function isStudent(user: User): user is Student {
  return user.role === 'student';
}

export function isCompany(user: User): user is Company {
  return user.role === 'company';
}

export function isAdmin(user: User): user is Admin {
  return user.role === 'admin';
}