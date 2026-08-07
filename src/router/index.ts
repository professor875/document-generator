/**
 * Vue Router Configuration
 *
 * Defines the application routes and a global navigation guard
 * that enforces authentication rules:
 *
 *   /           -> LoginView   (public -- redirects to /dashboard if already logged in)
 *   /dashboard  -> DashboardView (protected -- redirects to / if not logged in)
 */

import { createRouter, createWebHashHistory, type RouteRecordRaw } from 'vue-router'
import { isAuthenticated } from '@/services/auth'

// ---------------------------------------------------------------
// Route definitions
// ---------------------------------------------------------------
const routes: RouteRecordRaw[] = [
  {
    path: '/',
    name: 'Login',
    // Lazy-load the LoginView so it is only fetched when needed
    component: () => import('@/views/LoginView.vue'),
    meta: {
      // Custom flag: this route should only be visible to guests
      // (unauthenticated users).
      guestOnly: true
    }
  },
  {
    path: '/dashboard',
    name: 'Dashboard',
    // Lazy-load the DashboardView
    component: () => import('@/views/DashboardView.vue'),
    meta: {
      // Custom flag: this route requires the user to be logged in.
      requiresAuth: true
    }
  }
]

// ---------------------------------------------------------------
// Router instance
// ---------------------------------------------------------------
const router = createRouter({
  // Use hash mode for static hosting (Hostinger, etc.) compatibility.
  history: createWebHashHistory(),
  routes
})

// ---------------------------------------------------------------
// Global navigation guard
//
// Runs before every route change to enforce access rules.
// ---------------------------------------------------------------
router.beforeEach((to, _from, next) => {
  const authenticated = isAuthenticated()

  if (to.meta.requiresAuth && !authenticated) {
    // The user is trying to access a protected route without being
    // logged in -- redirect them to the login page.
    next({ name: 'Login' })
  } else if (to.meta.guestOnly && authenticated) {
    // The user is already logged in but is trying to visit a
    // guest-only page (e.g. the login form) -- send them to
    // the dashboard instead.
    next({ name: 'Dashboard' })
  } else {
    // No restrictions apply -- allow navigation.
    next()
  }
})

export default router
