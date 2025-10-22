import axios from 'axios';
import { BrowserRouter, Routes, Route } from 'react-router-dom'
import { Auth0Provider } from '@auth0/auth0-react';
import dotenv from 'dotenv';

// PAGES IMPORTED
import LandingPage from './pages/Home/LandingPage'
import LoginPage from './pages/Auth/LoginPage'
import SignupPage from './pages/Auth/SignupPage'
import CallbackPage from './pages/Auth/CallbackPage'

axios.defaults.baseURL = "http://localhost:3000";
dotenv.config({ path: '../.env' });

function App() {
  return (
    <Auth0Provider
      domain={process.env.AUTH0_DOMAIN || ''}
      clientId={process.env.AUTH0_CLIENT_ID || ''}
      authorizationParams={{
        redirect_uri: `${window.location.origin}/callback`
      }}
    >
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<LandingPage />}/>
          <Route path="/login" element={<LoginPage />}/>
          <Route path="/signup" element={<SignupPage />}/>
          <Route path="/callback" element={<CallbackPage />}/>
          
          {/* Example of protected routes - uncomment when you have these pages */}
          {/* <Route path="/profile" element={<ProtectedRoute><ProfilePage /></ProtectedRoute>}/> */}
          {/* <Route path="/swipe" element={<ProtectedRoute><SwipePage /></ProtectedRoute>}/> */}
        </Routes> 
      </BrowserRouter>
    </Auth0Provider>
  )
}

export default App
