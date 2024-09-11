import  { useState } from 'react'
import loginService from '../services/login'
import PropTypes from 'prop-types'


const LoginForm = ({ onLogin, showMessage }) => {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')

  const handleLogin = async (event) => {
    event.preventDefault()

    try {
      const user = await loginService.login({ email, password })
      localStorage.setItem('user', JSON.stringify(user))
      showMessage('Login successful!', 'success')
      onLogin()
    } catch (error) {
      console.error('Login failed:', error)
      showMessage('Login failed. Check your credentials or register first.', 'error')
    }
  }

  return (
    <form onSubmit={handleLogin}>
      <div>
        <label>Email</label>
        <input
          type="email"
          value={email}
          onChange={(event) => setEmail(event.target.value)}
          required
        />
      </div>
      <div>
        <label>Password</label>
        <input
          type="password"
          value={password}
          onChange={(event) => setPassword(event.target.value)}
          required
        />
      </div>
      <button type="submit">Login</button>
    </form>
  )
}

LoginForm.propTypes = {
  onLogin: PropTypes.func.isRequired,
  showMessage: PropTypes.func.isRequired
}

export default LoginForm
