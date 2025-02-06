import { useState, useEffect } from 'react'
import axios from 'axios'

const useField = (type) => {
  const [value, setValue] = useState('')

  const onChange = (event) => {
    setValue(event.target.value)
  }

  const reset = () => {
    setValue('')
  }

  return {
    type,
    value,
    onChange,
    reset,
  }
}

const useResource = (baseUrl) => {
  const [resources, setResources] = useState([])

  let token = null

  // eslint-disable-next-line no-unused-vars
  const setToken = (newToken) => {
    token = `bearer ${newToken}`
  }

  useEffect(() => {
    const request = axios.get(baseUrl)
    request.then((response) => setResources(response.data))
  }, [baseUrl])

  const create = (resource) => {
    const config = {
      headers: { Authorization: token },
    }

    const request = axios.post(baseUrl, resource, config)
    request.then((response) => setResources(resources.concat(response.data)))
  }

  const service = {
    create,
  }

  return [resources, service]
}

// A custom input component that discards unknown attribute "reset" and adds
// attribute "name" to enable form auto-fill etc. Attribute "type" is also
// discarded because setting the type in specific cases, e.g. "number", changes
// the input method, also disallowing inputting strings.

// eslint-disable-next-line react/prop-types, no-unused-vars
const Input = ({ type, reset, ...rest }) => {
  return <input {...rest} name={type} />
}

const App = () => {
  const content = useField('content')
  const name = useField('name')
  const number = useField('number')

  const [notes, noteService] = useResource('http://localhost:3005/notes')
  const [persons, personService] = useResource('http://localhost:3005/persons')

  const handleNoteSubmit = (event) => {
    event.preventDefault()
    noteService.create({ content: content.value })
    content.reset()
  }

  const handlePersonSubmit = (event) => {
    event.preventDefault()
    personService.create({ name: name.value, number: number.value })
    name.reset()
    number.reset()
  }

  return (
    <div>
      <h2>notes</h2>
      <form onSubmit={handleNoteSubmit}>
        <Input {...content} required />
        <button>create</button>
      </form>
      {notes.map((n) => (
        <p key={n.id}>{n.content}</p>
      ))}

      <h2>persons</h2>
      <form onSubmit={handlePersonSubmit}>
        name <Input {...name} required /> <br />
        number <Input {...number} required />
        <button>create</button>
      </form>
      {persons.map((n) => (
        <p key={n.id}>
          {n.name} {n.number}
        </p>
      ))}
    </div>
  )
}

export default App
