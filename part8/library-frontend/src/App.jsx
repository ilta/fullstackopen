import Authors from './components/Authors'
import Books from './components/Books'
import NewBook from './components/NewBook'
import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom'

const App = () => {
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

        <Routes>
          <Route path="/authors" element={<Authors />} />
          <Route path="/books" element={<Books />} />
          <Route path="/add" element={<NewBook />} />
          <Route path="/" element={<></>} />
        </Routes>
      </div>
    </Router>
  )
}

export default App
