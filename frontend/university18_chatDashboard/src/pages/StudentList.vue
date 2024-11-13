<template>
  <div class="user-list">
    <div class="header">University18 Chat Dashboard</div>
    <div
      v-for="student in students"
      @click="selectStudent(student.id, student.name, student.status)"
      :key="student.id"
      class="user"
    >
      <div class="user-info">
        <span class="text-sm font-bold">{{ student.name }}</span>
        <span class="username text-sm font-bold"> | {{ student.username }}</span
        ><br />
        <span class="text-clamp">{{ student.content }}</span
        ><br />
        <span class="text-slate-400 text-xs">{{
          formatDistanceToNow(student.timestamp, { addSuffix: true })
        }}</span>
      </div>
      <div class="status" :class="student.status"></div>
    </div>
  </div>
</template>

<script setup>
import { ref, watch, onMounted, defineEmits } from "vue";
import { io } from "socket.io-client";
import axios from "axios";
import { formatDistanceToNow } from "date-fns";

const students = ref([]);

// Initialize socket.io client
const socket = io("http://localhost:3000");

// Emit event when a new student joins
socket.on("newStudent", (data) => {
  console.log(data);
  const existingStudent = students.value.find((s) => s.id === data.room);
  // even if the student in the loop variable is different from existingStudent, since both reference the same underlying object in students.value, modifying existingStudent.content will automatically update student.content in the loop because the object is the same. Vue detects changes to the object and updates the UI accordingly

  if (existingStudent) {
    existingStudent.content = data.text;
    existingStudent.timestamp = data.timestamp;
  } else {
    students.value.push({
      id: data.room,
      name: data.sender,
      username: data.sender_id,
      content: data.text,
      timestamp: data.timestamp,
      status: "offline",
    });
  }
});

socket.on("userStatus", (studentStatus) => {
  const existingStudent = students.value.find(
    (s) => s.username === studentStatus.studentId
  );
  existingStudent.status = studentStatus.status;
});

const emit = defineEmits(["studentSelected"]);
function selectStudent(studentId, studentName, stdStatus) {
  emit("studentSelected", studentId, studentName, stdStatus);
}

// Fetch student data from the server
onMounted(() => {
  axios
    .get("http://localhost:3000/students")
    .then((response) => {
      students.value = response.data;
      students.value = students.value.map((s) => ({
        id: s.sender_id,
        name: s.sender,
        username: s.sender_id,
        content: s.content,
        timestamp: s.timestamp,
        status: "offline",
      }));
      console.log("Fetched students:", students.value);
    })
    .catch((error) => {
      console.error("Error fetching students:", error);
    });
});
</script>

<style scoped>
.user-list {
  min-width: 300px;
  max-width: 300px;
  padding: 10px;
  background-color: #e6fae7;
  display: flex;
  flex-direction: column;
  box-shadow: 0px 2px 4px rgba(0, 0, 0, 0.3);
  border-radius: 2px;
  overflow-y: auto;
}

.header {
  font-size: 1em;
  font-weight: bold;
  padding: 10px;
  text-align: center;
  background-color: #fafad7;
  border-radius: 4px;
  color: #62825D;
  margin: 10px 0;
  box-shadow: 0px 1px 2px rgba(0, 0, 0, 0.3);
}

.user {
  display: flex;
  align-items: center;
  padding: 8px;
  background-color: #fbfbfb;
  color: #074173;
  border-radius: 8px;
  margin: 3px 0;
}

.user-info {
  flex-grow: 1;
}

.username {
  /* font-size: 0.8em; */
  color: #353333;
}

.badge {
  background-color: #1c70f0;
  color: white;
  padding: 2px 8px;
  border-radius: 12px;
  font-size: 0.9em;
}

.status {
  width: 10px;
  height: 10px;
  border-radius: 50%;
  margin-left: 10px;
}

.online {
  background-color: #72bf78;
}

.offline {
  background-color: #a6aebf;
  border: 2px solid #283333;
}

.text-clamp {
  display: inline-block; /* Allows the width to be applied */
  white-space: nowrap;
  overflow: hidden; /* Ensures overflow is hidden */
  text-overflow: ellipsis; /* Adds the ellipsis */
  width: 200px; /* Adjust width as needed */
}
</style>
