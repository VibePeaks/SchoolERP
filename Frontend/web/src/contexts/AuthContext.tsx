// src/contexts/AuthContext.tsx
import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { User, SubscriptionPlan } from '@/types';
import { authService } from '@/services/authService';
import { toast } from 'sonner';

import { LoginResponse } from '@/types/api';

interface AuthContextType {
  user: User | null;
  login: (email: string, password: string, role?: User['role']) => Promise<void>;
  logout: () => Promise<void>;
  isAuthenticated: boolean;
  loading: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) throw new Error('useAuth must be used within an AuthProvider');
  return context;
};

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  // Check for existing token on mount
  useEffect(() => {
    const initializeAuth = async () => {
      const token = localStorage.getItem('token');
      const refreshToken = localStorage.getItem('refreshToken');
      const userData = localStorage.getItem('user');

      if (token && userData) {
        try {
          // Check if this is a demo token
          const isDemoToken = token.startsWith('demo-token-');

          if (isDemoToken) {
            // Demo user - restore from localStorage without backend validation
            const user = JSON.parse(userData);
            setUser(user);
          } else {
            // Real authentication - validate token with backend
            const response = await authService.getCurrentUser();
            if (response.success && response.data) {
              setUser(response.data);
              localStorage.setItem('user', JSON.stringify(response.data));
            }
          }
        } catch (error) {
          // Invalid token, clear storage
          clearAuthTokens();
          localStorage.removeItem('user');
        }
      }

      setLoading(false);
    };

    initializeAuth();
  }, []);

  const login = async (email: string, password: string, role?: User['role']) => {
    setLoading(true);

    try {
      // Check if this is a demo/quick login (dummy credentials)
      const isDemoLogin = email.includes('@default.school.com') || email.includes('@demo.school.com');

      if (isDemoLogin) {
        // Demo login - create user locally without backend call
        const demoUser: User = {
          id: 'demo-' + role,
          name: role === 'admin' ? 'Demo Admin' : role === 'teacher' ? 'Demo Teacher' : 'Demo Principal',
          email: email,
          role: role as User['role'],
          subscriptionPlan: 'enterprise' as SubscriptionPlan, // Give demo users full access
        };

        console.log('Setting demo user:', demoUser);
        setUser(demoUser);
        localStorage.setItem('user', JSON.stringify(demoUser));
        localStorage.setItem('token', 'demo-token-' + role);
        localStorage.setItem('refreshToken', 'demo-refresh-' + role);
        localStorage.setItem('tenantId', '1');

        toast.success(`Demo login successful as ${role}!`);
      } else {
        // Real authentication with backend
        const response = await authService.login({
          email,
          password,
          tenantCode: localStorage.getItem('tenantCode') || 'default'
        });

        if (response) {
          const newUser: User = {
            id: response.user.id,
            name: response.user.name,
            email: response.user.email,
            role: response.user.role as User['role'],
            subscriptionPlan: response.user.subscriptionPlan as SubscriptionPlan,
          };
          setUser(newUser);
          localStorage.setItem('user', JSON.stringify(newUser));
          localStorage.setItem('token', response.token);
          localStorage.setItem('refreshToken', response.refreshToken);
          localStorage.setItem('tenantId', response.user.tenantId || '1');

          toast.success('Login successful!');
        } else {
          toast.error('Login failed');
        }
      }
    } catch (error) {
      toast.error('Login failed: ' + (error as Error).message);
    } finally {
      setLoading(false);
    }
  };

  const logout = async () => {
    setLoading(true);
    
    try {
      await authService.logout();
      setUser(null);
      localStorage.removeItem('user');
      localStorage.removeItem('token');
      localStorage.removeItem('refreshToken');
      localStorage.removeItem('tenantId');
      localStorage.removeItem('tenantCode');
      toast.success('Logged out successfully!');
    } catch (error) {
      toast.error('Logout failed: ' + (error as Error).message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        login,
        logout,
        isAuthenticated: !!user,
        loading,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

// Helper function to clear auth tokens
const clearAuthTokens = () => {
  localStorage.removeItem('token');
  localStorage.removeItem('refreshToken');
  localStorage.removeItem('user');
  localStorage.removeItem('tenantId');
  localStorage.removeItem('tenantCode');
};
