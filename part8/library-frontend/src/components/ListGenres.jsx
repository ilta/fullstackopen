import { useLazyQuery } from '@apollo/client'
import PropTypes from 'prop-types'
import { BOOKS_BY_GENRE } from '../queries'
import { useEffect } from 'react'

const ListGenres = ({ genres, setBooksByGenre, setActiveGenreName }) => {
  ListGenres.propTypes = {
    genres: PropTypes.array.isRequired,
    setBooksByGenre: PropTypes.func.isRequired,
    setActiveGenreName: PropTypes.func.isRequired,
  }

  const [getGenre, { data }] = useLazyQuery(BOOKS_BY_GENRE, {
    fetchPolicy: 'cache-and-network',
  })

  useEffect(() => {
    if (data) {
      setBooksByGenre(data.allBooks)
    }
  })

  const selectGenre = (genre) => {
    getGenre({ variables: { genreToSearch: genre } })
    setActiveGenreName(genre)
  }

  return (
    <>
      {genres.map((genre) => (
        <button key={genre} onClick={() => selectGenre(genre)}>
          {genre}
        </button>
      ))}
      <button onClick={() => selectGenre(null)}>all genres</button>
    </>
  )
}

export default ListGenres
