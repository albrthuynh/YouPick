import { BrowserRouter, Routes, Route } from 'react-router-dom'

import axios from 'axios';

// changed a comment again!
// Rogelio testing making a pull request
// Pages Imported (example comment)
// viviana changes!
import LandingPage from './pages/Home/LandingPage'
import LoginPage from './pages/Auth/LoginPage'
import SignupPage from './pages/Auth/SignupPage'
import ProfilePage from './pages/Profile/ProfilePage';
import HomePage from './pages/Home/HomePage';

axios.defaults.baseURL = "http://localhost:3000";

function App() {
  return (
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<HomePage />}/>
          <Route path="/landing" element={<LandingPage />} />
          <Route path="/login" element={<LoginPage />}/>
          <Route path="/signup" element={<SignupPage />}/>
          <Route path="/profile" element={<ProfilePage/>}/>
          <Route path="/home" element={<HomePage/>}/>

          {/* Example of protected routes - uncomment when you have these pages */}
          {/* <Route path="/profile" element={<ProtectedRoute><ProfilePage /></ProtectedRoute>}/> */}
          {/* <Route path="/swipe" element={<ProtectedRoute><SwipePage /></ProtectedRoute>}/> */}
          {/* <Route path="/create-hangout" element={<ProtectedRoute><SwipePage /></ProtectedRoute>}/> */}
          {/* <Route path="/join-hangout" element={<ProtectedRoute><SwipePage /></ProtectedRoute>}/> */}
          {/* <Route path="/all-hangouts" element={<ProtectedRoute><SwipePage /></ProtectedRoute>}/> */}

        </Routes> 
      </BrowserRouter>
  )
}

export default App
