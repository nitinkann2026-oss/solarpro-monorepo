import React from 'react'
import SectionTitle from '../components/SectionTitle'
import { Send, CalendarCheck, FileSpreadsheet, Wrench, Activity } from 'lucide-react'

export default function Process() {
  const steps = [
    {
      number: 1,
      icon: Send,
      title: 'Submit an Enquiry',
      desc: 'Share your property details, current monthly electricity bills, and energy requirements through our contact form.'
    },
    {
      number: 2,
      icon: CalendarCheck,
      title: 'Site Assessment',
      desc: 'Our engineers conduct an on-site or digital rooftop assessment to analyze roof tilt, structural integrity, and shading.'
    },
    {
      number: 3,
      icon: FileSpreadsheet,
      title: 'System Proposal',
      desc: 'Receive an itemized technical proposal specifying recommended module capacity, inverter specifications, and layout plans.'
    },
    {
      number: 4,
      icon: Wrench,
      title: 'Complete Installation',
      desc: 'Certified electrical technicians install mounting rails, secure solar modules, wire inverters, and verify DC isolator safety.'
    },
    {
      number: 5,
      icon: Activity,
      title: 'System Performance',
      desc: 'The array is energized and synced to the monitoring portal, allowing you to track clean generation directly on your mobile device.'
    }
  ]

  return (
    <section id="process" className="section process-section">
      <div className="container">
        <SectionTitle
          badge="Seamless Workflow"
          title="From Initial Consultation To Live Generation"
          subtitle="A clear, transparent 5-step installation sequence designed to make going solar straightforward, safe, and stress-free."
        />

        <div className="process-timeline">
          {steps.map((step, idx) => {
            const Icon = step.icon
            return (
              <div key={step.number} className="process-step-item">
                <div className="step-badge-line">
                  <div className="step-circle">
                    <span className="step-num">{step.number}</span>
                  </div>
                  {idx < steps.length - 1 && <div className="step-connector"></div>}
                </div>

                <div className="card card-white step-card">
                  <div className="step-card-header">
                    <div className="icon-box">
                      <Icon size={22} />
                    </div>
                    <span className="step-order">Step 0{step.number}</span>
                  </div>
                  <h4>{step.title}</h4>
                  <p>{step.desc}</p>
                </div>
              </div>
            )
          })}
        </div>
      </div>
    </section>
  )
}
