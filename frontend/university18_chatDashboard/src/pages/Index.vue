<template>
  <div class="chat-window">
    <div class="chat-body">
      <div v-for="msg in messages" :key="msg.id" :class="msg.sender">{{ msg.text }}</div>
    </div>
    <input v-model="newMessage" @keyup.enter="sendMessage" placeholder="Type a message..." />
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue';
import { io } from "socket.io-client";

const socket = io("http://localhost:3000");

const messages = ref([]);
const newMessage = ref('');

function sendMessage() {
  if (newMessage.value.trim()) {
    const message = { room: "student", text: newMessage.value, sender: 'examiner' };
    socket.emit('message', message);
    messages.value.push(message);
    newMessage.value = '';
  }
}

onMounted(() => {
  socket.emit('joinRoom', 'examiner');
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
  color: rgb(253, 251, 251);
  padding: 10px;
  text-align: center;
  border-top-left-radius: 10px;
  border-top-right-radius: 10px;
}

.chat-body {
  flex: 1;
  overflow-y: auto;
  padding: 10px;
  color:rgb(29, 4, 4)
}

.student {
  text-align: right;
  color: blue;
}

.examiner {
  text-align: left;
  color: green;
}
</style>

  