const LandingPage = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-pink-50 via-blue-50 to-purple-50">
      {/* Hero Section */}
      <div className="flex items-center justify-center min-h-screen px-4 text-center">
        <div className="max-w-4xl mx-auto animate-fade-in-up">
          <h1 className="text-6xl md:text-7xl font-bold mb-6 bg-gradient-to-r from-pink-400 via-green-300 to-purple-400 bg-clip-text text-transparent drop-shadow-lg">
            YouPick
          </h1>
          <p className="text-2xl text-purple-600 mb-6 font-medium">
            Making group decisions effortless
          </p>
          <p className="text-lg text-gray-600 leading-relaxed mb-12 max-w-2xl mx-auto">
            Stop the endless "what should we do?" conversations. YouPick helps indecisive friends 
            plan hangouts by finding when everyone's free and letting your group swipe on activities together.
          </p>
          <div className="flex flex-col sm:flex-row gap-6 justify-center items-center">
            <button 
              type="button" 
              className="px-8 py-4 bg-gradient-to-r from-pink-400 to-pink-300 text-white font-semibold rounded-full shadow-lg hover:shadow-xl transform hover:-translate-y-1 transition-all duration-300 uppercase tracking-wide text-lg"
            >
              Get Started
            </button>
            <button 
              type="button" 
              className="px-8 py-4 bg-white/80 text-purple-600 font-semibold rounded-full border-2 border-purple-300 backdrop-blur-sm hover:bg-purple-50 transform hover:-translate-y-1 transition-all duration-300 uppercase tracking-wide text-lg"
            >
              Learn More
            </button>
          </div>
        </div>
      </div>
      
      {/* Features Section */}
      <div className="py-20 px-4 bg-white/40 backdrop-blur-sm">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-4xl font-bold text-center text-purple-600 mb-16">
            How it works
          </h2>
          <div className="grid md:grid-cols-3 gap-8">
            <div className="bg-white/70 p-8 rounded-3xl shadow-lg backdrop-blur-sm border border-white/30 hover:transform hover:-translate-y-2 transition-all duration-300 text-center border-t-4 border-t-green-300">
              <div className="text-5xl mb-6">📅</div>
              <h3 className="text-xl font-semibold text-gray-700 mb-4">Find Free Time</h3>
              <p className="text-gray-600 leading-relaxed">
                Automatically suggests the best times when everyone in your group is available
              </p>
            </div>
            <div className="bg-white/70 p-8 rounded-3xl shadow-lg backdrop-blur-sm border border-white/30 hover:transform hover:-translate-y-2 transition-all duration-300 text-center border-t-4 border-t-pink-300">
              <div className="text-5xl mb-6">👥</div>
              <h3 className="text-xl font-semibold text-gray-700 mb-4">Group Swiping</h3>
              <p className="text-gray-600 leading-relaxed">
                Swipe right on activities you love, left on ones you don't - just like dating, but for hangouts!
              </p>
            </div>
            <div className="bg-white/70 p-8 rounded-3xl shadow-lg backdrop-blur-sm border border-white/30 hover:transform hover:-translate-y-2 transition-all duration-300 text-center border-t-4 border-t-purple-300">
              <div className="text-5xl mb-6">✨</div>
              <h3 className="text-xl font-semibold text-gray-700 mb-4">Perfect Match</h3>
              <p className="text-gray-600 leading-relaxed">
                Get personalized suggestions based on your group's preferences and availability
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LandingPage;