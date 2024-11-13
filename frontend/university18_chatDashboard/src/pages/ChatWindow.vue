<template>
  <div class="chat-window">
    <div class="flex items-center space-x-4 ml-auto">
      <div class="flex items-center space-x-2">
        <div
          class="w-8 h-8 rounded-full bg-blue-600 flex text-slate-50 items-center justify-center"
        >
          <span class="text-sm font-semibold">{{
            getInitials(studentName)
          }}</span>
        </div>
        <span>{{ studentName }}</span>
        <div
          class="w-2 h-2 rounded-full"
          :class="status === 'online' ? 'bg-green-500' : 'bg-slate-400'"
        ></div>
        <span class="text-sm text-slate-600">{{ status }}</span>
      </div>
      <div class="flex items-center space-x-3 text-gray-400">
        <i class="fas fa-ellipsis-v"></i>
      </div>
    </div>

    <div class="border-b border-gray-300 p-3"></div>
    <div></div>

    <div class="conversation">
      <div class="image-background"></div>
      <div
        v-for="msg in messages"
        :key="msg.id"
        :class="msg.senderType"
        class="messages"
      >
        <div v-if="msg.senderType === 'examiner'" class="message reply">
          <div class="avatar">U18</div>
          <div class="text student-bg">
            {{ msg.text }}<br /><span
              class="text-slate-400 float-right text-xs"
              >{{
                formatDistanceToNow(msg.timestamp, { addSuffix: true })
              }}</span
            >
          </div>
        </div>
        <div v-else class="message">
          <div class="avatar">{{ getInitials(msg.sender) }}</div>
          <div class="text examiner-bg">
            {{ msg.text }}<br /><span
              class="text-gray-400 float-right text-xs"
              >{{
                formatDistanceToNow(msg.timestamp, { addSuffix: true })
              }}</span
            >
          </div>
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
        <button @click="sendMessage">
          <i class="fas fa-paper-plane"></i>
        </button>
      </div>
    </div>
  </div>
</template>

<script setup>
import { watch, ref, onMounted, nextTick } from "vue";
import axios from "axios";
import { io } from "socket.io-client";
import { defineProps } from "vue";
import { formatDistanceToNow } from "date-fns";

const props = defineProps({
  selectedStudentId: String,
  selectedStudentName: String,
  selectedStudentStatus: String,
});

const socket = io("http://localhost:3000");

const messages = ref([]);
const newMessage = ref("");
const RoomId = ref("u18");
const studentName = ref(props.selectedStudentName || "Anonymous");
const status = ref(props.selectedStudentStatus || "offline");
// const status = ref("offline");

watch(
  () => props.selectedStudentName,
  (newName) => {
    studentName.value = newName;
  }
);

watch(
  () => props.selectedStudentStatus,
  (newStatus) => {
    status.value = newStatus;
  }
);

socket.on("userStatus", (userStatus) => {
  if (props.selectedStudentId === userStatus.studentId) {
    status.value = userStatus.status;
  }
});

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
    // localStorage.removeItem("selectedStudentName");
    const response = await axios.get(
      `http://localhost:3000/messages/${roomId}`
    ); //roomID
    messages.value = response.data;
    messages.value = messages.value.map((m) => ({
      sender: m.sender,
      text: m.content,
      senderType: m.senderType,
      timestamp: m.timestamp,
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
      timestamp: Date.now(),
    };
    socket.emit("message", message);
    // messages.value.push(message);
    newMessage.value = "";
    scrollToBottom();
  }
}

function getInitials(name) {
  return name
    .split(" ")
    .map((word) => word[0]) // Take the first letter of each word
    .join("") // Join the initials together
    .substring(0, 2) // Take the first two initials only
    .toUpperCase();
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
  background-color: #fbfbfb;
  box-shadow: 0px 2px 4px rgba(0, 0, 0, 0.3);
  border-radius: 2px;
}

.conversation {
  flex-grow: 1;
  display: flex;
  background-image: url('https://i.ibb.co/g9CMZQZ/bg-doodle.png');
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
  width: 35px;
  height: 35px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  font-weight: bold;
  margin: 0 10px;
}

.examiner-bg {
  background-color: #c2ffc7;
  box-shadow: 0px 1px 1px rgba(0, 0, 0, 0.2);
}

.student-bg {
  background-color: #f5f7f8;
  box-shadow: 0px 1px 1px rgba(0, 0, 0, 0.2);
}

.text {
  padding: 10px;
  border-radius: 6px;
  max-width: 60%;
  color: #16423c;
}

.input-area {
  display: flex;
  align-items: center;
  padding: 10px;
}

input {
  flex-grow: 1;
  padding: 10px;
  /* border: none; */
  border: #e2ecea 1px solid;
  border-radius: 5px;
  margin-right: 10px;
  color: #16423c;
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
