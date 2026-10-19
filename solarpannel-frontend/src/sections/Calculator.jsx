import React, { useState, useId } from 'react'
import SectionTitle from '../components/SectionTitle'
import Button from '../components/Button'
import { 
  Calculator as CalcIcon, 
  Zap, 
  Sun, 
  BatteryCharging, 
  TrendingUp, 
  Trees, 
  ArrowRight, 
  DollarSign, 
  ShieldCheck,
  CheckCircle2,
  Sparkles
} from 'lucide-react'

export default function Calculator() {
  const [monthlyBill, setMonthlyBill] = useState(250)
  const [propertyType, setPropertyType] = useState('residential') // 'residential' | 'commercial' | 'agricultural'
  const [sunlightTier, setSunlightTier] = useState(5.0) // 4.2 | 5.0 | 5.8 peak sun hours
  const [includeBattery, setIncludeBattery] = useState(false)
  const sliderId = useId()

  // Dynamic calculations based on industry solar standards:
  // Average electricity rate ~$0.16/kWh
  const avgRatePerKwh = propertyType === 'commercial' ? 0.14 : propertyType === 'agricultural' ? 0.13 : 0.17
  const monthlyKwhConsumption = monthlyBill / avgRatePerKwh
  
  // Solar sizing factor (covering ~85% of monthly consumption)
  const solarCoverage = 0.85
  const targetMonthlySolarKwh = monthlyKwhConsumption * solarCoverage
  const dailySolarKwhNeeded = targetMonthlySolarKwh / 30
  
  // System size in kW = daily kWh / peak sun hours
  const rawKw = dailySolarKwhNeeded / sunlightTier
  const systemSizeKw = Math.max(2.5, Math.min(100, Math.round(rawKw * 10) / 10))
  
  // High-efficiency 425W Tier-1 panels
  const panelWattage = 425
  const estimatedPanelCount = Math.ceil((systemSizeKw * 1000) / panelWattage)
  const roofSpaceSqFt = Math.round(estimatedPanelCount * 22) // approx 22 sq ft per panel with spacing

  // Savings calculations
  const monthlySavings = Math.round(monthlyBill * solarCoverage)
  const annualSavings = monthlySavings * 12
  
  // 25-Year cumulative savings with 3% annual utility rate escalation
  let cumulative25YearSavings = 0
  let currentYearSavings = annualSavings
  for (let year = 1; year <= 25; year++) {
    cumulative25YearSavings += currentYearSavings
    currentYearSavings *= 1.03 // 3% annual grid inflation
  }
  const lifetimeSavingsFormatted = Math.round(cumulative25YearSavings).toLocaleString()

  // Environmental impact
  const annualKwhGenerated = systemSizeKw * sunlightTier * 365
  const annualCo2Tons = (annualKwhGenerated * 0.000705).toFixed(1) // EPA standard: ~0.705 kg CO2 per kWh
  const treesPlantedEquivalent = Math.round(annualKwhGenerated * 0.016) // ~16 trees per 1000 kWh

  // Estimated Payback Period
  const paybackYears = propertyType === 'commercial' ? '3.8 – 4.5' : '4.6 – 5.8'

  // Scroll to contact form with pre-filled context
  const handleScrollToContact = () => {
    const contactSection = document.getElementById('contact')
    if (contactSection) {
      contactSection.scrollIntoView({ behavior: 'smooth' })
    }
  }

  // Calculate percentage for slider neon fill
  const minBill = 50
  const maxBill = 1200
  const sliderPercentage = ((monthlyBill - minBill) / (maxBill - minBill)) * 100

  return (
    <section id="calculator" className="section calculator-section">
      <div className="container">
        <SectionTitle
          badge="Interactive Financial Feasibility"
          title="Instant Solar Savings & Sizing Calculator"
          subtitle="Estimate your required rooftop kilowatt capacity, annual utility bill reduction, and projected 25-year financial return based on your power consumption."
        />

        <div className="calculator-layout-card">
          {/* Left Side: Interactive Controls */}
          <div className="calc-inputs-pane">
            <div className="calc-pane-header">
              <div className="calc-header-icon">
                <CalcIcon size={22} />
              </div>
              <div>
                <h3 className="calc-pane-title">Energy Consumption Profile</h3>
                <p className="calc-pane-subtitle">Adjust variables to calibrate your custom solar configuration</p>
              </div>
            </div>

            {/* Input 1: Monthly Electric Bill Slider */}
            <div className="calc-control-group">
              <div className="calc-slider-header">
                <label htmlFor={sliderId} className="calc-label">
                  Average Monthly Electric Bill
                </label>
                <div className="calc-bill-value-badge">
                  <span className="currency">$</span>
                  <span className="amount">{monthlyBill}</span>
                  <span className="period">/mo</span>
                </div>
              </div>

              <div className="calc-slider-container">
                <input
                  type="range"
                  id={sliderId}
                  min={minBill}
                  max={maxBill}
                  step={25}
                  value={monthlyBill}
                  onChange={(e) => setMonthlyBill(Number(e.target.value))}
                  className="calc-range-slider"
                  style={{
                    background: `linear-gradient(to right, var(--color-solar-lime) 0%, var(--color-solar-lime) ${sliderPercentage}%, rgba(255,255,255,0.12) ${sliderPercentage}%, rgba(255,255,255,0.12) 100%)`
                  }}
                  aria-label="Monthly electric bill in dollars"
                />
                <div className="calc-slider-markers">
                  <span>${minBill}</span>
                  <span>$350</span>
                  <span>$700</span>
                  <span>${maxBill}+</span>
                </div>
              </div>
            </div>

            {/* Input 2: Property Type Selector */}
            <div className="calc-control-group">
              <label className="calc-label">Property & Installation Classification</label>
              <div className="calc-property-selector">
                <button
                  type="button"
                  className={`calc-type-btn ${propertyType === 'residential' ? 'active' : ''}`}
                  onClick={() => setPropertyType('residential')}
                >
                  <span className="type-title">Residential Home</span>
                  <span className="type-sub">Single & Multi-Family</span>
                </button>
                <button
                  type="button"
                  className={`calc-type-btn ${propertyType === 'commercial' ? 'active' : ''}`}
                  onClick={() => setPropertyType('commercial')}
                >
                  <span className="type-title">Commercial Building</span>
                  <span className="type-sub">Offices, Warehouses</span>
                </button>
                <button
                  type="button"
                  className={`calc-type-btn ${propertyType === 'agricultural' ? 'active' : ''}`}
                  onClick={() => setPropertyType('agricultural')}
                >
                  <span className="type-title">Rural / Agri Land</span>
                  <span className="type-sub">Ground & Shed Mounts</span>
                </button>
              </div>
            </div>

            {/* Input 3: Sun Hours / Geographic Sun Exposure */}
            <div className="calc-control-group">
              <label className="calc-label">Sun Exposure & Regional Irradiance</label>
              <div className="calc-sun-selector">
                <button
                  type="button"
                  className={`calc-sun-chip ${sunlightTier === 4.2 ? 'active' : ''}`}
                  onClick={() => setSunlightTier(4.2)}
                >
                  <Sun size={15} />
                  <span>Moderate (~4.2 hrs/day)</span>
                </button>
                <button
                  type="button"
                  className={`calc-sun-chip ${sunlightTier === 5.0 ? 'active' : ''}`}
                  onClick={() => setSunlightTier(5.0)}
                >
                  <Sun size={15} />
                  <span>Optimal (~5.0 hrs/day)</span>
                </button>
                <button
                  type="button"
                  className={`calc-sun-chip ${sunlightTier === 5.8 ? 'active' : ''}`}
                  onClick={() => setSunlightTier(5.8)}
                >
                  <Sun size={15} />
                  <span>High Peak (~5.8 hrs/day)</span>
                </button>
              </div>
            </div>

            {/* Input 4: Battery Storage Option */}
            <div className="calc-battery-toggle-card">
              <div className="battery-toggle-info">
                <div className="battery-icon-box">
                  <BatteryCharging size={20} />
                </div>
                <div>
                  <div className="battery-title">Smart Battery Storage Backup</div>
                  <div className="battery-desc">Pair with 10kWh–20kWh lithium storage for night power & outage resilience</div>
                </div>
              </div>
              <label className="switch-toggle" aria-label="Toggle battery storage">
                <input
                  type="checkbox"
                  checked={includeBattery}
                  onChange={(e) => setIncludeBattery(e.target.checked)}
                />
                <span className="switch-slider"></span>
              </label>
            </div>
          </div>

          {/* Right Side: Real-Time Results & Financial Modeling */}
          <div className="calc-results-pane">
            <div className="calc-results-header">
              <span className="calc-model-badge">
                <Sparkles size={14} /> Certified System Estimate
              </span>
              <span className="calc-warranty-tag">Tier-1 Guaranteed</span>
            </div>

            {/* Primary Highlight Metrics */}
            <div className="calc-hero-metric-card">
              <div className="calc-metric-left">
                <span className="metric-caption">Recommended Solar Capacity</span>
                <div className="metric-primary-value">
                  {systemSizeKw} <span className="metric-unit">kWp</span>
                </div>
                <span className="metric-subtext">
                  ≈ {estimatedPanelCount} High-Efficiency N-Type Panels ({roofSpaceSqFt} sq ft roof space)
                </span>
              </div>
              <div className="calc-metric-badge-box">
                <Zap size={28} />
                <span>85% Grid Offset</span>
              </div>
            </div>

            {/* Savings Breakdown Grid */}
            <div className="calc-financial-grid">
              <div className="calc-fin-item">
                <span className="fin-label">Estimated Monthly Savings</span>
                <span className="fin-value highlight-lime">${monthlySavings.toLocaleString()}</span>
                <span className="fin-hint">Average monthly offset</span>
              </div>

              <div className="calc-fin-item">
                <span className="fin-label">First Year Savings</span>
                <span className="fin-value">${annualSavings.toLocaleString()}</span>
                <span className="fin-hint">Direct cash reduction</span>
              </div>

              <div className="calc-fin-item">
                <span className="fin-label">Projected 25-Year Value</span>
                <span className="fin-value highlight-glow">${lifetimeSavingsFormatted}</span>
                <span className="fin-hint">Factoring 3% utility escalation</span>
              </div>

              <div className="calc-fin-item">
                <span className="fin-label">Estimated Payback Period</span>
                <span className="fin-value">{paybackYears} <span className="years-unit">Yrs</span></span>
                <span className="fin-hint">Net system amortization</span>
              </div>
            </div>

            {/* Environmental Impact Strip */}
            <div className="calc-eco-strip">
              <div className="eco-item">
                <Trees size={18} className="eco-icon" />
                <span><strong>{treesPlantedEquivalent}</strong> Trees Planted Equiv. / Year</span>
              </div>
              <div className="eco-item">
                <TrendingUp size={18} className="eco-icon" />
                <span><strong>{annualCo2Tons}</strong> Metric Tons CO₂ Avoided / Year</span>
              </div>
            </div>

            {/* Battery status if enabled */}
            {includeBattery && (
              <div className="calc-battery-status-bar">
                <CheckCircle2 size={16} />
                <span>Included: <strong>10–15 kWh Smart Lithium Storage System</strong> with 10-Yr Full Cycling Warranty</span>
              </div>
            )}

            {/* CTA Button to finalize engineering assessment */}
            <div className="calc-cta-wrapper">
              <Button
                variant="primary"
                size="lg"
                icon={<ArrowRight size={18} />}
                iconPosition="right"
                onClick={handleScrollToContact}
                className="calc-submit-btn"
              >
                Lock In This {systemSizeKw} kWp Solar Assessment
              </Button>
              <div className="calc-disclaimer">
                <ShieldCheck size={14} />
                <span>Free zero-obligation engineering evaluation. Real output verified through roof angle & shading modeling.</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
