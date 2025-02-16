import { useNotifyMessage } from '../../NotifyContext'

const Notification = () => {
  const message = useNotifyMessage()

  if (!message) return null

  return <div className="notification">{message}</div>
}

export default Notification
