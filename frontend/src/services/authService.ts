import apiClient from '../config/api';

/**
 * Interface for sign in credentials
 */
export interface SignInData {
  email: string;
  password: string;
}

/**
 * Interface for sign up data
 */
export interface SignUpData {
  name: string;
  email: string;
  password: string;
}

/**
 * Interface for authentication response
 */
export interface AuthResponse {
  token: string;
  user: {
    id: string;
    name: string;
    email: string;
    createdAt?: string;
  };
  message?: string;
}

/**
 * Interface for user profile
 */
export interface UserProfile {
  id: string;
  name: string;
  email: string;
  createdAt: string;
  totalAnalyses?: number;
  lastLogin?: string;
}

/**
 * Authentication Service
 * Handles all authentication-related API calls
 */
export const authService = {
  /**
   * Sign in user
   * @param data - User credentials
   * @returns Authentication token and user data
   */
  signIn: async (data: SignInData): Promise<AuthResponse> => {
    try {
      // POST request to /auth/signin endpoint
      const response = await apiClient.post('/auth/signin', data);
      
      // Save token to localStorage
      if (response.data.token) {
        localStorage.setItem('authToken', response.data.token);
        localStorage.setItem('user', JSON.stringify(response.data.user));
      }
      
      return response.data;
    } catch (error: any) {
      console.error('Sign in failed:', error);
      throw new Error(
        error.response?.data?.message || 'Invalid email or password'
      );
    }
  },

  /**
   * Sign up new user
   * @param data - New user data
   * @returns Authentication token and user data
   */
  signUp: async (data: SignUpData): Promise<AuthResponse> => {
    try {
      // POST request to /auth/signup endpoint
      const response = await apiClient.post('/auth/signup', data);
      
      // Save token to localStorage
      if (response.data.token) {
        localStorage.setItem('authToken', response.data.token);
        localStorage.setItem('user', JSON.stringify(response.data.user));
      }
      
      return response.data;
    } catch (error: any) {
      console.error('Sign up failed:', error);
      throw new Error(
        error.response?.data?.message || 'Failed to create account'
      );
    }
  },

  /**
   * Sign out user
   * Clears local storage and redirects to sign in
   */
  signOut: () => {
    localStorage.removeItem('authToken');
    localStorage.removeItem('user');
    window.location.href = '/signin';
  },

  /**
   * Check if user is authenticated
   * @returns boolean indicating authentication status
   */
  isAuthenticated: (): boolean => {
    const token = localStorage.getItem('authToken');
    return !!token;
  },

  /**
   * Get current user from localStorage
   * @returns User object or null
   */
  getCurrentUser: (): UserProfile | null => {
    const userStr = localStorage.getItem('user');
    if (!userStr) return null;
    
    try {
      return JSON.parse(userStr);
    } catch (error) {
      console.error('Failed to parse user data:', error);
      return null;
    }
  },

  /**
   * Get user profile from backend
   * @returns Updated user profile
   */
  getProfile: async (): Promise<UserProfile> => {
    try {
      const response = await apiClient.get('/auth/profile');
      
      // Update localStorage with fresh data
      localStorage.setItem('user', JSON.stringify(response.data));
      
      return response.data;
    } catch (error) {
      console.error('Failed to fetch profile:', error);
      throw error;
    }
  },

  /**
   * Update user profile
   * @param data - Profile update data
   */
  updateProfile: async (data: Partial<UserProfile>): Promise<UserProfile> => {
    try {
      const response = await apiClient.put('/auth/profile', data);
      
      // Update localStorage
      localStorage.setItem('user', JSON.stringify(response.data));
      
      return response.data;
    } catch (error) {
      console.error('Failed to update profile:', error);
      throw error;
    }
  },

  /**
   * Change password
   * @param oldPassword - Current password
   * @param newPassword - New password
   */
  changePassword: async (oldPassword: string, newPassword: string): Promise<void> => {
    try {
      await apiClient.post('/auth/change-password', {
        oldPassword,
        newPassword,
      });
    } catch (error: any) {
      console.error('Failed to change password:', error);
      throw new Error(
        error.response?.data?.message || 'Failed to change password'
      );
    }
  },

  /**
   * Request password reset
   * @param email - User email
   */
  forgotPassword: async (email: string): Promise<void> => {
    try {
      await apiClient.post('/auth/forgot-password', { email });
    } catch (error: any) {
      console.error('Failed to request password reset:', error);
      throw new Error(
        error.response?.data?.message || 'Failed to send reset email'
      );
    }
  },

  /**
   * Reset password with token
   * @param token - Reset token from email
   * @param newPassword - New password
   */
  resetPassword: async (token: string, newPassword: string): Promise<void> => {
    try {
      await apiClient.post('/auth/reset-password', {
        token,
        newPassword,
      });
    } catch (error: any) {
      console.error('Failed to reset password:', error);
      throw new Error(
        error.response?.data?.message || 'Failed to reset password'
      );
    }
  },
};

export default authService;
