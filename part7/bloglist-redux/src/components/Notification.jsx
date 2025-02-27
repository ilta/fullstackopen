import { useSelector } from 'react-redux'

const Notification = () => {
  const message = useSelector((state) => state.notification)
  if (!message) return null

  return <div className="border p-2 m-2 rounded-md bg-amber-100">{message}</div>
}

export default Notification
