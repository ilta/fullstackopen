import { useQuery } from '@apollo/client'
import { ALL_BOOKS, BOOKS_BY_GENRE } from '../queries'
import { useEffect, useState } from 'react'
import PropTypes from 'prop-types'
import ListGenres from './ListGenres'

export const BookRecommendations = ({ favoriteGenre }) => {
  BookRecommendations.propTypes = {
    favoriteGenre: PropTypes.string.isRequired,
  }

  const { loading, data } = useQuery(BOOKS_BY_GENRE, {
    variables: { genreToSearch: favoriteGenre },
  })

  if (loading) return <div>loading...</div>

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
          {data.allBooks &&
            data.allBooks.map((a) => (
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
}

const Books = () => {
  const { loading, data } = useQuery(ALL_BOOKS)
  const [booksByGenre, setBooksByGenre] = useState()
  const [activeGenreName, setActiveGenreName] = useState()

  // Show books by all genres when the component mounts
  useEffect(() => {
    if (data) {
      setBooksByGenre(data.allBooks)
    }
  }, [setBooksByGenre, data])

  if (loading) return <div>loading...</div>

  const books = data.allBooks

  // Construct a unique list (set) of genres and filter with selected genre
  let genres = new Set()
  books.map((book) => book.genres.map((genre) => genres.add(genre)))

  return (
    <div>
      <h2>books</h2>
      {activeGenreName ? (
        <>
          in genre <strong>{activeGenreName}</strong>
        </>
      ) : null}
      <table>
        <tbody>
          <tr>
            <th></th>
            <th>author</th>
            <th>published</th>
          </tr>
          {booksByGenre &&
            booksByGenre.map((a) => (
              <tr key={a.title}>
                <td>{a.title}</td>
                <td>{a.author.name}</td>
                <td>{a.published}</td>
              </tr>
            ))}
        </tbody>
      </table>
      <ListGenres
        genres={Array.from(genres)}
        setBooksByGenre={setBooksByGenre}
        setActiveGenreName={setActiveGenreName}
      />
    </div>
  )
}

export default Books
