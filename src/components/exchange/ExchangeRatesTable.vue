<template>
  <div class="rates-table">
    <h3>Tasas de Cambio Disponibles</h3>
    <el-table 
      :data="rates" 
      border 
      style="width: 100%"
      v-loading="loading"
      empty-text="No hay tasas de cambio disponibles"
    >
      <el-table-column prop="fromCurrency" label="De" width="120" />
      <el-table-column prop="toCurrency" label="A" width="120" />
      <el-table-column prop="rate" label="Tasa" width="150">
        <template #default="{ row }">
          {{ row.rate.toFixed(4) }}
        </template>
      </el-table-column>
      <el-table-column prop="updatedAt" label="Última Actualización">
        <template #default="{ row }">
          {{ formatDate(row.updatedAt) }}
        </template>
      </el-table-column>
    </el-table>
  </div>
</template>

<script setup>
const props = defineProps({
  rates: {
    type: Array,
    default: () => []
  },
  loading: {
    type: Boolean,
    default: false
  },
  formatDate: {
    type: Function,
    default: (date) => new Date(date).toLocaleString()
  }
})
</script>

<style scoped>
.rates-table {
  margin-top: 40px;
}

.rates-table h3 {
  margin-bottom: 15px;
  color: var(--el-text-color-primary);
}

:deep(.el-table) {
  margin-top: 10px;
}

:deep(.el-table__empty-block) {
  min-height: 100px;
}
</style>