import { createContext, useContext, useReducer } from 'react'
import PropTypes from 'prop-types'

const NotifyContext = createContext()

const notifyReducer = (state, action) => {
  switch (action.type) {
    case 'NOTIFY':
      return action.payload
    case 'CLEAR':
      return null
    default:
      return state
  }
}

export const NotifyContextProvider = (props) => {
  const [message, messageDispatch] = useReducer(notifyReducer, null)

  return (
    <NotifyContext.Provider value={[message, messageDispatch]}>
      {props.children}
    </NotifyContext.Provider>
  )
}

NotifyContextProvider.propTypes = {
  children: PropTypes.element.isRequired,
}

export const useNotifyMessage = () => {
  const messageAndDispatch = useContext(NotifyContext)
  return messageAndDispatch[0]
}

export const useNotifyDispatch = () => {
  const messageAndDispatch = useContext(NotifyContext)
  const dispatch = messageAndDispatch[1]
  return (payload) => {
    dispatch({ type: 'NOTIFY', payload })
    setTimeout(() => dispatch({ type: 'CLEAR' }), 5000)
  }
}

export default NotifyContext
