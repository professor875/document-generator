/**
 * Auth Service
 *
 * Handles authentication logic for the document generator app.
 * Credentials are stored in a config object below so they can be
 * changed in one place without hunting through the code.
 *
 * State (logged-in / logged-out) is persisted in localStorage so it
 * survives page refreshes.
 */

// ---------------------------------------------------------------
// Configurable credentials -- change these values as needed.
// In a real app you would validate against a backend instead.
// ---------------------------------------------------------------
const AUTH_CONFIG = {
  username: 'admin',   // default username -- change before production
  password: 'admin123' // default password -- change before production
} as const

// The localStorage key used to store the authentication token / flag.
// Prefixed with "doc-gen-" to avoid collisions with other apps on
// the same origin.
const STORAGE_KEY = 'doc-gen-auth'

/**
 * Attempt to log in with the provided credentials.
 *
 * If the credentials match the config, a JSON payload containing
 * the username is saved to localStorage and the function returns true.
 * Otherwise it returns false and localStorage is left untouched.
 */
export function login(username: string, password: string): boolean {
  // Compare supplied values against the configured credentials
  if (username === AUTH_CONFIG.username && password === AUTH_CONFIG.password) {
    // Persist a small JSON blob so we can restore the session later
    localStorage.setItem(
      STORAGE_KEY,
      JSON.stringify({ username })
    )
    return true
  }

  // Credentials did not match
  return false
}

/**
 * Log out the current user by removing the auth entry from
 * localStorage. After this call, isAuthenticated() will return false.
 */
export function logout(): void {
  localStorage.removeItem(STORAGE_KEY)
}

/**
 * Check whether a user is currently authenticated.
 * Returns true only if the storage key exists and contains a
 * parseable JSON object with a username field.
 */
export function isAuthenticated(): boolean {
  const raw = localStorage.getItem(STORAGE_KEY)

  if (!raw) {
    return false
  }

  try {
    const data = JSON.parse(raw)
    // Make sure the stored object actually has a username
    return typeof data.username === 'string' && data.username.length > 0
  } catch {
    // Corrupted data -- treat as unauthenticated
    return false
  }
}

/**
 * Return the username of the currently authenticated user,
 * or null if no one is logged in.
 */
export function getUsername(): string | null {
  const raw = localStorage.getItem(STORAGE_KEY)

  if (!raw) {
    return null
  }

  try {
    const data = JSON.parse(raw)
    return typeof data.username === 'string' ? data.username : null
  } catch {
    return null
  }
}
