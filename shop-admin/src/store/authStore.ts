import { create } from 'zustand'
import { persist } from 'zustand/middleware'

interface AuthStore {
  token: string | null
  user: any | null
  setAuth: (user: any, token: string) => void
  logout: () => void
}

export const useAuthStore = create<AuthStore>()(
  persist(
    (set) => ({
      token: null,
      user: null,
      setAuth: (user, token) => {
        set({ user, token })
        localStorage.setItem('gs_token', token)
      },
      logout: () => {
        set({ user: null, token: null })
        localStorage.removeItem('gs_token')
      },
    }),
    { name: 'gs-admin-auth' }
  )
)
