import React from 'react'

export default function SectionTitle({
  badge,
  title,
  subtitle,
  align = 'center', // 'center' | 'left'
  dark = false,
  className = ''
}) {
  return (
    <div className={`section-header ${align === 'left' ? 'text-left' : ''} ${className}`}>
      {badge && (
        <div style={{ marginBottom: '0.85rem' }}>
          <span className={`badge ${dark ? 'badge-dark' : 'badge-lime'}`}>
            {badge}
          </span>
        </div>
      )}
      <h2>{title}</h2>
      {subtitle && <p className="text-lead">{subtitle}</p>}
    </div>
  )
}
