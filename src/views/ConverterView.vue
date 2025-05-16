<template>
  <div class="converter-view">
    <el-card class="converter-card">
      <!-- Cabecera -->
      <template #header>
        <div class="card-header">
          <h2>Conversor de Monedas</h2>
          <el-button
            type="primary"
            size="small"
            @click="fetchRates"
            :loading="exchangeStore.loadingRates"
          >
            Actualizar Tasas
          </el-button>
        </div>
      </template>

      <!-- Formulario de conversión -->
      <ConversionForm
        :available-currencies="exchangeStore.availableCurrencies"
        :target-currencies="targetCurrencies"
        @convert="handleConvert"
      />

      <!-- Resultado de conversión -->
      <ConversionResult
        v-if="exchangeStore.conversionResult"
        :result="exchangeStore.conversionResult"
        :from-currency="form.fromCurrency"
        :to-currency="form.toCurrency"
        :format-date="exchangeStore.formatDate"
      />

      <!-- Tabla de tasas -->
      <ExchangeRatesTable
        :rates="exchangeStore.rates"
        :loading="exchangeStore.loadingRates"
        :format-date="exchangeStore.formatDate"
      />
    </el-card>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from "vue";
import { useExchangeRateStore } from "@/stores/exchange.store";
import ConversionForm from "@/components/exchange/ConversionForm.vue";
import ConversionResult from "@/components/exchange/ConversionResult.vue";
import ExchangeRatesTable from "@/components/exchange/ExchangeRatesTable.vue";

const exchangeStore = useExchangeRateStore();
const form = ref({
  amount: 1,
  fromCurrency: "USD",
  toCurrency: "PEN",
});

// Computed
const targetCurrencies = computed(() => {
  return exchangeStore.targetCurrencies(form.value.fromCurrency) || [];
});

const initializeDefaults = () => {
  if (exchangeStore.availableCurrencies.length > 0) {
    form.value.fromCurrency = exchangeStore.availableCurrencies.includes("USD")
      ? "USD"
      : exchangeStore.availableCurrencies[0];

    form.value.toCurrency = targetCurrencies.value.includes("PEN")
      ? "PEN"
      : targetCurrencies.value[0];
  }
};
// Métodos
const fetchRates = async () => {
  await exchangeStore.fetchExchangeRates();
  initializeDefaults();
};

const handleConvert = (payload) => {
  exchangeStore.convertCurrency(payload);
};
// Inicialización
onMounted(fetchRates);
</script>
