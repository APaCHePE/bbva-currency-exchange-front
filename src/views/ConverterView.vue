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
        :available-currencies="fromCurrencies"
        :loading="exchangeStore.loadingConversion"
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

const fromCurrencies = computed(() => Object.keys(exchangeStore.currencyPairs));

const targetCurrencies = computed(() => {
  return exchangeStore.currencyPairs[form.value.fromCurrency] || [];
});

const initializeDefaults = () => {
  if (fromCurrencies.value.length > 0) {
    form.value.fromCurrency = fromCurrencies.value.includes("USD")
      ? "USD"
      : fromCurrencies.value[0];

    form.value.toCurrency = targetCurrencies.value[0];
  }
};
// Métodos
const fetchRates = async () => {
  await exchangeStore.fetchExchangeRates();
  initializeDefaults();
};

const handleConvert = (payload) => {
  form.value = {
    amount: payload.amount,
    fromCurrency: payload.from,
    toCurrency: payload.to
  };
  exchangeStore.convertCurrency(payload);
};
// Inicialización
onMounted(fetchRates);
</script>
