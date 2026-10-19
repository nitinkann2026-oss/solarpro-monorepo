import React from 'react'
import { Sparkles, MapPin, Zap } from 'lucide-react'

export default function ProjectCard({ project }) {
  return (
    <article className="card card-white project-card">
      <div className="project-image-box">
        <img 
          src={project.image} 
          alt={`Demonstration sample: ${project.title}`} 
          className="project-img"
          loading="lazy"
        />
        {/* Prominent Demo Badge to maintain business authenticity */}
        <div className="project-demo-pill">
          <span className="badge badge-demo">
            <Sparkles size={12} /> DEMO PROJECT SAMPLE
          </span>
        </div>
        <div className="project-category-tag">
          <span className="badge badge-forest">{project.category}</span>
        </div>
      </div>

      <div className="project-card-body">
        <div className="project-capacity-pill">
          <Zap size={14} color="var(--color-solar-lime)" />
          <span>{project.capacity}</span>
        </div>

        <h3 className="project-title">{project.title}</h3>
        
        <div className="project-location">
          <MapPin size={14} />
          <span>{project.location}</span>
        </div>

        <p className="project-desc">{project.description}</p>

        <div className="project-specs-grid">
          <div className="spec-item">
            <span className="spec-label">Array Size</span>
            <span className="spec-val">{project.stats.modules}</span>
          </div>
          <div className="spec-item">
            <span className="spec-label">Inverter Spec</span>
            <span className="spec-val">{project.stats.inverter}</span>
          </div>
        </div>
      </div>
    </article>
  )
}
