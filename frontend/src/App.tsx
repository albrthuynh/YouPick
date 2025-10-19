import { BrowserRouter, Routes, Route } from 'react-router-dom'
import LandingPage from './pages/Home/LandingPage'

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/ass" element={<LandingPage />}/>
      </Routes> 
    </BrowserRouter>
  )
}

export default App
