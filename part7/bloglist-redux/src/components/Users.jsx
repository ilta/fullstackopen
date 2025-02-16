import { useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { initializeUsers } from '../reducers/userReducer'
import PropTypes from 'prop-types'

const UserLine = ({ user }) => {
  UserLine.propTypes = {
    user: PropTypes.object.isRequired,
  }

  return (
    <tr>
      <td>{user.name}</td>
      <td>{user.blogs.length}</td>
    </tr>
  )
}

const Users = () => {
  const dispatch = useDispatch()
  useEffect(() => {
    dispatch(initializeUsers())
  }, [dispatch])

  const users = useSelector((state) => state.users)

  return (
    <div>
      <h2>Users</h2>
      <table>
        <tbody>
          <tr>
            <td></td>
            <td>
              <strong>blogs created</strong>
            </td>
          </tr>
          {users.map((user) => (
            <UserLine key={user.id} user={user} />
          ))}
        </tbody>
      </table>
    </div>
  )
}

export default Users
