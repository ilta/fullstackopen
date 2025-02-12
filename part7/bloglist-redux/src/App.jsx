import { useState, useEffect, useRef } from 'react'
import blogService from './services/blogs'
import loginService from './services/login'
import LoginForm from './components/LoginForm'
import BlogForm from './components/BlogForm'
import Blog from './components/Blog'
import Notification from './components/Notification'
import Togglable from './components/Togglable'
import { useDispatch } from 'react-redux'
import { setNotification } from './reducers/notificationReducer'

const App = () => {
  const [blogs, setBlogs] = useState([])
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const [user, setUser] = useState(null)
  const blogFormRef = useRef()
  const dispatch = useDispatch()

  const handleLogin = async (event) => {
    event.preventDefault()

    try {
      const user = await loginService.login({
        username,
        password,
      })

      window.localStorage.setItem('loggedBlogAppUser', JSON.stringify(user))
      blogService.setToken(user.token)
      setUser(user)
      setUsername('')
      setPassword('')
    } catch (exception) {
      dispatch(setNotification('Wrong credentials'))
    }
  }

  const handleLogout = () => {
    window.localStorage.removeItem('loggedBlogAppUser')
    blogService.setToken(null)
    const userName = user.name
    setUser(null)
    setUsername('')
    setPassword('')
    dispatch(setNotification(`logged out ${userName}`))
  }

  const createBlog = (newBlog) => {
    blogService
      .create(newBlog)
      .then((result) => {
        // Rewrite the returned blog to allow immediate blog deletion
        result = {
          ...result,
          user: { id: result.user, username: user.username },
        }
        setBlogs(blogs.concat(result))
        dispatch(
          setNotification(
            `a new blog ${result.title} by ${result.author} added`
          )
        )
      })
      .catch((error) => {
        dispatch(setNotification(error.response.data.error))
      })
  }

  const updateLikes = (id, blogObject) => {
    blogService
      .update(id, blogObject)
      .then((returnedBlog) => {
        setBlogs(blogs.map((blog) => (blog.id === id ? returnedBlog : blog)))
        dispatch(setNotification(`Liked blog ${blogObject.title}`))
      })
      .catch((error) => {
        console.error(error.response.data.error)
      })
  }

  const deleteBlog = (id, title) => {
    blogService
      .deletePost(id)
      .then(() => {
        setBlogs(blogs.filter((blog) => blog.id !== id))
        dispatch(setNotification(`Deleted blog ${title}`))
      })
      .catch((error) => {
        console.log(error)
      })
  }

  useEffect(() => {
    blogService.getAll().then((blogs) => setBlogs(blogs))
  }, [])

  useEffect(() => {
    const loggedUserJSON = window.localStorage.getItem('loggedBlogAppUser')
    if (loggedUserJSON) {
      const user = JSON.parse(loggedUserJSON)
      setUser(user)
      blogService.setToken(user.token)
    }
  }, [])

  if (user === null) {
    return (
      <div>
        <Notification />
        <LoginForm
          handleLogin={handleLogin}
          username={username}
          setUsername={setUsername}
          password={password}
          setPassword={setPassword}
        />
      </div>
    )
  }

  return (
    <div>
      <Notification />
      <h2>blogs</h2>
      <p>
        {user.name} is logged in
        <button onClick={handleLogout}>logout</button>
      </p>
      <Togglable buttonLabel="new blog" ref={blogFormRef}>
        <BlogForm blogFormRef={blogFormRef} createBlog={createBlog} />
      </Togglable>
      {blogs
        .sort((a, b) => b.likes - a.likes)
        .map((blog) => (
          <Blog
            key={blog.id}
            blog={blog}
            updateLikes={updateLikes}
            deleteBlog={deleteBlog}
            user={user}
          />
        ))}
    </div>
  )
}

export default App
