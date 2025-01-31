const { test, expect, beforeEach, describe } = require('@playwright/test')
const { loginWith, createBlog } = require('./helper')

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

    describe('and some blogs exist', () => {
      beforeEach(async ({ page }) => {
        await createBlog(
          page,
          'React patterns',
          'Michael Chan',
          'https://reactpatterns.com/',
          true
        )
        await createBlog(
          page,
          'Go To Statement Considered Harmful',
          'Edsger W. Dijkstra',
          'http://www.u.arizona.edu/~rubinson/copyright_violations/Go_To_Considered_Harmful.html',
          true
        )
        await createBlog(
          page,
          'Canonical string reduction',
          'Edsger W. Dijkstra',
          'http://www.cs.utexas.edu/~EWD/transcriptions/EWD08xx/EWD808.html',
          true
        )
      })

      test('a blog post can be liked', async ({ page }) => {
        await page
          .locator('div')
          .filter({
            hasText: /^Go To Statement Considered Harmful Edsger W. Dijkstra/,
          })
          .getByRole('button', { name: 'view' })
          .click()
        await page.getByRole('button', { name: 'like' }).click()
        await expect(page.getByText('likes 1')).toBeVisible()
      })

      test('a blog post can be deleted', async ({ page }) => {
        await page
          .locator('div')
          .filter({
            hasText: /^Go To Statement Considered Harmful Edsger W. Dijkstra/,
          })
          .getByRole('button', { name: 'view' })
          .click()
        page.on('dialog', (dialog) => dialog.accept())
        await page.getByRole('button', { name: 'remove' }).click()
        await expect(
          page.getByText(
            'Go To Statement Considered Harmful Edsger W. Dijkstra'
          )
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
        await loginWith(page, 'nottim', 'this password is also too weak')

        await page
          .locator('div')
          .filter({
            hasText: /^Go To Statement Considered Harmful Edsger W. Dijkstra/,
          })
          .getByRole('button', { name: 'view' })
          .click()
        await expect(page.getByText('remove')).not.toBeVisible()
      })

      test('blog posts are sorted per likes, descending order', async ({
        page,
      }) => {
        /* Expand the second blog ("Go To Statements...") by clicking "view".
           Then click "like" and "hide".
           
           => "React patterns" and "Go To Statements..." should switch 
           positions, because the first has 0 likes.
        */
        await page
          .locator('div')
          .filter({
            hasText: /^Go To Statement Considered Harmful Edsger W. Dijkstra/,
          })
          .getByRole('button', { name: 'view' })
          .click()
        await page.getByRole('button', { name: 'like' }).click()
        await page.getByRole('button', { name: 'hide' }).click()

        const blogs = await page.locator('.blog').all()
        const expectedTitleAuthor = [
          'Go To Statement Considered Harmful Edsger W. Dijkstra',
          'React patterns Michael Chan',
          'Canonical string reduction Edsger W. Dijkstra',
        ]
        await expect(blogs[0]).toHaveText(expectedTitleAuthor[0])
        await expect(blogs[1]).toHaveText(expectedTitleAuthor[1])
        await expect(blogs[2]).toHaveText(expectedTitleAuthor[2])
      })
    })
  })
})
