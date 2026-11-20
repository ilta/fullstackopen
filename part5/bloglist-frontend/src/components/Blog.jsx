import { Button, Link, Typography } from '@mui/material'
import PropTypes from 'prop-types'

const blogStyle = {
  paddingTop: 10,
  paddingBottom: 10,
  paddingLeft: 10,
  marginRight: '8em',
  border: 'outset',
  borderRadius: '1em',
  borderWidth: 0.2,
  marginBottom: 5,
  marginTop: 5,
}

const Blog = ({ blog, updateLikes, deleteBlog, user }) => {
  const handleLike = () => {
    updateLikes(blog.id, {
      ...blog,
      likes: blog.likes + 1,
    })
  }

  const handleDelete = () => {
    if (window.confirm(`Remove blog ${blog.title} by ${blog.author}`)) {
      deleteBlog(blog.id, blog.title)
    }
  }

  if (!blog) return null

  const buttonStyle = {
    '&:hover': { bgcolor: 'rgba(255,255,255,0.3)' },
    marginLeft: '0.5em',
  }

  return (
    <div style={blogStyle}>
      <div className='blog'>
        <Typography style={{ fontSize: 20, fontWeight: 'bold' }}>
          {blog.title}
        </Typography>
        <Typography>by {blog.author}</Typography>
      </div>
      <div style={{ marginTop: '0.5em', marginBottom: '0.5em' }}>
        <Link href={blog.url}>{blog.url}</Link>
      </div>
      <Typography>Added by {blog.user.name}</Typography>
      <div style={{ marginTop: '0.5em' }}>
        {blog.likes} likes
        {user && (
          <Button
            color='primary'
            variant='outlined'
            sx={buttonStyle}
            className='likeButton'
            onClick={handleLike}
          >
            like
          </Button>
        )}
        {user?.username === blog?.user?.username && (
          <Button
            color='warning'
            variant='outlined'
            sx={buttonStyle}
            className='deleteBlogButton'
            onClick={handleDelete}
          >
            remove
          </Button>
        )}
      </div>
    </div>
  )
}

Blog.propTypes = {
  blog: PropTypes.object.isRequired,
  updateLikes: PropTypes.func.isRequired,
  deleteBlog: PropTypes.func.isRequired,
  user: PropTypes.object.isRequired,
}

export default Blog
