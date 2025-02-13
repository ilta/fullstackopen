import { createSlice } from '@reduxjs/toolkit'
import blogService from '../services/blogs'
import { setNotification } from './notificationReducer'

const blogSlice = createSlice({
  name: 'blogs',
  initialState: [],
  reducers: {
    setBlogs(state, action) {
      // Sorting per likes, descending
      return action.payload.sort((a, b) => b.likes - a.likes)
    },
    appendBlogs(state, action) {
      return state.concat(action.payload)
    },
  },
})

export const initializeBlogs = () => {
  return async (dispatch) => {
    const blogs = await blogService.getAll()
    dispatch(setBlogs(blogs))
  }
}

export const addBlog = (payload) => {
  return async (dispatch) => {
    try {
      const newBlog = await blogService.create(payload)
      dispatch(appendBlogs(newBlog))
      dispatch(
        setNotification(
          `a new blog ${newBlog.title} by ${newBlog.author} added`
        )
      )
    } catch (error) {
      dispatch(setNotification(error.response.data.error))
      console.error(error.response.data.error)
    }
  }
}

export const { setBlogs, appendBlogs } = blogSlice.actions
export default blogSlice.reducer
