import axios, { AxiosError, AxiosResponse } from 'axios';
import { Alert } from 'react-native';

export interface ApiResponse<T = any> {
  success: boolean;
  data?: T;
  message?: string;
  errors?: string[];
}

export interface ApiError {
  message: string;
  statusCode?: number;
  details?: any;
}

class ApiService {
  private baseURL: string;
  private timeout: number = 30000; // 30 seconds

  constructor() {
    this.baseURL = 'https://api.schooerp.com'; // TODO: Use environment variable
    this.setupInterceptors();
  }

  private setupInterceptors() {
    // Request interceptor
    axios.interceptors.request.use(
      (config) => {
        // Add auth token if available
        // const token = await AsyncStorage.getItem('authToken');
        // if (token) {
        //   config.headers.Authorization = `Bearer ${token}`;
        // }

        // Add tenant header
        // config.headers['X-Tenant-ID'] = tenantId;

        console.log('API Request:', config.method?.toUpperCase(), config.url);
        return config;
      },
      (error) => {
        console.error('Request Error:', error);
        return Promise.reject(error);
      }
    );

    // Response interceptor
    axios.interceptors.response.use(
      (response: AxiosResponse) => {
        console.log('API Response:', response.status, response.config.url);
        return response;
      },
      (error: AxiosError) => {
        return this.handleApiError(error);
      }
    );
  }

  private handleApiError(error: AxiosError): Promise<never> {
    let errorMessage = 'An unexpected error occurred';
    let statusCode = 500;

    if (error.response) {
      // Server responded with error status
      statusCode = error.response.status;
      const responseData = error.response.data as any;

      switch (statusCode) {
        case 400:
          errorMessage = responseData?.message || 'Bad request. Please check your input.';
          break;
        case 401:
          errorMessage = 'Authentication failed. Please login again.';
          // TODO: Redirect to login or refresh token
          break;
        case 403:
          errorMessage = 'You do not have permission to perform this action.';
          break;
        case 404:
          errorMessage = 'The requested resource was not found.';
          break;
        case 422:
          errorMessage = responseData?.message || 'Validation failed. Please check your input.';
          break;
        case 429:
          errorMessage = 'Too many requests. Please try again later.';
          break;
        case 500:
          errorMessage = 'Server error. Please try again later.';
          break;
        case 503:
          errorMessage = 'Service temporarily unavailable. Please try again later.';
          break;
        default:
          errorMessage = responseData?.message || `Request failed with status ${statusCode}`;
      }

      // Log detailed error for debugging
      console.error('API Error Response:', {
        status: statusCode,
        url: error.config?.url,
        method: error.config?.method,
        data: responseData,
      });

    } else if (error.request) {
      // Network error - no response received
      // TODO: Use NetInfo for React Native network detection
      // For now, assume it's a network issue
      errorMessage = 'Network error. Please check your connection and try again.';
      console.error('Network Error:', error.request);

    } else {
      // Something else happened
      errorMessage = error.message || 'An unexpected error occurred';
      console.error('Unexpected Error:', error.message);
    }

    // Show user-friendly alert for critical errors
    if (statusCode >= 500) {
      setTimeout(() => {
        Alert.alert(
          'Connection Error',
          errorMessage,
          [
            { text: 'Retry', onPress: () => {/* TODO: Implement retry logic */} },
            { text: 'OK', style: 'default' }
          ]
        );
      }, 100);
    }

    const apiError: ApiError = {
      message: errorMessage,
      statusCode,
      details: error.response?.data,
    };

    return Promise.reject(apiError);
  }

  private async makeRequest<T>(
    method: 'GET' | 'POST' | 'PUT' | 'DELETE' | 'PATCH',
    endpoint: string,
    data?: any,
    config?: any
  ): Promise<T> {
    try {
      const response = await axios({
        method,
        url: `${this.baseURL}${endpoint}`,
        data,
        timeout: this.timeout,
        ...config,
      });

      return response.data;
    } catch (error) {
      throw error; // Error already handled by interceptor
    }
  }

  // Authentication endpoints
  async login(credentials: { email: string; password: string; tenantCode: string; role: string }): Promise<ApiResponse<any>> {
    return this.makeRequest('POST', '/auth/login', credentials);
  }

  async refreshToken(): Promise<ApiResponse<any>> {
    return this.makeRequest('POST', '/auth/refresh');
  }

  // Parent endpoints
  async getChildren(parentId: string): Promise<ApiResponse<any[]>> {
    return this.makeRequest('GET', `/parents/${parentId}/children`);
  }

  async getAttendance(parentId: string, childId?: string): Promise<ApiResponse<any[]>> {
    const childParam = childId ? `?childId=${childId}` : '';
    return this.makeRequest('GET', `/parents/${parentId}/attendance${childParam}`);
  }

  async getGrades(parentId: string, childId?: string): Promise<ApiResponse<any[]>> {
    const childParam = childId ? `?childId=${childId}` : '';
    return this.makeRequest('GET', `/parents/${parentId}/grades${childParam}`);
  }

  async getFees(parentId: string, childId?: string): Promise<ApiResponse<any[]>> {
    const childParam = childId ? `?childId=${childId}` : '';
    return this.makeRequest('GET', `/parents/${parentId}/fees${childParam}`);
  }

  async getBusLocation(busId: string): Promise<ApiResponse<any>> {
    return this.makeRequest('GET', `/transport/bus/${busId}/location`);
  }

  // Teacher endpoints
  async getClasses(teacherId: string): Promise<ApiResponse<any[]>> {
    return this.makeRequest('GET', `/teacher/${teacherId}/classes`);
  }

  async markAttendance(classId: string, attendanceData: any): Promise<ApiResponse<any>> {
    return this.makeRequest('POST', `/teacher/classes/${classId}/attendance`, attendanceData);
  }

  async getStudents(classId: string): Promise<ApiResponse<any>> {
    return this.makeRequest('GET', `/teacher/classes/${classId}/students`);
  }

  async submitGrades(classId: string, gradesData: any): Promise<ApiResponse<any>> {
    return this.makeRequest('POST', `/teacher/classes/${classId}/grades`, gradesData);
  }

  // Driver endpoints
  async getRoutes(driverId: string): Promise<ApiResponse<any[]>> {
    return this.makeRequest('GET', `/transport/drivers/${driverId}/routes`);
  }

  async updateBusLocation(busId: string, locationData: any): Promise<ApiResponse<any>> {
    return this.makeRequest('POST', `/transport/bus/${busId}/location`, locationData);
  }

  async updateStudentPickup(pickupId: string, pickupData: any): Promise<ApiResponse<any>> {
    return this.makeRequest('POST', `/transport/pickups/${pickupId}/pickup`, pickupData);
  }

  async updateStudentDropoff(dropoffId: string, dropoffData: any): Promise<ApiResponse<any>> {
    return this.makeRequest('POST', `/transport/pickups/${dropoffId}/dropoff`, dropoffData);
  }

  async startRoute(routeId: string, startData: any): Promise<ApiResponse<any>> {
    return this.makeRequest('POST', `/transport/routes/${routeId}/start`, startData);
  }

  async completeRoute(routeId: string, completeData: any): Promise<ApiResponse<any>> {
    return this.makeRequest('POST', `/transport/routes/${routeId}/complete`, completeData);
  }

  async getRouteStudents(routeId: string, status?: string): Promise<ApiResponse<any>> {
    const statusParam = status ? `?status=${status}` : '';
    return this.makeRequest('GET', `/transport/routes/${routeId}/students${statusParam}`);
  }

  // Student Mode endpoints
  async validateStudentMode(parentId: number, studentId: number, passkey: string): Promise<ApiResponse<any>> {
    return this.makeRequest('POST', `/parents/${parentId}/student-mode/validate`, { studentId, passkey });
  }

  async getStudentDashboard(parentId: number, studentId: number): Promise<ApiResponse<any>> {
    return this.makeRequest('GET', `/parents/${parentId}/student-mode/${studentId}/dashboard`);
  }

  async setStudentPasskey(parentId: number, studentId: number, passkey: string): Promise<ApiResponse<any>> {
    return this.makeRequest('POST', `/parents/${parentId}/student-mode/${studentId}/passkey`, { passkey });
  }

  async toggleStudentMode(parentId: number, studentId: number, enabled: boolean): Promise<ApiResponse<any>> {
    return this.makeRequest('PUT', `/parents/${parentId}/student-mode/${studentId}/toggle`, { enabled });
  }

  async forceStudentLogout(parentId: number, studentId: number): Promise<ApiResponse<any>> {
    return this.makeRequest('DELETE', `/parents/${parentId}/student-mode/${studentId}/session`);
  }

  async getStudentActivityLog(parentId: number, studentId: number, limit?: number): Promise<ApiResponse<any>> {
    const limitParam = limit ? `?limit=${limit}` : '';
    return this.makeRequest('GET', `/parents/${parentId}/student-mode/${studentId}/activity${limitParam}`);
  }

  // Admin endpoints
  async getSystemStats(): Promise<ApiResponse<any>> {
    return this.makeRequest('GET', '/admin/stats');
  }

  async getUsers(filters?: any): Promise<ApiResponse<any[]>> {
    const queryString = filters ? `?${new URLSearchParams(filters).toString()}` : '';
    return this.makeRequest('GET', `/admin/users${queryString}`);
  }

  async createUser(userData: any): Promise<ApiResponse<any>> {
    return this.makeRequest('POST', '/admin/users', userData);
  }

  async updateUser(userId: string, userData: any): Promise<ApiResponse<any>> {
    return this.makeRequest('PUT', `/admin/users/${userId}`, userData);
  }

  async getReports(filters: any): Promise<ApiResponse<any>> {
    const queryString = `?${new URLSearchParams(filters).toString()}`;
    return this.makeRequest('GET', `/admin/reports${queryString}`);
  }

  // Generic CRUD operations with error handling
  async get<T>(endpoint: string, params?: any): Promise<ApiResponse<T>> {
    const queryString = params ? `?${new URLSearchParams(params).toString()}` : '';
    return this.makeRequest('GET', `${endpoint}${queryString}`);
  }

  async post<T>(endpoint: string, data: any): Promise<ApiResponse<T>> {
    return this.makeRequest('POST', endpoint, data);
  }

  async put<T>(endpoint: string, data: any): Promise<ApiResponse<T>> {
    return this.makeRequest('PUT', endpoint, data);
  }

  async delete<T>(endpoint: string): Promise<ApiResponse<T>> {
    return this.makeRequest('DELETE', endpoint);
  }
}

// Singleton instance
export const apiService = new ApiService();
export default apiService;
