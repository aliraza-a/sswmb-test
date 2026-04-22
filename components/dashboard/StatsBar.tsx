import { Bin, DumpPoint } from '@/lib/mock-data';
import { Card, CardContent } from '@/components/ui/card';
import { Trash2, AlertTriangle, CheckCircle, Factory } from 'lucide-react';
import { useEffect, useState } from 'react';

// A generic animated counter component
function AnimatedCounter({ value }: { value: number }) {
  const [displayedValue, setDisplayedValue] = useState(0);

  useEffect(() => {
    let start = displayedValue;
    const end = value;
    if (start === end) return;
    
    const duration = 1000;
    const startTime = performance.now();
    
    const animate = (currentTime: number) => {
      const elapsed = currentTime - startTime;
      const progress = Math.min(elapsed / duration, 1);
      
      const easeProgress = progress === 1 ? 1 : 1 - Math.pow(2, -10 * progress);
      setDisplayedValue(Math.floor(start + (end - start) * easeProgress));
      
      if (progress < 1) requestAnimationFrame(animate);
    };
    
    requestAnimationFrame(animate);
  }, [value, displayedValue]);

  return <span>{displayedValue}</span>;
}

export default function StatsBar({ bins, dumpPoints }: { bins: Bin[], dumpPoints: DumpPoint[] }) {
  const totalBins = bins.length;
  const criticalBins = bins.filter(b => b.isCritical).length;
  // Let's pretend collections in last 24h
  const collections24h = bins.filter(b => (Date.now() - new Date(b.lastCollectedAt).getTime()) < 24 * 60 * 60 * 1000).length;
  const criticalDumps = dumpPoints.filter(d => d.capacityLevel >= 80).length;

  const stats = [
    { title: 'Total Active Bins', value: totalBins, icon: Trash2 },
    { title: 'Requires Action', value: criticalBins, icon: AlertTriangle },
    { title: 'Collections (24h)', value: collections24h, icon: CheckCircle },
    { title: 'GTS Near Capacity', value: criticalDumps, icon: Factory },
  ];

  return (
    <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 md:gap-4">
      {stats.map((stat) => (
        <Card key={stat.title}>
          <CardContent className="p-3 md:p-4 flex items-center justify-between">
            <div className="min-w-0">
              <p className="text-xs md:text-sm font-medium text-muted-foreground leading-tight truncate">{stat.title}</p>
              <h3 className="text-xl md:text-2xl font-bold mt-0.5">
                <AnimatedCounter value={stat.value} />
              </h3>
            </div>
            <div className="shrink-0 text-muted-foreground ml-2">
              <stat.icon size={18} />
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}
