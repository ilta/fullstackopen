import { render, screen } from '@testing-library/react'
import Blog from './Blog'
import { describe, expect } from 'vitest'
import userEvent from '@testing-library/user-event'

const blog = {
  id: '6793bbc92544ba38ab50c515',
  title: 'Go To Statement Considered Harmful',
  author: 'Edsger W. Dijkstra',
  url: 'http://www.u.arizona.edu/~rubinson/copyright_violations/Go_To_Considered_Harmful.html',
  likes: 6,
  user: {
    username: 'sheila',
    name: 'Sheila Bucket',
    id: '678ebc091be4523e9b7267d5',
  },
}

describe('<Blog />', () => {
  test('the button label should be "view" and change to "hide" when clicked', async () => {
    const updateLikes = vi.fn()
    const deleteBlog = vi.fn()

    render(
      <Blog
        blog={blog}
        updateLikes={updateLikes}
        deleteBlog={deleteBlog}
        user={blog.user}
      />
    ).container

    let button = screen.getByText('view')
    expect(button).toBeDefined()
  })

  test('the button label should change to "hide" when clicked', async () => {
    const updateLikes = vi.fn()
    const deleteBlog = vi.fn()
    const user = userEvent.setup()

    const container = render(
      <Blog
        blog={blog}
        updateLikes={updateLikes}
        deleteBlog={deleteBlog}
        user={blog.user}
      />
    ).container

    let button = container.querySelector('.expandButton')
    await user.click(button)
    button = screen.getByText('hide')
    expect(button).toBeDefined()
  })

  test('does not render url and likes when the view (expand) button has NOT been clicked', () => {
    const updateLikes = vi.fn()
    const deleteBlog = vi.fn()

    render(
      <Blog
        blog={blog}
        updateLikes={updateLikes}
        deleteBlog={deleteBlog}
        user={blog.user}
      />
    )

    const element = screen.getByText(
      'Go To Statement Considered Harmful Edsger W. Dijkstra'
    )
    expect(element).toBeDefined()

    const url = screen.queryByText(
      'http://www.u.arizona.edu/~rubinson/copyright_violations/Go_To_Considered_Harmful.html'
    )
    expect(url).toBeNull()

    const likes = screen.queryByText('likes 6')
    expect(likes).toBeNull()
  })

  test('renders url and likes when the view button has been clicked', async () => {
    const updateLikes = vi.fn()
    const deleteBlog = vi.fn()
    const user = userEvent.setup()

    const container = render(
      <Blog
        blog={blog}
        updateLikes={updateLikes}
        deleteBlog={deleteBlog}
        user={blog.user}
      />
    ).container

    const button = container.querySelector('.expandButton')
    expect(button).toBeDefined()
    await user.click(button)

    const element = screen.getByText(
      'Go To Statement Considered Harmful Edsger W. Dijkstra'
    )
    expect(element).toBeDefined()

    const url = screen.getByText(
      'http://www.u.arizona.edu/~rubinson/copyright_violations/Go_To_Considered_Harmful.html'
    )
    expect(url).toBeDefined()

    const likes = screen.getByText('likes 6')
    expect(likes).toBeDefined()
  })

  test('does not render url and likes when the hide button has been clicked', async () => {
    const updateLikes = vi.fn()
    const deleteBlog = vi.fn()
    const user = userEvent.setup()

    const container = render(
      <Blog
        blog={blog}
        updateLikes={updateLikes}
        deleteBlog={deleteBlog}
        user={blog.user}
      />
    ).container

    let button = container.querySelector('.expandButton')
    expect(button).toBeDefined()
    await user.click(button)
    button = container.querySelector('.expandButton')
    await user.click(button)
    // Button label should now have changed back to "view"
    button = screen.getByText('view')
    expect(button).toBeDefined()

    const element = screen.getByText(
      'Go To Statement Considered Harmful Edsger W. Dijkstra'
    )
    expect(element).toBeDefined()

    const url = screen.queryByText(
      'http://www.u.arizona.edu/~rubinson/copyright_violations/Go_To_Considered_Harmful.html'
    )
    expect(url).toBeNull()

    const likes = screen.queryByText('likes 6')
    expect(likes).toBeNull()
  })

  test('if like button is clicked twice, the event handler is called twice', async () => {
    const updateLikes = vi.fn()
    const deleteBlog = vi.fn()
    const user = userEvent.setup()

    const container = render(
      <Blog
        blog={blog}
        updateLikes={updateLikes}
        deleteBlog={deleteBlog}
        user={blog.user}
      />
    ).container

    const expandButton = container.querySelector('.expandButton')
    await user.click(expandButton)

    const likeButton = container.querySelector('.likeButton')
    await user.click(likeButton)
    await user.click(likeButton)
    expect(updateLikes.mock.calls).toHaveLength(2)
  })
})
