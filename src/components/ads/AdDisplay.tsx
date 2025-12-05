import { Link } from 'react-router-dom'
import { getActiveAdsByPosition } from '@/lib/storage'
import type { Ad } from '@/types'
import { Button } from '@/components/ui/button'

interface AdDisplayProps {
  position: Ad['position']
  className?: string
}

export default function AdDisplay({ position, className = '' }: AdDisplayProps) {
  const ads = getActiveAdsByPosition(position)

  if (ads.length === 0) return null

  // For now, show only the first ad (can be enhanced to rotate)
  const ad = ads[0]

  return (
    <div className={`relative overflow-hidden rounded-lg ${className}`}>
      <img
        src={ad.image}
        alt={ad.title}
        className="w-full h-full object-cover"
      />
      <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent flex flex-col justify-end p-6">
        <h3 className="text-white text-2xl font-bold mb-2">{ad.title}</h3>
        {ad.description && (
          <p className="text-white/90 text-sm mb-4">{ad.description}</p>
        )}
        {ad.link && (
          ad.link.startsWith('http') ? (
            <a href={ad.link} target="_blank" rel="noopener noreferrer">
              <Button variant="secondary" size="lg">
                {ad.buttonText || 'Learn More'}
              </Button>
            </a>
          ) : (
            <Link to={ad.link}>
              <Button variant="secondary" size="lg">
                {ad.buttonText || 'Learn More'}
              </Button>
            </Link>
          )
        )}
      </div>
    </div>
  )
}
