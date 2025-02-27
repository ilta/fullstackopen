import { useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { initializeUsers } from '../reducers/userReducer'
import PropTypes from 'prop-types'
import { Link } from 'react-router-dom'
import { H2, H3 } from './Elements'

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
      <H2>{user.name}</H2>
      <div className="ml-4">
        <H3>added blogs:</H3>
        <ul className="ml-2">
          {user.blogs.map((blog) => (
            <li key={blog.id}>{blog.title}</li>
          ))}
        </ul>
      </div>
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
        <Link
          className="hover:bg-fuchsia-700 hover:text-gray-100 text-gray-900 ml-1.5 visited:text-orange-500 px-1"
          to={`/users/${user.id}`}
        >
          {user.name}
        </Link>
      </td>
      <td className="pl-1">{user.blogs.length}</td>
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
    <>
      <H3>Users</H3>
      <div className="rounded-2xl bg-amber-200 m-2">
        <table className="ml-2">
          <thead>
            <tr className="bg-gray-600">
              <th className="font-bold px-2 text-gray-200">user</th>
              <th className="font-bold px-2 text-gray-200">blogs created</th>
            </tr>
          </thead>
          <tbody>
            {users.map((user) => (
              <UserLine key={user.id} user={user} />
            ))}
          </tbody>
        </table>
      </div>
    </>
  )
}

export default Users
