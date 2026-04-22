import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';
import { Switch } from '../ui/switch';
import { Badge } from '../ui/badge';
import { motion } from 'framer-motion';
import { Layers, Filter, Activity, MapPin } from 'lucide-react';
import { Dispatch, SetStateAction } from 'react';

interface SidebarProps {
  showBins: boolean;
  setShowBins: Dispatch<SetStateAction<boolean>>;
  showDumpPoints: boolean;
  setShowDumpPoints: Dispatch<SetStateAction<boolean>>;
  showRoutes: boolean;
  setShowRoutes: Dispatch<SetStateAction<boolean>>;
  showOnlyCritical: boolean;
  setShowOnlyCritical: Dispatch<SetStateAction<boolean>>;
}

export default function Sidebar({
  showBins, setShowBins,
  showDumpPoints, setShowDumpPoints,
  showRoutes, setShowRoutes,
  showOnlyCritical, setShowOnlyCritical
}: SidebarProps) {

  return (
    <motion.div
      initial={{ x: -300, opacity: 0 }}
      animate={{ x: 0, opacity: 1 }}
      transition={{ type: 'spring', damping: 25, stiffness: 200 }}
      className="absolute left-4 top-24 bottom-4 w-72 z-10 hidden md:flex flex-col gap-4 pointer-events-none"
    >
      <div className="pointer-events-auto h-full flex flex-col gap-4 max-h-[calc(100vh-120px)] overflow-y-auto pr-1 pb-4 no-scrollbar">

        {/* Layers Control */}
        <Card className="bg-white/90 dark:bg-slate-950/90 backdrop-blur border-slate-200 dark:border-slate-800 shadow-sm shrink-0">
          <CardHeader className="pb-3 border-b border-slate-100 dark:border-slate-800">
            <CardTitle className="text-sm font-semibold flex items-center gap-2">
              <Layers size={16} /> Map Layers
            </CardTitle>
          </CardHeader>
          <CardContent className="pt-4 space-y-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 rounded-full bg-emerald-500 shadow-sm" />
                <span className="text-sm font-medium">Garbage Bins</span>
              </div>
              <Switch checked={showBins} onCheckedChange={setShowBins} />
            </div>
            
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <MapPin size={14} className="text-orange-500" />
                <span className="text-sm font-medium">Transfer Stations (GTS)</span>
              </div>
              <Switch checked={showDumpPoints} onCheckedChange={setShowDumpPoints} />
            </div>

            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Activity size={14} className="text-blue-500" />
                <span className="text-sm font-medium">Collection Routes</span>
              </div>
              <Switch checked={showRoutes} onCheckedChange={setShowRoutes} />
            </div>
          </CardContent>
        </Card>

        {/* Operational Filters */}
        <Card className="bg-white/90 dark:bg-slate-950/90 backdrop-blur border-slate-200 dark:border-slate-800 shadow-sm shrink-0">
          <CardHeader className="pb-3 border-b border-slate-100 dark:border-slate-800">
            <CardTitle className="text-sm font-semibold flex items-center gap-2">
              <Filter size={16} /> Operational Filters
            </CardTitle>
          </CardHeader>
          <CardContent className="pt-4">
            <div className="flex items-center justify-between p-3 bg-red-50 dark:bg-red-950/30 border border-red-100 dark:border-red-900 rounded-lg">
              <div className="flex flex-col">
                <span className="text-sm font-bold text-red-700 dark:text-red-400">Critical Action Only</span>
                <span className="text-xs text-red-600/70 dark:text-red-400/70">{">"} 24h & High Capacity</span>
              </div>
              <Switch 
                checked={showOnlyCritical} 
                onCheckedChange={(checked) => {
                  setShowOnlyCritical(checked);
                  if (checked) {
                    setShowBins(true); // Auto-enable bins to show critical ones
                  }
                }} 
              />
            </div>
          </CardContent>
        </Card>

        {/* Map Legend */}
        <Card className="bg-white/90 dark:bg-slate-950/90 backdrop-blur border-slate-200 dark:border-slate-800 shadow-sm shrink-0">
          <CardHeader className="pb-2">
            <CardTitle className="text-xs font-semibold uppercase text-slate-500">Legend</CardTitle>
          </CardHeader>
          <CardContent className="space-y-2 pb-4">
            <div className="flex flex-wrap gap-2">
              <Badge variant="outline" className="bg-emerald-50 dark:bg-emerald-950 border-emerald-200 text-emerald-700 dark:text-emerald-400">
                <div className="w-2 h-2 rounded-full bg-emerald-500 mr-2" /> {"<"}50% Full
              </Badge>
              <Badge variant="outline" className="bg-amber-50 dark:bg-amber-950 border-amber-200 text-amber-700 dark:text-amber-400">
                <div className="w-2 h-2 rounded-full bg-amber-500 mr-2" /> 50%-89% Full
              </Badge>
              <Badge variant="outline" className="bg-red-50 dark:bg-red-950 border-red-200 text-red-700 dark:text-red-400">
                <div className="w-2 h-2 rounded-full bg-red-500 mr-2" /> {">="}90% Full
              </Badge>
            </div>
          </CardContent>
        </Card>
      </div>
    </motion.div>
  );
}
