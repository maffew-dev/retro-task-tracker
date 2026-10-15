import React from 'react';
import { StatsCards } from './StatsCards';
import { ActivityHeatmap } from './ActivityHeatmap';
import { DistributionCharts } from './DistributionCharts';
import { VibeWidget } from './VibeWidget';
import { Cpu } from 'lucide-react';


export const Dashboard: React.FC = () => {
  return (
    <div className="flex-1 p-4 sm:p-6 overflow-y-auto space-y-5">
      {/* Dashboard Window Header Banner */}
      <div className="bg-neutral-900 border-2 border-black retro-shadow p-3 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Cpu className="w-5 h-5 text-cyan-400" />
          <h2 className="font-pixel text-sm text-cyan-300">
            SYSTEM_ANALYTICS // DASHBOARD_v1.0
          </h2>
        </div>
        <div className="font-mono text-xs text-neutral-400">
          LOGGED IN: PILOT // METRICS SYNCHRONIZED
        </div>
      </div>

      {/* 1. Core Metrics Top Cards */}
      <StatsCards />

      {/* 2. Activity Heatmap & Vibe Check */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">
        <div className="lg:col-span-2">
          <ActivityHeatmap />
        </div>
        <div>
          <VibeWidget />
        </div>
      </div>

      {/* 3. Distribution & Upcoming Deadlines Radar */}
      <DistributionCharts />
    </div>
  );
};
