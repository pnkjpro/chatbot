<template>
    <div class="min-h-screen bg-gray-900 text-gray-100">
      <!-- Header -->
      <header class="p-4 border-b border-gray-800">
        <div class="flex items-center justify-between">
          <!-- Left section -->
          <div class="flex items-center space-x-4">
            <!-- Search -->
            <div class="relative">
              <input 
                type="text" 
                placeholder="Search" 
                class="bg-gray-800 rounded-md pl-10 pr-4 py-2 text-sm focus:outline-none focus:ring-1 focus:ring-gray-700"
              >
              <span class="absolute left-3 top-2.5 text-gray-400">
                <i class="fas fa-search"></i>
              </span>
            </div>
            
            <!-- Sort -->
            <div class="flex items-center space-x-2">
              <span class="text-sm">Sort by: Date</span>
              <i class="fas fa-chevron-down text-xs"></i>
            </div>
          </div>
  
          <!-- Right section -->
          <div class="flex items-center space-x-4">
            <div class="flex items-center space-x-2">
              <div class="w-8 h-8 rounded-full bg-gray-700 flex items-center justify-center">
                <span class="text-sm">{{ userInitials }}</span>
              </div>
              <span>{{ currentUser.name }}</span>
              <div class="w-2 h-2 rounded-full bg-green-500"></div>
            </div>
            <div class="flex items-center space-x-3 text-gray-400">
              <i class="fas fa-cog"></i>
              <i class="fas fa-bell"></i>
              <i class="fas fa-ellipsis-v"></i>
            </div>
          </div>
        </div>
      </header>
  
      <!-- Chat Area -->
      <div class="flex-1 overflow-y-auto">
        <div class="p-4 space-y-6">
          <div v-for="message in messages" :key="message.id" class="flex items-start space-x-4">
            <!-- Avatar -->
            <div class="relative">
              <div class="w-10 h-10 rounded-full bg-gray-700 flex items-center justify-center">
                <span class="text-sm">{{ getInitials(message.user) }}</span>
              </div>
              <div v-if="message.online" class="absolute bottom-0 right-0 w-2.5 h-2.5 rounded-full bg-green-500 border-2 border-gray-900"></div>
            </div>
  
            <!-- Message Content -->
            <div class="flex-1">
              <div class="flex items-baseline space-x-2">
                <span class="font-medium">{{ message.user }}</span>
                <span class="text-gray-400 text-sm">{{ message.time }}</span>
              </div>
              <p class="mt-1 text-gray-300">{{ message.message }}</p>
            </div>
  
            <!-- Attachments if any -->
            <div v-if="message.attachments" class="flex items-center space-x-2">
              <div v-for="attachment in message.attachments" :key="attachment.id" 
                   class="bg-gray-800 rounded p-2 flex items-center space-x-2">
                <i class="fas fa-file"></i>
                <div>
                  <p class="text-sm">{{ attachment.name }}</p>
                  <p class="text-xs text-gray-400">{{ attachment.size }}</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
  
      <!-- Input Area -->
      <div class="border-t border-gray-800 p-4">
        <div class="flex items-center space-x-4">
          <input 
            type="text" 
            placeholder="Your Message..." 
            class="flex-1 bg-gray-800 rounded-md px-4 py-2 focus:outline-none focus:ring-1 focus:ring-gray-700"
            v-model="newMessage"
          >
          <div class="flex items-center space-x-3 text-gray-400">
            <i class="fas fa-paperclip cursor-pointer"></i>
            <i class="fas fa-microphone cursor-pointer"></i>
            <button 
              class="bg-blue-600 text-white rounded-md px-4 py-2 hover:bg-blue-700 focus:outline-none"
              @click="sendMessage"
            >
              <i class="fas fa-paper-plane"></i>
            </button>
          </div>
        </div>
      </div>
    </div>
  </template>
  
  <script>
  export default {
    name: 'ChatDashboard',
    data() {
      return {
        currentUser: {
          name: 'Joan Bates',
          online: true
        },
        newMessage: '',
        messages: [
          {
            id: 1,
            user: 'Elaine Day',
            message: 'The arts play a large role in the experience of inner thoughts and beauty in my life, the arts...',
            time: '20 min',
            online: true
          },
          {
            id: 2,
            user: 'Joan Bates',
            message: 'Hello there,\nI am writing to introduce you to your david boyd',
            time: '20 min',
            online: true
          },
          {
            id: 3,
            user: 'David Palmer',
            message: 'We use the Arts as a means of touching that part of us that we cannot reach with',
            time: '20 min',
            online: true,
            attachments: [
              {
                id: 1,
                name: 'Documentation.pdf',
                size: '5.01 kb'
              }
            ]
          }
        ]
      }
    },
    computed: {
      userInitials() {
        return this.getInitials(this.currentUser.name)
      }
    },
    methods: {
      getInitials(name) {
        return name.split(' ').map(n => n[0]).join('')
      },
      sendMessage() {
        if (!this.newMessage.trim()) return
        
        this.messages.push({
          id: this.messages.length + 1,
          user: this.currentUser.name,
          message: this.newMessage,
          time: 'Just now',
          online: true
        })
        
        this.newMessage = ''
      }
    }
  }
  </script>
  
  <style scoped>
  /* Add any additional custom styles here */
  .min-h-screen {
    min-height: 100vh;
  }
  </style>