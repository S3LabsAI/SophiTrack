import { AuthApiError, AuthRetryableFetchError, AuthUnknownError } from '@supabase/supabase-js'
import { describe, expect, it } from 'vitest'
import {
  SIGN_IN_FAILED,
  SIGN_IN_NO_CONNECTION,
  SIGN_IN_OTHER,
  forgetSignedIn,
  rememberEmail,
  rememberSignedIn,
  rememberedEmail,
  signInErrorMessage,
  signedInMark,
} from './auth'

describe('sign-in error wording', () => {
  it('a wrong email or password uses the words from the brief', () => {
    const error = new AuthApiError('Invalid login credentials', 400, 'invalid_credentials')
    expect(signInErrorMessage(error)).toBe("That email or password didn't work. Try again.")
    expect(signInErrorMessage(error)).toBe(SIGN_IN_FAILED)
  })

  it('no signal is not blamed on the password', () => {
    expect(signInErrorMessage(new AuthRetryableFetchError('Load failed', 0))).toBe(
      SIGN_IN_NO_CONNECTION,
    )
    expect(signInErrorMessage(new TypeError('Load failed'))).toBe(SIGN_IN_NO_CONNECTION)
  })

  it('too many tries or a server fault asks to wait, in plain words', () => {
    expect(signInErrorMessage(new AuthApiError('Rate limit', 429, 'over_request_rate_limit'))).toBe(
      SIGN_IN_OTHER,
    )
    // auth-js reports a 5xx as a retryable fetch error with the status set.
    expect(signInErrorMessage(new AuthRetryableFetchError('oops', 500))).toBe(SIGN_IN_OTHER)
    expect(signInErrorMessage(new AuthUnknownError('???', null))).toBe(SIGN_IN_OTHER)
  })

  it('other refusals are not blamed on the password', () => {
    expect(
      signInErrorMessage(new AuthApiError('Email not confirmed', 400, 'email_not_confirmed')),
    ).toBe(SIGN_IN_OTHER)
    expect(
      signInErrorMessage(
        new AuthApiError('Email logins are disabled', 400, 'email_provider_disabled'),
      ),
    ).toBe(SIGN_IN_OTHER)
    // An older server sends a wrong password as a bare 400 with no code.
    expect(signInErrorMessage(new AuthApiError('Invalid login credentials', 400, undefined))).toBe(
      SIGN_IN_FAILED,
    )
  })

  it("never passes the server's own text through", () => {
    const raw = 'Invalid login credentials'
    for (const error of [
      new AuthApiError(raw, 400, 'invalid_credentials'),
      new AuthApiError(raw, 500, 'unexpected_failure'),
      new Error(raw),
    ]) {
      expect(signInErrorMessage(error)).not.toContain(raw)
    }
  })
})

describe('remembered email', () => {
  function memoryStore() {
    const map = new Map<string, string>()
    return {
      getItem: (k: string) => map.get(k) ?? null,
      setItem: (k: string, v: string) => void map.set(k, v),
      removeItem: (k: string) => void map.delete(k),
    }
  }
  const blocked = {
    getItem: () => {
      throw new Error('blocked')
    },
    setItem: () => {
      throw new Error('blocked')
    },
    removeItem: () => {
      throw new Error('blocked')
    },
  }

  it('is empty on a new device', () => {
    expect(rememberedEmail(memoryStore())).toBe('')
    expect(rememberedEmail(null)).toBe('')
  })

  it('comes back after a sign-in, trimmed', () => {
    const store = memoryStore()
    rememberEmail('  parent@example.com ', store)
    expect(rememberedEmail(store)).toBe('parent@example.com')
  })

  it('does not throw when storage is blocked', () => {
    expect(() => rememberEmail('parent@example.com', blocked)).not.toThrow()
    expect(rememberedEmail(blocked)).toBe('')
  })
})

describe('the "this phone has signed in" mark', () => {
  function memoryStore() {
    const map = new Map<string, string>()
    return {
      getItem: (k: string) => map.get(k) ?? null,
      setItem: (k: string, v: string) => void map.set(k, v),
      removeItem: (k: string) => void map.delete(k),
    }
  }

  it('is missing on a new device', () => {
    expect(signedInMark(memoryStore())).toBeNull()
    expect(signedInMark(null)).toBeNull()
  })

  it('comes back after a sign-in, with or without a name', () => {
    const store = memoryStore()
    rememberSignedIn({ userId: 'u1', name: null }, store)
    expect(signedInMark(store)).toEqual({ userId: 'u1', name: null })
    rememberSignedIn({ userId: 'u1', name: 'Heidi' }, store)
    expect(signedInMark(store)).toEqual({ userId: 'u1', name: 'Heidi' })
  })

  it('goes away only when forgotten', () => {
    const store = memoryStore()
    rememberSignedIn({ userId: 'u1', name: 'Tom' }, store)
    forgetSignedIn(store)
    expect(signedInMark(store)).toBeNull()
  })

  it('ignores a damaged value', () => {
    for (const raw of ['not json', '"text"', '{}', '{"userId":""}', 'null']) {
      const store = memoryStore()
      store.setItem('sophitrack.signedIn', raw)
      expect(signedInMark(store)).toBeNull()
    }
  })

  it('does not throw when storage is blocked', () => {
    const blocked = {
      getItem: () => {
        throw new Error('blocked')
      },
      setItem: () => {
        throw new Error('blocked')
      },
      removeItem: () => {
        throw new Error('blocked')
      },
    }
    expect(signedInMark(blocked)).toBeNull()
    expect(() => rememberSignedIn({ userId: 'u1', name: null }, blocked)).not.toThrow()
    expect(() => forgetSignedIn(blocked)).not.toThrow()
  })
})
