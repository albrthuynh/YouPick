import { Button } from "@/components/ui/button"
import { Link } from "react-router-dom"
import { useState } from "react"
import { useAuth0 } from '@auth0/auth0-react'

export default function LoginPage() {
  const { loginWithRedirect, isLoading } = useAuth0()
  const [isAnimating, setIsAnimating] = useState(false)

  const handleLogin = async () => {
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
    <div className="min-h-screen bg-background flex flex-col items-center justify-center px-4 relative overflow-hidden">
      {/* Simple decorative shapes */}
      <div className="absolute inset-0 pointer-events-none">
        {/* Top left shape */}
        <svg className="absolute top-20 left-10 w-32 h-32 text-primary/20 float-animation" viewBox="0 0 100 100">
          <circle cx="50" cy="50" r="30" fill="none" stroke="currentColor" strokeWidth="2" />
        </svg>

        {/* Bottom right shape */}
        <svg className="absolute bottom-32 right-16 w-40 h-40 text-accent/18 float-animation" style={{ animationDelay: '1s' }} viewBox="0 0 100 100">
          <path
            d="M20,50 Q30,20 50,30 T80,50 Q70,80 50,70 T20,50"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
          />
        </svg>

        {/* Top right shape */}
        <svg className="absolute top-1/3 right-1/4 w-24 h-24 text-accent/25 float-animation" style={{ animationDelay: '2s' }} viewBox="0 0 100 100">
          <path
            d="M50,10 L60,40 L90,40 L65,60 L75,90 L50,70 L25,90 L35,60 L10,40 L40,40 Z"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>

        {/* Left middle shape */}
        <svg className="absolute top-1/2 left-20 w-20 h-20 text-primary/15 float-animation" style={{ animationDelay: '0.5s' }} viewBox="0 0 100 100">
          <path
            d="M50,20 L80,70 L20,70 Z"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>
      </div>

      <div className="max-w-md w-full mx-auto relative z-10">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="font-poppins text-5xl md:text-6xl font-bold text-foreground mb-4">
            Welcome
            <br />
            <span className="relative inline-block">
              <span className="text-foreground">back!</span>
              <svg
                className="absolute -bottom-2 left-0 w-full h-3 text-primary"
                viewBox="0 0 200 12"
                preserveAspectRatio="none"
              >
                <path
                  d="M5,7 Q50,3 100,7 T195,7"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="6"
                  strokeLinecap="round"
                />
              </svg>
            </span>
          </h1>
          <p className="text-lg text-muted-foreground font-poppins mt-6">
            Ready to plan some epic adventures? 🚀
          </p>
        </div>

        {/* Main Login Card */}
        <div className="bg-card/80 backdrop-blur-sm rounded-3xl p-8 shadow-lg border border-border hover:shadow-xl hover:border-accent transition-all duration-300">
          <Button
            onClick={handleLogin}
            disabled={isLoading || isAnimating}
            className="w-full bg-primary text-primary-foreground hover:bg-primary/90 font-poppins font-semibold py-6 rounded-full text-lg shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105 spring-bounce disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isAnimating ? (
              <span className="flex items-center justify-center">
                <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-3"></div>
                Signing in...
              </span>
            ) : (
              "Sign In"
            )}
          </Button>
        </div>

        {/* Sign Up Link */}
        <div className="text-center mt-8">
          <p className="text-muted-foreground font-poppins">
            New to the adventure?{" "}
            <Link
              to="/signup"
              className="text-accent hover:text-accent/80 font-semibold transition-colors duration-200 hover:underline"
            >
              Join the crew! 🎉
            </Link>
          </p>
        </div>

        {/* Back to Home */}
        <div className="text-center mt-6">
          <Link
            to="/"
            className="text-muted-foreground hover:text-foreground font-poppins text-sm transition-colors duration-200 hover:underline"
          >
            ← Back to home
          </Link>
        </div>
      </div>

      {/* Loading overlay */}
      {isAnimating && (
        <div className="fixed inset-0 bg-background/50 backdrop-blur-sm flex items-center justify-center z-50">
          <div className="text-center bg-card/80 backdrop-blur-sm rounded-3xl p-8 shadow-lg border border-border">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-accent mx-auto mb-4"></div>
            <p className="text-foreground font-poppins">Preparing your adventure...</p>
          </div>
        </div>
      )}
    </div>
  )
}