import { useState } from 'react'
import PropTypes from 'prop-types'
import { useDispatch } from 'react-redux'
import { addBlog } from '../reducers/blogReducer'
import { Button, H2, Input } from './Elements'

const BlogForm = ({ blogFormRef }) => {
  const [title, setTitle] = useState('')
  const [author, setAuthor] = useState('')
  const [url, setUrl] = useState('')
  const dispatch = useDispatch()

  BlogForm.propTypes = {
    blogFormRef: PropTypes.object.isRequired,
  }

  const handleSubmitBlog = (event) => {
    event.preventDefault()
    const newBlog = { title, author, url }

    dispatch(addBlog(newBlog))

    blogFormRef.current.toggleVisibility()
    setTitle('')
    setAuthor('')
    setUrl('')
  }

  return (
    <div className="m-2">
      <H2>create new</H2>
      <div className="border rounded-2xl p-2">
        <form onSubmit={handleSubmitBlog}>
          <div className="flex flex-row sm:gap-3 m-1">
            <span className="w-20">title</span>
            <Input
              className="w-120"
              data-testid="title"
              type="text"
              value={title}
              name="title"
              onChange={({ target }) => setTitle(target.value)}
              placeholder="write title here"
            />
          </div>
          <div className="flex flex-row sm:gap-3 m-1">
            <span className="w-20">author</span>
            <Input
              className="w-120"
              data-testid="author"
              type="text"
              value={author}
              name="author"
              onChange={({ target }) => setAuthor(target.value)}
              placeholder="write author here"
            />
          </div>
          <div className="flex flex-row sm:gap-3 m-1">
            <span className="w-20">url</span>
            <Input
              className="w-120"
              data-testid="url"
              type="text"
              value={url}
              name="url"
              onChange={({ target }) => setUrl(target.value)}
              placeholder="https://... or http://..."
            />
          </div>
          <Button type="submit">create</Button>
        </form>
      </div>
    </div>
  )
}

export default BlogForm
