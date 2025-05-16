import {
  createApp
}
from 'vue'
import {
  createPinia
} from 'pinia'
import App from './App.vue'

// Element Plus
import ElementPlus from 'element-plus'
import 'element-plus/dist/index.css'
import locale from 'element-plus/es/locale/lang/es'

import router from './router'

const app = createApp(App);

app.use(createPinia())
app.use(router)
app.use(ElementPlus, {
  locale
})

app.mount('#app');