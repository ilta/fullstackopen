import { useSelector, useDispatch } from 'react-redux'
import PropTypes from 'prop-types'
import { likeBlog, deleteBlog } from '../reducers/blogReducer'
import { Link, useNavigate } from 'react-router-dom'
import CommentForm from './CommentForm'
import { Button } from './Elements'

export const Blog = ({ blogMatch }) => {
  Blog.propTypes = {
    blogMatch: PropTypes.object,
  }

  const id = blogMatch.params.id
  const dispatch = useDispatch()
  const navigate = useNavigate()

  const blogs = useSelector((state) => state.blogs)
  const blog = blogs.filter((b) => b.id === id)[0]
  const user = useSelector((state) => state.user)

  if (!blog || !user) return null

  const handleLike = () => {
    dispatch(likeBlog(blog))
  }

  const handleDelete = () => {
    if (window.confirm(`Remove blog ${blog.title} by ${blog.author}`)) {
      dispatch(deleteBlog(blog))
      navigate('/')
    }
  }

  return (
    <>
      <div className="mx-1">
        <h2>
          <span className="italic">{blog.title}</span> by{' '}
          <span className="font-semibold">{blog.author}</span>
        </h2>
      </div>
      <div className="border rounded-2xl mx-2 p-1">
        <div>
          <a
            className="hover:bg-fuchsia-700 hover:text-gray-100 text-gray-900 visited:text-orange-500"
            href={blog.url}
          >
            {blog.url}
          </a>
        </div>
        <div className="flex">
          <span className="w-48">{blog.likes} likes</span>
          <Button className="likeButton" onClick={handleLike}>
            like
          </Button>
        </div>
        <div>
          added by <span className="italic">{blog.user.name}</span>
        </div>
        {user.username === blog.user.username && (
          <Button className="deleteBlogButton" onClick={handleDelete}>
            remove
          </Button>
        )}
        <div className="ml-1.5">
          <h3 className="mt-2 font-semibold">comments</h3>
          <CommentForm id={blog.id} />
          <ul>
            {blog.comments.map((comment) => (
              <li key={comment.id}>{comment.content}</li>
            ))}
          </ul>
        </div>
      </div>
    </>
  )
}

const BlogLine = ({ blog }) => {
  BlogLine.propTypes = {
    blog: PropTypes.object.isRequired,
  }

  return (
    <tr className="px-1 mb-1.5 mr-4 odd:bg-gray-50 even:bg-amber-200">
      <td className="blog">
        <Link
          className="hover:bg-fuchsia-700 hover:text-gray-100 text-gray-900 ml-1.5 visited:text-orange-500 italic underline"
          to={`/blogs/${blog.id}`}
        >
          {blog.title}
        </Link>{' '}
        by <span className="font-semibold text-gray-700">{blog.author}</span>
      </td>
    </tr>
  )
}

const Blogs = () => {
  const blogs = useSelector((state) => state.blogs)

  return (
    <div className="rounded-2xl m-2 p-2 border bg-amber-200">
      <table className="w-full">
        <tbody>
          {blogs && blogs.map((blog) => <BlogLine key={blog.id} blog={blog} />)}
        </tbody>
      </table>
    </div>
  )
}

export default Blogs
