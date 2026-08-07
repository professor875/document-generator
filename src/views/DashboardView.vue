<!--
  DashboardView.vue -- Main dashboard page

  Shown after a successful login.  Contains a top header bar with
  the app title and a logout button, and renders the DocumentForm
  component in a centered layout below.
-->

<template>
  <div class="dashboard">
    <!-- Top header bar -->
    <header class="header">
      <!-- Logout button on the left side -->
      <button class="logout-button" @click="handleLogout">Logout</button>

      <!-- App title on the right side -->
      <h1 class="header-title">Document Generator</h1>
    </header>

    <!-- Main content area -- centers the document form -->
    <main class="content">
      <DocumentForm />
    </main>
  </div>
</template>

<script setup lang="ts">
import { useRouter } from 'vue-router'
// logout() clears the auth token from localStorage
import { logout } from '@/services/auth'
import DocumentForm from '@/components/DocumentForm.vue'

const router = useRouter()

/**
 * Log the user out and redirect back to the login page.
 */
function handleLogout(): void {
  logout()
  router.push('/')
}
</script>

<style scoped>
/* Full-page wrapper */
.dashboard {
  min-height: 100vh;
  background-color: #f5f5f5;
}

/* Fixed-height header bar */
.header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 0.75rem 1.5rem;
  background-color: #1e3a5f;
  color: #fff;
}

.header-title {
  font-size: 1.25rem;
  font-weight: 600;
  margin: 0;
}

/* Logout button styled as a subtle white-outlined button */
.logout-button {
  padding: 0.4rem 1rem;
  background: transparent;
  color: #fff;
  border: 1px solid #fff;
  border-radius: 4px;
  font-size: 0.9rem;
  cursor: pointer;
  transition: background-color 0.2s;
}

.logout-button:hover {
  background-color: rgba(255, 255, 255, 0.15);
}

/* Center the document form with some vertical padding */
.content {
  display: flex;
  justify-content: center;
  padding: 2rem 1rem;
}
</style>
