import PropTypes from 'prop-types'

const Notification = ({ errorMessage }) => {
  Notification.propTypes = {
    errorMessage: PropTypes.string,
  }

  if (!errorMessage) return null

  return <div style={{ color: 'red' }}>{errorMessage}</div>
}

export default Notification
