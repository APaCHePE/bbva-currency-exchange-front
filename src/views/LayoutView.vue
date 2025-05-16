<template>
  <div class="layout-container">
    <!-- Barra de navegación -->
    <el-header v-if="!$route.meta.hideNav" class="app-header">
      <div class="header-left">
        <el-icon :size="24" class="menu-collapse" @click="isCollapse = !isCollapse">
          <Expand v-if="isCollapse" />
          <Fold v-else />
        </el-icon>
        <h1>CurrencyExchange</h1>
      </div>
      <div class="header-right">
        <el-dropdown trigger="click">
          <span class="user-avatar">
            <el-avatar :size="32" :icon="UserFilled" />
            <span class="username">{{ authStore.user?.username }}</span>
            <el-icon><ArrowDown /></el-icon>
          </span>
          <template #dropdown>
            <el-dropdown-menu>
              <el-dropdown-item @click="handleLogout">
                <el-icon><SwitchButton /></el-icon>
                Cerrar Sesión
              </el-dropdown-item>
            </el-dropdown-menu>
          </template>
        </el-dropdown>
      </div>
    </el-header>

    <!-- Contenido principal -->
    <div class="main-content" :class="{ 'nav-collapsed': isCollapse }">
      <!-- Sidebar -->
      <el-aside v-if="!$route.meta.hideNav" class="app-sidebar">
        <el-menu
          :default-active="$route.path"
          :collapse="isCollapse"
          router
          class="sidebar-menu"
        >
          <el-menu-item index="/" :route="{ name: 'converter' }">
            <el-icon><Refresh /></el-icon>
            <template #title>Conversor</template>
          </el-menu-item>
          
          <el-menu-item 
            v-if="authStore.isAdmin"
            index="/rates" 
            :route="{ name: 'rates' }"
          >
            <el-icon><TrendCharts /></el-icon>
            <template #title>Tipos de Cambio</template>
          </el-menu-item>
        </el-menu>
      </el-aside>

      <!-- Contenido de la vista -->
      <el-main class="content-view">
        <router-view v-slot="{ Component }">
          <transition name="fade" mode="out-in">
            <component :is="Component" />
          </transition>
        </router-view>
      </el-main>
    </div>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue'
import { useRouter } from 'vue-router'
import { useAuthStore } from '@/stores/auth.store'
import { 
  Expand,
  Fold,
  UserFilled,
  ArrowDown,
  SwitchButton,
  Refresh,
  TrendCharts
} from '@element-plus/icons-vue'

const router = useRouter()
const authStore = useAuthStore()
const isCollapse = ref(false)

const handleLogout = async () => {
  await authStore.logout()
  router.push('/login')
}
</script>

<style scoped>
.layout-container {
  display: flex;
  flex-direction: column;
  min-height: 100vh;
}

.app-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  background-color: var(--el-color-primary);
  color: white;
  padding: 0 20px;
  height: 60px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
  z-index: 10;
}

.header-left {
  display: flex;
  align-items: center;
  gap: 15px;
}

.header-left h1 {
  margin: 0;
  font-size: 1.2rem;
  font-weight: 600;
}

.menu-collapse {
  cursor: pointer;
  transition: all 0.3s;
}

.menu-collapse:hover {
  opacity: 0.8;
}

.header-right {
  display: flex;
  align-items: center;
}

.user-avatar {
  display: flex;
  align-items: center;
  gap: 8px;
  cursor: pointer;
  color: white;
}

.username {
  font-weight: 500;
}

.main-content {
  display: flex;
  flex: 1;
  margin-left: 210px;
  transition: margin-left 0.3s;
}

.main-content.nav-collapsed {
  margin-left: 64px;
}

.app-sidebar {
  width: 210px !important;
  background-color: white;
  position: fixed;
  left: 0;
  top: 60px;
  bottom: 0;
  z-index: 9;
  transition: width 0.3s;
  box-shadow: 2px 0 4px rgba(0, 0, 0, 0.05);
}

.sidebar-menu {
  border-right: none;
  height: 100%;
}

.content-view {
  padding: 20px;
  background-color: #f5f7fa;
  min-height: calc(100vh - 60px);
}

/* Transiciones */
.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.2s ease;
}

.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}

/* Cuando el sidebar está colapsado */
.el-menu--collapse {
  width: 64px;
}

.el-menu--collapse .el-menu-item span,
.el-menu--collapse .el-submenu__title span {
  height: 0;
  width: 0;
  overflow: hidden;
  visibility: hidden;
  display: inline-block;
}

.el-menu--collapse .el-submenu__icon-arrow {
  display: none;
}
</style>