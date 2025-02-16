import { createContext, useContext, useEffect, useReducer } from 'react'
import blogService from './src/services/blogs'
import PropTypes from 'prop-types'

const UserContext = createContext(null)

const userReducer = (state, action) => {
  switch (action.type) {
    case 'SETUSER':
      if (action.payload && action.payload.token) {
        blogService.setToken(action.payload.token)
      }
      return action.payload
    default:
      return state
  }
}

export const UserContextProvider = (props) => {
  const [user, userDispatch] = useReducer(userReducer, null)

  useEffect(() => {
    const loggedUserJSON = window.localStorage.getItem('loggedBlogAppUser')
    if (loggedUserJSON) {
      const loginUser = JSON.parse(loggedUserJSON)
      userDispatch(loginUser)
    }
  }, [])

  return (
    <UserContext.Provider value={[user, userDispatch]}>
      {props.children}
    </UserContext.Provider>
  )
}

UserContextProvider.propTypes = {
  children: PropTypes.element.isRequired,
}

export const useUser = () => {
  const userAndDispatch = useContext(UserContext)
  return userAndDispatch[0]
}

export const useUserDispatch = () => {
  const userAndDispatch = useContext(UserContext)
  const dispatch = userAndDispatch[1]
  return (payload) => {
    dispatch({ type: 'SETUSER', payload })
  }
}

export default UserContext
