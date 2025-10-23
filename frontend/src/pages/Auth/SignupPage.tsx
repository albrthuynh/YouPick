import { Button } from "@/components/ui/button"
import { Link } from "react-router-dom"
import { useState, useEffect } from "react"
import { useAuth0 } from '@auth0/auth0-react'

export default function SignupPage() {
  const { loginWithRedirect, isLoading } = useAuth0()
  const [isAnimating, setIsAnimating] = useState(false)
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 })
  const [isHovering, setIsHovering] = useState(false)
  const [currentStep, setCurrentStep] = useState(0)

  // Track mouse movement for interactive effects
  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      setMousePosition({ x: e.clientX, y: e.clientY })
    }
    window.addEventListener('mousemove', handleMouseMove)
    return () => window.removeEventListener('mousemove', handleMouseMove)
  }, [])

  // Auto-advance steps for demo effect
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentStep((prev) => (prev + 1) % 3)
    }, 2000)
    return () => clearInterval(interval)
  }, [])

  const handleSignup = async () => {
    setIsAnimating(true)
    setTimeout(async () => {
      await loginWithRedirect({
        appState: {
          returnTo: window.location.origin
        }
      })
    }, 500)
  }

  const handleSocialSignup = async () => {
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
    <div className="min-h-screen bg-gradient-to-br from-emerald-900 via-blue-900 to-purple-900 flex flex-col items-center justify-center px-4 relative overflow-hidden">
      {/* Animated Background Elements */}
      <div className="absolute inset-0 pointer-events-none">
        {/* Floating orbs with different colors */}
        <div className="absolute top-20 left-20 w-80 h-80 bg-gradient-to-r from-emerald-400/20 to-cyan-400/20 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute bottom-20 right-20 w-96 h-96 bg-gradient-to-r from-blue-400/20 to-purple-400/20 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '2s' }}></div>
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-72 h-72 bg-gradient-to-r from-pink-400/20 to-rose-400/20 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '4s' }}></div>
        
        {/* Interactive mouse follower */}
        <div 
          className="absolute w-40 h-40 bg-gradient-to-r from-emerald-500/30 to-cyan-500/30 rounded-full blur-xl transition-all duration-300 pointer-events-none"
          style={{
            left: mousePosition.x - 80,
            top: mousePosition.y - 80,
            transform: isHovering ? 'scale(1.3)' : 'scale(1)',
          }}
        ></div>

        {/* Animated geometric shapes */}
        <div className="absolute top-10 left-10 w-24 h-24 border-2 border-emerald-400/30 rotate-45 animate-spin" style={{ animationDuration: '15s' }}></div>
        <div className="absolute bottom-10 right-10 w-20 h-20 border-2 border-cyan-400/30 rounded-full animate-bounce" style={{ animationDelay: '1s' }}></div>
        <div className="absolute top-1/3 right-1/4 w-16 h-16 bg-gradient-to-r from-pink-400/40 to-purple-400/40 rounded-full animate-pulse" style={{ animationDelay: '3s' }}></div>
        
        {/* Floating particles with different colors */}
        {[...Array(25)].map((_, i) => (
          <div
            key={i}
            className="absolute w-3 h-3 bg-white/30 rounded-full animate-float"
            style={{
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
              animationDelay: `${Math.random() * 5}s`,
              animationDuration: `${3 + Math.random() * 4}s`,
              background: `linear-gradient(45deg, ${['#10b981', '#06b6d4', '#8b5cf6', '#ec4899'][Math.floor(Math.random() * 4)]}, transparent)`
            }}
          ></div>
        ))}
      </div>

      <div className="max-w-lg w-full mx-auto relative z-10">
        {/* Header with cool animations */}
        <div className="text-center mb-12">
          <div className="relative inline-block">
            <h1 className="font-poppins text-6xl md:text-7xl font-bold text-white mb-6 relative z-10">
              <span className="bg-gradient-to-r from-emerald-400 via-cyan-400 to-purple-400 bg-clip-text text-transparent animate-gradient-x">
                Join the
              </span>
              <br />
              <span className="text-white text-4xl md:text-5xl">adventure! 🚀</span>
            </h1>
            {/* Glowing effect behind text */}
            <div className="absolute inset-0 bg-gradient-to-r from-emerald-400/20 to-cyan-400/20 blur-xl rounded-full"></div>
          </div>
          <p className="text-xl text-emerald-200 font-poppins animate-fade-in-up">
            Let's create some unforgettable memories together! ✨
          </p>
        </div>

        {/* Main Signup Card */}
        <div 
          className="bg-white/10 backdrop-blur-xl rounded-3xl p-8 shadow-2xl border border-white/20 hover:bg-white/15 transition-all duration-500 relative overflow-hidden"
          onMouseEnter={() => setIsHovering(true)}
          onMouseLeave={() => setIsHovering(false)}
        >
          {/* Card glow effect */}
          <div className="absolute inset-0 bg-gradient-to-r from-emerald-500/10 to-cyan-500/10 rounded-3xl blur-xl"></div>
          
          {/* Animated border */}
          <div className="absolute inset-0 rounded-3xl bg-gradient-to-r from-emerald-400 via-cyan-400 to-purple-400 p-[2px]">
            <div className="w-full h-full bg-gradient-to-br from-emerald-900 via-blue-900 to-purple-900 rounded-3xl"></div>
          </div>

          <div className="relative z-10">
            {/* Step indicators */}
            <div className="flex justify-center mb-8">
              {[0, 1, 2].map((step) => (
                <div
                  key={step}
                  className={`w-3 h-3 rounded-full mx-2 transition-all duration-500 ${
                    step === currentStep 
                      ? 'bg-gradient-to-r from-emerald-400 to-cyan-400 scale-125' 
                      : 'bg-white/30'
                  }`}
                ></div>
              ))}
            </div>

            {/* Signup Button */}
            <Button
              onClick={handleSignup}
              disabled={isLoading || isAnimating}
              className="w-full bg-gradient-to-r from-emerald-500 via-cyan-500 to-purple-500 text-white hover:from-emerald-600 hover:via-cyan-600 hover:to-purple-600 font-poppins font-bold py-6 rounded-2xl text-xl shadow-2xl hover:shadow-emerald-500/25 transition-all duration-300 hover:scale-105 spring-bounce disabled:opacity-50 disabled:cursor-not-allowed relative overflow-hidden group"
            >
              <span className="relative z-10 flex items-center justify-center">
                {isAnimating ? (
                  <>
                    <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-white mr-3"></div>
                    Creating your account...
                  </>
                ) : (
                  <>
                    <svg className="w-6 h-6 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M18 9v3m0 0v3m0-3h3m-3 0h-3m-2-5a4 4 0 11-8 0 4 4 0 018 0zM3 20a6 6 0 0112 0v1H3v-1z" />
                    </svg>
                    Start Your Journey 🎯
                  </>
                )}
              </span>
              {/* Button glow effect */}
              <div className="absolute inset-0 bg-gradient-to-r from-emerald-400/20 to-cyan-400/20 blur-xl opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
            </Button>

            {/* Divider with style */}
            <div className="relative my-8">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-gradient-to-r from-transparent via-white/30 to-transparent"></div>
              </div>
              <div className="relative flex justify-center text-sm">
                <span className="px-6 bg-gradient-to-br from-emerald-900 via-blue-900 to-purple-900 text-emerald-300 font-poppins font-medium">or join with</span>
              </div>
            </div>

            {/* Social Signup Buttons */}
            <div className="space-y-4">
              <Button
                onClick={handleSocialSignup}
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
                Join with Google
              </Button>

              <Button
                onClick={handleSocialSignup}
                disabled={isLoading || isAnimating}
                variant="outline"
                size="lg"
                className="w-full border-2 border-white/20 text-white hover:bg-white/10 hover:border-white/40 font-poppins font-semibold py-4 rounded-2xl transition-all duration-300 hover:scale-105 spring-bounce bg-white/5 backdrop-blur-sm group"
              >
                <svg className="w-6 h-6 mr-3 group-hover:scale-110 transition-transform duration-300" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/>
                </svg>
                Join with Facebook
              </Button>
            </div>

            {/* Features preview */}
            <div className="mt-8 grid grid-cols-3 gap-4 text-center">
              <div className="bg-white/5 rounded-xl p-3 backdrop-blur-sm">
                <div className="text-2xl mb-1">🎯</div>
                <div className="text-xs text-emerald-300 font-poppins">Smart Planning</div>
              </div>
              <div className="bg-white/5 rounded-xl p-3 backdrop-blur-sm">
                <div className="text-2xl mb-1">👥</div>
                <div className="text-xs text-cyan-300 font-poppins">Group Sync</div>
              </div>
              <div className="bg-white/5 rounded-xl p-3 backdrop-blur-sm">
                <div className="text-2xl mb-1">⚡</div>
                <div className="text-xs text-purple-300 font-poppins">Instant Results</div>
              </div>
            </div>
          </div>
        </div>

        {/* Login Link */}
        <div className="text-center mt-8">
          <p className="text-emerald-200 font-poppins text-lg">
            Already part of the crew?{" "}
            <Link
              to="/login"
              className="text-cyan-400 hover:text-cyan-300 font-bold transition-colors duration-200 hover:underline"
            >
              Welcome back! 🎉
            </Link>
          </p>
        </div>

        {/* Back to Home */}
        <div className="text-center mt-6">
          <Link
            to="/"
            className="text-emerald-300 hover:text-white font-poppins text-sm transition-colors duration-200 hover:underline"
          >
            ← Back to home
          </Link>
        </div>
      </div>

      {/* Loading overlay */}
      {isAnimating && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50">
          <div className="text-center">
            <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-emerald-400 mx-auto mb-4"></div>
            <p className="text-white font-poppins text-lg">Setting up your adventure...</p>
          </div>
        </div>
      )}
    </div>
  )
}