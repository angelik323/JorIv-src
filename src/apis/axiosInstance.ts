import { useLogin } from '@/stores'
import axios, { AxiosResponse } from 'axios'
import { createPinia, storeToRefs } from 'pinia'

const pinia = createPinia()

let IS_LOGGING_OUT = false

// Configuración compartida para ambas instancias
const axiosConfig = {
  baseURL: `${import.meta.env.VITE_APP_URL}`,
  headers: {
    'Content-Type': 'application/json',
  },
}

// Instancias de axios
const apiBase = axios.create(axiosConfig)
const apiBaseLogin = axios.create(axiosConfig)

apiBase.interceptors.request.use((config) => {
  const { token } = storeToRefs(useLogin())
  if (token.value) {
    config.headers.Authorization = `Bearer ${token.value}`
  }
  return config
})

apiBase.interceptors.response.use(
  (response: AxiosResponse) => response,
  async (error) => {
    const status = error.response?.status
    if (status === 401) {
      if (!IS_LOGGING_OUT) {
        IS_LOGGING_OUT = true
        const authStore = useLogin(pinia)
        await authStore._logoutAction()
      }
      localStorage.clear()
      sessionStorage.clear()
      window.location.replace('/')
    }
    return Promise.reject(error)
  }
)

export { apiBaseLogin }
export default apiBase
