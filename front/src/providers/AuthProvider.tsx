import { createContext, ReactNode, useCallback, useContext, useEffect, useMemo, useState } from "react"
import { ApiError } from "@/models/ApiError"

type AuthContextType = {
  login: (params: { email: string, password: string }) => Promise<void>,
  logout: () => Promise<void>,
  register: (params: { email: string, password: string, name: string }) => Promise<void>
  refreshSession: () => Promise<void>,
  isAuthenticated: boolean,
  isInitializing: boolean
}

type AuthProviderProps = {
  children: ReactNode
  onLoginSuccess?: () => Promise<void>
  onLogoutSuccess?: () => Promise<void>
  onRefreshSuccess?: () => Promise<void>
  onRegisterSuccess?: () => Promise<void>
  useAuthorizationHeader?: boolean
}

const AuthContext = createContext<AuthContextType>({
  isAuthenticated: false,
  isInitializing: true,
  login: () => Promise.resolve(),
  logout: () => Promise.resolve(),
  register: () => Promise.resolve(),
  refreshSession: () => Promise.resolve(),
})

const API_URL = import.meta.env.VITE_AUTH_API_URL ?? ""
const LOCAL_STORAGE_KEY = "coco_at"
const { fetch: originalFetch } = window;

const addInterceptFetch = (token: string) => {
  window.fetch = async (...args: Parameters<typeof originalFetch>) => {
    const [resource, config = {}] = args;

    const response = await originalFetch(resource, {
      ...config, headers: {
        ...(config.headers ?? {}),
        Authorization: "Bearer " + token
      }
    });

    return response;
  }
}

const clearFetch = () => {
  window.fetch = originalFetch
}

export const AuthProvider = ({ children, onLoginSuccess, onLogoutSuccess, onRefreshSuccess, onRegisterSuccess, useAuthorizationHeader }: AuthProviderProps) => {
  const [isAuthenticated, setIsAuthenticated] = useState<boolean | undefined>(false)

  const login: AuthContextType['login'] = useCallback(async ({ email, password }) => {
    const res = await fetch(`${API_URL}/auth/login`, {
      method: "POST",
      credentials: "include",
      body: JSON.stringify({
        email,
        password
      }),
      headers: {
        "Content-Type": "application/json"
      }
    })
    if (res.ok) {
      if (useAuthorizationHeader) {
        const { token } = await res.json()
        addInterceptFetch(token)
        localStorage.setItem(LOCAL_STORAGE_KEY, token)
        setIsAuthenticated(true)
        await onLoginSuccess?.()
      } else {
        const { message } = await res.json()
        throw new ApiError(res.status, message)
      }
    }

  }, [onLoginSuccess, useAuthorizationHeader])

  const register: AuthContextType['register'] = useCallback(async ({ email, password, name }) => {
    const res = await fetch(`${API_URL}/auth/register`, {
      method: "POST",
      body: JSON.stringify({
        email,
        password,
        name
      }),
      headers: {
        "Content-Type": "application/json"
      }
    })
    if (res.ok) {
      await onRegisterSuccess?.()
    } else {
      const { message } = await res.json()
      throw new ApiError(res.status, message)
    }

  }, [onRegisterSuccess])

  const logout = useCallback(async () => {
    const res = await fetch(`${API_URL}/auth/logout`, {
      method: "GET",
      credentials: "include",
    })
    if (res.ok) {
      if (useAuthorizationHeader) {
        clearFetch()
        localStorage.removeItem(LOCAL_STORAGE_KEY)
      }
      await onLogoutSuccess?.()
    } else {
      const { message } = await res.json()
      throw new ApiError(res.status, message)
    }
    setIsAuthenticated(false)
  }, [onLogoutSuccess, useAuthorizationHeader])

  const refreshSession = useCallback(async () => {
    try {
      if (useAuthorizationHeader && localStorage.getItem(LOCAL_STORAGE_KEY)) {
        const res = await fetch(`${API_URL}/auth/refresh`, { credentials: "include", headers: { Authorization: "Bearer " + localStorage.getItem(LOCAL_STORAGE_KEY) } })
        if (res.ok) {
          const { token } = await res.json()
          addInterceptFetch(token)
          localStorage.setItem(LOCAL_STORAGE_KEY, token)
          onRefreshSuccess?.()
          if (!isAuthenticated) {
            setIsAuthenticated(true)
          }
        } else {
          if (isAuthenticated || isAuthenticated === undefined) {
            setIsAuthenticated(false)
          }
          const { message } = await res.json()
          throw new ApiError(res.status, message)
        }
      } else {
        const res = await fetch(`${API_URL}/auth/refresh`, { credentials: "include" })
        if (res.ok) {
          onRefreshSuccess?.()
          if (!isAuthenticated) {
            setIsAuthenticated(true)
          }
        } else {
          if (isAuthenticated || isAuthenticated === undefined) {
            setIsAuthenticated(false)
          }
          const { message } = await res.json()
          throw new ApiError(res.status, message)
        }
      }
    } catch (err) {
      if (isAuthenticated || isAuthenticated === undefined) {
        setIsAuthenticated(false)
      }
      throw err
    }
  }, [useAuthorizationHeader, onRefreshSuccess, isAuthenticated])

  useEffect(() => {
    if (!isAuthenticated) {
      refreshSession().catch(() => null)
    }
  }, [refreshSession, isAuthenticated])

  const value = useMemo(() => ({
    isInitializing: isAuthenticated === undefined,
    isAuthenticated,
    refreshSession,
    register,
    logout,
    login
  } as AuthContextType), [isAuthenticated, refreshSession, register, logout, login])

  if (!API_URL || API_URL.endsWith("/")) {
    throw new Error("VITE_AUTH_API_URL need to be set with no trailing slash")
  }

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  )
}

export const useAuth = () => {
  const context = useContext(AuthContext)

  if (!context) {
    throw new Error('useAuth must be used inside AuthContext')
  }

  return context
}
