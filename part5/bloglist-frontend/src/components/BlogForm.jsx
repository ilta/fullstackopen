import { useState } from 'react'
import blogService from '../services/blogs'
import PropTypes from 'prop-types'

const BlogForm = ({ blogs, setBlogs, notify, blogFormRef }) => {
  const [title, setTitle] = useState('')
  const [author, setAuthor] = useState('')
  const [url, setUrl] = useState('')

  BlogForm.propTypes = {
    blogs: PropTypes.array.isRequired,
    setBlogs: PropTypes.func.isRequired,
    notify: PropTypes.func.isRequired,
    blogFormRef: PropTypes.object.isRequired,
  }

  const handleSubmitBlog = (event) => {
    event.preventDefault()
    const newBlog = { title, author, url }

    blogFormRef.current.toggleVisibility()
    blogService
      .create(newBlog)
      .then((result) => {
        setBlogs(blogs.concat(result))
        setTitle('')
        setAuthor('')
        setUrl('')
        notify(`a new blog ${result.title} by ${result.author} added`)
      })
      .catch((error) => {
        notify(error.response.data.error)
      })
  }

  return (
    <div>
      <h2>create new</h2>
      <form onSubmit={handleSubmitBlog}>
        <div>
          title
          <input
            type="text"
            value={title}
            name="title"
            onChange={({ target }) => setTitle(target.value)}
          />
        </div>
        <div>
          author
          <input
            type="text"
            value={author}
            name="author"
            onChange={({ target }) => setAuthor(target.value)}
          />
        </div>
        <div>
          url
          <input
            type="text"
            value={url}
            name="url"
            onChange={({ target }) => setUrl(target.value)}
          />
        </div>
        <button type="submit">create</button>
      </form>
    </div>
  )
}

export default BlogForm
