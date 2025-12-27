import { create } from 'zustand';

export const useAuthStore = create((set) => ({
  admin: null,
  token: localStorage.getItem('adminToken'),
  isAuthenticated: !!localStorage.getItem('adminToken'),
  
  login: (token, admin) => {
    localStorage.setItem('adminToken', token);
    set({ token, admin, isAuthenticated: true });
  },
  
  logout: () => {
    localStorage.removeItem('adminToken');
    set({ token: null, admin: null, isAuthenticated: false });
  },
}));

