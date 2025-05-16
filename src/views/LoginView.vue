<template>
  <div class="login-container">
    <div class="login-background">
      <div class="login-background-overlay"></div>
      <div class="login-background-pattern"></div>
    </div>

    <el-card class="login-card" shadow="hover">
      <div class="login-header">
        <div class="logo-container">
          <el-icon :size="48" color="#409EFF"><Money /></el-icon>
          <h1>Currency<span>Exchange</span></h1>
        </div>
        <p class="welcome-message">Bienvenido! Por favor ingrese su cuenta</p>
      </div>

      <el-form
        :model="form"
        :rules="rules"
        ref="loginForm"
        @submit.prevent="handleLogin"
        class="login-form"
      >
        <el-form-item prop="username">
          <el-input
            v-model="form.username"
            placeholder="Username"
            size="large"
            :prefix-icon="User"
            class="custom-input"
            tabindex="1"
          />
        </el-form-item>

        <el-form-item prop="password">
          <el-input
            v-model="form.password"
            type="password"
            placeholder="Password"
            size="large"
            :prefix-icon="Lock"
            show-password
            class="custom-input"
            tabindex="2"
            @keyup.enter="handleLogin"
          />
        </el-form-item>

        <div class="login-options">
          <el-checkbox v-model="rememberMe" label="Recordar" />
          <el-link type="primary" :underline="false"
            >Recuperar contraseña?</el-link
          >
        </div>

        <el-button
          type="primary"
          native-type="submit"
          :loading="loading"
          size="large"
          class="login-button"
          tabindex="3"
        >
          Iniciar Sesión
        </el-button>

        <p class="signup-text">
          No tienes cuenta?
          <el-link type="primary" :underline="false">Regístrate</el-link>
        </p>
      </el-form>
    </el-card>
  </div>
</template>

<script setup>
import { ref } from "vue";
import { useRouter } from "vue-router";
import { useAuthStore } from "@/stores/auth.store";
import { ElMessage } from "element-plus";
import {
  User,
  Lock,
  Money,
} from "@element-plus/icons-vue";

const router = useRouter();
const authStore = useAuthStore();

const form = ref({
  username: "",
  password: "",
});

const rememberMe = ref(false);
const loading = ref(false);
const loginForm = ref(null);

const rules = {
  username: [
    { required: true, message: "Por favor ingrese usuario", trigger: "blur" },
    {
      min: 3,
      message: "El nombre de usuario debe tener al menos 3 caracteres",
      trigger: "blur",
    },
  ],
  password: [
    {
      required: true,
      message: "Por favor ingrese contraseña",
      trigger: "blur",
    },
    {
      min: 6,
      message: "La contraseña debe tener al menos 6 caracteres",
      trigger: "blur",
    },
  ],
};

const handleLogin = async () => {
  try {
    loading.value = true;
    await loginForm.value.validate();
    await authStore.login(form.value);
    router.push("/");
  } catch (error) {
    console.log(error);
  } finally {
    loading.value = false;
  }
};
</script>

<style scoped>
.login-container {
  display: flex;
  justify-content: center;
  align-items: center;
  min-height: 100vh;
  position: relative;
  overflow: hidden;
  padding: 20px;
}

.login-background {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: linear-gradient(135deg, #409eff 0%, #36d1dc 100%);
  z-index: 0;
}

.login-background-overlay {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: rgba(0, 0, 0, 0.2);
}

.login-background-pattern {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-image: radial-gradient(
    rgba(255, 255, 255, 0.1) 1px,
    transparent 1px
  );
  background-size: 20px 20px;
}

.login-card {
  width: 100%;
  max-width: 450px;
  border-radius: 12px;
  overflow: hidden;
  z-index: 1;
  border: none;
  box-shadow: 0 10px 30px rgba(0, 0, 0, 0.1);
}

.login-header {
  text-align: center;
  margin-bottom: 30px;
}

.logo-container {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 12px;
  margin-bottom: 10px;
}

.logo-container h1 {
  font-size: 28px;
  font-weight: 700;
  color: #303133;
  margin: 0;
}

.logo-container h1 span {
  color: #409eff;
}

.welcome-message {
  color: #909399;
  margin: 0;
  font-size: 15px;
}

.login-form {
  margin-top: 20px;
}

.custom-input {
  width: 100%;
}

.custom-input :deep(.el-input__wrapper) {
  border-radius: 8px;
  padding: 0 15px;
}

.custom-input :deep(.el-input__prefix-inner) {
  margin-right: 8px;
}

.login-options {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 20px;
}

.login-button {
  width: 100%;
  border-radius: 8px;
  font-weight: 600;
  letter-spacing: 0.5px;
  height: 48px;
  margin-bottom: 20px;
}

.social-login {
  margin: 25px 0;
}

.divider {
  display: flex;
  align-items: center;
  color: #909399;
  font-size: 14px;
  margin: 15px 0;
}

.divider::before,
.divider::after {
  content: "";
  flex: 1;
  border-bottom: 1px solid #dcdfe6;
}

.divider::before {
  margin-right: 10px;
}

.divider::after {
  margin-left: 10px;
}

.social-buttons {
  display: flex;
  justify-content: center;
  gap: 15px;
}

.social-buttons .el-button {
  width: 44px;
  height: 44px;
  font-size: 18px;
  border: 1px solid #dcdfe6;
  background: #fff;
  color: #606266;
}

.signup-text {
  text-align: center;
  color: #606266;
  font-size: 14px;
  margin-top: 10px;
}

/* Responsive adjustments */
@media (max-width: 480px) {
  .login-card {
    padding: 20px 15px;
  }

  .logo-container {
    flex-direction: column;
    gap: 8px;
  }

  .logo-container h1 {
    font-size: 24px;
  }
}
</style>
