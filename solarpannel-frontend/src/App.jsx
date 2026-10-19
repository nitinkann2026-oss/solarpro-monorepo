import React, { useState } from 'react'
import Navbar from './components/Navbar'
import LoginModal from './components/LoginModal'
import Hero from './sections/Hero'
import Benefits from './sections/Benefits'
import Solutions from './sections/Solutions'
import Calculator from './sections/Calculator'
import WhyUs from './sections/WhyUs'
import Process from './sections/Process'
import Projects from './sections/Projects'
import Contact from './sections/Contact'
import Footer from './components/Footer'
import AdminPanel from './sections/AdminPanel'
import './App.css'

export default function App() {
  const [currentView, setCurrentView] = useState('home') // 'home' | 'admin'
  const [isLoginOpen, setIsLoginOpen] = useState(false)
  const [authUser, setAuthUser] = useState(() => {
    try {
      const saved = localStorage.getItem('solarpro_user')
      if (!saved) return null
      const parsed = JSON.parse(saved)
      if (parsed) {
        parsed.name = parsed.role === 'customer' ? 'Customer Client' : 'SolarPro Admin'
        localStorage.setItem('solarpro_user', JSON.stringify(parsed))
      }
      return parsed
    } catch {
      return null
    }
  })

  const handleLoginSuccess = (user) => {
    setAuthUser(user)
    // If admin, automatically open the Admin Panel
    if (user.role === 'admin') {
      setCurrentView('admin')
    }
  }

  const handleLogout = () => {
    setAuthUser(null)
    try {
      localStorage.removeItem('solarpro_user')
      localStorage.removeItem('solarpro_token')
    } catch (e) {
      console.error(e)
    }
    setCurrentView('home')
  }

  if (currentView === 'admin') {
    return (
      <AdminPanel 
        onBack={() => setCurrentView('home')} 
        currentUser={authUser} 
        onLogout={handleLogout} 
      />
    )
  }

  return (
    <div className="solarpro-app">
      {/* A. Sticky Accessible Navbar with Login & Admin */}
      <Navbar 
        onOpenAdmin={() => setCurrentView('admin')} 
        onOpenLogin={() => setIsLoginOpen(true)}
        authUser={authUser}
        onLogout={handleLogout}
      />

      <main>
        {/* B. Impactful Hero Section */}
        <Hero />

        {/* C. Project Gallery with Demo Transparency Tags */}
        <Projects />

        {/* D. Trust and Benefits Section */}
        <Benefits />

        {/* E. Solar Solutions Grid */}
        <Solutions />

        {/* F. Interactive Solar Savings & Sizing Calculator */}
        <Calculator />

        {/* G. Why Choose SolarPro Engineering Approach (About) */}
        <WhyUs />

        {/* H. 5-Step Installation Workflow */}
        <Process />

        {/* I. Interactive Contact & Free Quote Consultation */}
        <Contact />
      </main>

      {/* J. Comprehensive Dark Theme Footer */}
      <Footer />

      {/* K. Interactive Login Modal Panel */}
      <LoginModal 
        isOpen={isLoginOpen}
        onClose={() => setIsLoginOpen(false)}
        onLoginSuccess={handleLoginSuccess}
      />
    </div>
  )
}
