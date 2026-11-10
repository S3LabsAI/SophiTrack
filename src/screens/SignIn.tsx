import { useState } from 'react'
import type { FormEvent } from 'react'
import {
  SIGN_IN_EMPTY,
  isOpenedFromHomeScreen,
  rememberEmail,
  rememberedEmail,
  signInErrorMessage,
} from '../data/auth'
import { supabase } from '../data/supabase'
import './SignIn.css'

/**
 * Email and password, one button. No "Forgot password" and no "Create account":
 * Tom creates both accounts and signs in on both phones in person.
 */
export default function SignIn() {
  const [email, setEmail] = useState(rememberedEmail)
  const [password, setPassword] = useState('')
  const [error, setError] = useState<string | null>(null)
  const [busy, setBusy] = useState(false)
  const [fromHomeScreen] = useState(isOpenedFromHomeScreen)

  async function onSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()
    if (busy) return
    const trimmed = email.trim()
    if (!trimmed || !password) {
      setError(SIGN_IN_EMPTY)
      return
    }
    setBusy(true)
    setError(null)
    try {
      const result = await supabase.auth.signInWithPassword({ email: trimmed, password })
      if (result.error) {
        setError(signInErrorMessage(result.error))
        return
      }
      // App swaps this screen out as soon as it hears about the new session.
      rememberEmail(trimmed)
    } catch (caught) {
      setError(signInErrorMessage(caught))
    } finally {
      setBusy(false)
    }
  }

  return (
    <main className="signin">
      <h1 className="signin-brand">
        <picture>
          <source srcSet="/brand/elephant-dark.png" media="(prefers-color-scheme: dark)" />
          <img src="/brand/elephant-light.png" alt="" width={120} height={102} />
        </picture>
        <picture>
          <source srcSet="/brand/wordmark-dark.png" media="(prefers-color-scheme: dark)" />
          <img src="/brand/wordmark-light.png" alt="SophiTrack" width={170} height={33} />
        </picture>
      </h1>

      <form onSubmit={onSubmit} noValidate>
        <div className="input">
          <label htmlFor="signin-email">Email</label>
          <input
            id="signin-email"
            name="username"
            type="email"
            inputMode="email"
            autoComplete="username"
            autoCapitalize="none"
            autoCorrect="off"
            spellCheck={false}
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
        </div>
        <div className="input">
          <label htmlFor="signin-password">Password</label>
          <input
            id="signin-password"
            name="password"
            type="password"
            autoComplete="current-password"
            aria-describedby={error ? 'signin-error' : undefined}
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
          {error && (
            <p className="plain" id="signin-error" role="alert">
              {error}
            </p>
          )}
        </div>
        <button className="btn btn-primary btn-full" type="submit" aria-busy={busy}>
          {busy ? 'Signing in…' : 'Sign in'}
        </button>
      </form>

      {!fromHomeScreen && (
        <p className="plain soft signin-hint">
          Already set up? Open SophiTrack from the elephant icon on your home screen.
        </p>
      )}
    </main>
  )
}
