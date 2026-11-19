import { useState } from 'react'
import PropTypes from 'prop-types'
import { Button, TextField } from '@mui/material'

const BlogForm = ({ createBlog }) => {
  const [title, setTitle] = useState('')
  const [author, setAuthor] = useState('')
  const [url, setUrl] = useState('')

  const handleSubmitBlog = (event) => {
    event.preventDefault()
    const newBlog = { title, author, url }

    createBlog(newBlog)

    setTitle('')
    setAuthor('')
    setUrl('')
  }

  return (
    <div>
      <h2>create new</h2>
      <form onSubmit={handleSubmitBlog}>
        <div>
          <TextField
            label='title'
            data-testid='title'
            type='text'
            value={title}
            name='title'
            onChange={({ target }) => setTitle(target.value)}
            placeholder='write title here'
          />
        </div>
        <div>
          <TextField
            label='author'
            style={{ marginTop: 10 }}
            data-testid='author'
            type='text'
            value={author}
            name='author'
            onChange={({ target }) => setAuthor(target.value)}
            placeholder='write author here'
          />
        </div>
        <div>
          <TextField
            label='url'
            style={{ marginTop: 10 }}
            data-testid='url'
            type='text'
            value={url}
            name='url'
            onChange={({ target }) => setUrl(target.value)}
            placeholder='https://... or http://...'
          />
        </div>
        <Button type='submit' variant='contained' style={{ marginTop: 10 }}>
          create
        </Button>
      </form>
    </div>
  )
}

BlogForm.propTypes = {
  blogFormRef: PropTypes.object.isRequired,
  createBlog: PropTypes.func.isRequired,
}

export default BlogForm
