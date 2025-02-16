import { useState, useEffect } from 'react'
import { useSelector, useDispatch } from 'react-redux'
import PropTypes from 'prop-types'
import { initializeBlogs, likeBlog, deleteBlog } from '../reducers/blogReducer'

const blogStyle = {
  paddingTop: 10,
  paddingLeft: 2,
  marginRight: '8em',
  border: 'solid',
  borderWidth: 1,
  marginBottom: 5,
}

const Blog = ({ blog, user }) => {
  const [expandedView, setExpandedView] = useState(false)
  const dispatch = useDispatch()

  Blog.propTypes = {
    blog: PropTypes.object.isRequired,
    user: PropTypes.object.isRequired,
  }

  const toggleExpandedView = () => {
    setExpandedView(!expandedView)
  }

  const handleLike = () => {
    dispatch(likeBlog(blog))
  }

  const handleDelete = () => {
    if (window.confirm(`Remove blog ${blog.title} by ${blog.author}`)) {
      dispatch(deleteBlog(blog))
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

const Blogs = ({ user }) => {
  Blogs.propTypes = {
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
        blogs.map((blog) => <Blog key={blog.id} blog={blog} user={user} />)}
    </>
  )
}

export default Blogs
