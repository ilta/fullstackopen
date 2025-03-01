import { useState } from 'react'
import { ALL_AUTHORS, MODIFY_AUTHOR } from '../queries'
import { useMutation, useQuery } from '@apollo/client'

const ModifyAuthorForm = () => {
  const [name, setName] = useState('')
  const [born, setBorn] = useState('')
  const [modifyAuthor] = useMutation(MODIFY_AUTHOR, {
    refetchQueries: [{ query: ALL_AUTHORS }],
    onCompleted: () => {
      setName('')
      setBorn('')
    },
    onError: (error) => {
      const messages = error.graphQLErrors.map((e) => e.message).join('\n')
      console.error(messages)
    },
  })

  const submit = async (event) => {
    event.preventDefault()

    // Basic sanity check that prevents submit when values are empty
    if (name && born) {
      modifyAuthor({
        variables: {
          name,
          born: parseInt(born, 10),
        },
      })
    }
  }

  return (
    <div>
      <form onSubmit={submit}>
        <div>
          name
          <input
            value={name}
            onChange={({ target }) => setName(target.value)}
          />
        </div>
        <div>
          born
          <input
            value={born}
            onChange={({ target }) => setBorn(target.value)}
          />
        </div>
        <button type="submit">update author</button>
      </form>
    </div>
  )
}

const Authors = () => {
  const result = useQuery(ALL_AUTHORS)

  if (result.loading) return <div>loading...</div>

  const authors = result.data.allAuthors

  return (
    <div>
      <h2>authors</h2>
      <ModifyAuthorForm />
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
