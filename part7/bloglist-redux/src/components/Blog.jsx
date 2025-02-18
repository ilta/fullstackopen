import { useEffect } from 'react'
import { useSelector, useDispatch } from 'react-redux'
import PropTypes from 'prop-types'
import { initializeBlogs, likeBlog, deleteBlog } from '../reducers/blogReducer'
import { Link } from 'react-router-dom'

const blogStyle = {
  paddingTop: 10,
  paddingLeft: 2,
  marginRight: '8em',
  border: 'solid',
  borderWidth: 1,
  marginBottom: 5,
}

export const Blog = ({ blogMatch }) => {
  Blog.propTypes = {
    blogMatch: PropTypes.object,
  }

  const id = blogMatch.params.id
  const dispatch = useDispatch()

  const blogs = useSelector((state) => state.blogs)
  const blog = blogs.filter((b) => b.id === id)[0]
  const user = useSelector((state) => state.user)

  // If the page is accessed directly, blogs have not been initialized yet
  if (!blog) {
    dispatch(initializeBlogs())
  }

  if (!blog || !user) return null

  const handleLike = () => {
    dispatch(likeBlog(blog))
  }

  const handleDelete = () => {
    if (window.confirm(`Remove blog ${blog.title} by ${blog.author}`)) {
      dispatch(deleteBlog(blog))
    }
  }

  return (
    <>
      <div>
        <h2>
          {blog.title} {blog.author}
        </h2>
      </div>
      <div style={blogStyle}>
        <div>
          <a href={blog.url}>{blog.url}</a>
        </div>
        <div>
          {blog.likes} likes
          <button className="likeButton" onClick={handleLike}>
            like
          </button>
        </div>
        <div>added by {blog.user.name}</div>
        {user.username === blog.user.username && (
          <button className="deleteBlogButton" onClick={handleDelete}>
            remove
          </button>
        )}
        <h3>comments</h3>
        <ul>
          {blog.comments.map((comment) => (
            <li key={comment.id}>{comment.content}</li>
          ))}
        </ul>
      </div>
    </>
  )
}

const BlogLine = ({ blog }) => {
  BlogLine.propTypes = {
    blog: PropTypes.object.isRequired,
  }

  return (
    <div style={blogStyle}>
      <span className="blog">
        <Link to={`/blogs/${blog.id}`}>{blog.title}</Link> {blog.author}
      </span>
    </div>
  )
}

const Blogs = () => {
  const dispatch = useDispatch()

  useEffect(() => {
    dispatch(initializeBlogs())
  }, [dispatch])

  const blogs = useSelector((state) => state.blogs)

  return (
    <>{blogs && blogs.map((blog) => <BlogLine key={blog.id} blog={blog} />)}</>
  )
}

export default Blogs
