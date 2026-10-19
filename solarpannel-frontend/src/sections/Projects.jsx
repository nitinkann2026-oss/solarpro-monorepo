import React, { useState } from 'react'
import SectionTitle from '../components/SectionTitle'
import ProjectCard from '../components/ProjectCard'
import { projectsData } from '../data/projects'
import { AlertCircle } from 'lucide-react'

export default function Projects() {
  const [activeFilter, setActiveFilter] = useState('All')

  const categories = ['All', 'Residential', 'Commercial', 'Industrial']

  const filteredProjects = activeFilter === 'All'
    ? projectsData
    : projectsData.filter((p) => p.category === activeFilter)

  return (
    <section id="projects" className="section projects-section">
      <div className="container">
        <SectionTitle
          badge="Sample Work"
          title="Engineered Solar Installation Demonstrations"
          subtitle="Explore architectural and high-capacity configurations modeled for modern residential homes, enterprise facilities, and industrial campuses."
        />

        {/* Category Filters */}
        <div className="project-filters">
          {categories.map((cat) => (
            <button
              key={cat}
              type="button"
              className={`filter-btn ${activeFilter === cat ? 'filter-btn-active' : ''}`}
              onClick={() => setActiveFilter(cat)}
            >
              {cat}
            </button>
          ))}
        </div>

        {/* Projects Grid */}
        <div className="grid-3 projects-grid">
          {filteredProjects.map((project) => (
            <ProjectCard key={project.id} project={project} />
          ))}
        </div>

        {/* Explicit Demo Disclaimer as strictly instructed */}
        <div className="projects-disclaimer-banner">
          <AlertCircle size={20} className="disclaimer-icon" />
          <p>
            <strong>Transparency Notice:</strong> All projects shown above are illustrative design demonstrations 
            and engineering reference concepts. As SolarPro prepares for full business launch, genuine completed 
            client case studies and verified electrical generation logs will replace these demo models.
          </p>
        </div>
      </div>
    </section>
  )
}
