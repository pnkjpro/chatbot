<template>
  <div class="flex flex-col h-screen bg-gray-100">
    <!-- Header -->
    <header class="bg-[#f0f2f5] px-4 py-0 flex items-center justify-between border-b border-[#d1d1d1]">
      <div class="flex items-center space-x-2">
        <button class="lg:hidden p-2 hover:bg-gray-200 rounded-full" @click="toggleSidebar">
          <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h16m-7 6h7" />
          </svg>
        </button>
        <div class="w-20 h-20">
          <img src="/src/assets/image/logo.png" alt="U18 Chat" class="w-full h-full object-contain" />
        </div>
        <h1 class="text-lg font-semibold hidden sm:block">U18 Chat</h1>
      </div>
      
      <div v-if="selectedStudent.name.length > 0" class="flex items-center space-x-4">
        <div class="flex items-center space-x-2">
          <div class="w-8 h-8 bg-emerald-500 rounded-full flex items-center justify-center text-white">
            {{ selectedStudent.name[0] || "S" }}
          </div>
          <div class="hidden sm:flex flex-col">
            <span class="text-sm font-medium"> {{ selectedStudent.name || "Anonymous Student" }}</span>
            <span class="text-xs text-green-500">{{  selectedStudent.status  || "offline" }}</span>
          </div>
        </div>
        <!-- Three dots menu -->
        <div class="relative">
          <button class="p-2 hover:bg-gray-200 rounded-full" @click="toggleUserMenu">
            <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 5v.01M12 12v.01M12 19v.01M12 6a1 1 0 110-2 1 1 0 010 2zm0 7a1 1 0 110-2 1 1 0 010 2zm0 7a1 1 0 110-2 1 1 0 010 2z" />
            </svg>
          </button>
          <!-- Dropdown menu -->
          <div v-if="isUserMenuOpen" 
               class="absolute right-0 top-full mt-2 bg-white shadow-lg rounded-lg py-1 w-48 z-50">
            <button @click="terminateSession" 
                    class="w-full text-left px-4 py-2 text-gray-700 hover:bg-gray-100 flex items-center space-x-2">
              <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
              </svg>
              <span>Terminate Session</span>
            </button>
          </div>
        </div>
      </div>
    </header>

    <!-- Main Content -->
    <div class="flex flex-1 overflow-hidden relative">
      <!-- Sidebar overlay -->
      <div v-if="isSidebarOpen" 
           class="lg:hidden fixed inset-0 bg-black bg-opacity-50 z-40"
           @click="toggleSidebar">
      </div>

      <!-- Sidebar -->
      <div :class="[
        'bg-[#ffffff] border-r border-[#d1d1d1] absolute lg:relative z-50',
        'transition-transform duration-300 ease-in-out',
        'w-80 lg:w-80 h-full',
        isSidebarOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'
      ]">
        <!-- Search -->
        <div class="p-2">
          <div class="bg-[#f0f2f5] flex items-center rounded-lg px-3 py-1.5">
            <svg class="w-5 h-5 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
            <input 
              type="text" 
              class="bg-transparent border-none focus:ring-0 flex-1 ml-2 text-[#9c9c9c]"
              placeholder="Search"
            />
          </div>
        </div>

        <!-- Chat List -->
        <!-- Chat List -->
<div class="overflow-hidden">
  <div v-for="student in (filteredStudents.length > 0 ? filteredStudents : students)"
       :key="student.id" 
       class="hover:bg-gray-100 px-3 py-2 cursor-pointer"
       @click="selectStudent(student)">
    <div class="flex items-center space-x-3">
      <div class="relative flex-shrink-0">
        <div :class="[
          'w-2 h-2 rounded-full absolute -right-0.5 -top-0.5',
          student.status === 'online' ? 'bg-green-500' : 'bg-gray-400'
        ]"></div>
        <div class="w-10 h-10 font-semibold rounded-full bg-emerald-500 flex items-center justify-center text-white">
          {{ student.name[0] }}
        </div>
      </div>
      <div class="flex-1 min-w-0">
        <div class="flex items-center justify-between">
          <span class="font-medium truncate">{{ student.name }}</span>
          <span :class="[
            'px-1 py-0.5 text-xs font-semibold rounded-lg',
            student.status === 'online' ? 'bg-green-100 text-green-700 font-bold' : 'bg-gray-200 text-gray-600'
          ]">
            {{ student.username }}
          </span>
          <span class="text-xs text-gray-500 flex-shrink-0 ml-2">{{ formatDistanceToNow(student.timestamp, { addSuffix: true }) }}</span>
        </div>
        <div class="flex items-center">
          <span class="text-sm text-gray-500 truncate block">{{ student.message }}</span>
          <div v-if="student.unread" 
               class="ml-2 bg-green-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center flex-shrink-0">
            {{ student.unread }}
          </div>
        </div>
      </div>
    </div>
  </div>
</div>

      </div>

      <!-- Chat Area -->
      <div v-if="selectedStudent.name && selectedStudent.name.length > 0"
        class="flex-1 flex flex-col bg-[#f0f2f5] chat-bgImage">
        <!-- Messages -->
        <div class="flex-1 overflow-y-auto p-4 messages-container">
          <div v-for="message in messages" 
               :key="message.id" 
               :class="[
                 'flex items-start space-x-2 mb-4',
                 message.senderType === 'examiner' ? 'flex-row-reverse space-x-reverse' : ''
               ]">
            <!-- Avatar -->
            <div class="w-8 h-8 rounded-full bg-emerald-500 flex-shrink-0 flex items-center justify-center text-white">
              {{ message.senderType === "examiner" ? "U" : message.sender[0] }}
            </div>
            <!-- Message content -->
            <div :class="[
              'max-w-[70%]'
            ]">
              <div :class="[
                'rounded-lg px-4 py-2',
                message.senderType === 'examiner' ? 'bg-emerald-500 text-white' : 'bg-white'
              ]">
                {{ message.message }}
              </div>
              <div :class="[
                'text-xs text-gray-500 mt-1',
                message.sent ? 'text-right' : ''
              ]">
                {{ formatDistanceToNow(message.timestamp, { addSuffix: true }) }}
              </div>
            </div>
          </div>
        </div>

        <!-- Input Area -->
        <div class="bg-[#ffffff] p-4 border-t border-[#d1d1d1]">
          <div class="flex items-center space-x-2">
            <!-- File upload button -->
            <label class="cursor-pointer p-2 hover:bg-gray-100 rounded-full">
              <input type="file" class="hidden" @change="handleFileUpload" />
              <svg class="w-6 h-6 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15.172 7l-6.586 6.586a2 2 0 102.828 2.828l6.414-6.586a4 4 0 00-5.656-5.656l-6.415 6.585a6 6 0 108.486 8.486L20.5 13" />
              </svg>
            </label>
            
            <input 
            v-model="newMessage"
            @keyup.enter="sendMessage" 
              class="flex-1 border border-gray-300 rounded-lg px-4 py-2 focus:ring-2 focus:ring-emerald-500 focus:border-transparent"
              placeholder="Type a message..."
            />
            
            <button @click="sendMessage" class="bg-emerald-500 text-white rounded-full p-2 hover:bg-emerald-600">
              <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" />
              </svg>
            </button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, watch, onMounted, defineEmits, nextTick } from 'vue';
import { io } from "socket.io-client";
import axios from "axios";
import { formatDistanceToNow } from "date-fns";
import { useToast } from 'vue-toastification';


//-------------------------- Initial Variables ------------------------
const appUrl = "https://socket.everitas.in";
let toast = useToast();
const students = ref([]);
const messages = ref([]);
const newMessage = ref("");
const searchQuery = ref("");
const selectedStudent = ref({
  id: null,
  name: "",
  username: "",
  content: "",
  timestamp: null,
  examination_id: null,
  status: "offline",
  unread: 0,
});

const filteredStudents = ref([]);

// Initialise socket.io client
const socket = io(`${appUrl}`, {
    transports: ['websocket', 'polling'],
    reconnection: true,
    reconnectionAttempts: 5,
    withCredentials: true,
    extraHeaders: {
        "Access-Control-Allow-Origin": "*"
    }
});

// Receive events when a new student joins
socket.on("newStudent", (data) => {
  const existingStudent = students.value.find((s) => s.examination_id === data.room_id);
  // even if the student in the loop variable is different from existingStudent, since both reference the same underlying object in students.value, modifying existingStudent.content will automatically update student.content in the loop because the object is the same. Vue detects changes to the object and updates the UI accordingly

  if (existingStudent) {
    existingStudent.message = data.message;
    existingStudent.timestamp = data.timestamp;
  } else {
    students.value.push({
      id: data.room_id,
      name: data.sender,
      username: data.sender_id,
      message: data.message,
      examination_id: data.examination_id,
      timestamp: data.timestamp,
      status: "offline",
      unread: 7, //do something with this
    });
  }
})

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
    isSidebarOpen.value = false
  }
  selectedStudent.value = student;
}

function leaveRoom(roomId) {
  if (roomId) {
    socket.emit("leaveRoom", roomId);
    console.log("Left Room", roomId);
  }
}

watch(()=> selectedStudent.value.examination_id, 
async (roomId, oldId) => {
  console.log("selectedStudent", selectedStudent.value);
    messages.value = []; // Clear messages when switching students
    const response = await axios.get(`${appUrl}/messages/${roomId}`); //roomID
    messages.value = JSON.parse(response.data[0].content);

    if (oldId) {
      console.log("Old Student Id", oldId);
      leaveRoom(oldId);
    }
    if (roomId) {
      socket.emit("joinRoom", roomId);
      console.log("Joined Room", roomId);
    }
  },
  { immediate: true, deep: true }
);

socket.on("message", (data) => {
  console.log("Message Structure on Emit", data)
    messages.value.push(data);
    scrollToBottom();
  });

function sendMessage() {
  if (newMessage.value.trim()) {
    const message = {
      room_id: selectedStudent.value.examination_id,
      sender: "Geetika",
      sender_id: "examiner01",
      recipient_id: selectedStudent.value.username,
      message: newMessage.value,
      examination_id: selectedStudent.value.examination_id,
      senderType: "examiner",
      read_status: "unread",
      timestamp: Date.now(),
    };
    socket.emit("message", message);
    newMessage.value = "";
    scrollToBottom();
  }
}

//=================== search and filter =================
function filterStudents(searchTerm) {
  filteredStudents.value = students.value.filter(student => {
    return (
      student.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      student.examination_id.toString().includes(searchTerm)
    );
  });
  return filteredStudents;
}

watch(()=>searchQuery.value, (newSearchQuery)=>{
  console.log(filterStudents(newSearchQuery));
})

async function scrollToBottom() {
  await nextTick();
  const messagesContainer = document.querySelector(".messages-container");
  messagesContainer.scrollTop = messagesContainer.scrollHeight;
}

// Auto-scroll when a new message arrives
watch(messages, scrollToBottom);



//============= fetch students data from the server ============
onMounted(()=> {
  axios.get(`${appUrl}/students`)
  .then((response)=>{
    students.value = JSON.parse(JSON.stringify(response.data));

    students.value = students.value.map((student) => {
      const parsedContent = JSON.parse(student.content);
      return {
        id: student.student_username,
        name: student.student_name,
        username: student.student_username,
        message: parsedContent[parsedContent.length - 1].message,
        timestamp: parsedContent[parsedContent.length - 1].timestamp,
        examination_id: student.session_id,
        status: "offline",
        unread: 3, // do something with this
      }
    })

    console.log("Students fetched successfully", students.value);
  })
  .catch((error)=>{
    console.error("Error fetching students data", error);
  })
});


const isSidebarOpen = ref(false)
const isUserMenuOpen = ref(false)

const toggleSidebar = () => {
  isSidebarOpen.value = !isSidebarOpen.value
  if (isSidebarOpen.value) isUserMenuOpen.value = false
}

const toggleUserMenu = () => {
  isUserMenuOpen.value = !isUserMenuOpen.value
  if (isUserMenuOpen.value) isSidebarOpen.value = false
}

const terminateSession = (sessionId) => {
  axios.get(`${appUrl}/terminateSession/${sessionId}`)
  .then((response) => {
    console.log("Session terminated successfully", response.data);
    window.location.reload();
  })
  .catch((error) => {
    console.error("Error terminating session", error);
  })
  isUserMenuOpen.value = false
}

const handleFileUpload = (event) => {
  const file = event.target.files[0]
  toast.error("File Upload function is not available as of now.")
  // Handle file upload logic
  console.log('File selected:', file)
}
</script>

<style scoped>
.chat-bgImage {
  background-image: url('https://i.ibb.co/g9CMZQZ/bg-doodle.png');
}
</style>