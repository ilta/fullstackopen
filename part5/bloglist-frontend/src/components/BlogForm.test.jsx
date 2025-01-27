import { render, screen } from '@testing-library/react'
import BlogForm from './BlogForm'
import { describe, expect } from 'vitest'
import userEvent from '@testing-library/user-event'

describe('<BlogForm />', () => {
  test('event handler should be called once with the right input when the blog is saved', async () => {
    const createBlog = vi.fn()
    const user = userEvent.setup()
    const blogFormRef = { current: { toggleVisibility: vi.fn() } }

    render(<BlogForm blogFormRef={blogFormRef} createBlog={createBlog} />)

    const inputTitle = screen.getByPlaceholderText('write title here')
    await user.type(inputTitle, 'Naming things is hard')
    const inputAuthor = screen.getByPlaceholderText('write author here')
    await user.type(inputAuthor, 'Everyone')
    const inputUrl = screen.getByPlaceholderText('https://... or http://...')
    await user.type(inputUrl, 'https://example.com/')
    const sendButton = screen.getByText('create')
    await user.click(sendButton)

    expect(createBlog.mock.calls).toHaveLength(1)
    const result = createBlog.mock.calls[0][0]
    expect(result.title).toBe('Naming things is hard')
    expect(result.author).toBe('Everyone')
    expect(result.url).toBe('https://example.com/')
  })
})
