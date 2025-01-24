import { useState } from 'react'

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

  const toggleExpandedView = () => {
    setExpandedView(!expandedView)
  }

  if (expandedView) {
    return (
      <div style={blogStyle}>
        <div>
          {blog.title} {blog.author}
        </div>
        <div>{blog.url}</div>
        <div>
          likes {blog.likes} <button>like</button>
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
