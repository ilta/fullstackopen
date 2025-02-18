import { createSlice } from '@reduxjs/toolkit'
import loginService from '../services/login'
import blogService from '../services/blogs'
import { setNotification } from './notificationReducer'

const userSlice = createSlice({
  name: 'user',
  initialState: null,
  reducers: {
    userLogin(state, action) {
      const user = action.payload
      window.localStorage.setItem('loggedBlogAppUser', JSON.stringify(user))
      blogService.setToken(user.token)
      return user
    },
    // eslint-disable-next-line no-unused-vars
    userLogout(state, action) {
      window.localStorage.clear()
      blogService.setToken(null)
      return null
    },
    userSet(state, action) {
      const user = action.payload
      if (user && user.token) blogService.setToken(user.token)
      return user
    },
  },
})

export const login = (username, password) => {
  return async (dispatch) => {
    try {
      const user = await loginService.login({ username, password })
      dispatch(userLogin(user))
      dispatch(setNotification(`logged in ${username}`))
    } catch (error) {
      console.error(error)
    }
  }
}

export const logout = (username) => {
  return async (dispatch) => {
    dispatch(userLogout())
    dispatch(setNotification(`logged out ${username}`))
  }
}

export const setUser = (user) => {
  return async (dispatch) => {
    dispatch(userSet(user))
  }
}

export const { userLogin, userLogout, userSet } = userSlice.actions
export default userSlice.reducer
