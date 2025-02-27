import PropTypes from 'prop-types'
import { Button, H2, Input } from './Elements'

const LoginForm = ({
  handleLogin,
  username,
  setUsername,
  password,
  setPassword,
}) => {
  LoginForm.propTypes = {
    handleLogin: PropTypes.func.isRequired,
    username: PropTypes.string.isRequired,
    setUsername: PropTypes.func.isRequired,
    password: PropTypes.string.isRequired,
    setPassword: PropTypes.func.isRequired,
  }
  return (
    <>
      <H2 className="text-2xl p-2">log in to application</H2>
      <form onSubmit={handleLogin}>
        <div className="flex flex-row sm:gap-3 m-1">
          <span className="w-20">username</span>
          <Input
            data-testid="username"
            type="text"
            value={username}
            name="Username"
            onChange={({ target }) => setUsername(target.value)}
          />
        </div>
        <div className="flex flex-row sm:gap-3 m-1">
          <span className="w-20">password</span>
          <Input
            data-testid="password"
            type="password"
            value={password}
            name="Password"
            onChange={({ target }) => setPassword(target.value)}
          />
        </div>
        <Button type="submit">login</Button>
      </form>
    </>
  )
}

export default LoginForm
