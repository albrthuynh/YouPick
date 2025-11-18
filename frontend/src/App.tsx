import { BrowserRouter, Routes, Route } from 'react-router-dom'
import axios from 'axios';
import { useAuth0 } from "@auth0/auth0-react";

// IMPORTED PAGES
import LandingPage from './pages/Home/LandingPage'
import LoginPage from './pages/Auth/LoginPage'
import SignupPage from './pages/Auth/SignupPage'
import ProfilePage from './pages/Profile/ProfilePage';
import HomePage from './pages/Home/HomePage';
import CreateHangout from './pages/CreateHangout/Create';
import FinalizePage from './pages/CreateHangout/Finalize';
import SwipingPage from './pages/Swiping/Swiping';
import ProtectedRoute from './components/ProtectedRoute';
import AllHangouts from './pages/Hangouts/AllHangouts'; // shows all hangouts
import UserHangouts from './pages/Hangouts/UserHangouts';
import { Navbar1 } from './components/navbar1';
import JoinHangoutPage from './pages/JoinHangout/JoinHangoutPage';
import CalendarPage from './pages/Calendar/CalendarPage';
import ChooseTimesPage from './pages/JoinHangout/ChooseTimesPage';

axios.defaults.baseURL = "http://localhost:3000";

function App() {
  return (
    <>
    <Navbar1
      menu={[
        { title: "Home", url: "/home" },
        { title: "Create Hangout", url: "/createhangout" },
        { title: "My Hangouts", url: "/user-hangouts" },
        { title: "Join Hangout", url: "/join-hangout"},
        { title: "Calendar", url: "/calendar"},
      ]}
      auth={{
        login: { title: "Login", url: "/login" },
        signup: { title: "Sign Up", url: "/signup" }
      }}
      logo={{
        url: "/home",
        src: "",
        alt: "logo",
        title: "YouPick"
      }}
    />
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
          <Route path="/user-hangouts" element={<ProtectedRoute><UserHangouts/></ProtectedRoute>}/>
        </Routes> 
      </BrowserRouter>
    </>
  );
};

export default App;
