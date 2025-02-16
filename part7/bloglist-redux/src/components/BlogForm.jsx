import { useState } from 'react'
import PropTypes from 'prop-types'
import { useDispatch } from 'react-redux'
import { addBlog } from '../reducers/blogReducer'

const BlogForm = ({ blogFormRef, user }) => {
  const [title, setTitle] = useState('')
  const [author, setAuthor] = useState('')
  const [url, setUrl] = useState('')
  const dispatch = useDispatch()

  BlogForm.propTypes = {
    blogFormRef: PropTypes.object.isRequired,
    user: PropTypes.object.isRequired,
  }

  const handleSubmitBlog = (event) => {
    event.preventDefault()
    const newBlog = { title, author, url }

    dispatch(addBlog(newBlog, user))

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
