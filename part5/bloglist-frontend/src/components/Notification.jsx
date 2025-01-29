// eslint-disable-next-line react/prop-types
const Notification = ({ message }) => {
  if (!message) return null

  return <div className="notification">{message}</div>
}

export default Notification
