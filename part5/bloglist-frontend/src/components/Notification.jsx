import PropTypes from 'prop-types'

const Notification = ({ message }) => {
  if (!message) return null

  return <div className="notification">{message}</div>
}

Notification.propTypes = {
  message: PropTypes.string.isRequired
}

export default Notification
