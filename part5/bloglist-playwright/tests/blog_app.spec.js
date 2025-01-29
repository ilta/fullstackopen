const { test, expect, beforeEach, describe } = require('@playwright/test')
const { loginWith } = require('./helper')

describe('Blog app', () => {
  beforeEach(async ({ page, request }) => {
    await request.post('/api/testing/reset')
    await request.post('/api/users', {
      data: {
        name: 'Tim Player',
        username: 'tim',
        password: 'this password is too weak',
      },
    })

    await page.goto('/')
  })

  test('Login form is shown', async ({ page }) => {
    await page.getByRole('button', { name: 'login' }).click()
  })

  describe('Login', () => {
    test('succeeds with correct credentials', async ({ page }) => {
      await loginWith(page, 'tim', 'this password is too weak')
      await expect(page.getByText('Tim Player is logged in')).toBeVisible()
    })

    test('fails with wrong credentials', async ({ page }) => {
      await loginWith(page, 'tim', 'wrong password')
      await expect(page.getByText('wrong credentials')).toBeVisible()
      await expect(page.getByText('Tim Player is logged in')).not.toBeVisible()
    })
  })

  describe('When logged in', () => {
    beforeEach(async ({ page }) => {
      await loginWith(page, 'tim', 'this password is too weak')
    })

    test('a new blog can be created', async ({ page }) => {
      await page.getByRole('button', { name: 'new blog' }).click()
      await page.getByTestId('title').fill('First class tests')
      await page.getByTestId('author').fill('Robert C. Martin')
      await page
        .getByTestId('url')
        .fill(
          'http://blog.cleancoder.com/uncle-bob/2017/05/05/TestDefinitions.html'
        )
      await page.getByRole('button', { name: 'create' }).click()
      // In notification
      await expect(
        page.getByText('a new blog First class tests by Robert C. Martin added')
      ).toBeVisible()
      // In body
      await expect(
        page.getByText('First class tests Robert C. Martin')
      ).toBeVisible()
    })
  })
})
