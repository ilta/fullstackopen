import { createSlice } from '@reduxjs/toolkit'

const notificationSlice = createSlice({
  name: 'notification',
  initialState: null,
  reducers: {
    setNotificationText(state, action) {
      return action.payload
    },
    clearNotification() {
      return null
    },
  },
})

export const setNotification = (text, timeOut = 5) => {
  return async (dispatch) => {
    dispatch(setNotificationText(text))
    setTimeout(() => dispatch(clearNotification()), timeOut * 1000)
  }
}

export const { setNotificationText, clearNotification } =
  notificationSlice.actions
export default notificationSlice.reducer
