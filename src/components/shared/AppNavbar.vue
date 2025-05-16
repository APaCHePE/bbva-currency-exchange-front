<template>
  <el-header class="app-header">
    <div class="header-left">
      <el-icon :size="24" class="menu-collapse" @click="toggleCollapse">
        <component :is="isCollapse ? Expand : Fold" />
      </el-icon>
      <h1>CurrencyExchange</h1>
    </div>
    <div class="header-right">
      <el-dropdown trigger="click">
        <span class="user-avatar">
          <el-avatar :size="32" :icon="UserFilled" />
          <span class="username">{{ username }}</span>
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
</template>

<script setup>
import { Expand, Fold, UserFilled, ArrowDown, SwitchButton } from '@element-plus/icons-vue'

const props = defineProps({
  username: {
    type: String,
    default: ''
  },
  isCollapse: {
    type: Boolean,
    default: false
  }
})

const emit = defineEmits(['toggle-collapse', 'logout'])

const toggleCollapse = () => {
  emit('toggle-collapse')
}

const handleLogout = () => {
  emit('logout')
}
</script>

<style scoped>
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
</style>