import axios from 'axios';
import { BrowserRouter, Routes, Route } from 'react-router-dom'

// PAGES IMPORTED
import LandingPage from './pages/Home/LandingPage'
import LoginPage from './pages/Auth/LoginPage'
import SignupPage from './pages/Auth/SignupPage'

axios.defaults.baseURL = "http://localhost:3000";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<LandingPage />}/>
        <Route path="/login" element={<LoginPage />}/>
        <Route path="/signup" element={<SignupPage />}/>
      </Routes> 
    </BrowserRouter>
  )
}

export default App
