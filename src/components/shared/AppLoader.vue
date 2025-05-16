<template>
  <div class="app-loader" :class="{ 'fullscreen': fullscreen }">
    <div class="loader-content">
      <el-icon class="is-loading" :size="size">
        <Loading />
      </el-icon>
      <p v-if="text" class="loader-text">{{ text }}</p>
    </div>
  </div>
</template>

<script setup>
import { Loading } from '@element-plus/icons-vue'

const props = defineProps({
  size: {
    type: Number,
    default: 48
  },
  text: {
    type: String,
    default: ''
  },
  fullscreen: {
    type: Boolean,
    default: false
  }
})
</script>

<style scoped>
.app-loader {
  display: flex;
  justify-content: center;
  align-items: center;
  padding: 20px;
}

.app-loader.fullscreen {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-color: rgba(255, 255, 255, 0.8);
  z-index: 9999;
}

.loader-content {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 12px;
}

.loader-text {
  color: var(--el-color-primary);
  font-size: 1rem;
  margin: 0;
}

.el-icon.is-loading {
  animation: rotating 2s linear infinite;
}

@keyframes rotating {
  from {
    transform: rotate(0deg);
  }
  to {
    transform: rotate(360deg);
  }
}
</style>