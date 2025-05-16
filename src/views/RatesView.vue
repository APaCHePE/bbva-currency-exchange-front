<template>
  <div class="rates-view">
    <el-card class="rates-card">
      <template #header>
        <div class="card-header">
          <h2>Tipos de Cambio</h2>
          <el-button
            type="primary"
            size="small"
            @click="openFormDialog"
            v-if="isAdmin"
          >
            Agregar Tipo
          </el-button>
        </div>
      </template>

      <rates-table
        :rates="exchangeStore.rates"
        :loading="exchangeStore.loading"
        :editable="isAdmin"
        :format-date="exchangeStore.formatDate"
        @edit="editRate"
      />
    </el-card>

    <rate-form-dialog
      ref="formDialog"
      :currencies="exchangeStore.availableCurrencies"
      :rate-to-edit="currentRate"
      @submit="handleSubmit"
    />
  </div>
</template>

<script setup>
import { ref, onMounted, computed } from "vue";
import { useExchangeRateStore } from "@/stores/exchange.store";
import { useAuthStore } from "@/stores/auth.store";
import RatesTable from "@/components/exchange/RatesTable.vue";
import RateFormDialog from "@/components/exchange/RateFormDialog.vue";

const exchangeStore = useExchangeRateStore();
const authStore = useAuthStore();
const formDialog = ref(null);
const currentRate = ref(null);

const isAdmin = computed(() => authStore.isAdmin);

const openFormDialog = () => {
  currentRate.value = null;
  formDialog.value?.show();
};

const editRate = (rate) => {
  currentRate.value = rate;
  formDialog.value?.show();
};

const handleSubmit = async (formData) => {
  try {
    console.log("submit currentRate",currentRate.value);
    
    if (currentRate.value) {
      console.log("IF");
      
      await exchangeStore.updateRate(currentRate.value.id, formData);
    } else {
      console.log("else");
      await exchangeStore.createRate(formData);
    }
  } catch (error) {
    console.log(error);
    
    // El error ya se maneja en el store
  }
};

// Cargar tasas al montar el componente
onMounted(() => {
  exchangeStore.fetchExchangeRates();
});
</script>

<style scoped>
.rates-view {
  max-width: 1200px;
  margin: 0 auto;
  padding: 20px;
}

.card-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  flex-wrap: wrap;
  gap: 10px;
}
</style>
