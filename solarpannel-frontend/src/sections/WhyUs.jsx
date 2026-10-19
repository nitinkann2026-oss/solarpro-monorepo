import React from 'react'
import SectionTitle from '../components/SectionTitle'
import { Compass, FileCode2, HardHat, LifeBuoy, ArrowRight } from 'lucide-react'
import Button from '../components/Button'

export default function WhyUs() {
  const pillars = [
    {
      step: '01',
      icon: Compass,
      title: 'Detailed Site Assessment',
      description:
        'Before recommending hardware, we assess roof pitch, structural load tolerance, localized tree shading, and main electrical panel capacity to verify installation feasibility.'
    },
    {
      step: '02',
      icon: FileCode2,
      title: 'Precision System Engineering',
      description:
        'Our electrical team models your historical energy consumption to size inverters and string voltages correctly—avoiding both undersized capacity and wasteful over-allocation.'
    },
    {
      step: '03',
      icon: HardHat,
      title: 'Compliant Installation Planning',
      description:
        'Every installation follows structured safety protocols: certified weatherproof roof penetrations, labeled DC isolator switches, and clean conduit pathways.'
    },
    {
      step: '04',
      icon: LifeBuoy,
      title: 'Ongoing Maintenance Support',
      description:
        'Our relationship continues after commissioning with available system health diagnostics, thermal hotspot audits, and proactive cleaning schedules.'
    }
  ]

  return (
    <section id="why-us" className="section section-dark why-us-section">
      <div className="container">
        <SectionTitle
          badge="Service Methodology"
          title="Why Choose SolarPro For Your Installation?"
          subtitle="A transparent, engineering-driven approach focused on structural integrity, safety standards, and long-term operating efficiency."
          dark={true}
        />

        <div className="grid-2 why-us-grid">
          {pillars.map((pillar, idx) => {
            const Icon = pillar.icon
            return (
              <div key={idx} className="card card-forest why-us-card">
                <div className="why-us-card-header">
                  <span className="pillar-number">{pillar.step}</span>
                  <div className="icon-box icon-box-dark">
                    <Icon size={24} />
                  </div>
                </div>
                <h3>{pillar.title}</h3>
                <p>{pillar.description}</p>
              </div>
            )
          })}
        </div>

        <div className="why-us-cta-box">
          <div>
            <h3>Ready to schedule your site assessment?</h3>
            <p>Our engineers will evaluate your property and provide an unbiased feasibility review.</p>
          </div>
          <Button href="#contact" variant="primary" size="lg" icon={<ArrowRight size={18} />}>
            Book Feasibility Assessment
          </Button>
        </div>
      </div>
    </section>
  )
}
