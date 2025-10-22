import { useEffect } from 'react'
import { useAuth0 } from '@auth0/auth0-react'
import { useNavigate } from 'react-router-dom'

export default function CallbackPage() {
  const { isAuthenticated, isLoading, error } = useAuth0()
  const navigate = useNavigate()

  useEffect(() => {
    if (!isLoading) {
      if (isAuthenticated) {
        // User is authenticated, redirect to home
        navigate('/')
      } else if (error) {
        // There was an error, redirect to login
        console.error('Auth0 error:', error)
        navigate('/login')
      }
    }
  }, [isAuthenticated, isLoading, error, navigate])

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-900 via-purple-900 to-pink-900 flex items-center justify-center">
      <div className="text-center">
        <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-purple-400 mx-auto mb-4"></div>
        <h2 className="text-2xl font-bold text-white font-poppins mb-2">Completing Authentication</h2>
        <p className="text-purple-200 font-poppins">Please wait while we set up your account...</p>
      </div>
    </div>
  )
}
