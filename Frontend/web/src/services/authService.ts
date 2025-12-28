import { api } from '@/lib/api';
import { LoginRequest, LoginResponse } from '@/types/api';
import { setAuthToken, setRefreshToken, setTenantId } from '@/lib/api';

export const authService = {
  // Login user
  async login(credentials: LoginRequest): Promise<LoginResponse> {
    const response = await api.post<LoginResponse>('/auth/login', credentials);
    const { token, refreshToken, user } = response.data;
    
    // Store tokens
    setAuthToken(token);
    setRefreshToken(refreshToken);
    
    if (user?.tenantId) {
      setTenantId(user.tenantId.toString());
    }
    
    // Store user info
    localStorage.setItem('user', JSON.stringify(user));
    
    return response.data;
  },

  // Logout user
  async logout(): Promise<void> {
    try {
      await api.post('/auth/logout');
    } catch (error) {
      // Even if logout API fails, clear local storage
      console.error('Logout API failed:', error);
    } finally {
      // Clear all auth data
      localStorage.removeItem('token');
      localStorage.removeItem('refreshToken');
      localStorage.removeItem('tenantId');
      localStorage.removeItem('user');
    }
  },

  // Refresh token
  async refreshToken(): Promise<{ token: string }> {
    const refreshToken = localStorage.getItem('refreshToken');
    if (!refreshToken) {
      throw new Error('No refresh token available');
    }

    const response = await api.post<{ token: string }>('/auth/refresh', {
      refreshToken,
    });

    setAuthToken(response.data.token);
    
    return response.data;
  },

  // Get current user
  async getCurrentUser() {
    const response = await api.get('/auth/me');
    return response.data;
  },

  // Check if user is authenticated
  isAuthenticated(): boolean {
    const token = localStorage.getItem('token');
    const user = localStorage.getItem('user');
    
    return !!(token && user);
  },

  // Parent login (simplified - tenant determined by context)
  async parentLogin(credentials: { email: string; password: string }): Promise<LoginResponse> {
    const response = await api.post<LoginResponse>('/auth/parent/login', credentials);
    const { token, refreshToken, user } = response.data;

    // Store tokens
    setAuthToken(token);
    setRefreshToken(refreshToken);

    if (user?.tenantId) {
      setTenantId(user.tenantId.toString());
    }

    // Store user info with parent role
    const parentUser = { ...user, role: 'parent' };
    localStorage.setItem('user', JSON.stringify(parentUser));

    return response.data;
  },

  // Get stored user
  getStoredUser() {
    const userStr = localStorage.getItem('user');
    return userStr ? JSON.parse(userStr) : null;
  },
};
