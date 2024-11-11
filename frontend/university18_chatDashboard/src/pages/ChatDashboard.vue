<template>
  <div class="dashboard-container">
    <StudentList @studentSelected="setSelectedStudent" />
    <ChatWindow
      v-if="selectedStudentId"
      :selectedStudentId="selectedStudentId"
      :selectedStudentName="selectedStudentName"
      :selectedStudentStatus="selectedStudentStatus"
    />
  </div>
</template>

<script setup>
import { ref } from "vue";
import StudentList from "./StudentList.vue";
import ChatWindow from "./ChatWindow.vue";

const selectedStudentId = ref(null);
const selectedStudentName = ref(null);
const selectedStudentStatus = ref("offline");

function setSelectedStudent(studentId, studentName, stdStatus) {
  selectedStudentId.value = studentId;
  selectedStudentName.value = studentName;
  selectedStudentStatus.value = stdStatus;
}
</script>

<style scoped>
@import url("https://fonts.googleapis.com/css2?family=Nunito:ital,wght@0,200..1000;1,200..1000&display=swap");
.dashboard-container {
  display: flex;
  height: 94vh;
  column-gap: 4px;
  font-family: "Nunito", sans-serif;

  max-width: 1280px;
  margin: 0 auto;
  padding: 2rem;
  font-weight: normal;
}
</style>
