import { ShieldAlert, Layers, MapPin, Activity, Filter } from 'lucide-react';
import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarSeparator,
} from '@/components/ui/sidebar';
import { Switch } from '@/components/ui/switch';
import { Badge } from '@/components/ui/badge';
import { Dispatch, SetStateAction } from 'react';

interface AppSidebarProps {
  showBins: boolean;
  setShowBins: Dispatch<SetStateAction<boolean>>;
  showDumpPoints: boolean;
  setShowDumpPoints: Dispatch<SetStateAction<boolean>>;
  showRoutes: boolean;
  setShowRoutes: Dispatch<SetStateAction<boolean>>;
  showOnlyCritical: boolean;
  setShowOnlyCritical: Dispatch<SetStateAction<boolean>>;
}

export function AppSidebar({
  showBins, setShowBins,
  showDumpPoints, setShowDumpPoints,
  showRoutes, setShowRoutes,
  showOnlyCritical, setShowOnlyCritical
}: AppSidebarProps) {
  return (
    <Sidebar variant="inset">
      <SidebarHeader className="flex flex-row items-center gap-2 p-4 pb-2">
        <div className="flex aspect-square size-8 items-center justify-center rounded-lg bg-emerald-600 text-white shadow">
          <ShieldAlert size={18} />
        </div>
        <div className="grid flex-1 text-left text-sm leading-tight">
          <span className="truncate font-semibold">SSWMB</span>
          <span className="truncate text-xs text-muted-foreground">Control Room Pilot</span>
        </div>
      </SidebarHeader>

      <SidebarSeparator className="mx-2" />

      <SidebarContent>
        {/* Layers Section */}
        <SidebarGroup>
          <SidebarGroupLabel>Map Layers</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              <SidebarMenuItem>
                <div className="flex w-full items-center justify-between px-2 py-2">
                  <div className="flex items-center gap-3">
                    <Layers size={16} className="text-muted-foreground" />
                    <span className="text-sm">Garbage Bins</span>
                  </div>
                  <Switch checked={showBins} onCheckedChange={setShowBins} />
                </div>
              </SidebarMenuItem>
              
              <SidebarMenuItem>
                <div className="flex w-full items-center justify-between px-2 py-2">
                  <div className="flex items-center gap-3">
                    <MapPin size={16} className="text-muted-foreground" />
                    <span className="text-sm">Transfer Stations</span>
                  </div>
                  <Switch checked={showDumpPoints} onCheckedChange={setShowDumpPoints} />
                </div>
              </SidebarMenuItem>
              
              <SidebarMenuItem>
                <div className="flex w-full items-center justify-between px-2 py-2">
                  <div className="flex items-center gap-3">
                    <Activity size={16} className="text-muted-foreground" />
                    <span className="text-sm">Collection Routes</span>
                  </div>
                  <Switch checked={showRoutes} onCheckedChange={setShowRoutes} />
                </div>
              </SidebarMenuItem>
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>

        <SidebarSeparator className="mx-2" />

        {/* Filters Section */}
        <SidebarGroup>
          <SidebarGroupLabel>Filters</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              <SidebarMenuItem>
                <div className="flex w-full flex-col justify-between gap-3 rounded-md bg-red-50 dark:bg-red-950/20 px-3 py-3 border border-red-100 dark:border-red-900/30">
                  <div className="flex w-full items-center justify-between">
                    <div className="flex items-center gap-2 text-red-600 dark:text-red-400">
                      <Filter size={16} />
                      <span className="text-sm font-medium">Critical Action</span>
                    </div>
                    <Switch 
                      checked={showOnlyCritical} 
                      onCheckedChange={(c) => {
                        setShowOnlyCritical(c);
                        if (c) setShowBins(true);
                      }} 
                    />
                  </div>
                  <p className="text-xs text-red-500/80">Only show items requiring immediate attention</p>
                </div>
              </SidebarMenuItem>
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
        
        <SidebarSeparator className="mx-2" />
        
        <SidebarGroup>
          <SidebarGroupLabel>Legend</SidebarGroupLabel>
          <SidebarGroupContent className="px-2 pt-2">
            <div className="flex flex-col gap-2">
              <div className="flex items-center gap-2">
                <div className="h-3 w-3 rounded-full bg-emerald-500" />
                <span className="text-xs text-muted-foreground">&lt; 50% Full (Healthy)</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="h-3 w-3 rounded-full bg-amber-500" />
                <span className="text-xs text-muted-foreground">50% - 89% Full (Warning)</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="h-3 w-3 rounded-full bg-red-500" />
                <span className="text-xs text-muted-foreground">&ge; 90% Full (Critical)</span>
              </div>
            </div>
          </SidebarGroupContent>
        </SidebarGroup>

      </SidebarContent>
    </Sidebar>
  );
}
