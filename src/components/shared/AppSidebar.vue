<template>
  <el-aside class="app-sidebar" :style="{ width: isCollapse ? '64px' : '210px' }">
    <el-menu
      :default-active="activeRoute"
      :collapse="isCollapse"
      router
      class="sidebar-menu"
    >
      <el-menu-item index="/" :route="{ name: 'converter' }">
        <el-icon><Refresh /></el-icon>
        <template #title>Conversor</template>
      </el-menu-item>
      
      <el-menu-item 
        v-if="isAdmin"
        index="/rates" 
        :route="{ name: 'rates' }"
      >
        <el-icon><TrendCharts /></el-icon>
        <template #title>Tipos de Cambio</template>
      </el-menu-item>
    </el-menu>
  </el-aside>
</template>

<script setup>
import { Refresh, TrendCharts } from '@element-plus/icons-vue'

const props = defineProps({
  activeRoute: {
    type: String,
    required: true
  },
  isCollapse: {
    type: Boolean,
    default: false
  },
  isAdmin: {
    type: Boolean,
    default: false
  }
})
</script>

<style scoped>
.app-sidebar {
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