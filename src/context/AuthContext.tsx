import { createContext, useContext, useState, ReactNode } from 'react';
import { AuthContextType, User, AuthState } from './types';

const AuthContext = createContext<AuthContextType | null>(null);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

// Helper to get user initials from name
const getInitials = (name: string) => {
  return name
    .split(' ')
    .map(part => part[0])
    .join('')
    .toUpperCase()
    .slice(0, 2);
};

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [authState, setAuthState] = useState<AuthState>({
    user: null,
    isAuthenticated: false,
  });

  const login = async (email: string, password: string) => {
    try {
      // Mock login - replace with real API call
      const mockUser: User = {
        id: Date.now().toString(),
        name: 'Test User',
        email,
        initials: getInitials('Test User')
      };
      
      setAuthState({
        user: mockUser,
        isAuthenticated: true
      });

      localStorage.setItem('auth_token', 'mock_token');
    } catch (error) {
      throw new Error('Login failed');
    }
  };

  const signup = async (name: string, email: string, password: string) => {
    try {
      // Mock signup - replace with real API call
      const mockUser: User = {
        id: Date.now().toString(),
        name,
        email,
        initials: getInitials(name)
      };
      
      setAuthState({
        user: mockUser,
        isAuthenticated: true
      });

      localStorage.setItem('auth_token', 'mock_token');
    } catch (error) {
      throw new Error('Signup failed');
    }
  };

  const logout = () => {
    setAuthState({
      user: null,
      isAuthenticated: false
    });
    localStorage.removeItem('auth_token');
  };

  const loginWithGoogle = async (credential: string) => {
    try {
      // Mock Google login - replace with real API call
      const mockUser: User = {
        id: 'g-' + Date.now().toString(),
        name: 'Google User',
        email: 'google.user@example.com',
        initials: getInitials('Google User')
      };
      
      setAuthState({
        user: mockUser,
        isAuthenticated: true
      });

      localStorage.setItem('auth_token', 'mock_google_token');
    } catch (error) {
      throw new Error('Google login failed');
    }
  };

  const loginWithFacebook = async (response: any) => {
    try {
      // Mock Facebook login - replace with real API call
      const mockUser: User = {
        id: 'fb-' + Date.now().toString(),
        name: 'Facebook User',
        email: 'facebook.user@example.com',
        initials: getInitials('Facebook User')
      };
      
      setAuthState({
        user: mockUser,
        isAuthenticated: true
      });

      localStorage.setItem('auth_token', 'mock_facebook_token');
    } catch (error) {
      throw new Error('Facebook login failed');
    }
  };

  return (
    <AuthContext.Provider value={{ 
      ...authState, 
      login, 
      signup, 
      logout,
      loginWithGoogle,
      loginWithFacebook
    }}>
      {children}
    </AuthContext.Provider>
  );
};