import api from './index'

export const ExchangeRateService = {
  async getExchangeRates() {
    try {
      const response = await api.get('/exchange-rates')
      // Asegurar formato consistente
      return response.data.data.map(rate => ({
        ...rate,
        fromCurrency: rate.fromCurrency.toUpperCase(),
        toCurrency: rate.toCurrency.toUpperCase()
      }))
    } catch (error) {
      throw new Error(error.response?.data?.message || 'Error fetching exchange rates')
    }
  },

  async convertCurrency(payload) {
    try {
      const response = await api.post('/exchange-rates/convert', payload)
      return response.data.data
    } catch (error) {
      throw new Error(error.response?.data?.message || 'Error converting currency')
    }
  },

  async createRate(payload) {
    try {
      const response = await api.post('/exchange-rates', payload)
      return response.data.data
    } catch (error) {
      throw new Error(error.response?.data?.message || 'Error al crear tasa de cambio')
    }
  },

  async updateRate(id, payload) {
    try {
      const response = await api.put(`/exchange-rates/${id}`, payload)
      return response.data.data
    } catch (error) {
      throw new Error(error.response?.data?.message || 'Error al actualizar tasa de cambio')
    }
  }
}