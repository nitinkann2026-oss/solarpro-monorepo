import React from 'react'
import { Home, Building2, Factory, BatteryCharging, Wrench, ArrowRight, CheckCircle2 } from 'lucide-react'
import Button from './Button'

const iconMap = {
  Home,
  Building2,
  Factory,
  BatteryCharging,
  Wrench
}

export default function SolutionCard({ solution }) {
  const IconComponent = iconMap[solution.iconName] || Home

  return (
    <article className="card card-white solution-card">
      <div className="solution-card-header">
        <div className="icon-box">
          <IconComponent size={26} />
        </div>
        <span className="badge badge-forest">{solution.category}</span>
      </div>

      <h3 className="solution-card-title">{solution.title}</h3>
      <p className="solution-card-desc">{solution.description}</p>

      <div className="solution-card-divider"></div>

      <ul className="solution-highlights">
        {solution.highlights.map((item, idx) => (
          <li key={idx} className="solution-highlight-item">
            <CheckCircle2 size={16} className="solution-highlight-icon" />
            <span>{item}</span>
          </li>
        ))}
      </ul>

      <div className="solution-card-footer">
        <Button 
          href={solution.ctaHref} 
          variant="outline" 
          size="sm" 
          className="w-full"
          icon={<ArrowRight size={15} />}
        >
          {solution.ctaText}
        </Button>
      </div>
    </article>
  )
}
