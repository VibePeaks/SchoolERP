
export interface User {
  id: string;
  name: string;
  email: string;
  role: 'admin' | 'principal' | 'teacher' | 'student' | 'parent';
  avatar?: string;
}

export interface Student {
  id: string;
  name: string;
  email: string;
  class: string;
  section: string;
  rollNumber: string;
  dateOfBirth: string;
  parentName: string;
  parentContact: string;
  address: string;
  status: 'active' | 'inactive';
  admissionDate: string;
}

export interface Teacher {
  id: string;
  name: string;
  email: string;
  employeeId: string;
  subjects: string[];
  classes: string[];
  contact: string;
  qualification: string;
  joinDate: string;
  status: 'active' | 'inactive';
}

export interface Class {
  id: string;
  name: string;
  section: string;
  teacher: string;
  subjects: string[];
  studentCount: number;
}

export interface DashboardStats {
  totalStudents: number;
  totalTeachers: number;
  totalClasses: number;
  attendanceRate: number;
  feeCollection: number;
  pendingFees: number;
}
