import React from 'react'
import { ArrowRight, CheckCircle2, Sparkles, Zap, TrendingUp, ShieldCheck } from 'lucide-react'
import Button from '../components/Button'
import heroSolarImg from '../assets/hero-solar.jpg'

export default function Hero() {
  return (
    <section id="home" className="hero-section">
      <div className="container">
        {/* Contained Hero Section Card — Image strictly confined to this particular section */}
        <div className="hero-card-container">
          {/* Background Image Layer — ONLY inside this particular section */}
          <div className="hero-bg-layer">
            <img 
              src={heroSolarImg} 
              alt="Modern architectural home with high-efficiency rooftop solar panel installation" 
              className="hero-bg-photo"
            />
            <div className="hero-bg-overlay"></div>
            <div className="hero-bg-grid"></div>
          </div>

          <div className="hero-card-inner">
            <div className="hero-grid">
              {/* Left Column: Hero Content directly on the atmospheric background */}
              <div className="hero-content">
            {/* Pill Announcement */}
            <div className="hero-badge-wrapper">
              <span className="badge badge-lime">
                <Sparkles size={14} /> Intelligent Solar Architecture
              </span>
            </div>

            {/* Main Headline */}
            <h1 className="hero-title">
              Power Your Future With <span className="text-highlight">Clean Solar Energy</span>
            </h1>

            {/* Subheading / Value Proposition */}
            <p className="hero-description text-lead">
              Engineered rooftop solar systems and commercial installations designed to significantly reduce 
              your electricity expenses with long-term reliability and zero greenhouse emissions.
            </p>

            {/* Dual CTAs */}
            <div className="hero-cta-group">
              <Button href="#contact" variant="primary" size="lg" icon={<ArrowRight size={18} />}>
                Get a Free Quote
              </Button>
              <Button href="#solutions" variant="outline" size="lg">
                Explore Solutions
              </Button>
            </div>

            {/* Trust Highlights */}
            <div className="hero-trust-list">
              <div className="trust-item">
                <CheckCircle2 size={18} className="trust-icon" />
                <span>Custom Site Assessment</span>
              </div>
              <div className="trust-item">
                <CheckCircle2 size={18} className="trust-icon" />
                <span>Tier-1 Solar Hardware</span>
              </div>
              <div className="trust-item">
                <CheckCircle2 size={18} className="trust-icon" />
                <span>Comprehensive Maintenance</span>
              </div>
            </div>
          </div>

          {/* Right Floating Quick-Stats Cards (Glassmorphism over background visual) */}
          <div className="hero-stats-panel">
            <div className="hero-stat-card">
              <div className="stat-icon-wrapper">
                <Zap size={22} className="text-lime" />
              </div>
              <div className="stat-info">
                <span className="stat-number">15k+</span>
                <span className="stat-caption">Verified Installations</span>
              </div>
            </div>

            <div className="hero-stat-card">
              <div className="stat-icon-wrapper">
                <TrendingUp size={22} className="text-lime" />
              </div>
              <div className="stat-info">
                <span className="stat-number">85%</span>
                <span className="stat-caption">Avg. Bill Reduction</span>
              </div>
            </div>

            <div className="hero-stat-card">
              <div className="stat-icon-wrapper">
                <ShieldCheck size={22} className="text-lime" />
              </div>
              <div className="stat-info">
                <span className="stat-number">25 Yrs</span>
                <span className="stat-caption">Hardware Warranty</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</section>
  )
}
