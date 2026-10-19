import React from 'react'
import SectionTitle from '../components/SectionTitle'
import { TrendingDown, Leaf, ShieldAlert, Sparkles, BatteryMedium, Cpu } from 'lucide-react'

export default function Benefits() {
  const benefitsList = [
    {
      icon: TrendingDown,
      title: 'Reduced Electricity Expenses',
      description:
        'Generate your own electricity during daylight hours to offset grid consumption. Actual bill reductions vary based on consumption patterns, roof orientation, and local utility tariffs.',
      tag: 'Economic Value'
    },
    {
      icon: Leaf,
      title: 'Zero-Emission Renewable Energy',
      description:
        'Photovoltaic solar generation produces zero operational greenhouse gases or pollutants, measurably reducing your carbon footprint from day one.',
      tag: 'Environmental Impact'
    },
    {
      icon: ShieldAlert,
      title: 'Protection from Rising Grid Tariffs',
      description:
        'With commercial and residential grid electricity rates subject to regular price adjustments, generating on-site solar provides predictable energy cost stability.',
      tag: 'Long-Term Security'
    },
    {
      icon: Cpu,
      title: 'Low Mechanical Wear & High Durability',
      description:
        'Solid-state photovoltaic silicon cells operate without motorized moving parts, ensuring dependable long-term performance under routine maintenance care.',
      tag: 'Engineering Durability'
    },
    {
      icon: Sparkles,
      title: 'Enhanced Property Modernization',
      description:
        'Properties equipped with modern, aesthetically integrated solar arrays benefit from improved energy efficiency ratings and heightened prospective appeal.',
      tag: 'Property Appeal'
    },
    {
      icon: BatteryMedium,
      title: 'Seamless Storage Integration',
      description:
        'Modern grid-tied and hybrid inverters support modular battery expansion, allowing you to store surplus daylight generation for night-time consumption.',
      tag: 'Grid Flexibility'
    }
  ]

  return (
    <section id="benefits" className="section benefits-section">
      <div className="container">
        <SectionTitle
          badge="Factual Advantages"
          title="Why Transition To Clean Solar Power?"
          subtitle="Explore the verified economic, environmental, and operational advantages of adopting rooftop solar technology."
        />

        <div className="grid-3 benefits-grid">
          {benefitsList.map((benefit, index) => {
            const Icon = benefit.icon
            return (
              <div key={index} className="card card-white benefit-card">
                <div className="benefit-card-top">
                  <div className="icon-box">
                    <Icon size={24} />
                  </div>
                  <span className="badge badge-forest">{benefit.tag}</span>
                </div>
                <h3>{benefit.title}</h3>
                <p>{benefit.description}</p>
              </div>
            )
          })}
        </div>

        {/* Factual Disclaimer Notice as requested in business objective */}
        <div className="benefits-disclaimer-box">
          <p>
            <strong>Note on Performance:</strong> Energy generation and cost reductions depend on physical location, seasonal sun hours, 
            roof pitch, orientation, shading from trees/structures, and individual consumption patterns. SolarPro conducts rigorous on-site 
            modeling before finalizing system projections.
          </p>
        </div>
      </div>
    </section>
  )
}
