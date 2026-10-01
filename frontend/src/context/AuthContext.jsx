import { createContext, useContext, useState } from 'react'
import { getAuthToken, getAuthUser, saveAuth, clearAuth } from '../utils/auth'

const AuthContext = createContext(null)

export const AuthProvider = ({ children }) => {
  const [token, setToken] = useState(getAuthToken())
  const [user, setUser] = useState(getAuthUser())

  const login = (token, user) => {
    saveAuth(token, user)
    setToken(token)
    setUser(user)
  }

  const logout = () => {
    clearAuth()
    setToken(null)
    setUser(null)
  }

  return (
    <AuthContext.Provider value={{ token, user, login, logout }}>
      {children}
    </AuthContext.Provider>
  )
}

export const useAuth = () => {
  return useContext(AuthContext)
}
