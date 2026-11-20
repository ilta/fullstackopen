import { useState, useEffect } from 'react'
import blogService from './services/blogs'
import loginService from './services/login'
import LoginForm from './components/LoginForm'
import BlogForm from './components/BlogForm'
import Blog from './components/Blog'
import Notification from './components/Notification'
import { Routes, Route, Link, useNavigate, useMatch } from 'react-router-dom'
import BlogList from './components/BlogList'
import {
  AppBar,
  Box,
  Button,
  Container,
  Toolbar,
  Typography,
} from '@mui/material'

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
      notify({ text: `logged in ${userResponse?.name}`, type: 'success' })
      setUsername('')
      setPassword('')

      navigate('/')
    } catch (exception) {
      notify({ text: 'Wrong credentials', type: 'error' })
    }
  }

  const handleLogout = () => {
    const userName = user.name
    setUser(null)
    setUsername('')
    setPassword('')
    notify({ text: `logged out ${userName}`, type: 'success' })
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
        notify({
          text: `a new blog ${result.title} by ${result.author} added`,
          type: 'success',
        })

        navigate('/')
      })
      .catch((error) => {
        notify({ text: error.response.data.error, type: 'error' })
      })
  }

  const updateLikes = (id, blogObject) => {
    blogService
      .update(id, blogObject)
      .then((returnedBlog) => {
        setBlogs(blogs.map((blog) => (blog.id === id ? returnedBlog : blog)))
        notify({ text: `Liked blog ${blogObject.title}`, type: 'success' })
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
        notify({ text: `Deleted blog ${title}`, type: 'error' })

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

  const style = { '&:hover': { bgcolor: 'rgba(255,255,255,0.3)' } }

  return (
    <Container>
      <Box>
        <Box>
          <AppBar position='static'>
            <Toolbar>
              <Typography style={{ fontSize: '1.5em' }}>Blog app</Typography>
              <section style={{ marginLeft: 'auto' }}>
                <Button color='inherit' sx={style} component={Link} to='/'>
                  blogs
                </Button>
                {!user ? (
                  <Button
                    color='inherit'
                    sx={style}
                    component={Link}
                    to='/login'
                  >
                    login
                  </Button>
                ) : (
                  <>
                    <Button
                      color='inherit'
                      sx={style}
                      component={Link}
                      to='/create'
                    >
                      new blog
                    </Button>
                    <Button color='inherit' sx={style} onClick={handleLogout}>
                      logout
                    </Button>
                  </>
                )}
              </section>
            </Toolbar>
          </AppBar>
          <Notification message={notifyMessage} />
        </Box>
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
      </Box>
    </Container>
  )
}

export default App
