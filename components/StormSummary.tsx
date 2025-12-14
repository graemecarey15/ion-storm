import React, { useMemo } from 'react';
import { Storm } from '../types';

interface StormSummaryProps {
  storm?: Storm | null;
  identityColor?: string;
}

const StormSummary: React.FC<StormSummaryProps> = ({ storm, identityColor }) => {
  const stats = useMemo(() => {
    if (!storm || !storm.track || storm.track.length === 0) {
      return {
        peakWind: 0,
        minPressure: 0,
        landfalls: [],
        category: 'N/A',
        catColor: 'text-slate-500',
        durationDays: 0
      };
    }

    const winds = storm.track.map(t => t.maxWind);
    const pressures = storm.track.map(t => t.minPressure).filter(p => p > 0);

    const peakWind = Math.max(...winds);
    const minPressure = pressures.length > 0 ? Math.min(...pressures) : 0;

    const landfalls = storm.track.filter(t => t.recordIdentifier === 'L');

    // Category Calculation
    let category = 'Tropical Storm';
    let catColor = 'text-emerald-400';
    if (peakWind < 34) { category = 'Depression'; catColor = 'text-blue-400'; }
    else if (peakWind >= 64 && peakWind < 83) { category = 'Category 1'; catColor = 'text-yellow-400'; }
    else if (peakWind >= 83 && peakWind < 96) { category = 'Category 2'; catColor = 'text-yellow-500'; }
    else if (peakWind >= 96 && peakWind < 113) { category = 'Category 3'; catColor = 'text-orange-400'; }
    else if (peakWind >= 113 && peakWind < 137) { category = 'Category 4'; catColor = 'text-red-400'; }
    else if (peakWind >= 137) { category = 'Category 5'; catColor = 'text-purple-400'; }

    // Duration Calculation
    const start = new Date(storm.track[0].datetime);
    const end = new Date(storm.track[storm.track.length - 1].datetime);
    const diffTime = Math.abs(end.getTime() - start.getTime());
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

    return {
      peakWind,
      minPressure,
      landfalls,
      category,
      catColor,
      durationDays: diffDays
    };
  }, [storm]);

  const headerColor = identityColor || '#94a3b8';

  return (
    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
      {/* Peak Intensity Card */}
      <div className="relative group bg-hull/40 border border-white/5 p-4 rounded-sm hover:border-cyan-500/30 transition-all backdrop-blur-sm">
        <div className="absolute top-0 right-0 p-1 opacity-20"><div className="w-1 h-1 bg-cyan-400 rounded-full"></div></div>

        <div>
          <p className="text-[10px] font-sans font-bold uppercase tracking-widest mb-2 opacity-80" style={{ color: headerColor }}>
            Peak Intensity
          </p>
          <div className="flex items-baseline gap-2">
            <h4 className={`text-3xl font-mono font-bold ${stats.peakWind > 0 ? stats.catColor : 'text-slate-700'}`}>
              {stats.peakWind > 0 ? stats.peakWind : '---'}
            </h4>
            <span className="text-[10px] text-slate-500 font-mono uppercase">kts</span>
          </div>
        </div>
        <div className={`mt-3 text-[10px] font-mono uppercase tracking-wider px-2 py-0.5 border border-white/5 inline-block ${stats.peakWind > 0 ? stats.catColor : 'text-slate-600'}`}>
          [{stats.category}]
        </div>
      </div>

      {/* Min Pressure Card */}
      <div className="relative group bg-hull/40 border border-white/5 p-4 rounded-sm hover:border-cyan-500/30 transition-all backdrop-blur-sm">
        <p className="text-[10px] font-sans font-bold uppercase tracking-widest mb-2 opacity-80" style={{ color: headerColor }}>Pressure</p>
        <div className="flex items-baseline gap-2">
          <h4 className={`text-3xl font-mono font-bold ${stats.minPressure > 0 ? 'text-rose-400' : 'text-slate-700'}`}>
            {stats.minPressure > 0 ? stats.minPressure : '---'}
          </h4>
          <span className="text-[10px] text-slate-500 font-mono uppercase">mb</span>
        </div>
        <div className="w-full bg-slate-800/50 h-0.5 mt-3 overflow-hidden">
          <div className="h-full bg-rose-500/50 w-2/3"></div>
        </div>
      </div>

      {/* Landfalls Card */}
      <div className="relative group bg-hull/40 border border-white/5 p-4 rounded-sm hover:border-cyan-500/30 transition-all backdrop-blur-sm">
        <p className="text-[10px] font-sans font-bold uppercase tracking-widest mb-2 opacity-80" style={{ color: headerColor }}>Impacts</p>
        <div className="flex items-baseline gap-2">
          <h4 className={`text-3xl font-mono font-bold ${stats.landfalls.length > 0 ? 'text-emerald-400' : 'text-slate-700'}`}>
            {stats.landfalls.length}
          </h4>
          <span className="text-[10px] text-slate-500 font-mono uppercase">Events</span>
        </div>
        <div className="mt-3 flex flex-wrap gap-1">
          {stats.landfalls.length > 0 ? (
            stats.landfalls.slice(0, 3).map((l, i) => (
              <span key={i} className="text-[9px] bg-emerald-900/20 text-emerald-400 px-1.5 py-0.5 border border-emerald-500/20 font-mono">
                {l.date.slice(5)}
              </span>
            ))
          ) : (
            <span className="text-[9px] text-slate-600 font-mono uppercase">Open Water</span>
          )}
        </div>
      </div>

      {/* Duration Card */}
      <div className="relative group bg-hull/40 border border-white/5 p-4 rounded-sm hover:border-cyan-500/30 transition-all backdrop-blur-sm">
        <p className="text-[10px] font-sans font-bold uppercase tracking-widest mb-2 opacity-80" style={{ color: headerColor }}>Duration</p>
        <div className="flex items-baseline gap-2">
          <h4 className={`text-3xl font-mono font-bold ${stats.durationDays > 0 ? 'text-blue-400' : 'text-slate-700'}`}>
            {stats.durationDays > 0 ? stats.durationDays : '-'}
          </h4>
          <span className="text-[10px] text-slate-500 font-mono uppercase">Days</span>
        </div>
        <p className="text-[9px] text-slate-500 mt-3 font-mono">
          {storm && storm.track.length > 0 ? (
            <>
              <span className="text-slate-400">{storm.track[0].date.slice(5)}</span>
              <span className="mx-1 text-slate-600">→</span>
              <span className="text-slate-400">{storm.track[storm.track.length - 1].date.slice(5)}</span>
            </>
          ) : 'NO_DATA'}
        </p>
      </div>
    </div>
  );
};

export default StormSummary;