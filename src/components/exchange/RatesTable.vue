<template>
  <el-table 
    :data="rates" 
    border 
    style="width: 100%"
    v-loading="loading"
    empty-text="No hay tasas de cambio disponibles"
  >
    <el-table-column prop="fromCurrency" label="De" width="120" />
    <el-table-column prop="toCurrency" label="A" width="120" />
    <el-table-column prop="rate" label="Tipo de Cambio" width="150">
      <template #default="{ row }">
        {{ row.rate.toFixed(6) }}
      </template>
    </el-table-column>
    <el-table-column prop="updatedAt" label="Última Actualización">
      <template #default="{ row }">
        {{ formatDate(row.updatedAt) }}
      </template>
    </el-table-column>
    <el-table-column label="Acciones" width="150" v-if="editable">
      <template #default="{ row }">
        <el-button size="small" @click="$emit('edit', row)">Editar</el-button>
      </template>
    </el-table-column>
  </el-table>
</template>

<script setup>
defineProps({
  rates: {
    type: Array,
    required: true
  },
  loading: {
    type: Boolean,
    default: false
  },
  editable: {
    type: Boolean,
    default: false
  },
  formatDate: {
    type: Function,
    default: (date) => new Date(date).toLocaleString()
  }
})

defineEmits(['edit'])
</script>