<template>
  <div class="chat-window">
    <div class="flex items-center space-x-4 ml-auto">
      <div class="flex items-center space-x-2">
        <div
          class="w-8 h-8 rounded-full bg-blue-500 flex items-center justify-center"
        >
          <span class="text-sm">PP</span>
        </div>
        <span>Pankaj Pandey</span>
        <div class="w-2 h-2 rounded-full bg-green-500"></div>
      </div>
      <div class="flex items-center space-x-3 text-gray-400">
        <i class="fas fa-ellipsis-v"></i>
      </div>
    </div>

    <div class="border-b border-gray-300 p-4"></div>

    <div class="conversation">
      <div
        v-for="msg in messages"
        :key="msg.id"
        :class="msg.sender"
        class="messages"
      >
        <div v-if="msg.senderType === 'examiner'" class="message reply">
          <div class="avatar">U18</div>
          <div class="text">{{ msg.text }}</div>
        </div>
        <div v-else class="message">
          <div class="avatar">PP</div>
          <div class="text">{{ msg.text }}</div>
          <span class="text-gray-400 text-sm">20 min</span>
        </div>
      </div>
    </div>



    <div class="border-t border-gray-300 p-4">
      <div class="flex items-center space-x-3 text-gray-400">
        <i class="fas fa-paperclip cursor-pointer"></i>
        <input
          v-model="newMessage"
          @keyup.enter="sendMessage"
          placeholder="Type a message..."
        />
        <button @click="sendMessage">Send</button>
      </div>
    </div>
  </div>
</template>

<script setup>
import { watch, ref, onMounted, nextTick } from "vue";
import axios from "axios";
import { io } from "socket.io-client";
import { defineProps } from "vue";

const props = defineProps({
  selectedStudentId: String,
});

const socket = io("http://localhost:3000");

const messages = ref([]);
const newMessage = ref("");
const RoomId = ref("u18");

function leaveRoom(roomId) {
  if (roomId) {
    socket.emit("leaveRoom", roomId);
    console.log("Left Room", roomId);
  }
}

// Load messages when selectedStudentId changes
watch(
  () => props.selectedStudentId,
  async (roomId, oldId) => {
    messages.value = []; // Clear messages when switching students
    const response = await axios.get(
      `http://localhost:3000/messages/${roomId}`
    ); //roomID
    messages.value = response.data;
    messages.value = messages.value.map((m) => ({
      text: m.content,
      senderType: m.senderType,
    }));
    console.log("messages loaded", messages.value);
    if (oldId) {
      console.log("Old Student Id", oldId);
      leaveRoom(oldId);
    }
    if (roomId) {
      socket.emit("joinRoom", roomId);
      console.log("Joined Room", roomId);
    }
  },
  { immediate: true }
);

function sendMessage() {
  if (newMessage.value.trim()) {
    const message = {
      room: props.selectedStudentId,
      sender: "Gunjan",
      sender_id: "examiner01",
      recipient: props.selectedStudentId,
      text: newMessage.value,
      senderType: "examiner",
    };
    socket.emit("message", message);
    // messages.value.push(message);
    newMessage.value = "";
    scrollToBottom();
  }
}

async function scrollToBottom() {
  await nextTick();
  const messagesContainer = document.querySelector(".conversation");
  messagesContainer.scrollTop = messagesContainer.scrollHeight;
}

// Auto-scroll when a new message arrives
watch(messages, scrollToBottom);

onMounted(() => {
  socket.emit("joinRoom", props.selectedStudentId);
  socket.on("message", (data) => {
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
  box-shadow: 0px 2px 4px rgba(0, 0, 0, 0.3);
  border-radius: 2px;
}

.conversation {
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
