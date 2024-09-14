import { useState } from 'react'
import registerService from '../services/register'
import PropTypes from 'prop-types'


const RegisterForm = ({ showMessage }) => {
  const [username, setUsername] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')

  const handleRegister = async (event) => {
    event.preventDefault()

    try {
      await registerService.register({ username, email, password })
      showMessage('Registration successful! Please login.', 'success')
    } catch (error) {
      console.error('Registration failed:', error)
      showMessage('Registration failed. Please try again.', 'error')
    }
  }

  return (
    <form onSubmit={handleRegister}>
      <div>
        <label>Username</label>
        <input
          type="text"
          value={username}
          id="username"
          onChange={(event) => setUsername(event.target.value)}
          required
        />
      </div>
      <div>
        <label>Email</label>
        <input
          type="email"
          value={email}
          id="email"
          onChange={(event) => setEmail(event.target.value)}
          required
        />
      </div>
      <div>
        <label>Password</label>
        <input
          type="password"
          value={password}
          id="password"
          onChange={(event) => setPassword(event.target.value)}
          required
        />
      </div>
      <button type="submit">Register</button>
    </form>
  )
}

RegisterForm.propTypes = {
  showMessage: PropTypes.func.isRequired,
}

export default RegisterForm
