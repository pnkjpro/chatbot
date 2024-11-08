<template>
  <div>
    <div class="chat-icon" @click="toggleChat">💬</div>
    <div v-if="isChatOpen" class="chat-window">
      <div class="chat-header">Chat with Examiner</div>
      <div class="chat-body" ref="chatBody">
        <div v-for="msg in messages" :key="msg.id" :class="msg.senderType">
          <div class="message-bubble">{{ msg.text }}</div>
        </div>
      </div>
      <input v-model="newMessage" @keyup.enter="sendMessage" placeholder="Type a message..." />
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, watch, nextTick } from 'vue';
import { io } from "socket.io-client";

const socket = io("http://localhost:3000");

const isChatOpen = ref(false);
const messages = ref([]);
const newMessage = ref('');

function toggleChat() {
  isChatOpen.value = !isChatOpen.value;
}

function sendMessage() {
  if (newMessage.value.trim()) {
    const message = { room: "student02", 
                      sender: "Akash", 
                      sender_id: "student02", 
                      recipient: "examiner01", 
                      text: newMessage.value, 
                      senderType: "student" };
    socket.emit('message', message);
    // messages.value.push(message);
    newMessage.value = '';
    scrollToBottom();
  }
}

function scrollToBottom() {
  nextTick(() => {
    const chatBody = document.querySelector('.chat-body');
    chatBody.scrollTop = chatBody.scrollHeight;
  });
}

// Auto-scroll when a new message arrives
watch(messages, scrollToBottom);

onMounted(() => {
  socket.emit('joinRoom', 'student02');
  messages.value.push({ text: 'Hi, How May I Help You?😎', senderType: 'examiner'});
  socket.on('message', (data) => {
    messages.value.push(data);
  });
});
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
