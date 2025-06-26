/// <reference types="vite/client" />

import React, { createContext, useContext, useEffect, useState } from 'react';
import axios from 'axios';

interface User {
  id: number;
  email: string;
  first_name?: string;
  last_name?: string;
  phone_number?: string;
  city?: string;
  pincode?: string;
}

interface AuthContextType {
  user: User | null;
  loading: boolean;
  login: () => void;
  logout: () => Promise<void>;
  updateProfile: (profileData: Partial<User>) => Promise<{ success: boolean; message: string }>;
  refreshProfile: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

interface AuthProviderProps {
  children: React.ReactNode;
}

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  // Configure axios defaults
  axios.defaults.baseURL = import.meta.env.VITE_API_URL || 'http://localhost:3001/api';
  axios.defaults.withCredentials = true;

  // Add request interceptor to include token
  axios.interceptors.request.use((config) => {
    const token = localStorage.getItem('authToken');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  });

  // Add response interceptor to handle auth errors
  axios.interceptors.response.use(
    (response) => response,
    (error) => {
      if (error.response?.status === 401) {
        localStorage.removeItem('authToken');
        setUser(null);
      }
      return Promise.reject(error);
    }
  );

  const verifyToken = async (token: string): Promise<User | null> => {
    try {
      const response = await axios.post('/auth/verify', { token });
      if (response.data.valid) {
        // Get full user profile
        const profileResponse = await axios.get('/profile');
        return profileResponse.data.profile;
      }
      return null;
    } catch (error) {
      console.error('Token verification failed:', error);
      return null;
    }
  };

  const loadUser = async () => {
    try {
      const token = localStorage.getItem('authToken');
      if (token) {
        const userData = await verifyToken(token);
        if (userData) {
          setUser(userData);
        } else {
          localStorage.removeItem('authToken');
        }
      }
    } catch (error) {
      console.error('Failed to load user:', error);
      localStorage.removeItem('authToken');
    } finally {
      setLoading(false);
    }
  };

  const login = () => {
    window.location.href = `${import.meta.env.VITE_API_URL || 'http://localhost:3001/api'}/auth/google`;
  };

  const logout = async (): Promise<void> => {
    try {
      await axios.post('/auth/logout');
    } catch (error) {
      console.error('Logout error:', error);
    } finally {
      localStorage.removeItem('authToken');
      setUser(null);
    }
  };

  const updateProfile = async (profileData: Partial<User>): Promise<{ success: boolean; message: string }> => {
    try {
      const response = await axios.put('/profile', profileData);
      
      if (response.data.workflowId) {
        // Start polling for workflow completion
        pollWorkflowStatus(response.data.workflowId);
      }

      return {
        success: true,
        message: 'Profile update initiated successfully! The changes will be processed in the background.'
      };
    } catch (error: any) {
      console.error('Profile update failed:', error);
      return {
        success: false,
        message: error.response?.data?.error || 'Failed to update profile'
      };
    }
  };

  const pollWorkflowStatus = async (workflowId: string) => {
    const maxAttempts = 30; // 30 seconds
    let attempts = 0;

    const poll = async () => {
      try {
        const response = await axios.get(`/profile/update-status/${workflowId}`);
        const status = response.data.status;

        if (status === 'completed') {
          // Refresh user profile
          await refreshProfile();
          return;
        } else if (status === 'failed') {
          console.error('Profile update workflow failed');
          return;
        }

        attempts++;
        if (attempts < maxAttempts) {
          setTimeout(poll, 1000); // Poll every second
        }
      } catch (error) {
        console.error('Failed to poll workflow status:', error);
      }
    };

    poll();
  };

  const refreshProfile = async (): Promise<void> => {
    try {
      const response = await axios.get('/profile');
      setUser(response.data.profile);
    } catch (error) {
      console.error('Failed to refresh profile:', error);
    }
  };

  useEffect(() => {
    loadUser();
  }, []);

  const value: AuthContextType = {
    user,
    loading,
    login,
    logout,
    updateProfile,
    refreshProfile
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
}; 