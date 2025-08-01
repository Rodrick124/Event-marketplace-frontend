export interface User {
  id: string;
  name: string;
  email: string;
  initials: string;
}

export interface AuthState {
  user: User | null;
  isAuthenticated: boolean;
}

export interface AuthContextType extends AuthState {
  login: (email: string, password: string) => Promise<void>;
  signup: (name: string, email: string, password: string) => Promise<void>;
  logout: () => void;
  loginWithGoogle: (credential: string) => Promise<void>;
  loginWithFacebook: (response: any) => Promise<void>;
}