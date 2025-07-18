import { createContext } from 'react'
import type { AuthState } from '../Services/auth.service'

export interface AuthContextType extends AuthState {
  login: () => Promise<void>
  logout: () => Promise<void>
  isLoading: boolean
}

export const AuthContext = createContext<AuthContextType | undefined>(undefined)
