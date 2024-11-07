<template>
    <div class="chat-window">
    <div class="conversation">
      <div v-for="msg in messages" :key="msg.id" :class="msg.sender" class="messages">
        <div v-if="msg.sender === 'examiner'" class="message reply">
          <div class="avatar">U18</div>
          <div class="text">{{ msg.text }}</div>
        </div>
        <div v-else class="message">
          <div class="avatar">PP</div>
          <div class="text">{{ msg.text }}</div>
        </div>
      </div>
    </div>
      <div class="input-area">
        <input v-model="newMessage" @keyup.enter="sendMessage" placeholder="Type a message..." />
        <button @click="sendMessage">Send</button>
      </div>
    </div>
  </template>

<script setup>
import { watch, ref, onMounted, nextTick } from 'vue';
import { io } from "socket.io-client";
import { defineProps } from 'vue';

const props = defineProps({
  selectedStudentId: String,
});

const socket = io("http://localhost:3000");

const messages = ref([]);
const newMessage = ref('');

function leaveRoom(roomId) {
  if (roomId) {
    socket.emit('leaveRoom', roomId);
    console.log("Left Room", roomId);
  }
}

// Load messages when selectedStudentId changes
watch(() => props.selectedStudentId, (newId, oldId) => {
  messages.value = []; // Clear messages when switching students
  if (oldId) {
    console.log("Old Student Id", oldId);
    // Leave the previous room before joining the new one
    leaveRoom(oldId);
  }
  if (newId) {
    // Join the room for the selected student
    socket.emit('joinRoom', newId);
    console.log("Joined Room",newId);
  }
});

function sendMessage() {
  if (newMessage.value.trim()) {
    const message = { room: props.selectedStudentId, text: newMessage.value, sender: 'examiner' };
    socket.emit('message', message);
    // messages.value.push(message);
    newMessage.value = '';
    scrollToBottom();
  }
}

async function scrollToBottom() {
  await nextTick();
  const messagesContainer = document.querySelector('.conversation');
  messagesContainer.scrollTop = messagesContainer.scrollHeight;
}

// Auto-scroll when a new message arrives
watch(messages, scrollToBottom);

onMounted(() => {
  socket.emit('joinRoom', props.selectedStudentId);
  socket.on('message', (data) => {
    messages.value.push(data);
    scrollToBottom();
  });
});
</script>
  
  <style scoped>
  .chat-window {
    flex-grow: 1;
    display: flex;
    flex-direction: column;
    padding: 10px;
    background-color: #dae5e7;
    box-shadow: 5px 5px 4px rgba(0, 0, 0, 0.3);
    border-radius: 8px;
  }

  .conversation{
    flex-grow: 1;
    display: flex;
    flex-direction: column;
    padding: 10px;
    /* max-height: 300px; */
    overflow-y: auto;
  }
  
  .messages {
    flex-grow: 1;
    display: flex;
    flex-direction: column;
    padding: 10px;
    max-height: 300px;
  }
  
  .message {
    display: flex;
    align-items: center;
    margin: 10px 0;
  }
  
  .message.reply {
    flex-direction: row-reverse;
  }
  
  .avatar {
    background-color: #d4e95e;
    color: 0F3F05;
    width: 30px;
    height: 30px;
    border-radius: 50%;
    display: flex;
    align-items: center;
    justify-content: center;
    font-weight: bold;
    margin: 0 10px;
  }
  
  .text {
    background-color: #f1f1f1;
    padding: 10px;
    border-radius: 8px;
    max-width: 60%;
  }
  
  .input-area {
    display: flex;
    align-items: center;
    padding: 10px;
  }
  
  input {
    flex-grow: 1;
    padding: 10px;
    border: none;
    border-radius: 5px;
    margin-right: 10px;
    font-size: 1em;
  }
  
  button {
    background-color: #1c70f0;
    color: white;
    padding: 10px 20px;
    border: none;
    border-radius: 5px;
    font-weight: bold;
    cursor: pointer;
  }
  </style>
  