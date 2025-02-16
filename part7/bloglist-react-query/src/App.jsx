import { useState, useRef } from 'react'
import loginService from './services/login'
import LoginForm from './components/LoginForm'
import BlogForm from './components/BlogForm'
import Blogs from './components/Blog'
import Notification from './components/Notification'
import Togglable from './components/Togglable'
import { useNotifyDispatch } from '../NotifyContext'
import { useUser, useUserDispatch } from '../UserContext'

const App = () => {
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const blogFormRef = useRef()

  const dispatch = useNotifyDispatch()
  const setUser = useUserDispatch()

  const user = useUser()

  const handleLogin = async (event) => {
    event.preventDefault()

    try {
      const loginUser = await loginService.login({
        username,
        password,
      })

      window.localStorage.setItem(
        'loggedBlogAppUser',
        JSON.stringify(loginUser)
      )
      setUser(loginUser)
      setUsername('')
      setPassword('')
    } catch (exception) {
      dispatch('Wrong credentials')
    }
  }

  const handleLogout = () => {
    window.localStorage.removeItem('loggedBlogAppUser')
    setUser(null)
    setUsername('')
    setPassword('')
    dispatch(`logged out ${user.name}`)
  }

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
        <BlogForm blogFormRef={blogFormRef} user={user} />
      </Togglable>
      <Blogs />
    </div>
  )
}

export default App
