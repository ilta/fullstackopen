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

// eslint-disable-next-line react-refresh/only-export-components
export const useNotifyMessage = () => {
  const messageAndDispatch = useContext(NotifyContext)
  return messageAndDispatch[0]
}

// eslint-disable-next-line react-refresh/only-export-components
export const useNotifyDispatch = () => {
  const messageAndDispatch = useContext(NotifyContext)
  return messageAndDispatch[1]
}

export default NotifyContext
