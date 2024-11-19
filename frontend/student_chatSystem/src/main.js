import './assets/main.css'
import '@fortawesome/fontawesome-free/css/all.css'

import { createApp } from 'vue'
import { createPinia } from 'pinia'
import App from './App.vue'
import router from './router'
import ServerChat from './pages/ServerChat.vue'

// Get the student data
const appElement = document.getElementById('app')
const studentData = JSON.parse(appElement.getAttribute('data-student'))

const app = createApp(App)

// Register ServerChat as a global component
app.component('ServerChat', ServerChat)

// Provide student data to all components
app.provide('studentData', studentData)

app.use(createPinia())
app.use(router)

app.mount('#app')