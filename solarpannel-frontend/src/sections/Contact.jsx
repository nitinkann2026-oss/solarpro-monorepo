import React, { useState } from 'react'
import SectionTitle from '../components/SectionTitle'
import Button from '../components/Button'
import { Phone, Mail, MapPin, Clock, ShieldCheck, CheckCircle2, ArrowRight, Sparkles, Loader2 } from 'lucide-react'
import { submitConsultationQuote } from '../services/api'

export default function Contact() {
  const [formData, setFormData] = useState({
    fullName: '',
    phone: '',
    email: '',
    propertyType: 'Residential Rooftop',
    monthlyBill: '$200 - $500',
    notes: ''
  })

  const [isSubmitted, setIsSubmitted] = useState(false)
  const [ticketNumber, setTicketNumber] = useState('')
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [submitError, setSubmitError] = useState(null)

  const handleChange = (e) => {
    const { name, value } = e.target
    setFormData((prev) => ({ ...prev, [name]: value }))
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setIsSubmitting(true)
    setSubmitError(null)

    const result = await submitConsultationQuote(formData)
    setIsSubmitting(false)

    if (result && result.success && result.ticketNumber) {
      setTicketNumber(result.ticketNumber)
      setIsSubmitted(true)
    } else {
      setSubmitError(result?.message || 'Cannot connect to backend server. Make sure port 5000 is running.')
    }
  }

  const handleReset = () => {
    setIsSubmitted(false)
    setTicketNumber('')
    setSubmitError(null)
    setFormData({
      fullName: '',
      phone: '',
      email: '',
      propertyType: 'Residential Rooftop',
      monthlyBill: '$200 - $500',
      notes: ''
    })
  }

  return (
    <section id="contact" className="section contact-section">
      <div className="container">
        <SectionTitle
          badge="Direct Engineering Consultation"
          title="Request Your Customized Solar Quote"
          subtitle="Speak with certified renewable specialists to evaluate roof pitch, solar panel capacity, storage requirements, and estimated utility bill savings."
        />

        <div className="contact-grid">
          {/* Left Column: Direct Contact & Trust Pillars */}
          <div className="contact-info-panel">
            <div className="contact-intro-card card card-forest">
              <h3>Speak Directly With Our Engineering Team</h3>
              <p>
                We do not use aggressive sales scripts. Every assessment is led by an electrical systems specialist 
                who models your actual consumption data and structural roof feasibility.
              </p>

              <div className="contact-details-list">
                <div className="contact-item">
                  <div className="contact-icon-box">
                    <Phone size={20} />
                  </div>
                  <div>
                    <span className="contact-label">Telephone Consultation</span>
                    <a href="tel:+18005557652" className="contact-value">+1 (800) 555-SOLAR</a>
                  </div>
                </div>

                <div className="contact-item">
                  <div className="contact-icon-box">
                    <Mail size={20} />
                  </div>
                  <div>
                    <span className="contact-label">Technical Inquiries</span>
                    <a href="mailto:engineering@solarpro-energy.com" className="contact-value">engineering@solarpro-energy.com</a>
                  </div>
                </div>

                <div className="contact-item">
                  <div className="contact-icon-box">
                    <MapPin size={20} />
                  </div>
                  <div>
                    <span className="contact-label">Service Territory</span>
                    <span className="contact-value">Metropolitan & Regional Commercial / Residential Hubs</span>
                  </div>
                </div>

                <div className="contact-item">
                  <div className="contact-icon-box">
                    <Clock size={20} />
                  </div>
                  <div>
                    <span className="contact-label">Operating Hours</span>
                    <span className="contact-value">Mon – Sat: 8:00 AM – 6:30 PM EST</span>
                  </div>
                </div>
              </div>

              <div className="contact-guarantee-badge">
                <ShieldCheck size={20} className="text-lime" />
                <span>Zero-obligation consultation & verified electrical schematic model.</span>
              </div>
            </div>
          </div>

          {/* Right Column: Interactive Consultation Form */}
          <div className="contact-form-panel">
            <div className="card card-white contact-form-card">
              {isSubmitted ? (
                <div className="contact-success-state">
                  <div className="success-icon-box">
                    <CheckCircle2 size={48} />
                  </div>
                  <h3>Consultation Request Received</h3>
                  <p>
                    Thank you, <strong>{formData.fullName || 'Valued Customer'}</strong>. Our engineering department has logged your 
                    details for <strong>{formData.propertyType}</strong>. A technical consultant will contact you at 
                    <strong> {formData.phone || formData.email}</strong> within 1 business day with preliminary solar yield estimates.
                  </p>
                  <div className="success-reference-box">
                    <span className="ref-label">Official Engineering Ticket</span>
                    <span className="ref-number">{ticketNumber || 'SOLAR-REQ-CONFIRMED'}</span>
                  </div>
                  <Button variant="primary" size="md" onClick={handleReset}>
                    Submit Another Request
                  </Button>
                </div>
              ) : (
                <form onSubmit={handleSubmit} className="quote-form">
                  <div className="form-header">
                    <h4>Calculate Your Solar Potential</h4>
                    <span className="badge badge-lime">
                      <Sparkles size={12} /> Free Site Feasibility
                    </span>
                  </div>

                  <div className="form-grid-2">
                    <div className="form-group">
                      <label htmlFor="fullName" className="form-label">Full Name *</label>
                      <input
                        id="fullName"
                        type="text"
                        name="fullName"
                        required
                        placeholder="e.g. Alex Morgan"
                        value={formData.fullName}
                        onChange={handleChange}
                        className="form-input"
                      />
                    </div>

                    <div className="form-group">
                      <label htmlFor="phone" className="form-label">Phone Number *</label>
                      <input
                        id="phone"
                        type="tel"
                        name="phone"
                        required
                        placeholder="e.g. (555) 019-2834"
                        value={formData.phone}
                        onChange={handleChange}
                        className="form-input"
                      />
                    </div>
                  </div>

                  <div className="form-group">
                    <label htmlFor="email" className="form-label">Email Address *</label>
                    <input
                      id="email"
                      type="email"
                      name="email"
                      required
                      placeholder="e.g. alex@example.com"
                      value={formData.email}
                      onChange={handleChange}
                      className="form-input"
                    />
                  </div>

                  <div className="form-grid-2">
                    <div className="form-group">
                      <label htmlFor="propertyType" className="form-label">Property Type</label>
                      <select
                        id="propertyType"
                        name="propertyType"
                        value={formData.propertyType}
                        onChange={handleChange}
                        className="form-select"
                      >
                        <option value="Residential Rooftop">Residential Rooftop</option>
                        <option value="Commercial Enterprise">Commercial Enterprise</option>
                        <option value="Industrial / Ground-Mount">Industrial / Ground-Mount</option>
                        <option value="Battery Storage Expansion">Battery Storage Expansion</option>
                        <option value="Solar Maintenance & Audit">Solar Maintenance & Audit</option>
                      </select>
                    </div>

                    <div className="form-group">
                      <label htmlFor="monthlyBill" className="form-label">Average Monthly Bill</label>
                      <select
                        id="monthlyBill"
                        name="monthlyBill"
                        value={formData.monthlyBill}
                        onChange={handleChange}
                        className="form-select"
                      >
                        <option value="Under $200">Under $200 / month</option>
                        <option value="$200 - $500">$200 – $500 / month</option>
                        <option value="$500 - $1,200">$500 – $1,200 / month</option>
                        <option value="$1,200 - $3,000">$1,200 – $3,000 / month</option>
                        <option value="$3,000+">$3,000+ / Commercial Scale</option>
                      </select>
                    </div>
                  </div>

                  <div className="form-group">
                    <label htmlFor="notes" className="form-label">Additional Property Details (Optional)</label>
                    <textarea
                      id="notes"
                      name="notes"
                      rows={3}
                      placeholder="Mention roof age, approximate square footage, shading concerns, or electrical backup interests..."
                      value={formData.notes}
                      onChange={handleChange}
                      className="form-textarea"
                    ></textarea>
                  </div>

                  {submitError && (
                    <div style={{ color: '#ef4444', backgroundColor: 'rgba(239, 68, 68, 0.1)', padding: '0.75rem', borderRadius: '0.5rem', marginBottom: '1rem', fontSize: '0.875rem' }}>
                      ⚠ {submitError}
                    </div>
                  )}

                  <Button 
                    type="submit" 
                    variant="primary" 
                    size="lg" 
                    className="w-full" 
                    disabled={isSubmitting}
                    icon={isSubmitting ? <Loader2 size={18} className="animate-spin" /> : <ArrowRight size={18} />}
                  >
                    {isSubmitting ? 'Transmitting Request...' : 'Request Free Engineering Assessment'}
                  </Button>

                  <p className="form-privacy-hint">
                    🔒 We respect your privacy. Your information is strictly utilized to prepare technical solar assessments and never sold to third-party telemarketers.
                  </p>
                </form>
              )}
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
