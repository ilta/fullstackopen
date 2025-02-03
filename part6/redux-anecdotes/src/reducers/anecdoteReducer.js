import { createSlice } from '@reduxjs/toolkit'

const anecdoteSlice = createSlice({
  name: 'anecdotes',
  initialState: [],
  reducers: {
    voteAnecdote(state, action) {
      const id = action.payload
      const anecdoteToChange = state.find((anecdote) => anecdote.id === id)
      const anecdoteToVote = {
        ...anecdoteToChange,
        votes: anecdoteToChange.votes + 1,
      }
      const anecdotes = state.map((anecdote) =>
        anecdote.id !== id ? anecdote : anecdoteToVote
      )
      // Sorting per votes, descending
      return anecdotes.sort((a, b) => b.votes - a.votes)
    },
    createAnecdote(state, action) {
      state.push(action.payload)
    },
    appendAnecdote(state, action) {
      state.push(action.payload)
    },
    setAnecdotes(state, action) {
      // Sorting per votes, descending
      return action.payload.sort((a, b) => b.votes - a.votes)
    },
  },
})

export const { voteAnecdote, createAnecdote, appendAnecdote, setAnecdotes } =
  anecdoteSlice.actions
export default anecdoteSlice.reducer
