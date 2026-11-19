import PropTypes from 'prop-types'

const blogStyle = {
  paddingTop: 10,
  paddingLeft: 2,
  marginRight: '8em',
  border: 'solid',
  borderWidth: 1,
  marginBottom: 5,
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

  return (
    <div style={blogStyle}>
      <div className='blog'>
        <h2>
          {blog.author}: {blog.title}
        </h2>
      </div>
      <div>{blog.url}</div>
      <div>
        likes {blog.likes}{' '}
        {user && (
          <button className='likeButton' onClick={handleLike}>
            like
          </button>
        )}
      </div>
      <div>Added by {blog.user.name}</div>
      {user?.username === blog?.user?.username && (
        <button className='deleteBlogButton' onClick={handleDelete}>
          remove
        </button>
      )}
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
