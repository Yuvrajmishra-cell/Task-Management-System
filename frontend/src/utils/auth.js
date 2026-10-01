const TOKEN_KEY = 'token'
const USER_KEY = 'user'

export const saveAuth = (token, user) => {
  localStorage.setItem(TOKEN_KEY, token)
  localStorage.setItem(USER_KEY, JSON.stringify(user))
}

export const getAuthToken = () => {
  return localStorage.getItem(TOKEN_KEY)
}

export const getAuthUser = () => {
  const storedUser = localStorage.getItem(USER_KEY)

  if (!storedUser) {
    return null
  }

  return JSON.parse(storedUser)
}

export const clearAuth = () => {
  localStorage.removeItem(TOKEN_KEY)
  localStorage.removeItem(USER_KEY)
}
