import { useState, useEffect } from 'react'
import blogService from './services/blogs'
import loginService from './services/login'
import LoginForm from './components/LoginForm'
import BlogForm from './components/BlogForm'
import Blog from './components/Blog'
import Notification from './components/Notification'
import { Routes, Route, Link, useNavigate, useMatch } from 'react-router-dom'
import BlogList from './components/BlogList'
import { Container } from '@mui/material'

const App = () => {
  const [blogs, setBlogs] = useState([])
  const [notifyMessage, setNotifyMessage] = useState(null)
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const [user, setUser] = useState(() => {
    const userValue = window.localStorage.getItem('loggedBlogAppUser')

    return userValue ? JSON.parse(userValue) : null
  })
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

        navigate('/')
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

        navigate('/')
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
    : null

  const padding = {
    padding: 5,
  }

  return (
    <Container>
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
          <>
            <Link style={padding} to='/create'>
              new blog
            </Link>
            <button onClick={handleLogout}>logout</button>
          </>
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
            path='/create'
            element={
              <>
                {user && (
                  <BlogForm
                    blogs={blogs}
                    setBlogs={setBlogs}
                    notify={notify}
                    createBlog={createBlog}
                  />
                )}
              </>
            }
          />
          <Route path='/' element={<BlogList blogs={blogs} />} />
        </Routes>
      </div>
    </Container>
  )
}

export default App
