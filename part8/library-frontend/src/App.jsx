import Authors from './components/Authors'
import Books, { BookRecommendations } from './components/Books'
import NewBook from './components/NewBook'
import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom'
import Notification from './components/Notification'
import { useEffect, useState } from 'react'
import LoginForm from './components/LoginForm'
import { useApolloClient, useLazyQuery, useSubscription } from '@apollo/client'
import { ALL_BOOKS, BOOK_ADDED, ME } from './queries'

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

  // Used for checking whether a book is included in the list of books in cache
  const includedIn = (set, object) => set.map((b) => b.id).includes(object.id)

  const updateCache = (bookAdded) => {
    // Update books in cache
    const booksInCache = client.cache.readQuery({ query: ALL_BOOKS })
    if (
      booksInCache?.allBooks &&
      !includedIn(booksInCache.allBooks, bookAdded)
    ) {
      client.cache.updateQuery({ query: ALL_BOOKS }, ({ allBooks }) => {
        return {
          allBooks: allBooks.concat(bookAdded),
        }
      })
    } else {
      console.log(
        `"${bookAdded.title}" already exists: skipped adding it to the list`
      )
    }
  }

  useSubscription(BOOK_ADDED, {
    onData: ({ data }) => {
      const bookAdded = data.data.bookAdded
      window.alert(`New book ${bookAdded.title} added`)
      updateCache(bookAdded)
    },
  })

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
            element={<BookRecommendations favoriteGenre={favoriteGenre} />}
          />
          <Route
            path="/add"
            element={<NewBook setError={setError} updateCache={updateCache} />}
          />
          <Route path="/" element={<></>} />
        </Routes>
      </div>
    </Router>
  )
}

export default App
