import { useState } from 'react'

const blogStyle = {
  paddingTop: 10,
  paddingLeft: 2,
  marginRight: '8em',
  border: 'solid',
  borderWidth: 1,
  marginBottom: 5,
}

const Blog = ({ blog, updateLikes }) => {
  const [expandedView, setExpandedView] = useState(false)

  const toggleExpandedView = () => {
    setExpandedView(!expandedView)
  }

  const handleLike = () => {
    updateLikes(blog.id, {
      ...blog,
      likes: blog.likes + 1,
    })
  }

  if (expandedView) {
    return (
      <div style={blogStyle}>
        <div>
          {blog.title} {blog.author}
        </div>
        <div>{blog.url}</div>
        <div>
          likes {blog.likes}{' '}
          <button name="likeButton" onClick={handleLike}>
            like
          </button>
        </div>
        <div>{blog.user.name}</div>
        <button name="expandButton" onClick={toggleExpandedView}>
          hide
        </button>
      </div>
    )
  }

  return (
    <div style={blogStyle}>
      {blog.title} {blog.author}
      <button name="expandButton" onClick={toggleExpandedView}>
        view
      </button>
    </div>
  )
}

export default Blog
