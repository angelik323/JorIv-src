// FILE: main.js

import { createApp, markRaw } from 'vue'
import { createPinia } from 'pinia'
import { Quasar, Notify } from 'quasar'

import piniaPluginPersistedstate from 'pinia-plugin-persistedstate'

// Import lang Spanish from quasar/lang
import langEs from 'quasar/lang/es'

// Import icon libraries
// import iconSet from 'quasar/icon-set/fontawesome-v6'
import iconSet from 'quasar/icon-set/mdi-v7'

import '@quasar/extras/mdi-v7/mdi-v7.css'
// import '@quasar/extras/fontawesome-v6/fontawesome-v6.css'

// Import Quasar css
import 'quasar/src/css/index.sass'
import './styles/index.scss'

//Global styles
import '@/styles/global.scss'

// Import your custom plugins
import globalLogger from './plugins/globalLogger'

// Assumes your root component is App.vue
// and placed in same folder as main.js
import App from './App.vue'
import router from './router/index'

// directives
import percentageDirective from '@/directives/percentage'

const pinia = createPinia()
pinia.use(({ store }) => {
  store.router = markRaw(router)
})
const myApp = createApp(App)

myApp.directive('percentage', percentageDirective)

myApp.use(Quasar, {
  plugins: {
    Notify,
  },
  iconSet,
  lang: langEs, // Configurar el idioma a español
})

myApp.use(pinia)
myApp.use(router)
pinia.use(piniaPluginPersistedstate)
myApp.use(globalLogger)

// Assumes you have a <div id="app"></div> in your index.html
myApp.mount('#app')
