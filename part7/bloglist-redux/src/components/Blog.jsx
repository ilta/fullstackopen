import { useState, useEffect } from 'react'
import { useSelector, useDispatch } from 'react-redux'
import PropTypes from 'prop-types'
import { initializeBlogs } from '../reducers/blogReducer'

const blogStyle = {
  paddingTop: 10,
  paddingLeft: 2,
  marginRight: '8em',
  border: 'solid',
  borderWidth: 1,
  marginBottom: 5,
}

const Blog = ({ blog, updateLikes, deleteBlog, user }) => {
  const [expandedView, setExpandedView] = useState(false)

  Blog.propTypes = {
    blog: PropTypes.object.isRequired,
    updateLikes: PropTypes.func.isRequired,
    deleteBlog: PropTypes.func.isRequired,
    user: PropTypes.object.isRequired,
  }

  const toggleExpandedView = () => {
    setExpandedView(!expandedView)
  }

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

  if (expandedView) {
    return (
      <div style={blogStyle}>
        <div className="blog">
          {blog.title} {blog.author}
          <button className="expandButton" onClick={toggleExpandedView}>
            hide
          </button>
        </div>
        <div>{blog.url}</div>
        <div>
          likes {blog.likes}{' '}
          <button className="likeButton" onClick={handleLike}>
            like
          </button>
        </div>
        <div>{blog.user.name}</div>
        {user.username === blog.user.username && (
          <button className="deleteBlogButton" onClick={handleDelete}>
            remove
          </button>
        )}
      </div>
    )
  }

  return (
    <div style={blogStyle}>
      <span className="blog">
        {blog.title} {blog.author}
      </span>
      <button className="expandButton" onClick={toggleExpandedView}>
        view
      </button>
    </div>
  )
}

const Blogs = ({ updateLikes, deleteBlog, user }) => {
  Blogs.propTypes = {
    updateLikes: PropTypes.func.isRequired,
    deleteBlog: PropTypes.func.isRequired,
    user: PropTypes.object.isRequired,
  }

  const dispatch = useDispatch()

  useEffect(() => {
    dispatch(initializeBlogs())
  }, [dispatch])

  const blogs = useSelector((state) => state.blogs)

  return (
    <>
      {blogs &&
        blogs.map((blog) => (
          <Blog
            key={blog.id}
            blog={blog}
            updateLikes={updateLikes}
            deleteBlog={deleteBlog}
            user={user}
          />
        ))}
    </>
  )
}

export default Blogs
