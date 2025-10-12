import React from 'react'

export function TechStackInfographic({ className = '' }: { className?: string }) {
  return (
    <div className={`w-full flex justify-center ${className}`}>
      <img
        src="/infographics/tech-stack.svg"
        alt="Infográfico da Stack Tecnológica"
        className="max-w-full h-auto rounded-xl shadow-lg"
        loading="lazy"
      />
    </div>
  )
}
