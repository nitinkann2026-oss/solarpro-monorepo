import React from 'react'
import solarIcon from '../assets/solarpro-icon.png'
import { ShieldCheck, Zap, Sun, Phone, Mail, MapPin, ArrowUp } from 'lucide-react'

export default function Footer() {
  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }

  return (
    <footer className="footer-wrapper">
      <div className="container">
        {/* Main Footer Grid */}
        <div className="footer-grid">
          {/* Brand Column */}
          <div className="footer-brand-col">
            <a href="#home" className="footer-brand" aria-label="SolarPro Clean Energy">
              <div className="footer-brand-lockup">
                <div className="footer-logo-badge">
                  <img 
                    src={solarIcon} 
                    alt="SolarPro Solar & Nature Emblem" 
                    className="footer-brand-icon"
                  />
                </div>
                <div className="footer-brand-text">
                  <div className="brand-name">
                    <span className="brand-solar">Solar</span>
                    <span className="brand-pro">Pro</span>
                  </div>
                  <span className="brand-tagline">Clean Energy Systems</span>
                </div>
              </div>
            </a>
            <p className="footer-tagline">
              Engineering high-efficiency rooftop photovoltaic systems and commercial solar microgrids calibrated for maximum long-term power yield and verified energy savings.
            </p>
            <div className="footer-badges">
              <div className="footer-badge-item">
                <ShieldCheck size={16} className="text-lime" />
                <span>Tier-1 Silicon Modules</span>
              </div>
              <div className="footer-badge-item">
                <Zap size={16} className="text-lime" />
                <span>Certified Grid Safety</span>
              </div>
            </div>
          </div>

          {/* Quick Nav Links */}
          <div className="footer-col">
            <h4 className="footer-heading">Navigation</h4>
            <ul className="footer-links">
              <li><a href="#projects">Project Gallery</a></li>
              <li><a href="#benefits">Verified Advantages</a></li>
              <li><a href="#solutions">Engineered Solutions</a></li>
              <li><a href="#calculator">Solar Calculator</a></li>
              <li><a href="#why-us">Why SolarPro (About)</a></li>
              <li><a href="#contact">Request Free Quote</a></li>
            </ul>
          </div>

          {/* Solutions Categories */}
          <div className="footer-col">
            <h4 className="footer-heading">Solar Solutions</h4>
            <ul className="footer-links">
              <li><a href="#solutions">Residential Rooftop Solar</a></li>
              <li><a href="#solutions">Commercial Building Arrays</a></li>
              <li><a href="#solutions">Industrial & Ground-Mount</a></li>
              <li><a href="#solutions">Hybrid Battery Storage</a></li>
              <li><a href="#solutions">Proactive System Maintenance</a></li>
              <li><a href="#solutions">Thermal Hotspot Audits</a></li>
            </ul>
          </div>

          {/* Contact & Hours */}
          <div className="footer-col">
            <h4 className="footer-heading">Engineering Office</h4>
            <div className="footer-contact-items">
              <div className="f-contact-item">
                <Phone size={15} className="text-lime" />
                <a href="tel:+18005557652">+1 (800) 555-SOLAR</a>
              </div>
              <div className="f-contact-item">
                <Mail size={15} className="text-lime" />
                <a href="mailto:contact@solarpro-energy.com">contact@solarpro-energy.com</a>
              </div>
              <div className="f-contact-item">
                <MapPin size={15} className="text-lime" />
                <span>Regional Headquarters & Commercial Depot</span>
              </div>
              <div className="f-contact-item">
                <Sun size={15} className="text-lime" />
                <span>Mon – Sat: 8:00 AM – 6:30 PM EST</span>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom Legal & Back to Top Bar */}
        <div className="footer-bottom">
          <p className="footer-copyright">
            © {new Date().getFullYear()} SolarPro Clean Energy Inc. All rights reserved. Built with modern high-efficiency photovoltaic standards.
          </p>

          <div className="footer-bottom-actions">
            <a href="#home" className="footer-legal-link">Privacy Policy</a>
            <span className="dot-divider">•</span>
            <a href="#home" className="footer-legal-link">Terms of Service</a>
            <span className="dot-divider">•</span>
            <button type="button" onClick={scrollToTop} className="back-to-top-btn" aria-label="Back to top">
              <span>Back to Top</span>
              <ArrowUp size={14} />
            </button>
          </div>
        </div>
      </div>
    </footer>
  )
}
