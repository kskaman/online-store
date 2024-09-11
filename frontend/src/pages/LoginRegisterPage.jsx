import { useState } from 'react'
import LoginForm from '../components/LoginForm'
import RegisterForm from '../components/RegisterForm'


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
    window.location.href = '/products' // Redirect after login
  }

  return (
    <div>
      <h2>{isRegistering ? 'Register' : 'Login'}</h2>

      {message && <p className={messageType}>{message}</p>}

      {isRegistering ? (
        <>
          <RegisterForm showMessage={showMessage} />
          <p>
            Already have an account?{' '}
            <button onClick={() => setIsRegistering(false)}>
              Login here
            </button>
          </p>
        </>
      ) : (
        <>
          <LoginForm onLogin={handleLogin} showMessage={showMessage} />
          <p>
            Don&apos;t have an account?{' '}
            <button onClick={() => setIsRegistering(true)}>
              Register here
            </button>
          </p>
        </>
      )}
    </div>
  )
}

export default LoginRegisterPage
