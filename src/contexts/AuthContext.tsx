"use client"

import { createContext, useContext, useEffect, useState } from 'react'
import { User } from '@/lib/supabase'
import { verifySession, logoutUser } from '@/lib/auth'

interface AuthContextType {
  user: User | null
  loading: boolean
  login: (token: string) => void
  logout: () => void
}

const AuthContext = createContext<AuthContextType>({
  user: null,
  loading: true,
  login: () => {},
  logout: () => {}
})

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    checkAuth()
  }, [])

  async function checkAuth() {
    const token = localStorage.getItem('auth_token')
    
    if (token) {
      const user = await verifySession(token)
      setUser(user)
    }
    
    setLoading(false)
  }

  function login(token: string) {
    localStorage.setItem('auth_token', token)
    checkAuth()
  }

  async function logout() {
    const token = localStorage.getItem('auth_token')
    if (token) {
      await logoutUser(token)
      localStorage.removeItem('auth_token')
    }
    setUser(null)
  }

  return (
    <AuthContext.Provider value={{ user, loading, login, logout }}>
      {children}
    </AuthContext.Provider>
  )
}

export const useAuth = () => useContext(AuthContext)
