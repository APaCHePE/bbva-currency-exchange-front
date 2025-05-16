import {
  defineStore
} from 'pinia'

export const useUIStore = defineStore('ui', {
  state: () => ({
    isLoading: false,
    loaderText: 'Cargando...',
    alert: {
      show: false,
      type: 'info',
      title: '',
      message: '',
      duration: 4000
    }
  }),
  actions: {
    showLoader(text = 'Cargando...') {
      this.isLoading = true
      this.loaderText = text
    },
    hideLoader() {
      this.isLoading = false
    },
    showAlert({
      type,
      title,
      message,
      duration = 4000
    }) {
      this.alert = {
        show: true,
        type,
        title,
        message,
        duration
      }
    },
    hideAlert() {
      this.alert.show = false
    }
  }
})