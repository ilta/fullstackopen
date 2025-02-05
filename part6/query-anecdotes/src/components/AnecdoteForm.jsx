import { useMutation, useQueryClient } from '@tanstack/react-query'
import { createAnecdote } from '../requests'
import { useNotifyDispatch } from '../NotifyContext'

const AnecdoteForm = () => {
  const queryClient = useQueryClient()

  const generateId = () => Number((Math.random() * 1000000).toFixed(0))

  const newNoteMutation = useMutation({
    mutationFn: createAnecdote,
    onSuccess: (newAnecdote) => {
      const anecdotes = queryClient.getQueryData(['anecdotes'])
      queryClient.setQueryData(['anecdotes'], anecdotes.concat(newAnecdote))

      dispatch({ type: 'NOTIFY', payload: `anecdote '${newAnecdote}' created` })
      setTimeout(() => dispatch({ type: 'CLEAR' }), 5000)
    },
    onError: (data) => {
      dispatch({ type: 'NOTIFY', payload: data.response.data.error })
      setTimeout(() => dispatch({ type: 'CLEAR' }), 5000)
    },
  })

  const dispatch = useNotifyDispatch()

  const onCreate = (event) => {
    event.preventDefault()
    const content = event.target.anecdote.value
    event.target.anecdote.value = ''
    newNoteMutation.mutate({ content, id: generateId(), votes: 0 })
  }

  return (
    <div>
      <h3>create new</h3>
      <form onSubmit={onCreate}>
        <input name="anecdote" />
        <button type="submit">create</button>
      </form>
    </div>
  )
}

export default AnecdoteForm
