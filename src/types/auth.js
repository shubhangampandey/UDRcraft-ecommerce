export type UserRole = 'customer' | 'vendor' | 'admin';

export interface User {
  id: string;
  email: string;
  name: string;
  role: UserRole;
  avatar?: string;
  createdAt: string;
  storeName?: string;
  storeDescription?: string;
  phone?: string;
  status: 'active' | 'suspended' | 'pending';
}

export interface AuthState {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
}
