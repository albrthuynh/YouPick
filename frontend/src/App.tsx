import { BrowserRouter, Routes, Route } from 'react-router-dom'
import axios from 'axios';
import { useAuth0 } from "@auth0/auth0-react";
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
import AllHangouts from './pages/Hangouts/AllHangouts';
import UserHangouts from './pages/Hangouts/UserHangouts';
import { Navbar1 } from './components/navbar1';


axios.defaults.baseURL = "http://localhost:3000";

function App() {


  return (
    <>
    <Navbar1
      menu={[
        { title: "Home", url: "/home" },
        { title: "Create Hangout", url: "/createhangout" },
        { title: "My Hangouts", url: "/user-hangouts" },
        { title: "Swipe", url: "/swiping" },
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
          <Route path="/profile" element={<ProfilePage/>}/>
          <Route path="/home" element={<HomePage/>}/>
          <Route path="/finalize" element={<FinalizePage/>}/>
          <Route path="/createhangout" element={<CreateHangout/>}/>
          <Route path="/swiping" element={<SwipingPage/>}/>
          {/* Example of protected routes - uncomment when you have these pages */}
          {/* <Route path="/profile" element={<ProtectedRoute><ProfilePage /></ProtectedRoute>}/> */}
          {/* <Route path="/swipe" element={<ProtectedRoute><SwipePage /></ProtectedRoute>}/> */}
          {/* <Route path="/create-hangout" element={<ProtectedRoute><SwipePage /></ProtectedRoute>}/> */}
          {/* <Route path="/join-hangout" element={<ProtectedRoute><SwipePage /></ProtectedRoute>}/> */}
          <Route path="/all-hangouts" element={<AllHangouts/>}/>
          <Route path="/user-hangouts" element={<UserHangouts/>}/>

        </Routes> 
      </BrowserRouter>
    </>
  )
}

export default App
