import { useState } from 'react'
import { ALL_AUTHORS, MODIFY_AUTHOR } from '../queries'
import { useMutation, useQuery } from '@apollo/client'
import Select from 'react-select'
import PropTypes from 'prop-types'

const ModifyAuthorForm = ({ authors }) => {
  const [born, setBorn] = useState('')
  const [selectedOption, setSelectedOption] = useState(null)
  const [modifyAuthor] = useMutation(MODIFY_AUTHOR, {
    refetchQueries: [{ query: ALL_AUTHORS }],
    onCompleted: () => {
      setSelectedOption(null)
      setBorn('')
    },
    onError: (error) => {
      const messages = error.graphQLErrors.map((e) => e.message).join('\n')
      console.error(messages)
    },
  })

  const options = authors.map((author) => ({
    value: author.name,
    label: author.name,
  }))

  const submit = async (event) => {
    event.preventDefault()

    // Basic sanity check that prevents submit when values are empty
    if (selectedOption && born) {
      modifyAuthor({
        variables: {
          name: selectedOption.value,
          born: parseInt(born, 10),
        },
      })
    }
  }

  ModifyAuthorForm.propTypes = {
    authors: PropTypes.array,
  }

  return (
    <div>
      <form onSubmit={submit}>
        <div style={{ width: 200, marginBottom: 5 }}>
          <Select
            value={selectedOption}
            onChange={setSelectedOption}
            options={options}
            placeholder="Select author..."
            isClearable
          />
        </div>
        <div>
          born
          <input
            value={born}
            type="number"
            style={{ width: 60 }}
            onChange={({ target }) => setBorn(target.value)}
          />
        </div>
        <button type="submit">update author</button>
      </form>
    </div>
  )
}

const Authors = () => {
  const { loading, data } = useQuery(ALL_AUTHORS)

  if (loading) return <div>loading...</div>

  const authors = data.allAuthors

  return (
    <div>
      <h2>authors</h2>
      <ModifyAuthorForm authors={authors} />
      <table>
        <tbody>
          <tr>
            <th></th>
            <th>born</th>
            <th>books</th>
          </tr>
          {authors.map((a) => (
            <tr key={a.name}>
              <td>{a.name}</td>
              <td>{a.born}</td>
              <td>{a.bookCount}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}

export default Authors
