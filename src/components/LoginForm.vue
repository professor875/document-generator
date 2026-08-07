<!--
  LoginForm.vue -- Login form component

  Renders username and password inputs with a submit button.
  On submission it calls the auth service's login() function.
  If authentication fails, an inline error message is displayed.
  On success the user is redirected to /dashboard via the router.
-->

<template>
  <form class="login-form" @submit.prevent="handleLogin">
    <!-- Username field -->
    <div class="field">
      <label for="username">Username</label>
      <input
        id="username"
        v-model="username"
        type="text"
        placeholder="Enter your username"
        autocomplete="username"
      />
    </div>

    <!-- Password field -->
    <div class="field">
      <label for="password">Password</label>
      <input
        id="password"
        v-model="password"
        type="password"
        placeholder="Enter your password"
        autocomplete="current-password"
      />
    </div>

    <!-- Error message -- only shown after a failed login attempt -->
    <p v-if="errorMessage" class="error">{{ errorMessage }}</p>

    <!-- Submit button -->
    <button type="submit" class="login-button">Login</button>
  </form>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { useRouter } from 'vue-router'
// The login function returns true on success, false on failure
import { login } from '@/services/auth'

const router = useRouter()

// Reactive form state
const username = ref('')
const password = ref('')
const errorMessage = ref('')

/**
 * Handle form submission.
 * Calls the auth service and either navigates to the dashboard
 * or shows an error message.
 */
function handleLogin(): void {
  // Clear any previous error before attempting login
  errorMessage.value = ''

  const success = login(username.value, password.value)

  if (success) {
    // Credentials matched -- redirect to the protected dashboard
    router.push('/dashboard')
  } else {
    // Credentials did not match -- show an error to the user
    errorMessage.value = 'Invalid username or password'
  }
}
</script>

<style scoped>
/* Card-like container for the form */
.login-form {
  display: flex;
  flex-direction: column;
  gap: 1rem;
  width: 100%;
  max-width: 360px;
  padding: 2rem;
  background: #fff;
  border-radius: 8px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
}

/* Each label + input pair */
.field {
  display: flex;
  flex-direction: column;
  gap: 0.35rem;
}

.field label {
  font-size: 0.9rem;
  font-weight: 500;
  color: #444;
}

.field input {
  padding: 0.6rem 0.75rem;
  border: 1px solid #ccc;
  border-radius: 4px;
  font-size: 0.95rem;
  outline: none;
  transition: border-color 0.2s;
}

.field input:focus {
  border-color: #3b82f6;
}

/* Error text */
.error {
  color: #dc2626;
  font-size: 0.85rem;
  margin: 0;
}

/* Submit button */
.login-button {
  padding: 0.65rem;
  background-color: #1e3a5f;
  color: #fff;
  border: none;
  border-radius: 4px;
  font-size: 1rem;
  cursor: pointer;
  transition: background-color 0.2s;
}

.login-button:hover {
  background-color: #162d4a;
}
</style>
