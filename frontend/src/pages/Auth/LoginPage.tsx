import { Button } from "@/components/ui/button"
import { Link } from "react-router-dom"
import { useState, useEffect } from "react"
import { useAuth0 } from '@auth0/auth0-react'

export default function LoginPage() {
  const { loginWithRedirect, isLoading } = useAuth0()
  const [isAnimating, setIsAnimating] = useState(false)
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 })
  const [isHovering, setIsHovering] = useState(false)

  // Track mouse movement for interactive effects
  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      setMousePosition({ x: e.clientX, y: e.clientY })
    }
    window.addEventListener('mousemove', handleMouseMove)
    return () => window.removeEventListener('mousemove', handleMouseMove)
  }, [])

  const handleLogin = async () => {
    setIsAnimating(true)
    // Add a small delay for the animation to complete
    setTimeout(async () => {
      await loginWithRedirect({
        appState: {
          // returnTo: window.location.origin
          returnTo: "/home"
        }
      })
    }, 500)
  }

  const handleSocialLogin = async () => {
    setIsAnimating(true)
    setTimeout(async () => {
      await loginWithRedirect({
        appState: {
          returnTo: window.location.origin
        }
      })
    }, 500)
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-900 via-purple-900 to-pink-900 flex flex-col items-center justify-center px-4 relative overflow-hidden">
      {/* Animated Background Elements */}
      <div className="absolute inset-0 pointer-events-none">
        {/* Floating orbs */}
        <div className="absolute top-20 left-20 w-72 h-72 bg-gradient-to-r from-purple-400/20 to-pink-400/20 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute bottom-20 right-20 w-96 h-96 bg-gradient-to-r from-blue-400/20 to-cyan-400/20 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '2s' }}></div>
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-64 h-64 bg-gradient-to-r from-yellow-400/20 to-orange-400/20 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '4s' }}></div>
        
        {/* Interactive mouse follower */}
        <div 
          className="absolute w-32 h-32 bg-gradient-to-r from-purple-500/30 to-pink-500/30 rounded-full blur-xl transition-all duration-300 pointer-events-none"
          style={{
            left: mousePosition.x - 64,
            top: mousePosition.y - 64,
            transform: isHovering ? 'scale(1.5)' : 'scale(1)',
          }}
        ></div>

        {/* Geometric shapes */}
        <div className="absolute top-10 left-10 w-20 h-20 border-2 border-purple-400/30 rotate-45 animate-spin" style={{ animationDuration: '20s' }}></div>
        <div className="absolute bottom-10 right-10 w-16 h-16 border-2 border-pink-400/30 rounded-full animate-bounce" style={{ animationDelay: '1s' }}></div>
        <div className="absolute top-1/3 right-1/4 w-12 h-12 bg-gradient-to-r from-cyan-400/40 to-blue-400/40 rounded-full animate-pulse" style={{ animationDelay: '3s' }}></div>
        
        {/* Floating particles */}
        {[...Array(20)].map((_, i) => (
          <div
            key={i}
            className="absolute w-2 h-2 bg-white/20 rounded-full animate-float"
            style={{
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
              animationDelay: `${Math.random() * 5}s`,
              animationDuration: `${3 + Math.random() * 4}s`
            }}
          ></div>
        ))}
      </div>

      <div className="max-w-md w-full mx-auto relative z-10">
        {/* Header with cool animations */}
        <div className="text-center mb-12">
          <div className="relative inline-block">
            <h1 className="font-poppins text-6xl md:text-7xl font-bold text-white mb-6 relative z-10">
              <span className="bg-gradient-to-r from-purple-400 via-pink-400 to-cyan-400 bg-clip-text text-transparent animate-gradient-x">
                Welcome
              </span>
              <br />
              <span className="text-white text-4xl md:text-5xl">back!</span>
            </h1>
            {/* Glowing effect behind text */}
            <div className="absolute inset-0 bg-gradient-to-r from-purple-400/20 to-pink-400/20 blur-xl rounded-full"></div>
          </div>
          <p className="text-xl text-purple-200 font-poppins animate-fade-in-up">
            Ready to plan some epic adventures? 🚀
          </p>
        </div>

        {/* Main Login Card */}
        <div 
          className="bg-white/10 backdrop-blur-xl rounded-3xl p-8 shadow-2xl border border-white/20 hover:bg-white/15 transition-all duration-500 relative overflow-hidden"
          onMouseEnter={() => setIsHovering(true)}
          onMouseLeave={() => setIsHovering(false)}
        >
          {/* Card glow effect */}
          <div className="absolute inset-0 bg-gradient-to-r from-purple-500/10 to-pink-500/10 rounded-3xl blur-xl"></div>
          
          {/* Animated border */}
          <div className="absolute inset-0 rounded-3xl bg-gradient-to-r from-purple-400 via-pink-400 to-cyan-400 p-[2px]">
            <div className="w-full h-full bg-gradient-to-br from-indigo-900 via-purple-900 to-pink-900 rounded-3xl"></div>
          </div>

          <div className="relative z-10">
            {/* Login Button */}
            <Button
              onClick={handleLogin}
              disabled={isLoading || isAnimating}
              className="w-full bg-gradient-to-r from-purple-500 via-pink-500 to-cyan-500 text-white hover:from-purple-600 hover:via-pink-600 hover:to-cyan-600 font-poppins font-bold py-6 rounded-2xl text-xl shadow-2xl hover:shadow-purple-500/25 transition-all duration-300 hover:scale-105 spring-bounce disabled:opacity-50 disabled:cursor-not-allowed relative overflow-hidden group"
            >
              <span className="relative z-10 flex items-center justify-center">
                {isAnimating ? (
                  <>
                    <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-white mr-3"></div>
                    Launching...
                  </>
                ) : (
                  <>
                    <svg className="w-6 h-6 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                    </svg>
                    Sign In with Magic ✨
                  </>
                )}
              </span>
              {/* Button glow effect */}
              <div className="absolute inset-0 bg-gradient-to-r from-purple-400/20 to-pink-400/20 blur-xl opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
            </Button>

            {/* Divider with style */}
            <div className="relative my-8">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-gradient-to-r from-transparent via-white/30 to-transparent"></div>
              </div>
              <div className="relative flex justify-center text-sm">
                <span className="px-6 bg-gradient-to-br from-indigo-900 via-purple-900 to-pink-900 text-purple-300 font-poppins font-medium">or continue with</span>
              </div>
            </div>

            {/* Social Login Buttons */}
            <div className="space-y-4">
              <Button
                onClick={handleSocialLogin}
                disabled={isLoading || isAnimating}
                variant="outline"
                size="lg"
                className="w-full border-2 border-white/20 text-white hover:bg-white/10 hover:border-white/40 font-poppins font-semibold py-4 rounded-2xl transition-all duration-300 hover:scale-105 spring-bounce bg-white/5 backdrop-blur-sm group"
              >
                <svg className="w-6 h-6 mr-3 group-hover:scale-110 transition-transform duration-300" viewBox="0 0 24 24">
                  <path fill="currentColor" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
                  <path fill="currentColor" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
                  <path fill="currentColor" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
                  <path fill="currentColor" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
                </svg>
                Continue with Google
              </Button>

              <Button
                onClick={handleSocialLogin}
                disabled={isLoading || isAnimating}
                variant="outline"
                size="lg"
                className="w-full border-2 border-white/20 text-white hover:bg-white/10 hover:border-white/40 font-poppins font-semibold py-4 rounded-2xl transition-all duration-300 hover:scale-105 spring-bounce bg-white/5 backdrop-blur-sm group"
              >
                <svg className="w-6 h-6 mr-3 group-hover:scale-110 transition-transform duration-300" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/>
                </svg>
                Continue with Facebook
              </Button>
            </div>
          </div>
        </div>

        {/* Sign Up Link */}
        <div className="text-center mt-8">
          <p className="text-purple-200 font-poppins text-lg">
            New to the adventure?{" "}
            <Link
              to="/signup"
              className="text-cyan-400 hover:text-cyan-300 font-bold transition-colors duration-200 hover:underline"
            >
              Join the crew! 🎉
            </Link>
          </p>
        </div>

        {/* Back to Home */}
        <div className="text-center mt-6">
          <Link
            to="/"
            className="text-purple-300 hover:text-white font-poppins text-sm transition-colors duration-200 hover:underline"
          >
            ← Back to home
          </Link>
        </div>
      </div>

      {/* Loading overlay */}
      {isAnimating && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50">
          <div className="text-center">
            <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-purple-400 mx-auto mb-4"></div>
            <p className="text-white font-poppins text-lg">Preparing your adventure...</p>
          </div>
        </div>
      )}
    </div>
  )
}