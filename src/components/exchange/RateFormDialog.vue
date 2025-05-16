<template>
  <el-dialog 
    v-model="visible" 
    :title="isEditing ? 'Editar Tipo de Cambio' : 'Agregar Tipo de Cambio'"
    width="500px"
    @closed="resetForm"
  >
    <el-form :model="form" ref="formRef" :rules="rules">
      <el-form-item label="Moneda Origen" prop="fromCurrency">
        <el-select 
          v-model="form.fromCurrency" 
          placeholder="Seleccione moneda"
          class="full-width"
        >
          <el-option
            v-for="currency in filteredToCurrencies"
            :key="'from-'+currency"
            :label="currency"
            :value="currency"
          />
        </el-select>
      </el-form-item>
      
      <el-form-item label="Moneda Destino" prop="toCurrency">
        <el-select 
          v-model="form.toCurrency" 
          placeholder="Seleccione moneda"
          class="full-width"
        >
          <el-option
            v-for="currency in filteredToCurrencies"
            :key="'to-'+currency"
            :label="currency"
            :value="currency"
          />
        </el-select>
      </el-form-item>
      
      <el-form-item label="Tipo de Cambio" prop="rate">
        <el-input-number 
          v-model="form.rate" 
          :min="0.000001" 
          :precision="6" 
          :controls="false"
          class="full-width"
        />
      </el-form-item>
    </el-form>
    
    <template #footer>
      <el-button @click="visible = false">Cancelar</el-button>
      <el-button type="primary" @click="submitForm">Guardar</el-button>
    </template>
  </el-dialog>
</template>

<script setup>
import { ref, computed, watch } from 'vue'
import { ElMessage } from 'element-plus'

const props = defineProps({
  currencies: {
    type: Array,
    required: true 
  },
  rateToEdit: {
    type: Object,
    default: null
  }
})

const emit = defineEmits(['submit'])

const visible = ref(false)
const formRef = ref(null)

const form = ref({
  fromCurrency: '',
  toCurrency: '',
  rate: 0
})

const rules = {
  fromCurrency: [{ required: true, message: 'Seleccione moneda origen', trigger: 'blur' }],
  toCurrency: [{ required: true, message: 'Seleccione moneda destino', trigger: 'blur' }],
  rate: [{ required: true, message: 'Ingrese tasa de cambio', trigger: 'blur' }]
}

const isEditing = computed(() => !!props.rateToEdit)

const show = () => {
  if (props.rateToEdit) {
    form.value = { ...props.rateToEdit }
  }
  visible.value = true
}

const resetForm = () => {
  formRef.value?.resetFields()
  form.value = {
    fromCurrency: '',
    toCurrency: '',
    rate: 0
  }
}

const submitForm = async () => {
  try {
    await formRef.value.validate()
    
    if (form.value.fromCurrency === form.value.toCurrency) {
      throw new Error('Las monedas deben ser diferentes')
    }
    
    emit('submit', { ...form.value })
    visible.value = false
  } catch (error) {
    ElMessage.error(error.message)
  }
}

const filteredToCurrencies = computed(() => 
  props.currencies.filter(c => c !== form.value.fromCurrency)
)
watch(
  () => props.rateToEdit,
  (newRate) => {
    if (newRate) {
      form.value = { ...newRate }
    } else {
      resetForm()
    }
  },
  { immediate: true } // Para que también lo cargue la primera vez
)
defineExpose({ show })
</script>

<style scoped>
.full-width {
  width: 100%;
}
</style>