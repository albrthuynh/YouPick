import { BrowserRouter, Routes, Route } from 'react-router-dom'
import axios from 'axios';
import React from 'react';

// changed a comment again!
// Rogelio testing making a pull request
// Pages Imported (example comment)
// viviana changes!
import LandingPage from './pages/Home/LandingPage'
import LoginPage from './pages/Auth/LoginPage'
import SignupPage from './pages/Auth/SignupPage'
import ProfilePage from './pages/Profile/ProfilePage';
import HomePage from './pages/Home/HomePage';
import CreateHangout from './pages/CreateHangout/Create';
import FinalizePage from './pages/CreateHangout/Finalize';
import SwipingPage from './pages/Swiping/Swiping';
import JoinHangoutPage from './pages/JoinHangout/JoinHangoutPage';
import CalendarPage from './pages/Calendar/CalendarPage';
import ChooseTimesPage from './pages/JoinHangout/ChooseTimesPage';

axios.defaults.baseURL = "http://localhost:3000";

function App() {
  return (
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<LandingPage />}/>
          <Route path="/login" element={<LoginPage />}/>
          <Route path="/signup" element={<SignupPage />}/>
          <Route path="/profile" element={<ProfilePage/>}/>
          <Route path="/home" element={<HomePage/>}/>
          <Route path="/finalize" element={<FinalizePage/>}/>
          <Route path="/createhangout" element={<CreateHangout/>}/>
          <Route path="/swiping" element={<SwipingPage/>}/>
          <Route path="/join-hangout" element={<JoinHangoutPage/>}/>
          <Route path="/calendar" element={<CalendarPage/>}/>
          <Route path="/choose-times" element={<ChooseTimesPage/>}/>

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
