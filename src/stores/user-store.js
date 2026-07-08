import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import { removeAuthCookie } from '@/src/app/actions/auth';

export const useUserStore = create(
  persist(
    (set) => ({
      user: null,
      token: null,
      isAuthenticated: false,
      _hasHydrated: false,

      setUser: (user) => set({ user, isAuthenticated: !!user }),
      setToken: (token) => {
        set({ token });
        if (token) {
          localStorage.setItem('token', token);
        } else {
          localStorage.removeItem('token');
        }
      },
      
      setAuth: (user, token) => {
        set({ user, token, isAuthenticated: !!(user && token) });
        if (token) {
          localStorage.setItem('token', token);
        } else {
          localStorage.removeItem('token');
        }
      },

      logout: async () => {
        set({ user: null, token: null, isAuthenticated: false });
        localStorage.removeItem('token');
        localStorage.removeItem('user-storage');
        await removeAuthCookie();
      },
    }),
    {
      name: 'user-storage',
      storage: createJSONStorage(() => localStorage),
      partialize: (state) => ({
        user: state.user,
        token: state.token,
        isAuthenticated: state.isAuthenticated,
      }),
      skipHydration: true,
      onRehydrateStorage: () => (state, error) => {
        if (!error && typeof window !== 'undefined') {
          const storedToken = localStorage.getItem('token');
          if (storedToken && !state?.token) {
            useUserStore.setState({ token: storedToken, isAuthenticated: true });
          }
        }

        useUserStore.setState({ _hasHydrated: true });
      },
    }
  )
);
