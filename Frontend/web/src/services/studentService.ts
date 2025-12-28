import { api } from '@/lib/api';
import { Student } from '@/types/index';
import { 
  StudentCreateRequest, 
  StudentSearchParams, 
  ApiResponse,
  PaginationInfo 
} from '@/types/api';

export const studentService = {
  // Get all students with pagination and filtering
  async getStudents(params?: StudentSearchParams): Promise<ApiResponse<Student[]>> {
    return await api.get<Student[]>('/students', { params });
  },

  // Get single student by ID
  async getStudent(id: string): Promise<ApiResponse<Student>> {
    return await api.get<Student>(`/students/${id}`);
  },

  // Create new student
  async createStudent(studentData: StudentCreateRequest): Promise<ApiResponse<Student>> {
    return await api.post<Student>('/students', studentData);
  },

  // Update existing student
  async updateStudent(id: string, studentData: Partial<StudentCreateRequest>): Promise<ApiResponse<Student>> {
    return await api.put<Student>(`/students/${id}`, studentData);
  },

  // Delete student
  async deleteStudent(id: string): Promise<ApiResponse<void>> {
    return await api.delete<void>(`/students/${id}`);
  },

  // Bulk delete students
  async deleteStudents(ids: string[]): Promise<ApiResponse<void>> {
    return await api.post<void>('/students/bulk-delete', { ids });
  },

  // Search students
  async searchStudents(query: string, params?: StudentSearchParams): Promise<ApiResponse<Student[]>> {
    return await api.get<Student[]>('/students/search', { 
      params: { ...params, q: query } 
    });
  },

  // Get students by class
  async getStudentsByClass(className: string, section?: string): Promise<ApiResponse<Student[]>> {
    return await api.get<Student[]>('/students/by-class', { 
      params: { class: className, section } 
    });
  },

  // Upload student photo
  async uploadStudentPhoto(studentId: string, file: File): Promise<ApiResponse<{ photoUrl: string }>> {
    const formData = new FormData();
    formData.append('photo', file);
    
    return await api.upload<{ photoUrl: string }>(`/students/${studentId}/photo`, formData);
  },

  // Export students to Excel/CSV
  async exportStudents(format: 'excel' | 'csv' = 'excel', params?: StudentSearchParams): Promise<void> {
    await api.download(`/students/export?format=${format}`, `students.${format}`, { params });
  },

  // Import students from Excel/CSV
  async importStudents(file: File): Promise<ApiResponse<{ 
    imported: number; 
    failed: number; 
    errors: string[] 
  }>> {
    const formData = new FormData();
    formData.append('file', file);
    
    return await api.upload<{ 
      imported: number; 
      failed: number; 
      errors: string[] 
    }>('/students/import', formData);
  },

  // Get student statistics
  async getStudentStats(): Promise<ApiResponse<{
    totalStudents: number;
    activeStudents: number;
    inactiveStudents: number;
    studentsByClass: Record<string, number>;
    studentsByGender: Record<string, number>;
    newStudentsThisMonth: number;
  }>> {
    return await api.get('/students/stats');
  },

  // Update student status
  async updateStudentStatus(id: string, status: 'active' | 'inactive'): Promise<ApiResponse<Student>> {
    return await api.patch<Student>(`/students/${id}/status`, { status });
  },

  // Get student attendance summary
  async getStudentAttendanceSummary(id: string, fromDate?: string, toDate?: string): Promise<ApiResponse<{
    totalDays: number;
    presentDays: number;
    absentDays: number;
    lateDays: number;
    attendancePercentage: number;
  }>> {
    return await api.get(`/students/${id}/attendance-summary`, {
      params: { fromDate, toDate }
    });
  },

  // Get student fee summary
  async getStudentFeeSummary(id: string): Promise<ApiResponse<{
    totalFees: number;
    paidFees: number;
    pendingFees: number;
    overdueFees: number;
  }>> {
    return await api.get(`/students/${id}/fee-summary`);
  },
};
