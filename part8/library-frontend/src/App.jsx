import Authors from './components/Authors'
import Books from './components/Books'
import NewBook from './components/NewBook'
import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom'
import Notification from './components/Notification'
import { useEffect, useState } from 'react'
import LoginForm from './components/LoginForm'
import { useApolloClient, useLazyQuery } from '@apollo/client'
import { ME } from './queries'

const App = () => {
  const [errorMessage, setErrorMessage] = useState(null)
  const [token, setToken] = useState(null)
  const [favoriteGenre, setFavoriteGenre] = useState(null)
  const client = useApolloClient()
  const [getMe, { data }] = useLazyQuery(ME)

  const setError = (error) => {
    const titleErrorMessage =
      error.graphQLErrors[0]?.extensions?.error?.errors?.title?.message
    const authorNameErrorMessage =
      error.graphQLErrors[0]?.extensions?.error?.errors?.name?.message
    const authorBornErrorMessage =
      error.graphQLErrors[0]?.extensions?.error?.errors?.born?.message

    if (titleErrorMessage) {
      notify(titleErrorMessage)
    } else if (authorNameErrorMessage) {
      notify(authorNameErrorMessage)
    } else if (authorBornErrorMessage) {
      notify(authorBornErrorMessage)
    } else {
      const messages = error.graphQLErrors.map((e) => e.message).join('\n')
      notify(messages)
    }
  }

  const notify = (message) => {
    setErrorMessage(message)
    setTimeout(() => {
      setErrorMessage(null)
    }, 10000)
  }

  useEffect(() => {
    const storedToken = window.localStorage.getItem('library-user-token')
    if (storedToken) {
      setToken(storedToken)
      getMe()
    }
  }, [setToken, getMe])

  useEffect(() => {
    if (token && data?.me?.favoriteGenre)
      setFavoriteGenre(data.me.favoriteGenre)
  }, [token, data])

  const logout = () => {
    setToken(null)
    localStorage.clear()
    client.resetStore()
  }

  if (!token) {
    return (
      <div>
        <Notification errorMessage={errorMessage} />
        <LoginForm setToken={setToken} setError={setError} />
      </div>
    )
  }

  return (
    <Router>
      <div>
        <div>
          <Link style={{ padding: 5 }} to="/authors">
            authors
          </Link>
          <Link style={{ padding: 5 }} to="/books">
            books
          </Link>
          <Link style={{ padding: 5 }} to="/add">
            add book
          </Link>
          <Link style={{ padding: 5 }} to="/recommended">
            recommended
          </Link>
          <button onClick={logout}>logout</button>
        </div>
        <Notification errorMessage={errorMessage} />

        <Routes>
          <Route path="/authors" element={<Authors setError={setError} />} />
          <Route path="/books" element={<Books />} />
          <Route
            path="/recommended"
            element={<Books favoriteGenre={favoriteGenre} />}
          />
          <Route path="/add" element={<NewBook setError={setError} />} />
          <Route path="/" element={<></>} />
        </Routes>
      </div>
    </Router>
  )
}

export default App
