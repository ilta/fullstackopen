import { useState, useEffect, useRef } from 'react'
import LoginForm from './components/LoginForm'
import BlogForm from './components/BlogForm'
import Blogs from './components/Blog'
import Notification from './components/Notification'
import Togglable from './components/Togglable'
import Users, { User } from './components/Users'
import { useDispatch, useSelector } from 'react-redux'
import { setNotification } from './reducers/notificationReducer'
import { login, logout, setUser } from './reducers/loginReducer'
import { Route, Routes, useMatch } from 'react-router-dom'

const App = () => {
  // const [blogs, setBlogs] = useState([])
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

  const userMatch = useMatch('/users/:id')

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
      <Notification />
      <h2>blogs</h2>
      <p>
        {user.name} is logged in
        <button onClick={handleLogout}>logout</button>
      </p>
      <Routes>
        <Route
          path="/"
          element={
            <>
              <Togglable buttonLabel="new blog" ref={blogFormRef}>
                <BlogForm blogFormRef={blogFormRef} user={user} />
              </Togglable>
              <Blogs user={user} />
            </>
          }
        />
        <Route path="/users" element={<Users />} />
        <Route path="/users/:id" element={<User userMatch={userMatch} />} />
      </Routes>
    </div>
  )
}

export default App
