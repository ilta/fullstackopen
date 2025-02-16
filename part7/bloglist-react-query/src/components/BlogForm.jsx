import { useState } from 'react'
import PropTypes from 'prop-types'
import blogService from '../services/blogs'
import { useNotifyDispatch } from '../../NotifyContext'
import { useMutation, useQueryClient } from '@tanstack/react-query'

const BlogForm = ({ blogFormRef, user }) => {
  const [title, setTitle] = useState('')
  const [author, setAuthor] = useState('')
  const [url, setUrl] = useState('')

  const queryClient = useQueryClient()

  const newBlogMutation = useMutation({
    mutationFn: blogService.create,
    onSuccess: (newBlog) => {
      const blogs = queryClient.getQueryData(['blogs'])
      // Add user to the post to enable deleting the post without app reload
      newBlog = {
        ...newBlog,
        user: { id: newBlog.user, username: user.username },
      }
      queryClient.setQueryData(['blogs'], blogs.concat(newBlog))

      dispatch(`a new blog ${newBlog.title} by ${newBlog.author} added`)
    },
    onError: (data) => {
      dispatch(data.response.data.error)
    },
  })

  const dispatch = useNotifyDispatch()

  BlogForm.propTypes = {
    blogFormRef: PropTypes.object.isRequired,
    user: PropTypes.object.isRequired,
  }

  const handleSubmitBlog = (event) => {
    event.preventDefault()
    const newBlog = { title, author, url }
    newBlogMutation.mutate(newBlog)

    blogFormRef.current.toggleVisibility()
    setTitle('')
    setAuthor('')
    setUrl('')
  }

  return (
    <div>
      <h2>create new</h2>
      <form onSubmit={handleSubmitBlog}>
        <div>
          title
          <input
            data-testid="title"
            type="text"
            value={title}
            name="title"
            onChange={({ target }) => setTitle(target.value)}
            placeholder="write title here"
          />
        </div>
        <div>
          author
          <input
            data-testid="author"
            type="text"
            value={author}
            name="author"
            onChange={({ target }) => setAuthor(target.value)}
            placeholder="write author here"
          />
        </div>
        <div>
          url
          <input
            data-testid="url"
            type="text"
            value={url}
            name="url"
            onChange={({ target }) => setUrl(target.value)}
            placeholder="https://... or http://..."
          />
        </div>
        <button type="submit">create</button>
      </form>
    </div>
  )
}

export default BlogForm
