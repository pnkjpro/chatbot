import './assets/main.css'
import '@fortawesome/fontawesome-free/css/all.css'

import { createApp } from 'vue'
import App from './App.vue'

// Get the student data
const appElement = document.getElementById('chatbot')
const studentData = JSON.parse(appElement.getAttribute('data-student'))

const app = createApp(App)

// Provide student data to all components
app.provide('studentData', studentData)

app.mount('#chatbot')