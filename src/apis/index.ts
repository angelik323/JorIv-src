import apiBase, { apiBaseLogin } from '@/apis/axiosInstance'

export const executeApi = () => {
  apiBase.defaults.baseURL = `${import.meta.env.VITE_APP_URL}`
  return apiBase
}

export const executeApiLogin = () => {
  apiBaseLogin.defaults.baseURL = `${import.meta.env.VITE_APP_URL}`
  return apiBaseLogin
}
