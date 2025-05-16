<template>
  <el-config-provider :locale="locale">
    <router-view v-slot="{ Component }">
      <template v-if="Component">
        <transition name="fade" mode="out-in">
          <suspense>
            <!-- Contenido principal -->
            <component :is="Component" />

            <!-- Loading state -->
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

    <!-- Notificaciones globales -->
    <el-notification-group move-class="notification-move">
      <!-- Las notificaciones se añadirán aquí -->
    </el-notification-group>
  </el-config-provider>
</template>

<script setup>
import { Loading } from '@element-plus/icons-vue'
import { ElConfigProvider } from 'element-plus'
import es from 'element-plus/es/locale/lang/es' // Locale en español
import { useAuthStore } from '@/stores/auth.store'
import { watch } from 'vue'
import { useRouter } from 'vue-router'

const locale = es
const authStore = useAuthStore()
const router = useRouter()

// Verificar autenticación al cargar la aplicación
watch(() => authStore.isAuthenticated, (isAuthenticated) => {
  if (!isAuthenticated && router.currentRoute.value.meta.requiresAuth) {
    router.push('/login')
  }
}, { immediate: true })
</script>

<style>
/* Estilos globales */
:root {
  --primary-color: #409EFF;
  --success-color: #67C23A;
  --warning-color: #E6A23C;
  --danger-color: #F56C6C;
  --info-color: #909399;
}

/* Reset básico */
* {
  margin: 0;
  padding: 0;
  box-sizing: border-box;
}

html, body {
  height: 100%;
  font-family: 'Helvetica Neue', Helvetica, 'PingFang SC', 'Hiragino Sans GB',
    'Microsoft YaHei', Arial, sans-serif;
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