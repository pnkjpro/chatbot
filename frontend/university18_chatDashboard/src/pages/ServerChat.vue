<template>
  <div class="flex flex-col h-screen bg-gray-100">
    <!-- Header -->
    <header
      class="bg-[#f0f2f5] px-4 py-0 flex items-center justify-between border-b border-[#d1d1d1]"
    >
      <div class="flex items-center space-x-2">
        <button
          class="lg:hidden p-2 hover:bg-gray-200 rounded-full"
          @click="toggleSidebar"
        >
          <svg
            class="w-6 h-6"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              d="M4 6h16M4 12h16m-7 6h7"
            />
          </svg>
        </button>
        <div class="w-96 h-20 flex">
          <span style="display: flex; align-items: center;" class="font-bold text-xl text-green-900">Today Exam Chat</span>
        </div>
      </div>

      <div
        v-if="selectedStudent.name.length > 0"
        class="flex items-center space-x-4"
      >
        <div class="flex items-center space-x-2">
          <div
            class="w-8 h-8 bg-emerald-500 rounded-full flex items-center justify-center text-white"
          >
            {{ selectedStudent.name[0] || "S" }}
          </div>
          <div class="hidden sm:flex flex-col">
            <span class="text-sm font-medium">
              {{ selectedStudent.name || "Anonymous Student" }}</span
            >
            <span class="text-xs text-green-500">{{
              selectedStudent.status || "offline"
            }}</span>
          </div>
        </div>
        <!-- Three dots menu -->
        <div class="relative">
          <button
            class="p-2 hover:bg-gray-200 rounded-full"
            @click="toggleUserMenu"
          >
            <svg
              class="w-6 h-6"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M12 5v.01M12 12v.01M12 19v.01M12 6a1 1 0 110-2 1 1 0 010 2zm0 7a1 1 0 110-2 1 1 0 010 2zm0 7a1 1 0 110-2 1 1 0 010 2z"
              />
            </svg>
          </button>
          <!-- Dropdown menu -->
          <!-- <div v-if="isUserMenuOpen" 
               class="absolute right-0 top-full mt-2 bg-white shadow-lg rounded-lg py-1 w-48 z-50">
            <button @click="terminateSession(selectedStudent.examination_id)" 
                    class="w-full text-left px-4 py-2 text-gray-700 hover:bg-gray-100 flex items-center space-x-2">
              <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
              </svg>
              <span>Terminate Session</span>
            </button>
          </div> -->
        </div>
      </div>
    </header>

    <!-- Main Content -->
    <div class="flex flex-1 overflow-hidden relative">
      <!-- Sidebar overlay -->
      <div
        v-if="isSidebarOpen"
        class="lg:hidden fixed inset-0 bg-black bg-opacity-50 z-40"
        @click="toggleSidebar"
      ></div>

      <!-- Sidebar -->
      <div
        :class="[
          'bg-[#ffffff] border-r border-[#d1d1d1] absolute lg:relative z-50',
          'transition-transform duration-300 ease-in-out',
          'w-96 lg:w-96 h-full',
          isSidebarOpen
            ? 'translate-x-0'
            : '-translate-x-full lg:translate-x-0',
        ]"
      >
        <!-- Search -->
        <div class="p-2">
          <div class="bg-[#f0f2f5] flex items-center rounded-lg px-3 py-1.5">
            <svg
              class="w-5 h-5 text-gray-500"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
              />
            </svg>
            <input
              type="text"
              v-model="searchQuery"
              class="bg-transparent border-none focus:ring-0 flex-1 ml-2 text-[#9c9c9c]"
              placeholder="Search"
            />
          </div>
        </div>

        <!-- Chat List -->
        <!-- Chat List -->
        <div class="overflow-auto h-screen">
          <div
            v-for="student in computedStudentList"
            :key="student.id"
            class="hover:bg-gray-100 px-3 py-2 cursor-pointer"
            @click="selectStudent(student)"
          >
            <div
              v-if="computedStudentList.length === 0"
              class="text-center text-gray-500 p-4"
            >
              {{ "No students found" }}
            </div>
            <div class="flex items-center space-x-3">
              <div class="relative flex-shrink-0">
                <div
                  :class="[
                    'w-2 h-2 rounded-full absolute -right-0.5 -top-0.5',
                    student.status === 'online'
                      ? 'bg-green-500'
                      : 'bg-gray-400',
                  ]"
                ></div>

                <div
                  class="w-10 h-10 font-semibold rounded-full bg-emerald-500 flex items-center justify-center text-white"
                >
                  {{ student.name[0] }}
                </div>
              </div>
              <div class="flex-1 min-w-0">
                <div class="flex items-center justify-between">
                  <span class="font-medium truncate">{{ student.name }}</span>
                  <span
                    :class="[
                      'px-1 py-0.5 text-xs font-semibold rounded-lg',
                      student.status === 'online'
                        ? 'bg-green-100 text-green-700 font-bold'
                        : 'bg-gray-200 text-gray-600',
                    ]"
                  >
                    {{ student.username }}
                  </span>
                  <span
                    class="px-1 py-0.5 text-xs font-semibold rounded-lg bg-blue-200 text-blue-600"
                  >
                    {{ student.examiner_username }}
                  </span>
                  <span class="text-xs text-gray-500 flex-shrink-0 ml-2">{{
                    formatTimestamp(student.timestamp, { addSuffix: true })
                  }}</span>
                </div>
                <div class="flex items-center">
                  <span class="text-sm text-gray-500 truncate block">{{
                    student.message
                  }}</span>
                  
                  <!-- Unread Messages Bell Icon -->
                <div v-if="student.unread" class="px-2">
                  <i class="fas fa-bell text-red-500"></i>
                </div>
                  
                </div>
              </div>
               
            </div>
          </div>
        </div>
      </div>

      <!-- Chat Area -->
      <div
        v-if="!selectedStudent.name || selectedStudent.name.length === 0"
        class="flex-1 flex flex-col bg-[#f0f2f5] items-center justify-center"
      >
        <div class="text-center text-gray-500">
          <i class="fas fa-comment-dots text-6xl mb-4 text-emerald-500"></i>
          <h2 class="text-xl font-semibold">Select Student to Chat</h2>
        </div>
      </div>

      <div v-else class="flex-1 flex flex-col bg-[#f0f2f5] chat-bgImage">
        <!-- Messages -->
        <div class="flex-1 overflow-y-auto p-4 messages-container">
          <div
            v-for="message in filteredMessages"
            :key="message.id"
            :class="[
              'flex items-start space-x-2 mb-4',
              message.senderType === 'examiner'
                ? 'flex-row-reverse space-x-reverse'
                : '',
            ]"
          >
            <!-- Avatar -->
            <div
              class="w-8 h-8 rounded-full bg-emerald-500 flex-shrink-0 flex items-center justify-center text-white"
            >
              {{ message.senderType === "examiner" ? "U" : message.sender[0] }}
            </div>
            <!-- Message content -->
            <div :class="['max-w-[70%]']">
              <div
                :class="[
                  'rounded-lg px-4 py-2',
                  message.senderType === 'examiner'
                    ? 'bg-emerald-500 text-white'
                    : 'bg-white',
                ]"
              >
                {{ message.message }}
              </div>
              <div
                :class="[
                  'text-xs text-gray-500 mt-1',
                  message.sent ? 'text-right' : '',
                ]"
              >
                {{ formatTimestamp(message.timestamp, { addSuffix: true }) }}
              </div>
            </div>
          </div>
        </div>

        <!-- Input Area -->
        <div class="bg-[#ffffff] p-4 border-t border-[#d1d1d1]">
          <div class="flex items-center space-x-2">
            <input
              v-model="newMessage"
              @keyup.enter="sendMessage"
              class="flex-1 border border-gray-300 rounded-lg px-4 py-2 focus:ring-2 focus:ring-emerald-500 focus:border-transparent"
              placeholder="Type a message..."
            />

            <button
              @click="sendMessage"
              class="bg-emerald-500 text-white rounded-full p-2 hover:bg-emerald-600"
            >
              <svg
                class="w-6 h-6"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8"
                />
              </svg>
            </button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, watch, onMounted, defineEmits, nextTick, computed } from "vue";
import { io } from "socket.io-client";
import axios from "axios";
import { formatDistanceToNow, format } from "date-fns";
import { useRoute } from "vue-router";
import { useToast } from "vue-toastification";

//-------------------------- Initial Variables ------------------------
const appUrl = "https://socket.everitas.in/api";
let toast = useToast();
const students = ref([]);
const messages = ref([]);
const newMessage = ref("");
const searchQuery = ref("");
const route = useRoute();
const filteredMessages = computed(() => messages.value.filter(m => m.message != "Hello! You are trying to connect with a proctor.."))
const selectedStudent = ref({
  id: null,
  name: "",
  username: "",
  content: "",
  timestamp: null,
  examination_id: null,
  status: "offline",
  unread: false,
});


const { client, examinerName, examinerUsername } = route.params;
console.log(client, examinerName, examinerUsername);

// Initialise socket.io client
const socket = io(`https://socket.everitas.in`, {
  transports: ["websocket", "polling"],
  reconnection: true,
  reconnectionAttempts: 5,
  withCredentials: true,
  extraHeaders: {
    "Access-Control-Allow-Origin": "*",
  },
});

const formatTimestamp = (timestamp) => {
  return format(timestamp, "hh:mm a");
};

// Receive events when a new student joins
socket.on("newStudent", (data) => {
  console.log("New student Data: ", data);
  if (data.clientcode === client) {
    const existingStudent = students.value.find(
      (s) => s.room_id === data.room_id
    );
    // even if the student in the loop variable is different from existingStudent, since both reference the same underlying object in students.value, modifying existingStudent.content will automatically update student.content in the loop because the object is the same. Vue detects changes to the object and updates the UI accordingly

    if (existingStudent) {
      existingStudent.message = data.message;
      existingStudent.timestamp = data.timestamp;
      if((data.senderType == 'student') && (data.room_id != selectedStudent.value.examination_id)) {
        existingStudent.unread = true; //do something with this
      }
    } else {
      students.value.push({
        room_id: data.room_id,
        name: data.sender,
        username: data.sender_id,
        examiner_username: "Anonymous",
        message: data.message,
        examination_id: data.examination_id,
        timestamp: data.timestamp,
        status: "online",
        unread: true, //do something with this
      });
    }
  }
});

// Receive events when a student is online/offline
socket.on("userStatus", (studentStatus) => {
  const existingStudent = students.value.find(
    (s) => s.examination_id === studentStatus.examinationId
  );
  existingStudent.status = studentStatus.status;
});

// ===================== Conversation Window starts here =====================
//handle student selection
const selectStudent = (student) => {
  if (window.innerWidth < 1024) {
    isSidebarOpen.value = false;
  }
  selectedStudent.value = student;
   // Mark all messages as read for this student
   selectedStudent.value.unread = false;
};

function leaveRoom(roomId) {
  if (roomId) {
    socket.emit("leaveRoom", roomId);
    console.log("Left Room", roomId);
  }
}

watch(
  () => selectedStudent.value.examination_id,
  async (roomId, oldId) => {
    console.log("selectedStudent", selectedStudent.value);
    messages.value = []; // Clear messages when switching students
    const response = await axios.get(`${appUrl}/messages/${roomId}`); //roomID
    // messages.value = JSON.parse(response.data[0].content);
    messages.value = response.data[0].content;

    if (oldId) {
      console.log("Old Student Id", oldId);
      leaveRoom(oldId);
    }
    if (roomId) {
      socket.emit("joinRoom", roomId);
      console.log("Joined Room", roomId);
    }
  },
  { deep: true }
);

const computedStudentList = computed(() => {
  // If search query exists, filter students
  if (searchQuery.value) {
    return students.value
      .filter(
        (student) =>
          student.name
            .toLowerCase()
            .includes(searchQuery.value.toLowerCase()) ||
          student.username
            .toLowerCase()
            .includes(searchQuery.value.toLowerCase()) ||
          student.examination_id.toString().includes(searchQuery.value)
      )
      .sort((a, b) => b.timestamp - a.timestamp);
  }

  // If no search query, return all students sorted by timestamp
  return students.value.sort((a, b) => b.timestamp - a.timestamp);
});

socket.on("message", (data) => {
  // console.log("Message Structure on Emit", data);
  messages.value.push(data);
  scrollToBottom();
});

function sendMessage() {
  if (newMessage.value.trim()) {
    const message = {
      room_id: selectedStudent.value.examination_id,
      sender: examinerName || "examiner_name",
      sender_id: examinerUsername || "examiner_username",
      recipient_id: selectedStudent.value.username,
      message: newMessage.value,
      clientcode: client,
      examination_id: selectedStudent.value.examination_id,
      senderType: "examiner",
      timestamp: Date.now(),
    };

    // ================= to change the examiner name if not set =================
    if(selectedStudent.value.examiner_username == "Anonymous"){
      selectedStudent.value.examiner_username = examinerUsername;
    }
    socket.emit("message", message);
    newMessage.value = "";
    scrollToBottom();
  }
}
async function scrollToBottom() {
  await nextTick();
  const messagesContainer = document.querySelector(".messages-container");
  messagesContainer.scrollTop = messagesContainer.scrollHeight;
}

// Auto-scroll when a new message arrives
watch(messages, scrollToBottom);

//============= fetch students data from the server ============
onMounted(() => {
  axios
    .get(`${appUrl}/students/${client}`)
    .then((response) => {
      console.log("Raw message: ",response.data);
      students.value = response.data;
      // students.value = JSON.parse(JSON.stringify(response.data));

      students.value = students.value.map((student) => {
        const parsedContent = student.content;
        // const parsedContent = JSON.parse(student.content);
        return {
          room_id: student.room_id,
          name: student.student_name,
          username: student.student_username, 
          examiner_username: student.examiner_username || "Anonymous",
          message: parsedContent[parsedContent.length - 1].message,
          timestamp: parsedContent[parsedContent.length - 1].timestamp,
          examination_id: student.session_id,
          unread: false,
          status: "offline",
        };
      });

      console.log("Students fetched successfully", students.value);
    })
    .catch((error) => {
      console.error("Error fetching students data", error);
    });
});

const isSidebarOpen = ref(false);
const isUserMenuOpen = ref(false);

const toggleSidebar = () => {
  isSidebarOpen.value = !isSidebarOpen.value;
  if (isSidebarOpen.value) isUserMenuOpen.value = false;
};

const toggleUserMenu = () => {
  isUserMenuOpen.value = !isUserMenuOpen.value;
  if (isUserMenuOpen.value) isSidebarOpen.value = false;
};

const terminateSession = (sessionId) => {
  axios
    .get(`${appUrl}/terminateSession/${sessionId}`)
    .then((response) => {
      console.log("Session terminated successfully", response.data);
      window.location.reload();
    })
    .catch((error) => {
      console.error("Error terminating session", error);
    });
  isUserMenuOpen.value = false;
};

const handleFileUpload = (event) => {
  const file = event.target.files[0];
  toast.error("File Upload function is not available as of now.");
  // Handle file upload logic
  console.log("File selected:", file);
};
</script>

<style scoped>
.chat-bgImage {
  background-image: url("https://i.ibb.co/g9CMZQZ/bg-doodle.png");
}
.animate-pulse {
  animation: pulse 1.5s cubic-bezier(0.4, 0, 0.6, 1) infinite;
}

</style>
