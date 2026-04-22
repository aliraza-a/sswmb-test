'use client';

import { useState } from 'react';
import { SidebarProvider, SidebarInset, SidebarTrigger } from '@/components/ui/sidebar';
import { Separator } from '@/components/ui/separator';
import { AppSidebar } from '@/components/app-sidebar';
import Map from '@/components/map/Map';
import StatsBar from '@/components/dashboard/StatsBar';
import Charts from '@/components/dashboard/Charts';
import { mockBins, mockDumpPoints, mockRoutes } from '@/lib/mock-data';
import { Card, CardContent } from '@/components/ui/card';

export default function Page() {
  const [showBins, setShowBins] = useState(true);
  const [showDumpPoints, setShowDumpPoints] = useState(true);
  const [showRoutes, setShowRoutes] = useState(true);
  const [showOnlyCritical, setShowOnlyCritical] = useState(false);

  return (
    <SidebarProvider>
      <AppSidebar 
        showBins={showBins} setShowBins={setShowBins}
        showDumpPoints={showDumpPoints} setShowDumpPoints={setShowDumpPoints}
        showRoutes={showRoutes} setShowRoutes={setShowRoutes}
        showOnlyCritical={showOnlyCritical} setShowOnlyCritical={setShowOnlyCritical}
      />
      <SidebarInset className="flex flex-col flex-1 min-h-screen md:h-screen overflow-hidden">
        
        {/* Top Header */}
        <header className="flex shrink-0 items-center gap-2 border-b bg-background px-3 py-2 md:px-4 md:py-0 h-12 md:h-14">
          <SidebarTrigger className="shrink-0" />
          <Separator orientation="vertical" className="mr-1 md:mr-2 h-4" />
          <div className="flex flex-col min-w-0">
            <h1 className="text-sm font-semibold truncate">SSWMB Dashboard</h1>
            <p className="text-xs text-muted-foreground hidden sm:block">Operational Overview</p>
          </div>
        </header>

        {/* Scrollable Main Content */}
        <div className="flex flex-1 flex-col gap-4 md:gap-6 p-3 md:p-6 overflow-auto bg-muted/30">
          
          {/* Key Metrics */}
          <StatsBar bins={mockBins} dumpPoints={mockDumpPoints} />

          {/* GIS Map Canvas wrapped in a standard SaaS Card Container */}
          <Card className="flex flex-col flex-1 min-h-[350px] sm:min-h-[420px] lg:min-h-[550px] overflow-hidden shadow-sm">
            <div className="border-b p-4 bg-muted/20">
              <h2 className="text-sm font-semibold">Live GIS Tracking</h2>
            </div>
            <CardContent className="flex-1 p-0 relative">
              <Map 
                bins={mockBins}
                dumpPoints={mockDumpPoints}
                routes={mockRoutes}
                showBins={showBins}
                showDumpPoints={showDumpPoints}
                showRoutes={showRoutes}
                showOnlyCritical={showOnlyCritical}
              />
            </CardContent>
          </Card>

          {/* Supplemental Data Charts */}
          <Charts bins={mockBins} />

        </div>
      </SidebarInset>
    </SidebarProvider>
  );
}
