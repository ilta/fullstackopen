import { useQuery } from '@apollo/client'
import { ALL_BOOKS } from '../queries'
import { useState } from 'react'
import PropTypes from 'prop-types'

const Books = ({ favoriteGenre }) => {
  Books.propTypes = {
    favoriteGenre: PropTypes.string || undefined,
  }

  const { loading, data } = useQuery(ALL_BOOKS)
  const [filter, setFilter] = useState()

  if (loading) return <div>loading...</div>

  const books = data.allBooks

  if (favoriteGenre) {
    const filteredBooks = books.filter((book) =>
      book.genres.includes(favoriteGenre)
    )

    return (
      <div>
        <h2>recommendations</h2>
        books in your favorite genre <strong>{favoriteGenre}</strong>
        <table>
          <tbody>
            <tr>
              <th></th>
              <th>author</th>
              <th>published</th>
            </tr>
            {filteredBooks.map((a) => (
              <tr key={a.title}>
                <td>{a.title}</td>
                <td>{a.author.name}</td>
                <td>{a.published}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    )
  } else {
    // Construct a unique list (set) of genres and filter with selected genre
    let genres = new Set()
    books.map((book) => book.genres.map((genre) => genres.add(genre)))
    const filteredBooks = filter
      ? books.filter((book) => book.genres.includes(filter))
      : books

    return (
      <div>
        <h2>books</h2>
        {filter ? (
          <>
            in genre <strong>{filter}</strong>
          </>
        ) : null}
        <table>
          <tbody>
            <tr>
              <th></th>
              <th>author</th>
              <th>published</th>
            </tr>
            {filteredBooks.map((a) => (
              <tr key={a.title}>
                <td>{a.title}</td>
                <td>{a.author.name}</td>
                <td>{a.published}</td>
              </tr>
            ))}
          </tbody>
        </table>
        {Array.from(genres).map((genre) => (
          <button key={genre} onClick={() => setFilter(genre)}>
            {genre}
          </button>
        ))}
        <button onClick={() => setFilter(null)}>all genres</button>
      </div>
    )
  }
}

export default Books
