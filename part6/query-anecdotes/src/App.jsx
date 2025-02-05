import AnecdoteForm from './components/AnecdoteForm'
import Notification from './components/Notification'
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { getAnecdotes, voteAnecdote } from './requests'
import { useNotifyDispatch } from './NotifyContext'

const App = () => {
  const { data, isLoading, isError } = useQuery({
    queryKey: ['anecdotes'],
    queryFn: getAnecdotes,
    retry: 1,
  })

  const queryClient = useQueryClient()
  const dispatch = useNotifyDispatch()

  const voteAnecdoteMutation = useMutation({
    mutationFn: voteAnecdote,
    onSuccess: (anecdote) => {
      queryClient.invalidateQueries({ queryKey: ['anecdotes'] })
      dispatch({
        type: 'NOTIFY',
        payload: `anecdote '${anecdote.content}' voted`,
      })
      setTimeout(() => dispatch({ type: 'CLEAR' }), 5000)
    },
  })

  if (isLoading) return <div>loading...</div>

  if (isError)
    return <div>anecdote service not available due to problems in server</div>

  const handleVote = (anecdote) => {
    voteAnecdoteMutation.mutate(anecdote)
  }

  const anecdotes = data

  return (
    <div>
      <h3>Anecdote app</h3>

      <Notification />
      <AnecdoteForm />

      {anecdotes.map((anecdote) => (
        <div key={anecdote.id}>
          <div>{anecdote.content}</div>
          <div>
            has {anecdote.votes}
            <button onClick={() => handleVote(anecdote)}>vote</button>
          </div>
        </div>
      ))}
    </div>
  )
}

export default App
