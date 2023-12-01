'use client';

// Import some packages
import dynamic from 'next/dynamic';

// Import map convas without SSR
const MapCanvas = dynamic(() => import('./components/map'), {
  ssr: false,
})

// Main app components
export default function Home() {
  return (
    <MapCanvas />
  )
}
