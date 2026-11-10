import { expect, test } from '@playwright/test'
import type { Page } from '@playwright/test'

// These tests never reach the real Supabase project: every auth and data call is answered here.
const USER_ID = '00000000-0000-4000-8000-000000000001'
const TEST_EMAIL = 'parent@example.com'

async function mockBackend(page: Page, options: { signInWorks: boolean }) {
  await page.route('**/auth/v1/token**', async (route) => {
    if (!options.signInWorks) {
      await route.fulfill({
        status: 400,
        contentType: 'application/json',
        body: JSON.stringify({
          code: 400,
          error_code: 'invalid_credentials',
          msg: 'Invalid login credentials',
        }),
      })
      return
    }
    const now = Math.floor(Date.now() / 1000)
    const payload = Buffer.from(
      JSON.stringify({ sub: USER_ID, role: 'authenticated', exp: now + 3600 }),
    ).toString('base64url')
    await route.fulfill({
      status: 200,
      contentType: 'application/json',
      body: JSON.stringify({
        access_token: `e30.${payload}.test`,
        token_type: 'bearer',
        expires_in: 3600,
        expires_at: now + 3600,
        refresh_token: 'test-refresh-token',
        user: {
          id: USER_ID,
          aud: 'authenticated',
          role: 'authenticated',
          email: TEST_EMAIL,
          app_metadata: {},
          user_metadata: {},
          created_at: '2026-11-10T00:00:00Z',
        },
      }),
    })
  })
  await page.route('**/auth/v1/logout**', (route) => route.fulfill({ status: 204, body: '' }))
  await page.route('**/rest/v1/members**', (route) =>
    route.fulfill({
      status: 200,
      contentType: 'application/json',
      body: JSON.stringify({ display_name: 'Heidi' }),
    }),
  )
}

// Anything that is not the app itself and was not answered by a mock is recorded and stopped here.
// Registered first, so the mocks added later in a test are tried before it.
let strayRequests: string[] = []
test.beforeEach(async ({ page }) => {
  strayRequests = []
  await page.route(
    (url) => url.hostname !== 'localhost',
    (route) => {
      strayRequests.push(`${route.request().method()} ${route.request().url()}`)
      return route.abort()
    },
  )
})

test('opens to the sign-in screen', async ({ page }) => {
  await page.goto('/')
  await expect(page).toHaveTitle('SophiTrack')
  await expect(page.getByRole('heading', { name: 'SophiTrack' })).toBeVisible()

  const email = page.getByLabel('Email')
  const password = page.getByLabel('Password')
  await expect(email).toHaveAttribute('autocomplete', 'username')
  await expect(password).toHaveAttribute('autocomplete', 'current-password')
  await expect(email).toHaveValue('')
  await expect(page.getByRole('button', { name: 'Sign in' })).toBeVisible()

  // No way to make an account or reset a password from the app.
  await expect(page.getByText(/forgot|create account|sign up/i)).toHaveCount(0)
  // In a browser tab, point an already set-up parent at the home-screen icon.
  await expect(
    page.getByText('Already set up? Open SophiTrack from the elephant icon'),
  ).toBeVisible()
})

test('a wrong password shows the plain-words error', async ({ page }) => {
  await mockBackend(page, { signInWorks: false })
  await page.goto('/')
  await page.getByLabel('Email').fill(TEST_EMAIL)
  await page.getByLabel('Password').fill('not-the-password')
  await page.getByRole('button', { name: 'Sign in' }).click()
  await expect(page.getByRole('alert')).toHaveText("That email or password didn't work. Try again.")
  await expect(page.getByText('Invalid login credentials')).toHaveCount(0)
})

test('empty fields ask for both, without calling the server', async ({ page }) => {
  await page.goto('/')
  await page.getByRole('button', { name: 'Sign in' }).click()
  await expect(page.getByRole('alert')).toHaveText('Enter your email and password.')
  expect(strayRequests).toEqual([])
})

test('no home-screen hint when opened from the home screen', async ({ page }) => {
  await page.addInitScript(() => {
    Object.defineProperty(Navigator.prototype, 'standalone', {
      get: () => true,
      configurable: true,
    })
  })
  await page.goto('/')
  await expect(page.getByRole('button', { name: 'Sign in' })).toBeVisible()
  await expect(page.getByText(/Already set up\?/)).toHaveCount(0)
})

test('signs in, stays signed in after a reload, and remembers the email after signing out', async ({
  page,
}) => {
  await mockBackend(page, { signInWorks: true })
  await page.goto('/')
  await page.getByLabel('Email').fill(TEST_EMAIL)
  await page.getByLabel('Password').fill('a-long-test-password')
  await page.getByRole('button', { name: 'Sign in' }).click()
  await expect(page.getByText('Signed in as Heidi')).toBeVisible()

  await page.reload()
  await expect(page.getByText('Signed in as Heidi')).toBeVisible()

  // An hour later the saved session has run out and is renewed on open.
  await expireSavedSession(page)
  await page.reload()
  await expect(page.getByText('Signed in as Heidi')).toBeVisible()

  const logout = page.waitForRequest('**/auth/v1/logout**')
  await page.getByRole('button', { name: 'Sign out' }).click()
  // This phone only: the other parent's phone stays signed in.
  expect(new URL((await logout).url()).searchParams.get('scope')).toBe('local')
  await expect(page.getByLabel('Email')).toHaveValue(TEST_EMAIL)
  await expect(page.getByLabel('Password')).toHaveValue('')
})

async function expireSavedSession(page: Page) {
  await page.evaluate(() => {
    const key = Object.keys(localStorage).find((k) => /^sb-.*-auth-token$/.test(k))
    if (!key) throw new Error('no saved session')
    const saved = JSON.parse(localStorage.getItem(key) ?? '{}')
    saved.expires_at = Math.floor(Date.now() / 1000) - 60
    localStorage.setItem(key, JSON.stringify(saved))
  })
}

async function signIn(page: Page) {
  await mockBackend(page, { signInWorks: true })
  await page.goto('/')
  await page.getByLabel('Email').fill(TEST_EMAIL)
  await page.getByLabel('Password').fill('a-long-test-password')
  await page.getByRole('button', { name: 'Sign in' }).click()
  await expect(page.getByText('Signed in as Heidi')).toBeVisible()
}

test('a signed-in phone with no signal opens straight to the app, never the sign-in screen', async ({
  page,
}) => {
  await signIn(page)
  await expireSavedSession(page)
  await page.route('**/auth/v1/token**', (route) => route.abort('internetdisconnected'))
  await page.route('**/rest/v1/members**', (route) => route.abort('internetdisconnected'))
  await page.reload()
  await expect(page.getByText('Signed in as Heidi')).toBeVisible({ timeout: 1000 })
  await expect(page.getByRole('button', { name: 'Sign in' })).toHaveCount(0)
})

test('a signed-in phone stays in the app when the server turns the session away', async ({
  page,
}) => {
  await signIn(page)
  await expireSavedSession(page)
  await page.route('**/auth/v1/token**', (route) =>
    route.fulfill({
      status: 400,
      contentType: 'application/json',
      body: JSON.stringify({
        code: 400,
        error_code: 'refresh_token_not_found',
        msg: 'Invalid Refresh Token: Refresh Token Not Found',
      }),
    }),
  )
  await page.reload()
  await expect(page.getByText('Signed in as Heidi')).toBeVisible({ timeout: 1000 })
  // Give the refused renewal time to land, then check the screen did not change.
  await page.waitForTimeout(1500)
  await expect(page.getByText('Signed in as Heidi')).toBeVisible()
  await expect(page.getByRole('button', { name: 'Sign in' })).toHaveCount(0)
})
