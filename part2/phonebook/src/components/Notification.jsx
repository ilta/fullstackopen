const Notification = ({ notification }) => {
  if (notification.message === null) {
    return null;
  }

  let type = null;

  if (notification.type === 'error') {
    type = 'error';
  } else {
    type = 'info';
  }

  return <div className={type}>{notification.message}</div>;
};

export default Notification;
