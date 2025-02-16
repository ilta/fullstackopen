import { configureStore } from '@reduxjs/toolkit'
import notificationReducer from './notificationReducer'
import blogReducer from './blogReducer'
import loginReducer from './loginReducer'
import userReducer from './userReducer'

const store = configureStore({
  reducer: {
    notification: notificationReducer,
    blogs: blogReducer,
    user: loginReducer,
    users: userReducer,
  },
})

export default store
