<template>
  <div class="converter-view">
    <el-card class="converter-card">
      <template #header>
        <h2>Conversor de Monedas</h2>
      </template>
      
      <el-form :model="form" ref="converterForm">
        <el-form-item label="Monto">
          <el-input-number 
            v-model="form.amount" 
            :min="0" 
            :precision="2" 
            :controls="false"
            size="large"
          />
        </el-form-item>
        
        <el-form-item label="De">
          <el-select 
            v-model="form.fromCurrency" 
            placeholder="Seleccione moneda"
            size="large"
          >
            <el-option
              v-for="currency in currencies"
              :key="'from-'+currency"
              :label="currency"
              :value="currency"
            />
          </el-select>
        </el-form-item>
        
        <el-form-item label="A">
          <el-select 
            v-model="form.toCurrency" 
            placeholder="Seleccione moneda"
            size="large"
          >
            <el-option
              v-for="currency in currencies"
              :key="'to-'+currency"
              :label="currency"
              :value="currency"
            />
          </el-select>
        </el-form-item>
        
        <el-button 
          type="primary" 
          size="large" 
          @click="convertCurrency"
          :loading="loading"
        >
          Convertir
        </el-button>
      </el-form>
      
      <div v-if="result" class="result-container">
        <h3>Resultado:</h3>
        <p class="result-amount">
          {{ form.amount }} {{ form.fromCurrency }} = 
          <strong>{{ result.convertedAmount }} {{ form.toCurrency }}</strong>
        </p>
        <p class="exchange-rate">
          Tipo de cambio: 1 {{ form.fromCurrency }} = {{ result.rate }} {{ form.toCurrency }}
        </p>
      </div>
    </el-card>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import { ElMessage } from 'element-plus'

const form = ref({
  amount: 1,
  fromCurrency: 'USD',
  toCurrency: 'EUR'
})

const currencies = ref(['USD', 'EUR', 'GBP', 'JPY', 'CAD'])
const result = ref(null)
const loading = ref(false)
const converterForm = ref(null)

const convertCurrency = async () => {
  try {
    loading.value = true
    result.value = null
    
    // Simular llamada a API
    await new Promise(resolve => setTimeout(resolve, 500))
    
    // Simular respuesta (en un proyecto real esto vendría de la API)
    const mockRates = {
      'USD_EUR': 0.93,
      'EUR_USD': 1.08,
      'USD_GBP': 0.79,
      'GBP_USD': 1.27,
      'USD_JPY': 148.50,
      'JPY_USD': 0.0067,
      'USD_CAD': 1.35,
      'CAD_USD': 0.74,
      'EUR_GBP': 0.85,
      'GBP_EUR': 1.18,
      'EUR_JPY': 159.68,
      'JPY_EUR': 0.0063,
      'EUR_CAD': 1.45,
      'CAD_EUR': 0.69,
      'GBP_JPY': 187.97,
      'JPY_GBP': 0.0053,
      'GBP_CAD': 1.71,
      'CAD_GBP': 0.58,
      'JPY_CAD': 0.0091,
      'CAD_JPY': 110.11
    }
    
    const rateKey = `${form.value.fromCurrency}_${form.value.toCurrency}`
    const rate = mockRates[rateKey] || 1
    
    result.value = {
      convertedAmount: (form.value.amount * rate).toFixed(2),
      rate: rate.toFixed(6)
    }
    
  } catch (error) {
    ElMessage.error('Error al convertir la moneda')
  } finally {
    loading.value = false
  }
}
</script>

<style scoped>
.converter-view {
  max-width: 600px;
  margin: 0 auto;
}

.converter-card {
  border-radius: 8px;
}

.result-container {
  margin-top: 30px;
  padding: 20px;
  background-color: #f8f9fa;
  border-radius: 8px;
}

.result-amount {
  font-size: 1.2rem;
  margin: 10px 0;
}

.exchange-rate {
  color: var(--el-text-color-secondary);
  font-size: 0.9rem;
}
</style>