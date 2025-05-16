<template>
  <div class="layout-container">
    <AppNavbar
      v-if="!$route.meta.hideNav"
      :username="authStore.currentUser"
      :is-collapse="isCollapse"
      @toggle-collapse="isCollapse = !isCollapse"
      @logout="handleLogout"
    />

    <!-- Contenido principal -->
    <div class="main-content" :class="{ 'nav-collapsed': isCollapse }">
      <AppSidebar
        v-if="!$route.meta.hideNav"
        :active-route="$route.path"
        :is-collapse="isCollapse"
        :is-admin="authStore.isAdmin"
      />

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
import AppNavbar from '@/components/shared/AppNavbar.vue'
import AppSidebar from '@/components/shared/AppSidebar.vue'

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

.main-content {
  display: flex;
  flex: 1;
  margin-left: 210px;
  transition: margin-left 0.3s;
}

.content-view {
  padding: 20px;
  background-color: #f5f7fa;
  min-height: calc(100vh - 60px);
}

</style>