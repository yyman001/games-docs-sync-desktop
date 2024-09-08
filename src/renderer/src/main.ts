import './assets/main.css'
import './assets/tailwind.css'
import './assets/index.css'
import 'ant-design-vue/dist/reset.css'
import Antd from 'ant-design-vue'

import router from './router/index'
import { createPinia } from 'pinia'
import { createApp } from 'vue'
import App from './App.vue'
import './ipcRenderer'

createApp(App).use(createPinia()).use(router).use(Antd).mount('#app')
