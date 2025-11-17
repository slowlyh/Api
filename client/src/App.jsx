import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import { useState, useEffect } from 'react'
import Navbar from './components/Navbar'
import Footer from './components/Footer'
import Home from './pages/Home'
import Docs from './pages/Docs'
import Status from './pages/Status'
import NotFound from './pages/NotFound'
import axios from 'axios'

function App() {
  const [metadata, setMetadata] = useState({
    creator: 'API Service',
    apititle: 'Modern API',
    github: '#',
    whatsapp: '#',
    youtube: '#'
  })

  useEffect(() => {
    // Fetch metadata from API
    axios.get('/api/metadata')
      .then(response => {
        if (response.data.status && response.data.result) {
          setMetadata(response.data.result)
        }
      })
      .catch(error => {
        console.error('Failed to fetch metadata:', error)
      })
  }, [])

  return (
    <Router>
      <div className="min-h-screen flex flex-col bg-dark-bg">
        <main className="flex-grow">
          <Routes>
            <Route path="/" element={<Home metadata={metadata} />} />
            <Route path="/docs" element={<Docs metadata={metadata} />} />
            <Route path="/status" element={<Status metadata={metadata} />} />
            <Route path="*" element={<NotFound />} />
          </Routes>
        </main>
      </div>
    </Router>
  )
}

export default App
