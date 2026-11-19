const { test, expect, beforeEach, describe } = require('@playwright/test')
const { muiFill, loginWith, createBlog } = require('./helper')

/* Increase timeout: some tests that use muiFill are so slow that they may 
   exceed the default timeout (5 s)
*/
test.describe.configure({ retries: 2, timeout: 10_000 })

describe('Blog app', () => {
  const serverUrl = 'http://localhost:5173'

  beforeEach(async ({ page, request }) => {
    await request.post('/api/testing/reset')
    await request.post('/api/users', {
      data: {
        name: 'Tim Player',
        username: 'tim',
        password: 'this password is too weak',
      },
    })

    await page.goto(`${serverUrl}/login`)
  })

  test('Login form is shown', async ({ page }) => {
    await page.getByRole('button', { name: 'login' }).click()
  })

  describe('Login', () => {
    test('succeeds with correct credentials', async ({ page }) => {
      await loginWith(page, 'tim', 'this password is too weak')
      await expect(page.getByText('logout')).toBeVisible()
    })

    test('fails with wrong credentials', async ({ page }) => {
      await loginWith(page, 'tim', 'wrong password')
      await expect(page.getByText('wrong credentials')).toBeVisible()
      await expect(page.getByText('logout')).not.toBeVisible()
    })
  })

  describe('When logged in', () => {
    beforeEach(async ({ page }) => {
      await page.goto(`${serverUrl}/login`)
      await loginWith(page, 'tim', 'this password is too weak')
      await expect(page.getByRole('button', { name: 'logout' })).toBeVisible()
    })

    test('a new blog can be created', async ({ page }) => {
      await page.goto(`${serverUrl}/create`)
      await muiFill(page, page.getByTestId('title'), 'First class tests')
      await muiFill(page, page.getByTestId('author'), 'Robert C. Martin')
      await muiFill(
        page,
        page.getByTestId('url'),
        'http://blog.cleancoder.com/uncle-bob/2017/05/05/TestDefinitions.html',
      )
      await page.getByRole('button', { name: 'create' }).click()
      // In notification
      await expect(
        page.getByText(
          'a new blog First class tests by Robert C. Martin added',
        ),
      ).toBeVisible()
      // In body
      await expect(
        page.getByRole('link', { name: 'First class tests' }),
      ).toBeVisible()
    })

    describe('and some blogs exist', () => {
      beforeEach(async ({ page }) => {
        await page.goto(`${serverUrl}/create`)
        await createBlog(
          page,
          'React patterns',
          'Michael Chan',
          'https://reactpatterns.com/',
        )

        await page.goto(`${serverUrl}/create`)
        await createBlog(
          page,
          'Go To Statement Considered Harmful',
          'Edsger W. Dijkstra',
          'http://www.u.arizona.edu/~rubinson/copyright_violations/Go_To_Considered_Harmful.html',
        )

        await page.goto(`${serverUrl}/create`)
        await createBlog(
          page,
          'Canonical string reduction',
          'Edsger W. Dijkstra',
          'http://www.cs.utexas.edu/~EWD/transcriptions/EWD08xx/EWD808.html',
        )
      })

      test('a blog post can be liked', async ({ page }) => {
        // Clicks one of the blog links and navigates to a blog details page
        await page
          .getByRole('link', { name: 'Canonical string reduction' })
          .click()
        // Now we can click the like button
        await page.getByRole('button', { name: 'like' }).click()
        await expect(page.getByText('likes 1')).toBeVisible()
      })

      test('a blog post can be deleted', async ({ page }) => {
        await page
          .getByRole('link', { name: 'Canonical string reduction' })
          .click()
        page.on('dialog', (dialog) => dialog.accept())
        await page.getByRole('button', { name: 'remove' }).click()
        await expect(
          page.getByRole('heading', { name: 'Canonical string reduction' }),
        ).not.toBeVisible()
      })

      test('delete button is not shown if user did not add the post', async ({
        page,
        request,
      }) => {
        // Create another user, log out and log back in with the second account
        await request.post('/api/users', {
          data: {
            name: 'Nottim Player',
            username: 'nottim',
            password: 'this password is also too weak',
          },
        })
        await page.getByRole('button', { name: 'logout' }).click()
        await page.goto(`${serverUrl}/login`)
        await loginWith(page, 'nottim', 'this password is also too weak')

        await page
          .getByRole('link', { name: 'Canonical string reduction' })
          .click()
        await expect(page.getByText('remove')).not.toBeVisible()
      })
    })
  })
})
