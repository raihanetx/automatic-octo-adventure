import { create } from 'zustand';
import { persist } from 'zustand/middleware';

interface AdminState {
  isAuthenticated: boolean;
  admin: { id: string; username: string } | null;
  setAdmin: (admin: { id: string; username: string }) => void;
  logout: () => void;
}

export const useAdminStore = create<AdminState>()(
  persist(
    (set) => ({
      isAuthenticated: false,
      admin: null,
      setAdmin: (admin) =>
        set({ isAuthenticated: true, admin }),
      logout: () =>
        set({ isAuthenticated: false, admin: null }),
    }),
    {
      name: 'admin-storage',
    }
  )
);
