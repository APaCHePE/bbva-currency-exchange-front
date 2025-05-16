<template>
  <div class="rates-view">
    <el-card class="rates-card">
      <template #header>
        <div class="card-header">
          <h2>Tipos de Cambio</h2>
          <el-button 
            type="primary" 
            size="small"
            @click="showAddDialog = true"
          >
            Agregar Tipo
          </el-button>
        </div>
      </template>
      
      <el-table :data="exchangeRates" border style="width: 100%">
        <el-table-column prop="fromCurrency" label="De" width="120" />
        <el-table-column prop="toCurrency" label="A" width="120" />
        <el-table-column prop="rate" label="Tipo de Cambio">
          <template #default="{ row }">
            {{ row.rate.toFixed(6) }}
          </template>
        </el-table-column>
        <el-table-column prop="updatedAt" label="Última Actualización" />
        <el-table-column label="Acciones" width="150">
          <template #default="{ row }">
            <el-button size="small" @click="editRate(row)">Editar</el-button>
          </template>
        </el-table-column>
      </el-table>
    </el-card>
    
    <!-- Diálogo para agregar/editar -->
    <el-dialog 
      v-model="showAddDialog" 
      :title="editingRate ? 'Editar Tipo de Cambio' : 'Agregar Tipo de Cambio'"
      width="500px"
    >
      <el-form :model="rateForm" ref="rateFormRef">
        <el-form-item label="Moneda Origen" prop="fromCurrency">
          <el-select 
            v-model="rateForm.fromCurrency" 
            placeholder="Seleccione moneda"
          >
            <el-option
              v-for="currency in currencies"
              :key="'from-'+currency"
              :label="currency"
              :value="currency"
            />
          </el-select>
        </el-form-item>
        
        <el-form-item label="Moneda Destino" prop="toCurrency">
          <el-select 
            v-model="rateForm.toCurrency" 
            placeholder="Seleccione moneda"
          >
            <el-option
              v-for="currency in currencies"
              :key="'to-'+currency"
              :label="currency"
              :value="currency"
            />
          </el-select>
        </el-form-item>
        
        <el-form-item label="Tipo de Cambio" prop="rate">
          <el-input-number 
            v-model="rateForm.rate" 
            :min="0.000001" 
            :precision="6" 
            :controls="false"
          />
        </el-form-item>
      </el-form>
      
      <template #footer>
        <el-button @click="showAddDialog = false">Cancelar</el-button>
        <el-button type="primary" @click="saveRate">Guardar</el-button>
      </template>
    </el-dialog>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import { ElMessage } from 'element-plus'

const currencies = ['USD', 'EUR', 'GBP', 'JPY', 'CAD']

// Datos simulados - en un proyecto real esto vendría de la API
const exchangeRates = ref([
  { 
    id: 1, 
    fromCurrency: 'USD', 
    toCurrency: 'EUR', 
    rate: 0.93, 
    updatedAt: '2023-11-20 10:30:00' 
  },
  { 
    id: 2, 
    fromCurrency: 'EUR', 
    toCurrency: 'USD', 
    rate: 1.08, 
    updatedAt: '2023-11-20 10:30:00' 
  },
  { 
    id: 3, 
    fromCurrency: 'USD', 
    toCurrency: 'GBP', 
    rate: 0.79, 
    updatedAt: '2023-11-20 10:30:00' 
  }
])

const showAddDialog = ref(false)
const editingRate = ref(null)
const rateFormRef = ref(null)

const rateForm = ref({
  fromCurrency: '',
  toCurrency: '',
  rate: 0
})

const editRate = (rate) => {
  editingRate.value = rate.id
  rateForm.value = {
    fromCurrency: rate.fromCurrency,
    toCurrency: rate.toCurrency,
    rate: rate.rate
  }
  showAddDialog.value = true
}

const saveRate = async () => {
  try {
    // Validar que las monedas sean diferentes
    if (rateForm.value.fromCurrency === rateForm.value.toCurrency) {
      ElMessage.error('Las monedas deben ser diferentes')
      return
    }
    
    // Simular guardado
    await new Promise(resolve => setTimeout(resolve, 500))
    
    if (editingRate.value) {
      // Actualizar tasa existente
      const index = exchangeRates.value.findIndex(r => r.id === editingRate.value)
      if (index !== -1) {
        exchangeRates.value[index] = {
          ...exchangeRates.value[index],
          ...rateForm.value,
          updatedAt: new Date().toISOString()
        }
      }
      ElMessage.success('Tipo de cambio actualizado')
    } else {
      // Agregar nueva tasa
      exchangeRates.value.push({
        id: exchangeRates.value.length + 1,
        ...rateForm.value,
        updatedAt: new Date().toISOString()
      })
      ElMessage.success('Tipo de cambio agregado')
    }
    
    showAddDialog.value = false
    resetForm()
  } catch (error) {
    ElMessage.error('Error al guardar el tipo de cambio')
  }
}

const resetForm = () => {
  rateForm.value = {
    fromCurrency: '',
    toCurrency: '',
    rate: 0
  }
  editingRate.value = null
}
</script>

<style scoped>
.rates-view {
  max-width: 1200px;
  margin: 0 auto;
}

.card-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
}
</style>