import {
  defineStore
} from 'pinia'
import {
  ref,
  computed
} from 'vue'
import api from '@/api'
import router from '@/router'
import {
  decodeJWT
} from '@/utils/jwtUtils'

export const useAuthStore = defineStore('auth', () => {
  const token = ref(localStorage.getItem('token'))
  const userData = ref(JSON.parse(localStorage.getItem('userData') || null))

  // Getters computados
  const isAuthenticated = computed(() => !!token.value)
  const isAdmin = computed(() => {
    if (!userData.value) return false
    return userData.value.roles.includes('ADMIN')
  })
  const currentUser = computed(() => userData.value?.sub || null)
  const userRoles = computed(() => userData.value?.roles || [])

  // Acción de login mejorada
  const login = async (credentials) => {
    try {
      const response = await api.post('/auth/login', credentials)

      token.value = response.data.data.token

      // Decodificar el JWT para extraer información
      const decoded = decodeJWT(token.value)
      if (!decoded) throw new Error('Invalid token')

      // Verificar expiración
      const currentTime = Date.now() / 1000
      if (decoded.payload.exp < currentTime) {
        throw new Error('Token expired')
      }

      // Extraer datos relevantes del payload
      userData.value = {
        sub: decoded.payload.sub,
        roles: decoded.payload.roles,
        iat: decoded.payload.iat,
        iss: decoded.payload.iss
      }

      // Almacenar en localStorage
      localStorage.setItem('token', token.value)
      localStorage.setItem('userData', JSON.stringify(userData.value))

      return response.data
    } catch (error) {
      logout()
      throw error
    }
  }
  const logout = () => {
    token.value = null
    userData.value = null
    localStorage.removeItem('token')
    localStorage.removeItem('userData')
    router.push('/login')
  }
  // Verificar autenticación al cargar la aplicación
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