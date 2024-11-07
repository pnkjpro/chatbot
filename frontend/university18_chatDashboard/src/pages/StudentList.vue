<template>
    <div class="user-list">
      <div class="header">University18 Chat Dashboard</div>
      <div v-for="student in students" @click="selectStudent(student.id)" :key="student.id" class="user">
        <div class="user-info">
          <span>{{ student.name }}</span>
          <span class="username"> | {{ student.username }}</span>
        </div>
        <div class="badge">12</div>
        <div class="status online"></div>
      </div>
    </div>
  </template>

  <script setup>
  import { defineEmits } from 'vue';
  
  const students = [
    { id: 'student01', name: 'Aman Singh', username: 'student01' },
    { id: 'student02', name: 'Chitranjan', username: 'student02' }
  ]; // Sample data
  
  const emit = defineEmits(['studentSelected']);
  function selectStudent(studentId) {
    emit('studentSelected', studentId);
  }
  </script>

  <style scoped>
  .user-list {
    min-width: 300px;
    padding: 10px;
    background-color: #e1e0e2;
    display: flex;
    flex-direction: column;
    box-shadow: 0px 5px 4px rgba(0, 0, 0, 0.3);
    border-radius: 8px;
  }
  
  .header {
    font-size: 1.2em;
    font-weight: bold;
    padding: 15px;
    text-align: center;
    background-color: #fafad7;
    border-radius: 4px;
    color: #0B033E;
  }
  
  .user {
    display: flex;
    align-items: center;
    padding: 10px;
    background-color: #f8f8f8;
    color: #0e0b0b;
    border-radius: 8px;
    margin: 10px 0;
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
    background-color: green;
  }
  </style>
  