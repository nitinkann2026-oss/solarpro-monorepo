import React, { useState, useEffect } from 'react'
import { 
  X, 
  Mail, 
  Lock, 
  Eye, 
  EyeOff, 
  ShieldCheck, 
  User, 
  ArrowRight, 
  Zap, 
  AlertCircle,
  Loader2
} from 'lucide-react'
import { loginUser } from '../services/api'
import '../styles/LoginModal.css'

export default function LoginModal({ isOpen, onClose, onLoginSuccess }) {
  const [role, setRole] = useState('admin') // 'admin' | 'customer'
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [showPassword, setShowPassword] = useState(false)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  // Close on Escape key
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === 'Escape' && isOpen) {
        onClose()
      }
    }
    window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [isOpen, onClose])

  if (!isOpen) return null

  const handleQuickDemoAdmin = () => {
    setRole('admin')
    setEmail('admin@solarpro.com')
    setPassword('admin123')
    setError('')
  }

  const handleQuickDemoCustomer = () => {
    setRole('customer')
    setEmail('customer@solardemo.com')
    setPassword('solar2026')
    setError('')
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError('')

    if (!email || !password) {
      setError('Please provide both email and password.')
      return
    }

    setLoading(true)
    try {
      const response = await loginUser({ email, password, role })
      
      if (response && response.success) {
        const userData = response.user || {
          name: role === 'customer' ? 'Customer Client' : 'SolarPro Admin',
          email,
          role
        }
        // Store in localStorage for session persistence
        localStorage.setItem('solarpro_user', JSON.stringify(userData))
        if (response.token) {
          localStorage.setItem('solarpro_token', response.token)
        }
        
        if (onLoginSuccess) {
          onLoginSuccess(userData)
        }
        onClose()
      } else {
        setError(response.message || 'Invalid email or password.')
      }
    } catch (err) {
      setError('Connection error. Please ensure backend is running.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div 
      className="login-modal-overlay" 
      onClick={(e) => {
        if (e.target === e.currentTarget) onClose()
      }}
    >
      <div className="login-modal-card" role="dialog" aria-modal="true">
        {/* Header */}
        <div className="login-modal-header">
          <button 
            type="button" 
            className="login-close-btn" 
            onClick={onClose}
            aria-label="Close Login Modal"
          >
            <X size={18} />
          </button>

          <div className="login-brand-icon-box">
            {role === 'admin' ? <ShieldCheck size={26} /> : <User size={26} />}
          </div>

          <h3 className="login-title">
            {role === 'admin' ? 'Admin / Engineer Portal' : 'Customer Access Portal'}
          </h3>
          <p className="login-subtitle">
            Sign in to manage solar inquiries, proposals & monitoring
          </p>
        </div>

        {/* Role Selector Tabs */}
        <div className="login-role-tabs">
          <button
            type="button"
            className={`login-role-tab ${role === 'admin' ? 'active' : ''}`}
            onClick={() => {
              setRole('admin')
              setError('')
            }}
          >
            <ShieldCheck size={15} /> Admin Portal
          </button>
          <button
            type="button"
            className={`login-role-tab ${role === 'customer' ? 'active' : ''}`}
            onClick={() => {
              setRole('customer')
              setError('')
            }}
          >
            <User size={15} /> Client Portal
          </button>
        </div>

        {/* Modal Form */}
        <div className="login-modal-body">
          {error && (
            <div className="login-error-box">
              <AlertCircle size={16} />
              <span>{error}</span>
            </div>
          )}

          <form onSubmit={handleSubmit}>
            {/* Email Field */}
            <div className="login-form-field">
              <label className="login-label">Email Address</label>
              <div className="login-input-wrap">
                <Mail size={16} className="login-input-icon" />
                <input
                  type="email"
                  className="login-input"
                  placeholder={role === 'admin' ? 'admin@solarpro.com' : 'user@example.com'}
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  autoFocus
                />
              </div>
            </div>

            {/* Password Field */}
            <div className="login-form-field">
              <label className="login-label">Password</label>
              <div className="login-input-wrap">
                <Lock size={16} className="login-input-icon" />
                <input
                  type={showPassword ? 'text' : 'password'}
                  className="login-input"
                  placeholder="••••••••••••"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                />
                <button
                  type="button"
                  className="login-eye-btn"
                  onClick={() => setShowPassword(!showPassword)}
                  aria-label={showPassword ? 'Hide password' : 'Show password'}
                >
                  {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                </button>
              </div>
            </div>

            {/* 1-Click Quick Demo Fill */}
            <button
              type="button"
              className="login-quick-demo-btn"
              onClick={role === 'admin' ? handleQuickDemoAdmin : handleQuickDemoCustomer}
            >
              <Zap size={14} /> 
              {role === 'admin' 
                ? 'Quick Fill Demo Admin (admin@solarpro.com)' 
                : 'Quick Fill Demo Client (customer@solardemo.com)'
              }
            </button>

            {/* Submit Button */}
            <button
              type="submit"
              className="login-submit-btn"
              disabled={loading}
            >
              {loading ? (
                <>
                  <Loader2 size={18} className="animate-spin" /> Authenticating...
                </>
              ) : (
                <>
                  Sign In to Dashboard <ArrowRight size={18} />
                </>
              )}
            </button>
          </form>
        </div>
      </div>
    </div>
  )
}
