<template>
  <div>
    <div class="chat-icon" @click="toggleChat">💬</div>
    <div v-if="isChatOpen" class="chat-window">
      <div class="chat-header">Chat with Examiner</div>
      <div class="chat-body" ref="chatBody">
        <div v-for="msg in messages" :key="msg.id" :class="msg.senderType">
          <div class="message-bubble">{{ msg.message }}</div>
        </div>
      </div>
      <input
        v-model="newMessage"
        @keyup.enter="sendMessage"
        placeholder="Type a message..."
      />
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, watch, nextTick } from "vue";
import { io } from "socket.io-client";
import axios from "axios";

const socket = io("https://socket.everitas.in", {
  withCredentials: true,
  transports: ['websocket', 'polling'],
  reconnection: true,
  reconnectionAttempts: 5,
  reconnectionDelay: 1000
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
  });
});

const fetchMessages = async (roomId) => {
  const response = await axios.get(`https://socket.everitas.in/messages/${roomId}`); //roomID
  messages.value = JSON.parse(response.data[0].content);
};

fetchMessages(studentId);
</script>

<style scoped>
.chat-icon {
  position: fixed;
  bottom: 20px;
  right: 20px;
  background-color: #007bff;
  color: white;
  border-radius: 50%;
  padding: 15px;
  cursor: pointer;
}

.chat-window {
  position: fixed;
  bottom: 70px;
  right: 20px;
  width: 300px;
  max-height: 400px;
  background: #f1f1f1;
  border-radius: 10px;
  display: flex;
  flex-direction: column;
}

.chat-header {
  background-color: #007bff;
  color: #ffffff;
  padding: 10px;
  text-align: center;
  border-top-left-radius: 10px;
  border-top-right-radius: 10px;
}

.chat-body {
  flex: 1;
  overflow-y: auto;
  padding: 10px;
}

.student .message-bubble {
  text-align: right;
  background-color: #e1e1e1;
  color: black;
  padding: 8px;
  border-radius: 8px;
  margin: 5px 0;
  align-self: flex-end;
}

.examiner .message-bubble {
  text-align: left;
  background-color: #007bff;
  color: white;
  padding: 8px;
  border-radius: 8px;
  margin: 5px 0;
  align-self: flex-start;
}

input {
  padding: 10px;
  border: none;
  border-top: 1px solid #ccc;
  border-radius: 0 0 10px 10px;
  outline: none;
}
</style>
