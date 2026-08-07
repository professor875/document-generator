<!--
  LoginView.vue -- Login page

  A centered page that displays the application title and the
  LoginForm component.  The entire layout is vertically and
  horizontally centered using flexbox so it looks clean on any
  screen size.
-->

<template>
  <!-- Full-viewport wrapper that centers its children -->
  <div class="login-page">
    <!-- Application title -->
    <h1 class="title">Document Generator</h1>

    <!-- The login form handles credential input and validation -->
    <LoginForm />
  </div>
</template>

<script setup lang="ts">
// Import the LoginForm component that handles user authentication
import LoginForm from '@/components/LoginForm.vue'
</script>

<style scoped>
/* Cover the full viewport and center everything */
.login-page {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  min-height: 100vh;
  background-color: #f5f5f5;
}

/* Application title styling */
.title {
  font-size: 1.8rem;
  font-weight: 600;
  color: #333;
  margin-bottom: 2rem;
}
</style>
