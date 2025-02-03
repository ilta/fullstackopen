import { createSlice } from '@reduxjs/toolkit'
import anecdoteService from '../services/anecdotes'

const anecdoteSlice = createSlice({
  name: 'anecdotes',
  initialState: [],
  reducers: {
    updateAnecdoteVote(state, action) {
      const id = action.payload.id
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
    appendAnecdote(state, action) {
      state.push(action.payload)
    },
    setAnecdotes(state, action) {
      // Sorting per votes, descending
      return action.payload.sort((a, b) => b.votes - a.votes)
    },
  },
})

export const initializeAnecdotes = () => {
  return async (dispatch) => {
    const anecdotes = await anecdoteService.getAll()
    dispatch(setAnecdotes(anecdotes))
  }
}

export const createAnecdote = (payload) => {
  return async (dispatch) => {
    const newAnecdote = await anecdoteService.createNew(payload)
    dispatch(appendAnecdote(newAnecdote))
  }
}

export const voteAnecdote = (id) => {
  return async (dispatch) => {
    const updatedVote = await anecdoteService.vote(id)
    dispatch(updateAnecdoteVote(updatedVote))
  }
}

export const { updateAnecdoteVote, appendAnecdote, setAnecdotes } =
  anecdoteSlice.actions
export default anecdoteSlice.reducer
