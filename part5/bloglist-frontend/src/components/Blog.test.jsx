import { render, screen } from '@testing-library/react'
import Blog from './Blog'
import userEvent from '@testing-library/user-event'

describe('<Blog />', () => {
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
  const updateLikes = vi.fn()
  const deleteBlog = vi.fn()

  describe('when the user is not authenticated', () => {
    test('blog information and the number of likes are shown', () => {
      render(
        <Blog blog={blog} updateLikes={updateLikes} deleteBlog={deleteBlog} />,
      )

      const element = screen.getByText('Go To Statement Considered Harmful', {
        exact: false,
      })
      expect(element).toBeDefined()

      const url = screen.queryByText(
        'http://www.u.arizona.edu/~rubinson/copyright_violations/Go_To_Considered_Harmful.html',
      )
      expect(url).toBeDefined()

      const likes = screen.queryByText('likes 7')
      expect(likes).toBeDefined()
    })

    test('buttons are not showed', () => {
      const { container } = render(
        <Blog blog={blog} updateLikes={updateLikes} deleteBlog={deleteBlog} />,
      )

      const likeButton = container.querySelector('.likeButton')
      expect(likeButton).toBeNull()

      const deleteButton = container.querySelector('.deleteBlogButton')
      expect(deleteButton).toBeNull()
    })
  })

  describe('when the user is authenticated', () => {
    test('user who is not the blog creator is shown only the like button', () => {
      const tempUser = {
        username: 'tim',
        name: 'Tim Player',
      }

      const { container } = render(
        <Blog
          blog={blog}
          updateLikes={updateLikes}
          deleteBlog={deleteBlog}
          user={tempUser}
        />,
      )

      const likeButton = container.querySelector('.likeButton')
      expect(likeButton).toBeDefined()

      const deleteButton = container.querySelector('.deleteBlogButton')
      expect(deleteButton).toBeNull()
    })

    test('the creator is shown the delete button', () => {
      const { container } = render(
        <Blog
          blog={blog}
          updateLikes={updateLikes}
          deleteBlog={deleteBlog}
          user={blog.user}
        />,
      )

      const button = container.querySelector('.deleteBlogButton')
      expect(button).toBeDefined()
    })
  })

  test('if like button is clicked twice, the event handler is called twice', async () => {
    const user = userEvent.setup()

    const { container } = render(
      <Blog
        blog={blog}
        updateLikes={updateLikes}
        deleteBlog={deleteBlog}
        user={blog.user}
      />,
    )

    const expandButton = container.querySelector('.expandButton')
    await user.click(expandButton)

    const likeButton = container.querySelector('.likeButton')
    await user.click(likeButton)
    await user.click(likeButton)
    expect(updateLikes.mock.calls).toHaveLength(2)
  })
})
