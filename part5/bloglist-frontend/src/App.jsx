import { useState, useEffect, useRef } from 'react'
import blogService from './services/blogs'
import loginService from './services/login'
import LoginForm from './components/LoginForm'
import BlogForm from './components/BlogForm'
import Blog from './components/Blog'
import Notification from './components/Notification'
import Togglable from './components/Togglable'
import { Routes, Route, Link, useNavigate, useMatch } from 'react-router-dom'
import BlogList from './components/BlogList'

const App = () => {
  const [blogs, setBlogs] = useState([])
  const [notifyMessage, setNotifyMessage] = useState(null)
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const [user, setUser] = useState(() => {
    const userValue = window.localStorage.getItem('loggedBlogAppUser')

    return userValue ? JSON.parse(userValue) : null
  })
  const blogFormRef = useRef()
  const navigate = useNavigate()

  const notify = (message) => {
    setNotifyMessage(message)
    setTimeout(() => {
      setNotifyMessage(null)
    }, 5000)
  }

  const handleLogin = async (event) => {
    event.preventDefault()

    try {
      const userResponse = await loginService.login({
        username,
        password,
      })

      setUser(userResponse)
      setUsername('')
      setPassword('')

      navigate('/')
    } catch (exception) {
      notify('Wrong credentials')
    }
  }

  const handleLogout = () => {
    const userName = user.name
    setUser(null)
    setUsername('')
    setPassword('')
    notify(`logged out ${userName}`)
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
        notify(`a new blog ${result.title} by ${result.author} added`)
      })
      .catch((error) => {
        notify(error.response.data.error)
      })
  }

  const updateLikes = (id, blogObject) => {
    blogService
      .update(id, blogObject)
      .then((returnedBlog) => {
        setBlogs(blogs.map((blog) => (blog.id === id ? returnedBlog : blog)))
        notify(`Liked blog ${blogObject.title}`)
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
        notify(`Deleted blog ${title}`)
      })
      .catch((error) => {
        console.log(error)
      })
  }

  useEffect(() => {
    blogService.getAll().then((blogs) => setBlogs(blogs))
  }, [])

  useEffect(() => {
    user?.token
      ? window.localStorage.setItem('loggedBlogAppUser', JSON.stringify(user))
      : window.localStorage.removeItem('loggedBlogAppUser')

    blogService.setToken(user?.token ? user.token : null)
  }, [user])

  const blogMatch = useMatch('/blogs/:id')
  const blog = blogMatch
    ? blogs
        .sort((a, b) => b.likes - a.likes)
        .find((blog) => blog.id === blogMatch.params.id)
    : blogs

  const padding = {
    padding: 5,
  }

  return (
    <div>
      <Notification message={notifyMessage} />
      <Link style={padding} to='/'>
        blogs
      </Link>
      {!user ? (
        <Link style={padding} to='/login'>
          login
        </Link>
      ) : (
        <button onClick={handleLogout}>logout</button>
      )}
      <Routes>
        <Route
          path='/login'
          element={
            <LoginForm
              handleLogin={handleLogin}
              username={username}
              setUsername={setUsername}
              password={password}
              setPassword={setPassword}
            />
          }
        />
        <Route
          path='/blogs/:id'
          element={
            <Blog
              blog={blog}
              updateLikes={updateLikes}
              deleteBlog={deleteBlog}
              user={user}
            />
          }
        />
        <Route
          path='/'
          element={
            <>
              <BlogList blogs={blogs} />
              {user && (
                <Togglable buttonLabel='new blog' ref={blogFormRef}>
                  <BlogForm
                    blogs={blogs}
                    setBlogs={setBlogs}
                    notify={notify}
                    blogFormRef={blogFormRef}
                    createBlog={createBlog}
                  />
                </Togglable>
              )}
            </>
          }
        />
      </Routes>
    </div>
  )
}

export default App
