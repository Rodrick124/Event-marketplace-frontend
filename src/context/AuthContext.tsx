import { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { AuthContextType, User, AuthState, UserRole } from './types';

const AuthContext = createContext<AuthContextType | null>(null);

// API base URL - adjust according to your backend
const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

// Helper to get user initials from name
const getInitials = (name: string) => {
  if (!name) return 'U';
  return name
    .split(' ')
    .map(part => part[0])
    .join('')
    .toUpperCase()
    .slice(0, 2);
};

// API helper function
const apiRequest = async (endpoint: string, options: RequestInit = {}) => {
  if (!API_BASE_URL) {
    throw new Error('API_BASE_URL is not configured. Please check your environment variables.');
  }

  const token = localStorage.getItem('auth_token');
  
  const config: RequestInit = {
    headers: {
      'Content-Type': 'application/json',
      ...(token && { Authorization: `Bearer ${token}` }),
      ...options.headers,
    },
    ...options,
  };

  const response = await fetch(`${API_BASE_URL}${endpoint}`, config);
  
  if (!response.ok) {
    const errorData = await response.json().catch(() => ({}));
    throw new Error(errorData.message || `HTTP error! status: ${response.status}`);
  }
  
  return response.json();
};

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [authState, setAuthState] = useState<AuthState>({
    user: null,
    isAuthenticated: false,
  });
  const [isLoading, setIsLoading] = useState(true);

  // Check for existing token on app load
  useEffect(() => {
    const checkAuthStatus = async () => {
      const token = localStorage.getItem('auth_token');
      if (token) {
        try {
          const userData = await apiRequest('/auth/me');
          
          // Validate that we have the required user data
          const userId = userData._id || userData.id;
          if (!userData || !userId || !userData.email) {
            throw new Error('Invalid user data received from server');
          }

          const user: User = {
            id: userId,
            name: userData.name || 'Unknown User',
            email: userData.email,
            role: userData.role || 'user',
            initials: getInitials(userData.name || 'Unknown User'),
            phone: userData.phone,
            bio: userData.bio,
            organization: userData.organization,
            website: userData.website,
          };
          
          setAuthState({
            user,
            isAuthenticated: true,
          });
        } catch (error) {
          // Token is invalid, remove it
          localStorage.removeItem('auth_token');
          console.error('Token validation failed:', error);
        }
      }
      setIsLoading(false);
    };

    checkAuthStatus();
  }, []);

  const login = async (email: string, password: string): Promise<UserRole> => {
    try {
      const response = await apiRequest('/auth/login', {
        method: 'POST',
        body: JSON.stringify({ email, password }),
      });

      // Handle different possible response structures with extensive logging
      let userData, token;
      
      if (response.user && response.token) {
        userData = response.user;
        token = response.token;
      } else if (response.data && response.data.user && response.data.token) {
        userData = response.data.user;
        token = response.data.token;
      } else if (response.id && response.email) {
        userData = response;
        token = response.token || response.accessToken || response.access_token;
      } else if (response.success && response.data) {
        userData = response.data;
        token = response.data.token || response.token;
      } else if (response.message && response.user) {
        userData = response.user;
        token = response.token || response.user.token;
      } else {
        
        // Try to find user-like data in the response
        const possibleUserData = response.user || response.data || response;
        const possibleToken = response.token || response.accessToken || response.access_token || 
                             (response.data && response.data.token) || 
                             (response.user && response.user.token);
        
        if (possibleUserData && possibleToken) {
          userData = possibleUserData;
          token = possibleToken;
        } else {
          throw new Error('Invalid response structure from login API');
        }
      }

      // More flexible validation - check for common user identifier fields
      const userId = userData.id || userData._id || userData.userId || userData.user_id;
      const userEmail = userData.email || userData.emailAddress || userData.email_address;
      
      if (!userData) {
        throw new Error('No user data received from server');
      }

      if (!userId) {
        throw new Error('No user ID found in server response');
      }

      if (!userEmail) {
        throw new Error('No user email found in server response');
      }

      if (!token) {
        throw new Error('No authentication token received from server');
      }

      const user: User = {
        id: userId,
        name: userData.name || userData.fullName || userData.full_name || 'Unknown User',
        email: userEmail,
        role: (userData.role || userData.userRole || userData.user_role || 'user') as UserRole,
        initials: getInitials(userData.name || userData.fullName || userData.full_name || 'Unknown User'),
        phone: userData.phone || userData.phoneNumber || userData.phone_number,
        bio: userData.bio || userData.biography,
        organization: userData.organization || userData.company,
        website: userData.website || userData.websiteUrl || userData.website_url,
      };

      
      setAuthState({
        user,
        isAuthenticated: true,
      });

      localStorage.setItem('auth_token', token);
      return user.role;
    } catch (error: any) {
      throw new Error(error.message || 'Login failed');
    }
  };

  const signup = async (
    name: string,
    email: string,
    password: string,
    role: UserRole,
    extraData: { phone?: string } = {}
  ): Promise<void> => {
    try {
      const requestBody = {
        name,
        email,
        password,
        role,
        ...extraData,
      };

      const registerResponse = await apiRequest('/auth/register', {
        method: 'POST',
        body: JSON.stringify(requestBody),
      });

      if (registerResponse.success) {
        // Optionally, send a verification email
        await apiRequest('/auth/send-verification-email', {
          method: 'POST',
          body: JSON.stringify({ email }),
        });
      }

    } catch (error: any) {
      console.error('Signup error:', error);
      throw new Error(error.message || 'Signup failed');
    }
  };

  const loginWithGoogle = async (credential: string): Promise<void> => {
    try {
      const response = await apiRequest('/auth/google', {
        method: 'POST',
        body: JSON.stringify({ credential }),
      });

      // Handle different possible response structures
      let userData, authToken;
      
      if (response.user && response.token) {
        userData = response.user;
        authToken = response.token;
      } else if (response.data && response.data.user && response.data.token) {
        userData = response.data.user;
        authToken = response.data.token;
      } else if (response.id && response.email) {
        userData = response;
        authToken = response.token || response.accessToken;
      } else {
        throw new Error('Invalid response structure from Google login API');
      }

      // Validate required fields
      if (!userData || !userData.id || !userData.email) {
        throw new Error('Invalid user data received from server');
      }

      if (!authToken) {
        throw new Error('No authentication token received from server');
      }

      const user: User = {
        id: userData.id,
        name: userData.name || 'Google User',
        email: userData.email,
        role: userData.role || 'user',
        initials: getInitials(userData.name || 'Google User'),
        phone: userData.phone,
        bio: userData.bio,
        organization: userData.organization,
        website: userData.website,
      };

      setAuthState({ user, isAuthenticated: true });
      localStorage.setItem('auth_token', authToken);
    } catch (error: any) {
      console.error('Google login error:', error);
      throw new Error(error.message || 'Google login failed');
    }
  };

  const loginWithFacebook = async (_response: any): Promise<void> => {
    // Placeholder implementation
    throw new Error('Facebook login not implemented');
  };

  const logout = async () => {
    try {
      // Call logout endpoint to invalidate token on server
      await apiRequest('/auth/logout', {
        method: 'POST',
      });
    } catch (error) {
      // Even if logout fails on server, we still clear local state
      console.error('Logout error:', error);
    } finally {
      setAuthState({
        user: null,
        isAuthenticated: false,
      });
      localStorage.removeItem('auth_token');
    }
  };

  // Don't render children until we've checked auth status
  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return (
    <AuthContext.Provider value={{ 
      ...authState, 
      login, 
      signup,
      loginWithGoogle,
      loginWithFacebook,
      logout
    }}>
      {children}
    </AuthContext.Provider>
  );
};