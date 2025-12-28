// API Response Types
export interface ApiResponse<T = any> {
  success: boolean;
  data: T;
  message?: string;
  errors?: string[];
  pagination?: PaginationInfo;
}

export interface PaginationInfo {
  currentPage: number;
  totalPages: number;
  totalItems: number;
  itemsPerPage: number;
  hasNext: boolean;
  hasPrevious: boolean;
}

export interface ApiError {
  message: string;
  statusCode: number;
  errors?: string[];
  timestamp: string;
  path?: string;
}

// Request/Response Types for different entities
export interface LoginRequest {
  email: string;
  password: string;
  tenantCode?: string;
}

export interface LoginResponse {
  user: {
    id: string;
    name: string;
    email: string;
    role: string;
    subscriptionPlan: string;
    tenantId: string;
  };
  token: string;
  refreshToken: string;
  expiresIn: number;
}

export interface StudentCreateRequest {
  name: string;
  email: string;
  rollNumber: string;
  class: string;
  section: string;
  dateOfBirth: string;
  parentName: string;
  parentContact: string;
  address: string;
}

export interface TeacherCreateRequest {
  name: string;
  email: string;
  employeeId: string;
  subjects: string[];
  classes: string[];
  contact: string;
  qualification: string;
}

export interface ClassCreateRequest {
  name: string;
  section: string;
  teacher: string;
  subjects: string[];
}

export interface FeeCreateRequest {
  studentId: string;
  feeType: string;
  amount: number;
  dueDate: string;
  description?: string;
}

export interface AttendanceRecord {
  id: string;
  studentId: string;
  studentName: string;
  class: string;
  date: string;
  status: 'present' | 'absent' | 'late' | 'half-day';
  markedBy: string;
  markedAt: string;
}

export interface AttendanceUpdateRequest {
  studentId: string;
  status: 'present' | 'absent' | 'late' | 'half-day';
  date: string;
}

// Subscription API Types
export interface SubscriptionPlan {
  id: number;
  planName: string;
  displayName: string;
  description: string;
  price: number;
  billingCycle: string;
  features: string[];
  isActive: boolean;
}

export interface UserSubscription {
  id: number;
  tenantId: number;
  userId: number;
  subscriptionPlan: SubscriptionPlan;
  startDate: string;
  endDate: string;
  status: string;
  autoRenew: boolean;
  paymentMethod: string;
  lastPaymentDate: string;
  nextPaymentDate: string;
}

export interface SubscriptionCreateRequest {
  planName: string;
  billingCycle: 'monthly' | 'yearly';
  paymentMethod: string;
  paymentReference: string;
}

// Hostel Management Types
export interface Hostel {
  id: string;
  name: string;
  code: string;
  capacity: number;
  occupied: number;
  floor: number;
  warden: string;
  facilities: string[];
  isActive: boolean;
}

export interface HostelRoom {
  id: string;
  hostelId: string;
  roomNumber: string;
  capacity: number;
  occupied: number;
  floor: number;
  type: 'single' | 'double' | 'triple' | 'dormitory';
  facilities: string[];
  rent: number;
  status: 'available' | 'occupied' | 'maintenance';
}

export interface StudentAllocation {
  id: string;
  studentId: string;
  roomId: string;
  checkInDate: string;
  checkOutDate?: string;
  status: 'active' | 'completed';
  fees: HostelFee[];
}

export interface HostelFee {
  id: string;
  studentId: string;
  feeType: string;
  amount: number;
  dueDate: string;
  paidDate?: string;
  status: 'pending' | 'paid' | 'overdue';
}

export interface MaintenanceRequest {
  id: string;
  roomId: string;
  reportedBy: string;
  issue: string;
  priority: 'low' | 'medium' | 'high' | 'urgent';
  status: 'pending' | 'in-progress' | 'completed' | 'rejected';
  reportedAt: string;
  resolvedAt?: string;
  resolvedBy?: string;
}

export interface Complaint {
  id: string;
  studentId: string;
  category: string;
  subject: string;
  description: string;
  priority: 'low' | 'medium' | 'high';
  status: 'pending' | 'in-progress' | 'resolved' | 'rejected';
  reportedAt: string;
  resolvedAt?: string;
  resolvedBy?: string;
}

// Query Parameters
export interface PaginationParams {
  page?: number;
  limit?: number;
  sortBy?: string;
  sortOrder?: 'asc' | 'desc';
}

export interface StudentSearchParams extends PaginationParams {
  search?: string;
  class?: string;
  section?: string;
  status?: 'active' | 'inactive';
}

export interface TeacherSearchParams extends PaginationParams {
  search?: string;
  subject?: string;
  status?: 'active' | 'inactive';
}

export interface AttendanceSearchParams extends PaginationParams {
  date?: string;
  class?: string;
  status?: 'present' | 'absent' | 'late' | 'half-day';
}
