const muiFill = async (page, locator, value) => {
  /* 
    keyboard.type() is needed because Material UI 8 makes the content
    not editable, see
    https://expertnow.medium.com/mui-8-migration-why-your-playwright-tests-are-failing-and-how-to-fix-them-99a4d279187e
  */
  await locator.click()
  await page.keyboard.type(value)
}

const loginWith = async (page, username, password) => {
  await muiFill(page, page.getByTestId('username'), username)
  await muiFill(page, page.getByTestId('password'), password)

  await page.getByRole('button', { name: 'login' }).click()
}

const createBlog = async (page, title, author, url) => {
  await muiFill(page, page.getByTestId('title'), title)
  await muiFill(page, page.getByTestId('author'), author)
  await muiFill(page, page.getByTestId('url'), url)
  await page.getByRole('button', { name: 'create' }).click()
  // Search in the body (not notify text)
  await page.getByRole('link', { name: title }).waitFor()
}

export { muiFill, loginWith, createBlog }
