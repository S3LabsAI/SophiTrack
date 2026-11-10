import { isAuthApiError, isAuthRetryableFetchError } from '@supabase/supabase-js'

export const SIGN_IN_FAILED = "That email or password didn't work. Try again."
export const SIGN_IN_NO_CONNECTION = "Can't connect right now. Check your signal and try again."
export const SIGN_IN_OTHER = "That didn't work. Wait a minute and try again."
export const SIGN_IN_EMPTY = 'Enter your email and password.'

/** Plain words for a failed sign-in. Never shows the server's own error text. */
export function signInErrorMessage(error: unknown): string {
  if (isAuthRetryableFetchError(error)) {
    // Status 0 is a request that never arrived. A server fault (5xx) also comes as this class.
    return error.status ? SIGN_IN_OTHER : SIGN_IN_NO_CONNECTION
  }
  if (isAuthApiError(error)) {
    // Other 400s (email not confirmed, email sign-in switched off, banned) are not the password.
    if (error.code === 'invalid_credentials' || (!error.code && error.status === 400)) {
      return SIGN_IN_FAILED
    }
    return SIGN_IN_OTHER
  }
  // Anything else at this point is almost always a dropped connection.
  if (error instanceof TypeError) return SIGN_IN_NO_CONNECTION
  return SIGN_IN_OTHER
}

const EMAIL_KEY = 'sophitrack.email'

interface KeyValueStore {
  getItem(key: string): string | null
  setItem(key: string, value: string): void
  removeItem(key: string): void
}

function deviceStore(): KeyValueStore | null {
  try {
    return globalThis.localStorage ?? null
  } catch {
    // Storage can be blocked (private browsing); sign-in still works without it.
    return null
  }
}

/** The email last used to sign in on this device, or ''. Never hard-coded. */
export function rememberedEmail(store: KeyValueStore | null = deviceStore()): string {
  try {
    return store?.getItem(EMAIL_KEY) ?? ''
  } catch {
    return ''
  }
}

export function rememberEmail(email: string, store: KeyValueStore | null = deviceStore()): void {
  try {
    store?.setItem(EMAIL_KEY, email.trim())
  } catch {
    // Not being able to remember the email is not worth an error.
  }
}

const SIGNED_IN_KEY = 'sophitrack.signedIn'

/**
 * The app's own record that this phone has signed in. It is read at once, with no network,
 * so a parent who has signed in never sees a blank page or the sign-in screen while the
 * saved session renews, or when there is no signal. Only "Sign out" clears it.
 */
export interface SignedInMark {
  userId: string
  /** The parent's display name, once it has been looked up. */
  name: string | null
}

export function signedInMark(store: KeyValueStore | null = deviceStore()): SignedInMark | null {
  try {
    const raw = store?.getItem(SIGNED_IN_KEY)
    if (!raw) return null
    const value: unknown = JSON.parse(raw)
    if (typeof value !== 'object' || value === null) return null
    const { userId, name } = value as Record<string, unknown>
    if (typeof userId !== 'string' || !userId) return null
    return { userId, name: typeof name === 'string' ? name : null }
  } catch {
    return null
  }
}

export function rememberSignedIn(
  mark: SignedInMark,
  store: KeyValueStore | null = deviceStore(),
): void {
  try {
    store?.setItem(SIGNED_IN_KEY, JSON.stringify(mark))
  } catch {
    // Without storage the parent signs in again next time; nothing else breaks.
  }
}

export function forgetSignedIn(store: KeyValueStore | null = deviceStore()): void {
  try {
    store?.removeItem(SIGNED_IN_KEY)
  } catch {
    // Nothing to do.
  }
}

/** True when the page was opened from the home-screen icon rather than a browser tab. */
export function isOpenedFromHomeScreen(): boolean {
  const nav = globalThis.navigator as (Navigator & { standalone?: boolean }) | undefined
  if (nav?.standalone === true) return true
  return globalThis.matchMedia?.('(display-mode: standalone)').matches ?? false
}
