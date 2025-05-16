import {
  defineStore
} from 'pinia'
import {
  ExchangeRateService
} from '@/api/exchange'
import {
  useUIStore
} from './ui.store'

export const useExchangeRateStore = defineStore('exchangeRate', {
  state: () => ({
    rates: [],
    conversionResult: null,
    loadingRates: false,
    loadingConversion: false
  }),
  getters: {
    availableCurrencies: (state) => {
      const currencies = new Set()
      state.rates.forEach(rate => {
        currencies.add(rate.fromCurrency)
        currencies.add(rate.toCurrency)
      })
      return Array.from(currencies).sort()
    },
    targetCurrencies: (state) => (fromCurrency) => {
      if (!fromCurrency) return []
      return state.rates
        .filter(rate => rate.fromCurrency === fromCurrency)
        .map(rate => rate.toCurrency)
        .filter((value, index, self) => self.indexOf(value) === index) // Eliminar duplicados
        .sort()
    },
    currencyPairs: (state) => {
      const pairs = {}
      state.rates.forEach(rate => {
        if (!pairs[rate.fromCurrency]) {
          pairs[rate.fromCurrency] = []
        }
        pairs[rate.fromCurrency].push(rate.toCurrency)
      })
      return pairs
    }
  },
  actions: {
    async fetchExchangeRates() {
      const uiStore = useUIStore()
      try {
        this.loadingRates = true
        uiStore.showLoader('Cargando tasas...')
        this.rates = await ExchangeRateService.getExchangeRates()
      } catch (error) {
        uiStore.showAlert({
          type: 'error',
          title: 'Error',
          message: error.message
        })
      } finally {
        this.loadingRates = false
        uiStore.hideLoader()
      }
    },

    async convertCurrency(payload) {
      const uiStore = useUIStore()
      try {
        this.loadingConversion = true
        uiStore.showLoader('Realizando conversión...')
        this.conversionResult = await ExchangeRateService.convertCurrency(payload)
      } catch (error) {
        uiStore.showAlert({
          type: 'error',
          title: 'Error',
          message: error.message
        })
      } finally {
        this.loadingConversion = false
        uiStore.hideLoader()
      }
    },

    async createRate(payload) {
      const uiStore = useUIStore();
      try {
        uiStore.showLoader('Creando tasa...')
        const newRate = await ExchangeRateService.createRate(payload)
        this.rates.push(newRate)
        uiStore.showAlert({
          type: 'success',
          title: 'Éxito',
          message: 'Tasa creada correctamente'
        })
        return newRate
      } catch (error) {
        uiStore.showAlert({
          type: 'error',
          title: 'Error',
          message: error.message
        })
        throw error
      } finally {
        uiStore.hideLoader()
      }
    },
  
    async updateRate(id, payload) {
      const uiStore = useUIStore()
      try {
        uiStore.showLoader('Actualizando tasa...')
        const updatedRate = await ExchangeRateService.updateRate(id, payload)
        const index = this.rates.findIndex(r => r.id === id)
        if (index !== -1) {
          this.rates.splice(index, 1, updatedRate)
        }
        uiStore.showAlert({
          type: 'success',
          title: 'Éxito',
          message: 'Tasa actualizada correctamente'
        })
        return updatedRate
      } catch (error) {
        uiStore.showAlert({
          type: 'error',
          title: 'Error',
          message: error.message
        })
        throw error
      } finally {
        uiStore.hideLoader()
      }
    },
    formatDate(dateString) {
      return new Date(dateString).toLocaleString();
    },
  },
})