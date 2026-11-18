import { Link } from 'react-router-dom'
import PropTypes from 'prop-types'

const BlogList = ({ blogs }) => {
  if (!blogs) return null

  return (
    <div>
      <h2>blogs</h2>
      <ul>
        {blogs
          .sort((a, b) => b.likes - a.likes)
          .map((blog) => (
            <li key={blog.id}>
              <Link to={`/blogs/${blog.id}`}>{blog.title}</Link>
            </li>
          ))}
      </ul>
    </div>
  )
}

BlogList.propTypes = {
  blogs: PropTypes.object.isRequired,
}

export default BlogList
