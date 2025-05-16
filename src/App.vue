<template>
  <el-config-provider :locale="locale">
    <app-loader
      v-if="uiStore.isLoading"
      :text="uiStore.loaderText"
      fullscreen
    />

    <app-alert
      v-if="uiStore.alert.show"
      :type="uiStore.alert.type"
      :title="uiStore.alert.title"
      :duration="uiStore.alert.duration"
      @close="uiStore.hideAlert"
    >
      {{ uiStore.alert.message }}
    </app-alert>

    <router-view v-slot="{ Component }">
      <template v-if="Component">
        <transition name="fade" mode="out-in">
          <suspense>
            <component :is="Component" />
            <template #fallback>
              <div class="full-page-loading">
                <el-icon :size="48" class="is-loading">
                  <Loading />
                </el-icon>
                <p>Cargando aplicación...</p>
              </div>
            </template>
          </suspense>
        </transition>
      </template>
    </router-view>
  </el-config-provider>
</template>

<script setup>
import { Loading } from "@element-plus/icons-vue";
import { ElConfigProvider } from "element-plus";
import es from "element-plus/es/locale/lang/es"; // Locale en español
import { useAuthStore } from '@/stores/auth.store'
import { useUIStore } from '@/stores/ui.store'
import { watch } from "vue";
import { useRouter } from "vue-router";
import AppLoader from '@/components/shared/AppLoader.vue'
import AppAlert from '@/components/shared/AppAlert.vue'

const locale = es;
const authStore = useAuthStore();
const uiStore = useUIStore();
const router = useRouter();

watch(
  () => authStore.isAuthenticated,
  (isAuthenticated) => {
    if (!isAuthenticated && router.currentRoute.value.meta.requiresAuth) {
      router.push("/login");
    }
  },
  { immediate: true }
);
</script>

<style>
/* Estilos globales */
:root {
  --primary-color: #409eff;
  --success-color: #67c23a;
  --warning-color: #e6a23c;
  --danger-color: #f56c6c;
  --info-color: #909399;
}

/* Reset básico */
* {
  margin: 0;
  padding: 0;
  box-sizing: border-box;
}

html,
body {
  height: 100%;
  font-family: "Helvetica Neue", Helvetica, "PingFang SC", "Hiragino Sans GB",
    "Microsoft YaHei", Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
}

#app {
  min-height: 100vh;
  background-color: #f5f7fa;
}

/* Transiciones */
.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.3s ease;
}

.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}

/* Loading full page */
.full-page-loading {
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  height: 100vh;
  gap: 16px;
  color: var(--primary-color);
}

/* Animación para notificaciones */
.notification-move {
  transition: all 0.3s ease-in-out;
}
</style>
