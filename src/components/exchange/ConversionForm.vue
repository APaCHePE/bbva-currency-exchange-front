<template>
  <el-form ref="formRef">
    <el-row :gutter="20">
      <el-col :span="24" :md="8">
        <el-form-item label="Monto">
          <el-input-number
            v-model="localAmount"
            :min="0"
            :precision="2"
            :controls="false"
            size="large"
            class="full-width"
          />
        </el-form-item>
      </el-col>

      <el-col :span="24" :md="8">
        <el-form-item label="De">
          <el-select
            v-model="localFromCurrency"
            placeholder="Seleccione moneda"
            size="large"
            class="full-width"
            @change="updateTargetCurrencies"
          >
            <el-option
              v-for="currency in availableCurrencies"
              :key="'from-' + currency"
              :label="currency"
              :value="currency"
            />
          </el-select>
        </el-form-item>
      </el-col>

      <el-col :span="24" :md="8">
        <el-form-item label="A">
          <el-select
            v-model="localToCurrency"
            placeholder="Seleccione moneda"
            size="large"
            class="full-width"
          >
            <el-option
              v-for="currency in localTargetCurrencies"
              :key="'to-' + currency"
              :label="currency"
              :value="currency"
            />
          </el-select>
        </el-form-item>
      </el-col>
    </el-row>

    <el-button
      type="primary"
      size="large"
      @click="handleConvert"
      :loading="loading"
      class="convert-button"
    >
      Convertir
    </el-button>
  </el-form>
</template>

<script setup>
import { ref, watch, computed } from "vue";
import { useExchangeRateStore } from "@/stores/exchange.store";
import { useUIStore } from "@/stores/ui.store";

const props = defineProps({
  availableCurrencies: {
    type: Array,
    default: () => [],
  },
  targetCurrencies: {
    type: Array,
    default: () => [],
  },
  loading: {
    type: Boolean,
    default: false,
  },
  initialValues: {
    type: Object,
    default: () => ({
      amount: 1,
      fromCurrency: "USD",
      toCurrency: "PEN",
    }),
  },
});

const emit = defineEmits(["convert"]);

const uiStore = useUIStore();
const exchangeStore = useExchangeRateStore();
const localAmount = ref(props.initialValues.amount);
const localFromCurrency = ref(props.initialValues.fromCurrency);
const localToCurrency = ref(props.initialValues.toCurrency);

// Actualizar monedas destino cuando cambia la moneda origen
const updateTargetCurrencies = () => {
  if (
    props.targetCurrencies.length > 0 &&
    !props.targetCurrencies.includes(localToCurrency.value)
  ) {
    localToCurrency.value = props.targetCurrencies[0];
  }
};
const localTargetCurrencies = computed(() => {
  return exchangeStore.targetCurrencies(localFromCurrency.value);
});
// Validar y emitir el evento de conversión
const handleConvert = () => {
  if (!validateForm()) return;

  emit("convert", {
    amount: localAmount.value,
    from: localFromCurrency.value,
    to: localToCurrency.value,
  });
};

const validateForm = () => {
  console.log("localAmount", localAmount.value);
  console.log("localToCurrency", localToCurrency.value);
  console.log("localFromCurrency", localFromCurrency.value);

  if (localAmount.value <= 0) {
    uiStore.showAlert({
      type: "error",
      title: "Validación",
      message: "Por favor ingrese un monto válido",
    });
    return false;
  }

  if (!localToCurrency.value) {
    uiStore.showAlert({
      type: "error",
      title: "Validación",
      message: "Por favor seleccione una moneda de destino",
    });
    return false;
  }

  if (localFromCurrency.value === localToCurrency.value) {
    uiStore.showAlert({
      type: "error",
      title: "Validación",
      message: "Las monedas deben ser diferentes",
    });
    return false;
  }

  return true;
};
const validateCurrencies = () => {
  if (!props.availableCurrencies.includes(localFromCurrency.value)) {
    localFromCurrency.value = props.availableCurrencies[0] || "";
  }

  if (!props.targetCurrencies.includes(localToCurrency.value)) {
    localToCurrency.value = props.targetCurrencies[0] || "";
  }
};

// Ejecutar validación al recibir nuevas props
watch(
  () => props.availableCurrencies,
  () => validateCurrencies()
);
watch(
  () => props.targetCurrencies,
  () => validateCurrencies()
);
watch(localFromCurrency, (newFromCurrency) => {
  const targets = exchangeStore.targetCurrencies(newFromCurrency);
  localToCurrency.value = targets.length > 0 ? targets[0] : "";
});

// Sincronizar con cambios en las props iniciales
watch(
  () => props.targetCurrencies,
  (newCurrencies) => {
    if (
      newCurrencies.length > 0 &&
      !newCurrencies.includes(localToCurrency.value)
    ) {
      localToCurrency.value = newCurrencies[0];
    }
  }
);
watch(localFromCurrency, () => {
  if (
    props.targetCurrencies.length > 0 &&
    !props.targetCurrencies.includes(localToCurrency.value)
  ) {
    localToCurrency.value = props.targetCurrencies[0];
  }
});
</script>

<style scoped>
.full-width {
  width: 100%;
}

.convert-button {
  width: 100%;
  margin-top: 20px;
}

@media (max-width: 768px) {
  .el-col {
    margin-bottom: 15px;
  }
}
</style>
