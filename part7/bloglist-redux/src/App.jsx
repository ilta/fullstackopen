import { useState, useEffect, useRef } from 'react'
import LoginForm from './components/LoginForm'
import BlogForm from './components/BlogForm'
import Blogs, { Blog } from './components/Blog'
import Notification from './components/Notification'
import Togglable from './components/Togglable'
import Users, { User } from './components/Users'
import { useDispatch, useSelector } from 'react-redux'
import { setNotification } from './reducers/notificationReducer'
import { login, logout, setUser } from './reducers/loginReducer'
import { Link, Route, Routes, useMatch } from 'react-router-dom'
import { initializeBlogs } from './reducers/blogReducer'
import { Button, H2 } from './components/Elements'

const App = () => {
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const blogFormRef = useRef()
  const dispatch = useDispatch()

  const user = useSelector((state) => state.user)

  const handleLogin = async (event) => {
    event.preventDefault()

    try {
      dispatch(login(username, password))
      dispatch(setUser(user))
      setUsername('')
      setPassword('')
    } catch (exception) {
      dispatch(setNotification('Wrong credentials'))
    }
  }

  const handleLogout = () => {
    dispatch(logout(user.username))
    dispatch(setUser(null))
    setUsername('')
    setPassword('')
    dispatch(setNotification(`logged out ${user.name}`))
  }

  useEffect(() => {
    const loggedUserJSON = window.localStorage.getItem('loggedBlogAppUser')
    if (loggedUserJSON) {
      const user = JSON.parse(loggedUserJSON)
      dispatch(setUser(user))
    }
  }, [dispatch])

  useEffect(() => {
    dispatch(initializeBlogs())
  }, [dispatch])

  const userMatch = useMatch('/users/:id')
  const blogMatch = useMatch('/blogs/:id')

  if (!user) {
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
      <div className="bg-purple-500 rounded-2xl p-1.5 flex gap-3.5 ml-0.5 mr-0.5">
        <Link
          className="hover:bg-amber-700 text-gray-100 ml-1.5 visited:text-amber-300"
          to="/"
        >
          blogs
        </Link>
        <Link
          className="hover:bg-amber-700 text-gray-100 visited:text-amber-300"
          to="/users"
        >
          users
        </Link>
        {/* Spacer between navigation links and logout button */}
        <span className="w-full"></span>
        <Button onClick={handleLogout}>logout</Button>
      </div>
      <Notification />
      <H2>blog app</H2>
      <Routes>
        <Route
          path="/"
          element={
            <>
              <Togglable buttonLabel="new blog" ref={blogFormRef}>
                <BlogForm blogFormRef={blogFormRef} />
              </Togglable>
              <Blogs user={user} />
            </>
          }
        />
        <Route path="/blogs/:id" element={<Blog blogMatch={blogMatch} />} />
        <Route path="/users" element={<Users />} />
        <Route path="/users/:id" element={<User userMatch={userMatch} />} />
      </Routes>
    </div>
  )
}

export default App
