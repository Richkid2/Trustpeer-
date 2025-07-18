import React, { useEffect, useState } from 'react'
import type { ReactNode } from 'react'
import { authService } from '../Services/auth.service'
import type { AuthState } from '../Services/auth.service'
import { AuthContext, type AuthContextType } from './AuthContext'

interface AuthProviderProps {
  children: ReactNode
}

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const [authState, setAuthState] = useState<AuthState>({
    isAuthenticated: false,
    principal: null,
    identity: null
  })
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    checkAuthentication()
  }, [])

  const checkAuthentication = async () => {
    try {
      const state = await authService.getAuthState()
      setAuthState(state)
    } catch (error) {
      console.error('Authentication check failed:', error)
    } finally {
      setIsLoading(false)
    }
  }

  const login = async () => {
    try {
      setIsLoading(true)
      const state = await authService.login()
      setAuthState(state)
    } catch (error) {
      console.error('Login failed:', error)
      throw error
    } finally {
      setIsLoading(false)
    }
  }

  const logout = async () => {
    try {
      await authService.logout()
      setAuthState({
        isAuthenticated: false,
        principal: null,
        identity: null
      })
    } catch (error) {
      console.error('Logout failed:', error)
      throw error
    }
  }

  const value: AuthContextType = {
    ...authState,
    login,
    logout,
    isLoading
  }

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}
