import React from 'react'
import SectionTitle from '../components/SectionTitle'
import SolutionCard from '../components/SolutionCard'
import { solutionsData } from '../data/solutions'
import Button from '../components/Button'
import { ArrowRight, HelpCircle } from 'lucide-react'

export default function Solutions() {
  return (
    <section id="solutions" className="section solutions-section">
      <div className="container">
        <SectionTitle
          badge="Engineered Solutions"
          title="Solar Systems Calibrated For Your Property"
          subtitle="Explore purpose-built solar architectures developed to provide peak energy yield, structural durability, and maximum utility savings."
        />

        {/* 5 Solutions Grid */}
        <div className="solutions-grid">
          {solutionsData.map((solution) => (
            <SolutionCard key={solution.id} solution={solution} />
          ))}
        </div>

        {/* Custom Solution Assistance Box */}
        <div className="custom-solution-banner">
          <div className="custom-solution-content">
            <div className="custom-solution-icon">
              <HelpCircle size={28} />
            </div>
            <div>
              <h4>Need a Custom Multi-Building or Hybrid Configuration?</h4>
              <p>
                Our engineering team prepares bespoke electrical schematics, shading analysis, 
                and load-matching proposals for specialized architectures.
              </p>
            </div>
          </div>
          <Button href="#contact" variant="primary" size="md" icon={<ArrowRight size={16} />}>
            Request Custom Consultation
          </Button>
        </div>
      </div>
    </section>
  )
}
