'use client'

import { useEffect, useRef, useState } from 'react'

interface MapProps {
  center?: [number, number]
  zoom?: number
}

export default function Map({
  center = [60.3913, 5.3221], // Bergen, Norway
  zoom = 13
}: MapProps) {
  const mapRef = useRef<HTMLDivElement>(null)
  const [isLoaded, setIsLoaded] = useState(false)
  const mapInstanceRef = useRef<unknown>(null)

  useEffect(() => {
    if (!mapRef.current || mapInstanceRef.current) return

    // Dynamically load CSS
    const link = document.createElement('link')
    link.rel = 'stylesheet'
    link.href = 'https://unpkg.com/leaflet@1.9.4/dist/leaflet.css'
    document.head.appendChild(link)

    // Dynamically import leaflet
    import('leaflet').then((L) => {
      if (!mapRef.current || mapInstanceRef.current) return

      const map = L.map(mapRef.current).setView(center, zoom)
      mapInstanceRef.current = map

      L.tileLayer('https://cache.kartverket.no/v1/wmts/1.0.0/topo/default/webmercator/{z}/{y}/{x}.png', {
        attribution: '&copy; <a href="http://www.kartverket.no/">Kartverket</a>'
      }).addTo(map)

      const icon = L.icon({
        iconUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png',
        iconRetinaUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png',
        shadowUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png',
        iconSize: [25, 41],
        iconAnchor: [12, 41],
        popupAnchor: [1, -34],
        shadowSize: [41, 41]
      })

      L.marker(center, { icon })
        .addTo(map)
        .bindPopup(`
          <div style="text-align: center;">
            <strong>NorthVenture</strong><br />
            Strandgaten 123<br />
            5013 Bergen, Norway
          </div>
        `)

      map.scrollWheelZoom.disable()
      setIsLoaded(true)
    })

    return () => {
      if (mapInstanceRef.current) {
        (mapInstanceRef.current as { remove: () => void }).remove()
        mapInstanceRef.current = null
      }
    }
  }, [center, zoom])

  return (
    <div className="h-full w-full relative">
      {!isLoaded && (
        <div className="absolute inset-0 bg-gray-100 animate-pulse rounded-2xl" />
      )}
      <div ref={mapRef} className="h-full w-full rounded-2xl" />
    </div>
  )
}
