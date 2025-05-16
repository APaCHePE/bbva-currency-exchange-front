import api from './index'

export default {
  login(credentials) {
    return api.post('/auth/login', credentials)
  },
  logout() {
    return api.post('/auth/logout')
  }
}