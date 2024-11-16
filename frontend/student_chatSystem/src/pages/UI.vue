<template>
  <div class="fixed bottom-4 right-4 z-50 flex flex-col items-end">
    <!-- Chat Widget -->
    <div v-show="isChatOpen" 
         class="mb-4 w-[400px] h-[600px] bg-white rounded-3xl flex flex-col overflow-hidden shadow-xl">
      <!-- Header -->
      <div class="bg-[#6B46C1] px-6 py-4">
        <h1 class="text-white text-xl font-medium">Chatbot</h1>
      </div>

      <!-- Chat area -->
      <div class="flex-1 bg-[#F5F5F5] p-4 overflow-y-auto chat-body">
        <div v-for="(msg, index) in messages" 
             :key="index"
             class="mb-4">
          <!-- Bot Message -->
          <div v-if="msg.senderType === 'examiner'" 
               class="flex items-start gap-2">
            <div class="w-8 h-8 bg-[#6B46C1] rounded-xl flex items-center justify-center flex-shrink-0">
              <svg class="w-5 h-5 text-white" viewBox="0 0 24 24" fill="none">
                <path d="M12 3C6.477 3 2 6.477 2 11c0 1.92.818 3.68 2.184 5.064L2 20l4.936-1.184A8.937 8.937 0 0012 20c5.523 0 10-3.477 10-8s-4.477-8-10-8z" 
                      fill="currentColor"/>
              </svg>
            </div>
            <div class="bg-[#E5E5E5] px-4 py-3 rounded-2xl max-w-[80%]">
              <p class="text-gray-800">{{ msg.message }}</p>
            </div>
          </div>
          
          <!-- User Message -->
          <div v-else class="flex justify-end mb-4">
            <div class="bg-[#6B46C1] text-white px-4 py-3 rounded-2xl max-w-[80%]">
              <p>{{ msg.message }}</p>
            </div>
          </div>
        </div>
      </div>

      <!-- Input area -->
      <div class="p-4 bg-white border-t">
        <div class="flex items-center gap-2">
          <input 
            v-model="newMessage"
            @keyup.enter="sendMessage"
            type="text"
            placeholder="Enter a message..."
            class="flex-1 px-4 py-3 bg-[#F5F5F5] rounded-2xl outline-none placeholder-gray-500"
          />
          <button 
            @click="sendMessage"
            class="w-10 h-10 bg-[#6B46C1] rounded-xl flex items-center justify-center hover:bg-[#5535A0] transition-colors duration-200"
          >
            <svg class="w-5 h-5 text-white" viewBox="0 0 24 24" fill="none" stroke="currentColor">
              <path d="M3 12.5l7 7m0 0l7-7m-7 7V5" 
                    stroke-width="2" 
                    stroke-linecap="round" 
                    stroke-linejoin="round"
                    transform="rotate(90 12 12)"/>
            </svg>
          </button>
        </div>
      </div>
    </div>

    <!-- Toggle Button (Fixed Position) -->
    <button 
      @click="toggleChat"
      class="w-14 h-14 bg-[#6B46C1] rounded-full flex items-center justify-center shadow-lg hover:bg-[#5535A0] transition-colors duration-200"
    >
      <svg v-if="!isOpen" class="w-6 h-6 text-white" viewBox="0 0 24 24" fill="none" stroke="currentColor">
        <path d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z" 
              stroke-width="2" 
              stroke-linecap="round" 
              stroke-linejoin="round"/>
      </svg>
      <svg v-else class="w-6 h-6 text-white" viewBox="0 0 24 24" fill="none" stroke="currentColor">
        <path d="M6 18L18 6M6 6l12 12" 
              stroke-width="2" 
              stroke-linecap="round" 
              stroke-linejoin="round"/>
      </svg>
    </button>
  </div>
</template>

<script setup>
import { ref, onMounted, watch, nextTick } from "vue";
import { io } from "socket.io-client";
import axios from "axios";

// Initialise socket.io client
const socket = io("https://socket.everitas.in", {
    transports: ['websocket', 'polling'],
    reconnection: true,
    reconnectionAttempts: 5,
    withCredentials: true,
    extraHeaders: {
        "Access-Control-Allow-Origin": "*"
    }
});

const isChatOpen = ref(false);
const messages = ref([]);
const newMessage = ref("");
const studentId = "student08";
// const chatInitiated = ref(false);

function toggleChat() {
  isChatOpen.value = !isChatOpen.value;
  if (messages.value.length === 0) {
    setTimeout(() => {
      messages.value.push({
        message: "Hi, How May I Help You?😎",
        senderType: "examiner",
      });
    }, 1000);
  }
}

socket.emit("userConnected", studentId);

function sendMessage() {
  if (newMessage.value.trim()) {
    const message = {
      room_id: studentId,
      sender: "Aanchal",
      sender_id: studentId,
      recipient_id: "examiner01",
      message: newMessage.value,
      senderType: "student",
      timestamp: Date.now(),
    };
    socket.emit("message", message);
    socket.emit("userConnected", studentId);
    // messages.value.push(message);
    newMessage.value = "";
    scrollToBottom();
  }
}

function scrollToBottom() {
  nextTick(() => {
    const chatBody = document.querySelector(".chat-body");
    chatBody.scrollTop = chatBody.scrollHeight;
  });
}

// Auto-scroll when a new message arrives
watch(messages, scrollToBottom);

onMounted(() => {
  socket.emit("joinRoom", studentId);
  socket.on("message", (data) => {
    messages.value.push(data);
    scrollToBottom();
  });
});

const fetchMessages = async (roomId) => {
  const response = await axios.get(`https://socket.everitas.in/messages/${roomId}`); //roomID
  messages.value = JSON.parse(response.data[0].content);
};

fetchMessages(studentId);
</script>

<style scoped>
.v-enter-active,
.v-leave-active {
  transition: opacity 0.3s ease;
}

.v-enter-from,
.v-leave-to {
  opacity: 0;
}
</style>