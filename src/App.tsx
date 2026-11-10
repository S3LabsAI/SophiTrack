import type { Session } from '@supabase/supabase-js'
import { useEffect, useState } from 'react'
import { forgetSignedIn, rememberSignedIn, signedInMark } from './data/auth'
import type { SignedInMark } from './data/auth'
import { supabase } from './data/supabase'
import SignIn from './screens/SignIn'

export default function App() {
  // Read from the phone at once, with no network. Decides which screen to draw.
  const [mark, setMark] = useState<SignedInMark | null>(signedInMark)
  // The live session. undefined: still being read or renewed. null: none.
  const [session, setSession] = useState<Session | null | undefined>(undefined)

  useEffect(() => {
    let active = true
    supabase.auth
      .getSession()
      .then(({ data }) => {
        if (active) setSession(data.session)
      })
      .catch(() => {
        if (active) setSession(null)
      })
    const { data } = supabase.auth.onAuthStateChange((_event, next) => {
      if (!active) return
      setSession(next)
      if (next) {
        // A session with no mark is a fresh sign-in on this phone.
        setMark((current) => {
          if (current?.userId === next.user.id) return current
          const fresh = { userId: next.user.id, name: null }
          rememberSignedIn(fresh)
          return fresh
        })
      }
      // A missing session never clears the mark: only "Sign out" does. A phone that has
      // signed in keeps opening to the app even if the server has turned the session away.
    })
    return () => {
      active = false
      data.subscription.unsubscribe()
    }
  }, [])

  function saveName(name: string) {
    setMark((current) => {
      if (!current || current.name === name) return current
      const next = { ...current, name }
      rememberSignedIn(next)
      return next
    })
  }

  function signOut() {
    forgetSignedIn()
    setMark(null)
    setSession(null)
    // 'local' signs out this phone only, and works with no signal.
    void supabase.auth.signOut({ scope: 'local' })
  }

  if (mark) {
    return <SignedIn mark={mark} session={session ?? null} onName={saveName} onSignOut={signOut} />
  }
  if (session === undefined) return null
  return <SignIn />
}

type Lookup = 'waiting' | 'found' | 'not-linked' | 'failed'

const FULL_HEIGHT = 'calc(100dvh - env(safe-area-inset-top) - env(safe-area-inset-bottom))'

/** Placeholder for M2. Replaced by Today and the tab layout in M4 and M5. */
function SignedIn({
  mark,
  session,
  onName,
  onSignOut,
}: {
  mark: SignedInMark
  session: Session | null
  onName: (name: string) => void
  onSignOut: () => void
}) {
  const [lookup, setLookup] = useState<Lookup>('waiting')
  const userId = session?.user.id

  useEffect(() => {
    if (!userId) return
    let active = true
    supabase
      .from('members')
      .select('display_name')
      .eq('user_id', userId)
      .maybeSingle()
      .then(
        ({ data, error }) => {
          if (!active) return
          if (error) {
            setLookup('failed')
            return
          }
          const name = data?.display_name
          if (name) {
            onName(name)
            setLookup('found')
          } else {
            setLookup('not-linked')
          }
        },
        () => {
          if (active) setLookup('failed')
        },
      )
    return () => {
      active = false
    }
    // onName is stable enough for a placeholder: it only stores the name.
    // oxlint-disable-next-line react-hooks/exhaustive-deps
  }, [userId])

  let line = ' '
  if (mark.name) line = `Signed in as ${mark.name}`
  else if (lookup === 'not-linked')
    line = "You're signed in, but this account isn't linked to Sophie yet."
  else if (lookup === 'failed') line = "You're signed in. Couldn't check this account right now."

  return (
    <main
      style={{
        minHeight: FULL_HEIGHT,
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        gap: 12,
        padding: 16,
        textAlign: 'center',
      }}
    >
      <picture>
        <source srcSet="/brand/elephant-dark.png" media="(prefers-color-scheme: dark)" />
        <img src="/brand/elephant-light.png" alt="" width={180} height={153} />
      </picture>
      <h1 style={{ margin: 0, fontSize: 28 }}>
        <span style={{ color: 'var(--teal)' }}>Sophi</span>
        <span style={{ color: 'var(--text2)' }}>Track</span>
      </h1>
      <p className="plain">{line}</p>
      <p className="plain soft">Setting up · v{__APP_VERSION__}</p>
      <button className="btn btn-quiet" type="button" onClick={onSignOut}>
        Sign out
      </button>
    </main>
  )
}
