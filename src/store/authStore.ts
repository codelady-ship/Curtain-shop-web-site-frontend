import { create } from 'zustand'

interface User {
  id: number
  email: string
  name: string
  role: 'RENTER' | 'OWNER' | 'ADMIN' | 'MODERATOR'
  avatar?: string
}

interface AuthState {
  user: User | null
  token: string | null
  login: (email: string, password: string) => Promise<void>
  logout: () => void
  setUser: (user: User | null) => void
}

export const useAuthStore = create<AuthState>((set, get) => ({
  user: null,
  token: null,
  
  login: async (email: string, password: string) => {
    try {
      // Mock API call
      const response = await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password })
      })
      
      const data = await response.json()
      set({ user: data.user, token: data.token })
      localStorage.setItem('token', data.token)
    } catch (error) {
      console.error('Login failed:', error)
      throw error
    }
  },

  logout: () => {
    set({ user: null, token: null })
    localStorage.removeItem('token')
  },

  setUser: (user) => set({ user })
}))
