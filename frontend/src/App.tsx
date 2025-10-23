import axios from 'axios';
import { BrowserRouter, Routes, Route } from 'react-router-dom'

// PAGES IMPORTED
import LandingPage from './pages/Home/LandingPage'

axios.defaults.baseURL = "http://localhost:3000";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<LandingPage />}/>
      </Routes> 
    </BrowserRouter>
  )
}

export default App
