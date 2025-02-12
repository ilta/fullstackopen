import { useSelector } from 'react-redux'

const Notification = () => {
  const style = {
    border: 'solid',
    padding: 10,
    borderWidth: 2,
  }

  const message = useSelector((state) => state.notification)
  if (!message) return null

  return <div style={style}>{message}</div>
}

export default Notification
