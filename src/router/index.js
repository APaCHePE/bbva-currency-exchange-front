import {
  createRouter,
  createWebHistory
} from 'vue-router'
import LayoutView from '@/views/LayoutView.vue'
import LoginView from '@/views/LoginView.vue'
import {
  useAuthStore
} from '@/stores/auth.store'

const router = createRouter({
  history: createWebHistory(
    process.env.VUE_APP_BASE_URL),
  routes: [{
      path: '/login',
      name: 'login',
      component: LoginView,
      meta: {
        title: 'Inicio de Sesión',
        requiresAuth: false,
        hideNav: true
      }
    },
    {
      path: '/',
      component: LayoutView,
      meta: {
        requiresAuth: true
      },
      children: [{
          path: '',
          name: 'converter',
          component: () => import('@/views/ConverterView.vue'),
          meta: {
            title: 'Conversor de Monedas',
            icon: 'Refresh'
          }
        },
        {
          path: 'rates',
          name: 'rates',
          component: () => import('@/views/RatesView.vue'),
          meta: {
            title: 'Tipos de Cambio',
            requiresAdmin: true,
            icon: 'TrendCharts'
          }
        }
      ]
    }, {
      path: '/:pathMatch(.*)*',
      redirect: '/login'
    }
  ]
})

// Guard de autenticación
router.beforeEach(async (to, from, next) => {
  const authStore = useAuthStore();

  document.title = to.meta.title ? `${to.meta.title} | CurrencyExchange` : 'CurrencyExchange';

  // Redirigir a / si ya está autenticado y trata de acceder a login
  if (to.path === '/login' && authStore.isAuthenticated) {
    return next('/')
  }

  // Verificar si la ruta requiere autenticación
  if (to.meta.requiresAuth && !authStore.isAuthenticated) {
    return next('/login')
  }

  // Verificar si la ruta requiere rol admin
  if (to.meta.requiresAdmin && !authStore.isAdmin) {
    return next('/')
  }

  next();
})

export default router;