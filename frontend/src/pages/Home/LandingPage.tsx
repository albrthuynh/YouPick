import { Button } from "@/components/ui/button"
import { Link } from "react-router-dom"
import { useAuth0 } from "@auth0/auth0-react"

export default function LandingPage() {
  const { isAuthenticated, isLoading } = useAuth0()
  return (
    <div className="min-h-screen bg-background flex flex-col items-center justify-center px-4 relative overflow-hidden">
      <div className="absolute inset-0 pointer-events-none">
        {/* Top left squiggle */}
        <svg className="absolute top-20 left-10 w-32 h-32 text-primary/20 float-animation" viewBox="0 0 100 100">
          <path
            d="M20,50 Q30,20 50,30 T80,50 Q70,80 50,70 T20,50"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
          />
        </svg>

        {/* Bottom right circles */}
        <svg className="absolute bottom-32 right-16 w-40 h-40 text-accent/15 float-animation" style={{ animationDelay: '1s' }} viewBox="0 0 100 100">
          <circle cx="50" cy="50" r="30" fill="none" stroke="currentColor" strokeWidth="2" strokeDasharray="5,5" />
          <circle cx="50" cy="50" r="20" fill="none" stroke="currentColor" strokeWidth="2" />
        </svg>

        {/* Top right zigzag */}
        <svg className="absolute top-1/3 right-1/4 w-24 h-24 text-primary/25 float-animation" style={{ animationDelay: '2s' }} viewBox="0 0 100 100">
          <path
            d="M10,50 L30,30 L50,50 L70,30 L90,50"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
          />
        </svg>

        {/* Left middle star */}
        <svg className="absolute top-1/2 left-20 w-20 h-20 text-muted/30 float-animation" style={{ animationDelay: '0.5s' }} viewBox="0 0 100 100">
          <path
            d="M50,10 L60,40 L90,40 L65,60 L75,90 L50,70 L25,90 L35,60 L10,40 L40,40 Z"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>

        {/* Top center wavy line */}
        <svg className="absolute top-10 left-1/3 w-48 h-16 text-primary/15 float-animation" style={{ animationDelay: '3s' }} viewBox="0 0 200 50">
          <path
            d="M10,25 Q40,10 70,25 T130,25 Q160,10 190,25"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
          />
        </svg>

        {/* Bottom left triangle */}
        <svg className="absolute bottom-20 left-1/4 w-28 h-28 text-accent/20 float-animation" style={{ animationDelay: '4s' }} viewBox="0 0 100 100">
          <path
            d="M50,20 L80,70 L20,70 Z"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>

        {/* Right middle spiral */}
        <svg className="absolute top-2/3 right-10 w-32 h-32 text-primary/20 float-animation" style={{ animationDelay: '1.5s' }} viewBox="0 0 100 100">
          <path
            d="M50,50 Q60,40 60,30 Q60,20 50,20 Q40,20 40,30 Q40,40 50,40 Q55,40 55,35"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
          />
        </svg>

        {/* Top left small dots */}
        <svg className="absolute top-40 left-1/3 w-16 h-16 text-muted/25 float-animation" style={{ animationDelay: '2.5s' }} viewBox="0 0 100 100">
          <circle cx="20" cy="20" r="3" fill="currentColor" />
          <circle cx="50" cy="30" r="3" fill="currentColor" />
          <circle cx="80" cy="20" r="3" fill="currentColor" />
          <circle cx="35" cy="50" r="3" fill="currentColor" />
          <circle cx="65" cy="50" r="3" fill="currentColor" />
        </svg>

        {/* Bottom center heart */}
        <svg className="absolute bottom-40 left-1/2 w-24 h-24 text-primary/18 float-animation" style={{ animationDelay: '3.5s' }} viewBox="0 0 100 100">
          <path
            d="M50,80 Q30,60 30,45 Q30,30 40,30 Q50,30 50,40 Q50,30 60,30 Q70,30 70,45 Q70,60 50,80"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>
      </div>

      <div className="max-w-5xl mx-auto text-center space-y-12 relative z-10">
        {/* Hero Section */}
        <div className="space-y-6">
          <h1 className="font-poppins text-5xl md:text-6xl lg:text-7xl font-bold text-foreground leading-tight tracking-tight">
            Welcome to
            <br />
            <span className="relative inline-block">
              <span className="text-foreground">YouPick!</span>
              <svg
                className="absolute -bottom-2 left-0 w-full h-3 text-accent"
                viewBox="0 0 300 12"
                preserveAspectRatio="none"
              >
                <path
                  d="M5,7 Q75,3 150,7 T295,7"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="6"
                  strokeLinecap="round"
                />
              </svg>
            </span>
          </h1>

          <p className="text-lg md:text-xl text-muted-foreground max-w-2xl mx-auto leading-relaxed font-poppins">
            Finally, a fun way for indecisive friends to plan hangouts.
            <br />
            Swipe, vote, and let us find the perfect time and place for everyone.
          </p>
        </div>

        {/* CTA Buttons */}
        <div className="flex flex-col sm:flex-row gap-4 justify-center items-center pt-4">
          {!isLoading && (
            isAuthenticated ? (
              <Link to="/profile">
                <Button
                  size="lg"
                  className="bg-primary text-primary-foreground hover:bg-primary/90 font-poppins font-semibold px-8 py-6 rounded-full text-lg shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105 spring-bounce"
                >
                  Go to Profile
                </Button>
              </Link>
            ) : (
              <>
                <Link to="/login">
                  <Button
                    size="lg"
                    className="bg-primary text-primary-foreground hover:bg-primary/90 font-poppins font-semibold px-8 py-6 rounded-full text-lg shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105 spring-bounce"
                  >
                    Have an Account? Login
                  </Button>
                </Link>

                <Link to="/signup">
                  <Button
                    variant="outline"
                    size="lg"
                    className="border-2 border-border text-foreground hover:bg-accent/10 hover:border-accent font-poppins font-semibold px-8 py-6 rounded-full text-lg transition-all duration-300 hover:scale-105 spring-bounce bg-card/70 backdrop-blur-sm"
                  >
                    Set Up Profile
                  </Button>
                </Link>
              </>
            )
          )}
        </div>

        {/* Feature Preview */}
        <div className="pt-16 grid md:grid-cols-3 gap-8 max-w-5xl mx-auto">
          <div className="bg-card/80 backdrop-blur-sm rounded-3xl p-8 text-center shadow-lg border border-border hover:shadow-xl hover:border-accent transition-all duration-300 relative group card-tilt">
            <div className="absolute -top-2 -right-2 w-12 h-12 bg-accent/30 rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-300 -z-10"></div>
            <div className="w-16 h-16 bg-muted rounded-2xl mx-auto mb-4 flex items-center justify-center text-3xl rotate-3 group-hover:rotate-6 transition-transform duration-300">
              👥
            </div>
            <h3 className="font-poppins text-xl font-semibold text-foreground mb-3">Group Sync</h3>
            <p className="text-muted-foreground text-sm leading-relaxed">Everyone adds their availability and interests</p>
          </div>

          <div className="bg-card/80 backdrop-blur-sm rounded-3xl p-8 text-center shadow-lg border border-border hover:shadow-xl hover:border-accent transition-all duration-300 relative group card-tilt">
            <div className="absolute -top-2 -right-2 w-12 h-12 bg-primary/30 rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-300 -z-10"></div>
            <div className="w-16 h-16 bg-muted rounded-2xl mx-auto mb-4 flex items-center justify-center text-3xl -rotate-3 group-hover:-rotate-6 transition-transform duration-300">
              💫
            </div>
            <h3 className="font-poppins text-xl font-semibold text-foreground mb-3">Smart Matching</h3>
            <p className="text-muted-foreground text-sm leading-relaxed">
              AI finds the perfect time and activity for your group
            </p>
          </div>

          <div className="bg-card/80 backdrop-blur-sm rounded-3xl p-8 text-center shadow-lg border border-border hover:shadow-xl hover:border-accent transition-all duration-300 relative group card-tilt">
            <div className="absolute -top-2 -right-2 w-12 h-12 bg-accent/30 rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-300 -z-10"></div>
            <div className="w-16 h-16 bg-muted rounded-2xl mx-auto mb-4 flex items-center justify-center text-3xl rotate-2 group-hover:rotate-4 transition-transform duration-300">
              📅
            </div>
            <h3 className="font-poppins text-xl font-semibold text-foreground mb-3">Instant Calendar</h3>
            <p className="text-muted-foreground text-sm leading-relaxed">
              Easily access your hangouts on our calendar
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}
