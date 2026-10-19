import React, { useState, useEffect } from 'react'
import { Menu, X, ArrowRight, Phone, ShieldCheck, LogIn, LogOut, User } from 'lucide-react'
import Button from './Button'
import solarIcon from '../assets/solarpro-icon.png'

export default function Navbar({ onOpenAdmin, onOpenLogin, authUser, onLogout }) {
  const [isScrolled, setIsScrolled] = useState(false)
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)

  // Track scroll position to enhance navbar elevation on scroll
  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 20) {
        setIsScrolled(true)
      } else {
        setIsScrolled(false)
      }
    }

    window.addEventListener('scroll', handleScroll, { passive: true })
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  // Close mobile menu on resize to desktop
  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth > 1024 && isMobileMenuOpen) {
        setIsMobileMenuOpen(false)
      }
    }
    window.addEventListener('resize', handleResize)
    return () => window.removeEventListener('resize', handleResize)
  }, [isMobileMenuOpen])

  // Prevent body scroll when mobile menu is open
  useEffect(() => {
    if (isMobileMenuOpen) {
      document.body.style.overflow = 'hidden'
    } else {
      document.body.style.overflow = 'unset'
    }
    return () => {
      document.body.style.overflow = 'unset'
    }
  }, [isMobileMenuOpen])

  const navLinks = [
    { label: 'Projects', href: '#projects' },
    { label: 'Benefits', href: '#benefits' },
    { label: 'Solutions', href: '#solutions' },
    { label: 'Calculator', href: '#calculator' },
    { label: 'About', href: '#why-us' },
    { label: 'Contact', href: '#contact' },
  ]

  const handleLinkClick = () => {
    setIsMobileMenuOpen(false)
  }

  return (
    <header className={`navbar-wrapper ${isScrolled ? 'navbar-scrolled' : ''}`}>
      <div className="container">
        <nav className="navbar" aria-label="Main Navigation">
          {/* Brand Logo Lockup */}
          <a href="#home" className="navbar-brand" onClick={handleLinkClick} aria-label="SolarPro Clean Energy">
            <div className="navbar-logo-badge">
              <img 
                src={solarIcon} 
                alt="SolarPro Sun & Solar Emblem" 
                className="navbar-brand-icon"
              />
            </div>
            <div className="navbar-brand-text">
              <div className="brand-name">
                <span className="brand-solar">Solar</span>
                <span className="brand-pro">Pro</span>
              </div>
              <span className="brand-tagline">Clean Energy Systems</span>
            </div>
          </a>

          {/* Desktop Navigation Links */}
          <ul className="navbar-links">
            {navLinks.map((link) => (
              <li key={link.label}>
                <a href={link.href} className="nav-link">
                  {link.label}
                </a>
              </li>
            ))}
          </ul>

          {/* Desktop Actions */}
          <div className="navbar-actions">
            {authUser ? (
              <div style={{ display: 'inline-flex', alignItems: 'center', gap: '0.4rem' }}>
                <button
                  type="button"
                  onClick={onOpenAdmin}
                  style={{
                    background: 'rgba(34, 197, 94, 0.15)',
                    border: '1px solid rgba(74, 222, 128, 0.4)',
                    color: '#4ade80',
                    padding: '0.45rem 0.85rem',
                    borderRadius: '8px',
                    fontSize: '0.85rem',
                    fontWeight: 600,
                    cursor: 'pointer',
                    display: 'inline-flex',
                    alignItems: 'center',
                    gap: '0.4rem'
                  }}
                  title="Signed in user"
                >
                  <User size={15} /> {authUser.role === 'customer' ? 'Client' : 'Admin'}
                </button>
                <button
                  type="button"
                  onClick={onLogout}
                  style={{
                    background: 'rgba(239, 68, 68, 0.15)',
                    border: '1px solid rgba(239, 68, 68, 0.3)',
                    color: '#f87171',
                    padding: '0.45rem 0.75rem',
                    borderRadius: '8px',
                    fontSize: '0.8rem',
                    fontWeight: 600,
                    cursor: 'pointer',
                    display: 'inline-flex',
                    alignItems: 'center',
                    gap: '0.35rem'
                  }}
                  title="Logout"
                >
                  <LogOut size={14} /> Logout
                </button>
              </div>
            ) : (
              <Button 
                onClick={onOpenLogin} 
                variant="primary" 
                size="sm" 
                icon={<LogIn size={15} />}
                iconPosition="left"
                id="nav-login-btn"
              >
                Login
              </Button>
            )}
          </div>

          {/* Mobile Hamburger Toggle Button */}
          <button
            type="button"
            className="navbar-toggle"
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            aria-expanded={isMobileMenuOpen}
            aria-label={isMobileMenuOpen ? 'Close navigation menu' : 'Open navigation menu'}
          >
            {isMobileMenuOpen ? <X size={26} /> : <Menu size={26} />}
          </button>
        </nav>
      </div>

      {/* Mobile Drawer Menu */}
      <div className={`mobile-menu ${isMobileMenuOpen ? 'mobile-menu-open' : ''}`}>
        <div className="mobile-menu-container">
          <ul className="mobile-nav-links">
            {navLinks.map((link) => (
              <li key={link.label}>
                <a href={link.href} className="mobile-nav-link" onClick={handleLinkClick}>
                  {link.label}
                </a>
              </li>
            ))}
          </ul>

          <div className="mobile-menu-footer">
            {authUser ? (
              <button
                type="button"
                className="btn btn-secondary w-full"
                style={{ justifyContent: 'center', marginBottom: '0.75rem', width: '100%', padding: '0.75rem', color: '#f87171' }}
                onClick={() => {
                  handleLinkClick();
                  if (onLogout) onLogout();
                }}
              >
                <LogOut size={18} /> Logout ({authUser.role === 'customer' ? 'Client' : 'Admin'})
              </button>
            ) : (
              <Button 
                onClick={() => {
                  handleLinkClick();
                  if (onOpenLogin) onOpenLogin();
                }} 
                variant="primary" 
                size="lg" 
                className="w-full"
                icon={<LogIn size={18} />}
                iconPosition="left"
              >
                Login
              </Button>
            )}

            <div className="mobile-contact-hint">
              <Phone size={14} />
              <span>Free on-site solar assessment</span>
            </div>
          </div>
        </div>
      </div>
    </header>
  )
}
