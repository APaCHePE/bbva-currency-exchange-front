<template>
  <div class="result-container">
    <h3>Resultado:</h3>
    <p class="result-amount">
      {{ result.originalAmount }} {{ fromCurrency }} = 
      <strong>{{ result.convertedAmount }} {{ toCurrency }}</strong>
    </p>
    <div class="rate-info">
      <el-icon><InfoFilled /></el-icon>
      <p class="exchange-rate">
        Tipo de cambio: 1 {{ fromCurrency }} = {{ result.rate }} {{ toCurrency }}
      </p>
    </div>
    <!-- <p class="last-update">
      <el-icon><Clock /></el-icon>
      Actualizado: {{ formatDate(result.updatedAt) }}
    </p> -->
  </div>
</template>

<script setup>
import { InfoFilled, Clock } from '@element-plus/icons-vue'

const props = defineProps({
  result: {
    type: Object,
    required: true
  },
  fromCurrency: {
    type: String,
    required: true
  },
  toCurrency: {
    type: String,
    required: true
  },
  formatDate: {
    type: Function,
    default: (date) => new Date(date).toLocaleString()
  }
})
</script>

<style scoped>
.result-container {
  margin-top: 30px;
  padding: 20px;
  background-color: #f8f9fa;
  border-radius: 8px;
  border: 1px solid var(--el-border-color-light);
}

.result-amount {
  font-size: 1.2rem;
  margin: 10px 0;
  color: var(--el-color-primary);
}

.rate-info {
  display: flex;
  align-items: center;
  gap: 8px;
  margin: 15px 0;
}

.exchange-rate {
  color: var(--el-text-color-secondary);
  font-size: 0.9rem;
  margin: 0;
}

.last-update {
  display: flex;
  align-items: center;
  gap: 8px;
  color: var(--el-text-color-secondary);
  font-size: 0.8rem;
  margin: 5px 0;
  font-style: italic;
}

.el-icon {
  font-size: 1em;
  vertical-align: middle;
}
</style>