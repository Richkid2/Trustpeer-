import { createContext } from 'react'

export interface LoadingContextType {
  isAppLoading: boolean
  setAppLoading: (loading: boolean) => void
  showAppLoader: () => void
  hideAppLoader: () => void
}

export const LoadingContext = createContext<LoadingContextType | undefined>(undefined)
