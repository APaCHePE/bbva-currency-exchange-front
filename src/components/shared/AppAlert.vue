<template>
  <transition name="alert-slide">
    <div v-show="visible" class="app-alert" :class="`el-alert--${type}`">
      <div class="app-alert__content">
        <el-icon v-if="showIcon" class="app-alert__icon">
          <component :is="iconComponent" />
        </el-icon>
        <div>
          <div v-if="title" class="app-alert__title">{{ title }}</div>
          <div class="app-alert__message"><slot /></div>
        </div>
      </div>
      <el-icon v-if="closable" class="app-alert__close" @click="close">
        <Close />
      </el-icon>
    </div>
  </transition>
</template>

<script setup>
import { ref, computed } from "vue";
import {
  Close,
  CircleCheckFilled,
  CircleCloseFilled,
  WarningFilled,
  InfoFilled,
} from "@element-plus/icons-vue";

const props = defineProps({
  type: {
    type: String,
    default: "info",
    validator: (value) =>
      ["success", "warning", "error", "info"].includes(value),
  },
  title: String,
  closable: {
    type: Boolean,
    default: true,
  },
  showIcon: {
    type: Boolean,
    default: true,
  },
  duration: {
    type: Number,
    default: 4500,
  },
});

const emit = defineEmits(["close"]);

const visible = ref(true);

const iconComponent = computed(
  () =>
    ({
      success: CircleCheckFilled,
      warning: WarningFilled,
      error: CircleCloseFilled,
      info: InfoFilled,
    }[props.type])
);

const close = () => {
  visible.value = false;
  emit("close");
};

if (props.duration > 0) {
  setTimeout(close, props.duration);
}
</script>

<style scoped>
.app-alert {
  position: fixed;
  top: 20px;
  right: 20px;
  display: flex;
  align-items: center;
  padding: 14px 20px;
  min-width: 300px;
  max-width: 400px;
  border-radius: 8px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
  z-index: 2000;
  background: var(--el-bg-color);
  border: 1px solid;
  transition: all 0.3s ease;
}

.app-alert__content {
  display: flex;
  align-items: center;
  flex-grow: 1;
}

.app-alert__icon {
  font-size: 18px;
  margin-right: 12px;
}

.app-alert--success {
  border-color: var(--el-color-success-light-3);
  background-color: var(--el-color-success-light-9);
  color: var(--el-color-success-dark-2);
}

.app-alert--error {
  border-color: var(--el-color-error-light-3);
  background-color: var(--el-color-error-light-9);
  color: var(--el-color-error-dark-2);
}

.app-alert--warning {
  border-color: var(--el-color-warning-light-3);
  background-color: var(--el-color-warning-light-9);
  color: var(--el-color-warning-dark-2);
}

.app-alert--info {
  border-color: var(--el-color-info-light-3);
  background-color: var(--el-color-info-light-9);
  color: var(--el-color-info-dark-2);
}

.app-alert__title {
  font-weight: 500;
  margin-bottom: 4px;
}

.app-alert__message {
  font-size: 0.9em;
  opacity: 0.9;
}

.app-alert__close {
  margin-left: 16px;
  cursor: pointer;
  opacity: 0.7;
  transition: opacity 0.2s;
}

.app-alert__close:hover {
  opacity: 1;
}

.alert-slide-enter-from,
.alert-slide-leave-to {
  opacity: 0;
  transform: translateX(100%);
}

.alert-slide-enter-to,
.alert-slide-leave-from {
  opacity: 1;
  transform: translateX(0);
}

.alert-slide-enter-active {
  transition: all 0.3s ease-out;
}

.alert-slide-leave-active {
  transition: all 0.2s ease-in;
}
</style>
