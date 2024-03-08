import { createContext, ReactNode, useContext, useMemo, useState } from "react"
import Cookies from 'js-cookie'

type AuthContextType = {
  login: (params: {email: string, password: string}) => Promise<void>,
  logout: () => Promise<void>,
  register: (params: {email: string, password: string, name: string}) => Promise<void>
  refreshSession: () => Promise<void>,
  isAuthenticated: boolean,
}

type AuthProviderProps = {
  children: ReactNode
  onLoginSuccess?: () => Promise<void>
  onLogoutSuccess?: () => Promise<void>
  onRefreshSuccess?: () => Promise<void>
  onRegisterSuccess?: () => Promise<void>
}

const AuthContext = createContext<AuthContextType>({
  isAuthenticated: false,
  login: () => Promise.resolve(),
  logout: () => Promise.resolve(),
  register: () => Promise.resolve(),
  refreshSession: () => Promise.resolve()
})

const COOKIE_NAME = "coco_at"
const API_URL = process.env.AUTH_API_URL ?? ""

export const AuthProvider = ({ children, onLoginSuccess, onLogoutSuccess, onRefreshSuccess, onRegisterSuccess }: AuthProviderProps) => {
  const [isAuthenticated, setIsAuthenticated] = useState(!!Cookies.get(COOKIE_NAME))

  const login: AuthContextType['login'] = async ({email, password}) => {
    console.log(API_URL)
    const res = await fetch(`${API_URL}/auth/login`, {
      method: "POST",
      body: JSON.stringify({
        email,
        password
      }),
      headers: {
        "Content-Type": "application/json"
      }
    })
    if (res.ok) {
      setIsAuthenticated(true)
      await onLoginSuccess?.()
    }

  }

  const register: AuthContextType['register'] = async ({email, password, name}) => {
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
    }

  }

  const logout = async () => {
    Cookies.remove(COOKIE_NAME)
    await onLogoutSuccess?.()
  }

  const refreshSession = async () => {
    const res = await fetch(`${API_URL}/auth/refresh`)
    if (res.ok) {
      onRefreshSuccess?.()
    }
  }

  const value = useMemo(() => ({
    isAuthenticated,
    refreshSession,
    register,
    logout,
    login
  } as AuthContextType), [])

  if (!API_URL || API_URL.endsWith("/")) {
    throw new Error("process.env.AUTH_API_URL need to be set with no trailing slash")
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
