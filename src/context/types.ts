export type UserRole = 'user' | 'organizer' | 'admin';

export interface User {
  id: string;
  name: string;
  email: string;
  initials: string;
  phone?: string;
  bio?: string;
  role: UserRole;
}

export interface AuthState {
  user: User | null;
  isAuthenticated: boolean;
}

export interface AuthContextType extends AuthState {
  login: (email: string, password: string) => Promise<UserRole>;
  signup: (name: string, email: string, password: string) => Promise<void>;
  logout: () => void;
  loginWithGoogle: (credential: string) => Promise<void>;
  loginWithFacebook: (response: any) => Promise<void>;
}