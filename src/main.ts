/**
 * Application entry point
 *
 * Creates the Vue 3 app instance, registers the router plugin,
 * and mounts everything to the #app element in index.html.
 */

import { createApp } from 'vue'
import App from './App.vue'
import router from './router'  // pulls in ./router/index.ts automatically

// Create the app, wire up the router, and mount
const app = createApp(App)
app.use(router)  // install vue-router so <router-view> and navigation guards work
app.mount('#app')
