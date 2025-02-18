import { useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { initializeUsers } from '../reducers/userReducer'
import PropTypes from 'prop-types'
import { Link } from 'react-router-dom'

export const User = ({ userMatch }) => {
  User.propTypes = {
    userMatch: PropTypes.object,
  }

  const id = userMatch.params.id

  const users = useSelector((state) => state.users)
  const user = users.filter((u) => u.id === id)[0]

  if (!user) return null

  return (
    <div>
      <h2>{user.name}</h2>
      <h3>added blogs</h3>
      <ul>
        {user.blogs.map((blog) => (
          <li key={blog.id}>{blog.title}</li>
        ))}
      </ul>
    </div>
  )
}

const UserLine = ({ user }) => {
  UserLine.propTypes = {
    user: PropTypes.object.isRequired,
  }

  return (
    <tr>
      <td>
        <Link to={`/users/${user.id}`}>{user.name}</Link>
      </td>
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
