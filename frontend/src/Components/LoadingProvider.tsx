import { createContext, useContext, useState } from 'react'
import type { ReactNode } from 'react'

interface LoadingContextType {
  isAppLoading: boolean
  setAppLoading: (loading: boolean) => void
  showAppLoader: () => void
  hideAppLoader: () => void
}

const LoadingContext = createContext<LoadingContextType | undefined>(undefined)

export const useLoading = () => {
  const context = useContext(LoadingContext)
  if (!context) {
    throw new Error('useLoading must be used within a LoadingProvider')
  }
  return context
}

interface LoadingProviderProps {
  children: ReactNode
}

export const LoadingProvider = ({ children }: LoadingProviderProps) => {
  const [isAppLoading, setIsAppLoading] = useState(true)

  const setAppLoading = (loading: boolean) => {
    setIsAppLoading(loading)
  }

  const showAppLoader = () => setIsAppLoading(true)
  const hideAppLoader = () => setIsAppLoading(false)

  return (
    <LoadingContext.Provider value={{
      isAppLoading,
      setAppLoading,
      showAppLoader,
      hideAppLoader
    }}>
      {children}
    </LoadingContext.Provider>
  )
}
