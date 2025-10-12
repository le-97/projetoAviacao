import React from 'react'

export function TechStackInfographic({ className = '' }: { className?: string }) {
    // cache-busting param to avoid CDN/browser stale versions
    const cacheBuster = typeof window !== 'undefined' ? `?v=${new Date().getTime()}` : ''
    const src = `/infographics/tech-stack.svg${cacheBuster}`

    return (
        <div className={`w-full flex justify-center ${className}`}>
            <img
                src={src}
                alt="Infográfico da Stack Tecnológica"
                className="max-w-full h-auto rounded-xl shadow-lg"
                loading="lazy"
                onError={(e) => {
                    const target = e.currentTarget as HTMLImageElement
                    // fallback to original path without cache param if 404 or blocked
                    if (target.src.includes('?v=')) {
                        target.src = '/infographics/tech-stack.svg'
                    }
                }}
            />
        </div>
    )
}
