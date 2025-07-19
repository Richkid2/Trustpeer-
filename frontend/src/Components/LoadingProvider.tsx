import { useState } from 'react'
import type { ReactNode } from 'react'
import { LoadingContext } from './LoadingContext'

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
