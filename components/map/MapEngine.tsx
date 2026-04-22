'use client';

import { useEffect } from 'react';
import { MapContainer, TileLayer, Marker, Popup, Polyline, useMap } from 'react-leaflet';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import { Bin, DumpPoint, Route } from '@/lib/mock-data';

// Keep map centered on Korangi
const KORANGI_CENTER: [number, number] = [24.83, 67.135];

// Custom icons using standard Leaflet divIcon combined with our CSS animations
const createBinIcon = (status: string, isCritical: boolean) => {
  let bgColor = 'bg-emerald-500';
  if (status === 'Yellow') bgColor = 'bg-amber-400';
  if (status === 'Red') bgColor = 'bg-red-500';

  const pulseClass = isCritical ? 'animate-ping-slow' : '';
  const criticalRing = isCritical ? `<div class="absolute inset-0 rounded-full border-2 border-red-500 animate-ping opacity-75"></div>` : '';

  return L.divIcon({
    className: 'custom-bin-icon',
    html: `
      <div class="relative flex items-center justify-center w-6 h-6">
        ${criticalRing}
        <div class="w-4 h-4 rounded-full shadow-md ${bgColor} border-2 border-white relative z-10 transition-transform hover:scale-125"></div>
      </div>
    `,
    iconSize: [24, 24],
    iconAnchor: [12, 12],
    popupAnchor: [0, -12],
  });
};

const createDumpPointIcon = (capacity: number) => {
  let bgColor = 'bg-emerald-600';
  if (capacity >= 70 && capacity < 90) bgColor = 'bg-orange-500';
  if (capacity >= 90) bgColor = 'bg-red-600';

  const size = capacity >= 90 ? 32 : capacity >= 70 ? 28 : 24;

  return L.divIcon({
    className: 'custom-dp-icon',
    html: `
      <div class="relative flex items-center justify-center" style="width: ${size}px; height: ${size}px;">
        <div class="w-full h-full rounded-md shadow-lg ${bgColor} border-2 border-slate-900 flex items-center justify-center text-[10px] font-bold text-white transition-transform hover:scale-110">
          GTS
        </div>
      </div>
    `,
    iconSize: [size, size],
    iconAnchor: [size / 2, size / 2],
    popupAnchor: [0, -(size / 2)],
  });
};

interface MapEngineProps {
  bins: Bin[];
  dumpPoints: DumpPoint[];
  routes: Route[];
  showBins: boolean;
  showDumpPoints: boolean;
  showRoutes: boolean;
  showOnlyCritical: boolean;
}

// Component to handle auto-focus logic
function MapController({ bins, showOnlyCritical }: { bins: Bin[], showOnlyCritical: boolean }) {
  const map = useMap();
  useEffect(() => {
    if (showOnlyCritical) {
      const criticalBins = bins.filter(b => b.isCritical);
      if (criticalBins.length > 0) {
        const bounds = L.latLngBounds(criticalBins.map(b => [b.lat, b.lng]));
        map.flyToBounds(bounds, { padding: [50, 50], duration: 1.5 });
      }
    } else {
      map.flyTo(KORANGI_CENTER, 14, { duration: 1.5 });
    }
  }, [showOnlyCritical, bins, map]);
  
  return null;
}

export default function MapEngine({
  bins,
  dumpPoints,
  routes,
  showBins,
  showDumpPoints,
  showRoutes,
  showOnlyCritical
}: MapEngineProps) {
  
  const filteredBins = bins.filter(bin => showOnlyCritical ? bin.isCritical : true);

  return (
    <MapContainer 
      center={KORANGI_CENTER} 
      zoom={14} 
      className="w-full h-full z-0"
      zoomControl={false}
    >
      <TileLayer
        url="https://{s}.basemaps.cartocdn.com/rastertiles/voyager/{z}/{x}/{y}{r}.png"
        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors &copy; <a href="https://carto.com/attributions">CARTO</a>'
      />
      
      <MapController bins={bins} showOnlyCritical={showOnlyCritical} />

      {/* Render Routes */}
      {showRoutes && routes.map(route => (
        <Polyline 
          key={route.id} 
          positions={route.path} 
          pathOptions={{ color: '#3b82f6', weight: 4, opacity: 0.6, dashArray: '10, 10' }} 
        />
      ))}

      {/* Render Dumping Points */}
      {showDumpPoints && dumpPoints.map(dp => (
        <Marker 
          key={dp.id} 
          position={[dp.lat, dp.lng]} 
          icon={createDumpPointIcon(dp.capacityLevel)}
        >
          <Popup className="custom-popup">
            <div className="p-1">
              <h3 className="font-bold text-sm mb-1">{dp.name}</h3>
              <p className="text-xs text-muted-foreground">Capacity: <span className="font-semibold text-slate-900">{dp.capacityLevel}%</span></p>
              {dp.capacityLevel >= 90 && <p className="text-xs font-semibold text-red-600 mt-1">Warning: Nearing Maximum Capacity</p>}
            </div>
          </Popup>
        </Marker>
      ))}

      {/* Render Bins */}
      {showBins && filteredBins.map(bin => (
        <Marker 
          key={bin.id} 
          position={[bin.lat, bin.lng]}
          icon={createBinIcon(bin.status, bin.isCritical)}
        >
          <Popup className="custom-popup">
            <div className="p-1 min-w-[140px]">
              <div className="flex justify-between items-center mb-2">
                <h3 className="font-bold text-sm">Bin {bin.id.split('-')[1]}</h3>
                <span className={`text-[10px] px-2 py-0.5 rounded-full text-white ${
                  bin.status === 'Red' ? 'bg-red-500' : bin.status === 'Yellow' ? 'bg-amber-400' : 'bg-emerald-500'
                }`}>
                  {bin.status}
                </span>
              </div>
              <p className="text-xs text-muted-foreground line-clamp-1 mb-1">Fill Level: <span className="font-medium text-slate-800">{bin.fillLevel}%</span></p>
              <p className="text-xs text-muted-foreground">Last collected: <span className="font-medium text-slate-800">{Math.round((Date.now() - new Date(bin.lastCollectedAt).getTime()) / (1000 * 60 * 60))}h ago</span></p>
              {bin.isCritical && (
                <div className="mt-2 bg-red-100 text-red-700 text-xs p-1.5 rounded-md border border-red-200">
                  Critical: Requires immediate pickup.
                </div>
              )}
            </div>
          </Popup>
        </Marker>
      ))}
    </MapContainer>
  );
}
