import React from 'react'

/**
 * Reusable Button Component
 * Supports anchor links (href) or button actions (onClick)
 */
export default function Button({
  children,
  variant = 'primary', // 'primary' | 'secondary' | 'outline' | 'outline-light' | 'white'
  size = 'md',        // 'sm' | 'md' | 'lg'
  href,
  onClick,
  className = '',
  icon,
  iconPosition = 'right',
  type = 'button',
  ...props
}) {
  const baseClasses = `btn btn-${variant} ${size !== 'md' ? `btn-${size}` : ''} ${className}`.trim()

  const renderIcon = () => {
    if (!icon) return null
    if (React.isValidElement(icon)) return icon
    if (typeof icon === 'function' || (typeof icon === 'object' && icon.$$typeof)) {
      const IconComponent = icon
      return <IconComponent size={18} />
    }
    return icon
  }

  const content = (
    <>
      {icon && iconPosition === 'left' && <span className="btn-icon">{renderIcon()}</span>}
      <span>{children}</span>
      {icon && iconPosition === 'right' && <span className="btn-icon">{renderIcon()}</span>}
    </>
  )

  if (href) {
    return (
      <a href={href} className={baseClasses} {...props}>
        {content}
      </a>
    )
  }

  return (
    <button type={type} onClick={onClick} className={baseClasses} {...props}>
      {content}
    </button>
  )
}
