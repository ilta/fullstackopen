import { useState } from 'react'
import PropTypes from 'prop-types'
import { useQuery, useQueryClient, useMutation } from '@tanstack/react-query'
import blogService from '../services/blogs'
import { useNotifyDispatch } from '../../NotifyContext'
import { useUser } from '../../UserContext'

const blogStyle = {
  paddingTop: 10,
  paddingLeft: 2,
  marginRight: '8em',
  border: 'solid',
  borderWidth: 1,
  marginBottom: 5,
}

const Blog = ({ blog }) => {
  const [expandedView, setExpandedView] = useState(false)

  const dispatch = useNotifyDispatch()
  const queryClient = useQueryClient()
  const user = useUser()

  Blog.propTypes = {
    blog: PropTypes.object.isRequired,
  }

  const likeBlogMutation = useMutation({
    // Note the unusual syntax is due to useMutation() only taking one argument
    // for variables
    mutationFn: ({ id, blogObject }) => blogService.update(id, blogObject),
    onSuccess: (updatedBlog) => {
      queryClient.invalidateQueries(['blogs'])
      dispatch(`Liked blog ${updatedBlog.title}`)
    },
    onError: (data) => {
      dispatch(data.response.data.error)
    },
  })

  const deleteBlogMutation = useMutation({
    mutationFn: blogService.deletePost,
    onSuccess: () => {
      queryClient.invalidateQueries(['blogs'])
      dispatch(`Deleted blog ${blog.title}`)
    },
    onError: (data) => {
      dispatch(data.response.data.error)
    },
  })

  const toggleExpandedView = () => {
    setExpandedView(!expandedView)
  }

  const handleLike = () => {
    likeBlogMutation.mutate({
      id: blog.id,
      blogObject: {
        ...blog,
        likes: blog.likes + 1,
      },
    })
  }

  const handleDelete = () => {
    if (window.confirm(`Remove blog ${blog.title} by ${blog.author}`)) {
      deleteBlogMutation.mutate(blog.id)
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

const Blogs = () => {
  const { data, isLoading, isError } = useQuery({
    queryKey: ['blogs'],
    queryFn: blogService.getAll,
  })

  if (isLoading) return <div>loading...</div>

  if (isError)
    return <div>blog service not available due to problems in server</div>

  const blogs = data

  return (
    <div>
      {blogs
        .sort((a, b) => b.likes - a.likes)
        .map((blog) => (
          <Blog key={blog.id} blog={blog} />
        ))}
    </div>
  )
}

export default Blogs
