import { Alert } from '@mui/material'
import PropTypes from 'prop-types'

const Notification = ({ message }) => {
  if (!message) return null

  return (
    <Alert
      className='notification'
      style={{ marginY: 10 }}
      severity={message?.type}
    >
      {message?.text}
    </Alert>
  )
}

Notification.propTypes = {
  message: PropTypes.string.isRequired,
}

export default Notification
