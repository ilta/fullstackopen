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
    appendComments(state, action) {
      const blogId = action.payload.blogId
      const blogToChange = state.find((b) => b.id === blogId)
      const modifiedBlog = {
        ...blogToChange,
        comments: blogToChange.comments.concat({
          content: action.payload.content,
          id: action.payload.commentId,
        }),
      }
      const blogs = state.map((blog) =>
        blog.id === blogId ? modifiedBlog : blog
      )
      return blogs
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

export const addComment = (payload) => {
  return async (dispatch) => {
    try {
      const { id, comment } = payload
      const newComment = await blogService.addComment(id, { content: comment })
      dispatch(appendComments(newComment))
      dispatch(setNotification(`a new comment ${comment} added`))
    } catch (error) {
      console.error(error)
      dispatch(setNotification(error.response.data.error))
      console.error(error.response.data.error)
    }
  }
}

export const {
  setBlogs,
  appendBlogs,
  updateBlogLikes,
  removeBlog,
  appendComments,
} = blogSlice.actions
export default blogSlice.reducer
