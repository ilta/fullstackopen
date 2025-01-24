import { useState } from 'react'
import blogService from '../services/blogs'

const BlogForm = ({ blogs, setBlogs, setErrorMessage, blogFormRef }) => {
  const [title, setTitle] = useState('')
  const [author, setAuthor] = useState('')
  const [url, setUrl] = useState('')

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
        setErrorMessage(`a new blog ${result.title} by ${result.author} added`)
        setTimeout(() => {
          setErrorMessage(null)
        }, 5000)
      })
      .catch((error) => {
        setErrorMessage(error.response.data.error)
        setTimeout(() => {
          setErrorMessage(null)
        }, 5000)
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
