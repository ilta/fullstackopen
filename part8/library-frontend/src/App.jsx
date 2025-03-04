import Authors from './components/Authors'
import Books from './components/Books'
import NewBook from './components/NewBook'
import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom'
import Notification from './components/Notification'
import { useState } from 'react'

const App = () => {
  const [errorMessage, setErrorMessage] = useState(null)

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
    }, 5000)
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
        </div>
        <Notification errorMessage={errorMessage} />

        <Routes>
          <Route path="/authors" element={<Authors setError={setError} />} />
          <Route path="/books" element={<Books />} />
          <Route path="/add" element={<NewBook setError={setError} />} />
          <Route path="/" element={<></>} />
        </Routes>
      </div>
    </Router>
  )
}

export default App
