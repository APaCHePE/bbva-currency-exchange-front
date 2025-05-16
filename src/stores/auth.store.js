import {
  defineStore
} from 'pinia'
import {
  ref,
  computed
} from 'vue'
import router from '@/router'
import {
  useUIStore
} from './ui.store'
import {
  decodeJWT
} from '@/utils/jwtUtils'
import authApi from '@/api/auth'

export const useAuthStore = defineStore('auth', () => {
  const uiStore = useUIStore();
  const token = ref(localStorage.getItem('token'))
  const userData = ref(JSON.parse(localStorage.getItem('userData') || null))

  const isAuthenticated = computed(() => !!token.value)
  const isAdmin = computed(() => {
    if (!userData.value) return false
    return userData.value.roles.includes('ADMIN')
  })
  const currentUser = computed(() => userData.value?.sub || null)
  const userRoles = computed(() => userData.value?.roles || [])

  const login = async (credentials) => {
    try {
      uiStore.showLoader('Iniciando sesión...')
      const response = await authApi.login(credentials)

      token.value = response.data.data.token;

      const decoded = decodeJWT(token.value)
      if (!decoded) throw new Error('Invalid token')

      const currentTime = Date.now() / 1000
      if (decoded.payload.exp < currentTime) {
        throw new Error('Token expired')
      }

      userData.value = {
        sub: decoded.payload.sub,
        roles: decoded.payload.roles,
        iat: decoded.payload.iat,
        iss: decoded.payload.iss
      }

      localStorage.setItem('token', token.value)
      localStorage.setItem('userData', JSON.stringify(userData.value))

      return response.data
    } catch (error) {
      uiStore.showAlert({
        type: 'error',
        title: 'Error de login',
        message: error.message
      })
      logout()
      throw error
    } finally {
      uiStore.hideLoader();
    }
  }

  const logout = () => {
    token.value = null
    userData.value = null
    localStorage.removeItem('token')
    localStorage.removeItem('userData')
    router.push('/login')
  }
  
  const initialize = () => {
    if (token.value) {
      const decoded = decodeJWT(token.value)
      if (decoded) {
        userData.value = {
          sub: decoded.payload.sub,
          roles: decoded.payload.roles,
          iat: decoded.payload.iat,
          iss: decoded.payload.iss
        }
      } else {
        logout()
      }
    }
  }
  // Inicializar al cargar el store
  initialize()

  return {
    token,
    userData,
    isAuthenticated,
    isAdmin,
    currentUser,
    userRoles,
    login,
    logout
  }
})