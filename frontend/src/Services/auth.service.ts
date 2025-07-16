import { AuthClient } from '@dfinity/auth-client'
import { Principal } from '@dfinity/principal'
import type { Identity } from '@dfinity/agent'

export interface AuthState {
  isAuthenticated: boolean
  principal: Principal | null
  identity: Identity | null
}

class AuthService {
  private authClient: AuthClient | null = null

  async initialize(): Promise<AuthClient> {
    if (!this.authClient) {
      this.authClient = await AuthClient.create()
    }
    return this.authClient
  }

  async login(): Promise<AuthState> {
    const authClient = await this.initialize()
    
    return new Promise((resolve, reject) => {
      authClient.login({
        identityProvider: 'https://identity.ic0.app',
        maxTimeToLive: BigInt(7 * 24 * 60 * 60 * 1000 * 1000 * 1000), // 7 days
        onSuccess: async () => {
          const identity = authClient.getIdentity()
          const principal = identity.getPrincipal()
          
          resolve({
            isAuthenticated: true,
            principal,
            identity
          })
        },
        onError: (error) => {
          reject(error)
        }
      })
    })
  }

  async logout(): Promise<void> {
    const authClient = await this.initialize()
    await authClient.logout()
  }

  async getAuthState(): Promise<AuthState> {
    const authClient = await this.initialize()
    const isAuthenticated = await authClient.isAuthenticated()
    
    if (isAuthenticated) {
      const identity = authClient.getIdentity()
      const principal = identity.getPrincipal()
      
      return {
        isAuthenticated: true,
        principal,
        identity
      }
    }
    
    return {
      isAuthenticated: false,
      principal: null,
      identity: null
    }
  }

  async isAuthenticated(): Promise<boolean> {
    const authClient = await this.initialize()
    return await authClient.isAuthenticated()
  }

  async getPrincipal(): Promise<Principal | null> {
    const authClient = await this.initialize()
    const isAuthenticated = await authClient.isAuthenticated()
    
    if (isAuthenticated) {
      const identity = authClient.getIdentity()
      return identity.getPrincipal()
    }
    
    return null
  }
}

export const authService = new AuthService()
