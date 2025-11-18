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
import ProtectedRoute from './components/ProtectedRoute';
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

          {/* Protected Routes - Authenticated Users can Access these Pages */}
          <Route path="/profile" element={<ProtectedRoute><ProfilePage/></ProtectedRoute>}/>
          <Route path="/swiping" element={<ProtectedRoute><SwipingPage/></ProtectedRoute>}/>
          <Route path="/createhangout" element={<ProtectedRoute><CreateHangout/></ProtectedRoute>}/>
          <Route path="/home" element={<ProtectedRoute><HomePage/></ProtectedRoute>}/>
          <Route path="/finalize" element={<ProtectedRoute><FinalizePage/></ProtectedRoute>}/>
          <Route path="/join-hangout" element={<ProtectedRoute><JoinHangoutPage/></ProtectedRoute>}/>
          <Route path="/calendar" element={<ProtectedRoute><CalendarPage/></ProtectedRoute>}/>
          <Route path="/choose-times" element={<ProtectedRoute><ChooseTimesPage/></ProtectedRoute>}/>
        </Routes> 
      </BrowserRouter>
  );
};

export default App
