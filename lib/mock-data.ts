export type BinStatus = 'Green' | 'Yellow' | 'Red';

export interface Bin {
  id: string;
  lat: number;
  lng: number;
  fillLevel: number; // 0 to 100
  status: BinStatus;
  lastCollectedAt: string; // ISO date string
  isCritical: boolean;
  assignedDumpPointId: string;
}

export interface DumpPoint {
  id: string;
  name: string;
  lat: number;
  lng: number;
  capacityLevel: number; // 0 to 100
}

export interface Route {
  id: string;
  name: string;
  path: [number, number][]; // Array of [lat, lng]
}

// Helper to generate a random coordinate within bounds
function getRandomCoord(min: number, max: number) {
  return Math.random() * (max - min) + min;
}

// Helper to calculate distance between two coordinates in km
export function calculateDistance(lat1: number, lon1: number, lat2: number, lon2: number) {
  const p = 0.017453292519943295;    // Math.PI / 180
  const c = Math.cos;
  const a = 0.5 - c((lat2 - lat1) * p)/2 + 
          c(lat1 * p) * c(lat2 * p) * 
          (1 - c((lon2 - lon1) * p))/2;

  return 12742 * Math.asin(Math.sqrt(a)); // 2 * R; R = 6371 km
}

// Generate Dump Points
export const mockDumpPoints: DumpPoint[] = [
  { id: 'dp-1', name: 'Korangi Sector 4 GTS', lat: 24.825, lng: 67.125, capacityLevel: 45 },
  { id: 'dp-2', name: 'Mehran Town Dump Site', lat: 24.845, lng: 67.145, capacityLevel: 85 }, // Critical
  { id: 'dp-3', name: 'Korangi Industrial Area Hub', lat: 24.832, lng: 67.112, capacityLevel: 60 },
  { id: 'dp-4', name: 'Zaman Town Node', lat: 24.815, lng: 67.135, capacityLevel: 92 }, // Critical
];

// Generate 75 Mock Bins around Korangi
export const mockBins: Bin[] = Array.from({ length: 75 }).map((_, i) => {
  const lat = getRandomCoord(24.81, 24.85);
  const lng = getRandomCoord(67.11, 67.16);
  
  const fillLevel = Math.floor(Math.random() * 100);
  let status: BinStatus = 'Green';
  if (fillLevel >= 50 && fillLevel < 90) status = 'Yellow';
  if (fillLevel >= 90) status = 'Red';

  // Last collected between 1 hour and 48 hours ago
  const hoursAgo = Math.floor(Math.random() * 48) + 1;
  const lastCollectedAt = new Date(Date.now() - hoursAgo * 60 * 60 * 1000).toISOString();
  
  const isCritical = status === 'Red' && hoursAgo > 24;

  // Find nearest dump point
  let nearestDumpPtId = mockDumpPoints[0].id;
  let minDistance = Infinity;
  mockDumpPoints.forEach(dp => {
    const d = calculateDistance(lat, lng, dp.lat, dp.lng);
    if (d < minDistance) {
      minDistance = d;
      nearestDumpPtId = dp.id;
    }
  });

  return {
    id: `bin-${i + 1}`,
    lat,
    lng,
    fillLevel,
    status,
    lastCollectedAt,
    isCritical,
    assignedDumpPointId: nearestDumpPtId,
  };
});

// Generate Mock Routes linking some bins
export const mockRoutes: Route[] = [
  {
    id: 'route-1',
    name: 'Sector 4 Cleanup Route',
    path: [
      [24.825, 67.125], // DP-1
      ...mockBins.filter(b => b.assignedDumpPointId === 'dp-1').slice(0, 5).map(b => [b.lat, b.lng] as [number, number]),
      [24.825, 67.125],
    ]
  },
  {
    id: 'route-2',
    name: 'Industrial Area Main',
    path: [
      [24.832, 67.112], // DP-3
      ...mockBins.filter(b => b.assignedDumpPointId === 'dp-3').slice(0, 6).map(b => [b.lat, b.lng] as [number, number]),
      [24.832, 67.112],
    ]
  },
  {
    id: 'route-3',
    name: 'East Korangi Collection',
    path: [
      [24.845, 67.145], // DP-2
      ...mockBins.filter(b => b.assignedDumpPointId === 'dp-2').slice(0, 4).map(b => [b.lat, b.lng] as [number, number]),
      [24.845, 67.145],
    ]
  }
];
