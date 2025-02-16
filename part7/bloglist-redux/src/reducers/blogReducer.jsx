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
    updateBlogLikes(state, action) {
      const id = action.payload.id
      const blogs = state.map((b) => (b.id === id ? action.payload : b))

      // Sorting per likes, descending
      return blogs.sort((a, b) => b.likes - a.likes)
    },
    removeBlog(state, action) {
      const id = action.payload
      return state.filter((blog) => blog.id !== id)
    },
  },
})

export const initializeBlogs = () => {
  return async (dispatch) => {
    const blogs = await blogService.getAll()
    dispatch(setBlogs(blogs))
  }
}

export const addBlog = (payload, user) => {
  return async (dispatch) => {
    try {
      const newBlog = await blogService.create(payload)
      // manipulate blog so it can be deleted without reloading the app
      newBlog.user = {
        name: user.name,
        username: user.username,
      }
      dispatch(appendBlogs(newBlog))
      dispatch(
        setNotification(
          `a new blog ${newBlog.title} by ${newBlog.author} added`
        )
      )
    } catch (error) {
      console.error(error)
      dispatch(setNotification(error.response.data.error))
      console.error(error.response.data.error)
    }
  }
}

export const likeBlog = (payload) => {
  return async (dispatch) => {
    const blogToLike = {
      ...payload,
      likes: payload.likes + 1,
    }
    const likedBlog = await blogService.update(payload.id, blogToLike)
    dispatch(updateBlogLikes(likedBlog))
    dispatch(setNotification(`Liked blog ${likedBlog.title}`))
  }
}

export const deleteBlog = (payload) => {
  return async (dispatch) => {
    try {
      const id = payload.id
      await blogService.deletePost(id)
      dispatch(removeBlog(id))
      dispatch(setNotification(`Deleted blog ${payload.title}`))
    } catch (error) {
      console.error(error)
      dispatch(setNotification(error.response.data.error))
      console.error(error.response.data.error)
    }
  }
}

export const { setBlogs, appendBlogs, updateBlogLikes, removeBlog } =
  blogSlice.actions
export default blogSlice.reducer
