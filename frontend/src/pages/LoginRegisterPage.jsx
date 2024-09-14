import { useState } from 'react'

import LoginForm from '../components/LoginForm'
import RegisterForm from '../components/RegisterForm'
import '../styles/LoginRegisterPage.css'

const LoginRegisterPage = () => {
  const [isRegistering, setIsRegistering] = useState(false)
  const [message, setMessage] = useState('')
  const [messageType, setMessageType] = useState('')

  const showMessage = (text, type) => {
    setMessage(text)
    setMessageType(type)
    setTimeout(() => {
      setMessage('')
      setMessageType('')
    }, 3000)
  }

  const handleLogin = () => {
    window.location.href = '/products'
  }

  return (
    <div>
      <div className="login-register-container">
        <h2>{isRegistering ? 'Register' : 'Login'}</h2>

        {message && <p className={messageType}>{message}</p>}

        {isRegistering ? (
          <>
            <RegisterForm showMessage={showMessage} />
            <div className="switch-link">
              <p>Already have an account?</p>
              <button onClick={() => setIsRegistering(false)}>Login here</button>
            </div>
          </>
        ) : (
          <>
            <LoginForm onLogin={handleLogin} showMessage={showMessage} />
            <div className="switch-link">
              <p>Don&apos;t have an account?</p>
              <button onClick={() => setIsRegistering(true)}>Register here</button>
            </div>
          </>
        )}
      </div>
    </div>
  )
}

export default LoginRegisterPage
