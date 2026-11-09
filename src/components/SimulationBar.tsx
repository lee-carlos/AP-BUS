import React from 'react';
import { DemoUser } from '../types/bus';
import { Clock, MapPin, Zap, AlertCircle, Sparkles, ShieldAlert, RotateCcw } from 'lucide-react';

interface SimulationBarProps {
  simulatedTimeStr: string;
  onSetTime: (timeStr: string) => void;
  currentUser: DemoUser;
  onToggleUserLocation: () => void;
  onTriggerStandbyRelease: () => void;
  onAddStrike: () => void;
  onResetStrikes: () => void;
}

export const SimulationBar: React.FC<SimulationBarProps> = ({
  simulatedTimeStr,
  onSetTime,
  currentUser,
  onToggleUserLocation,
  onTriggerStandbyRelease,
  onAddStrike,
  onResetStrikes,
}) => {
  return (
    <div className="bg-slate-900 border-t border-slate-800 p-3 text-xs space-y-2.5">
      <div className="flex items-center justify-between text-[11px] text-slate-400 font-semibold uppercase tracking-wider">
        <span className="flex items-center gap-1.5 text-blue-400">
          <Zap className="w-3.5 h-3.5" /> Interactive Rule Simulator
        </span>
        <span className="text-[10px] text-slate-400 font-normal">
          Multi-Booking & Anti-Troller Defense
        </span>
      </div>

      {/* Time presets */}
      <div className="flex items-center gap-1.5 overflow-x-auto no-scrollbar pb-1">
        <span className="text-[10px] text-slate-400 shrink-0 font-mono">Time:</span>
        {[
          { label: '07:20 AM (Locked)', value: '07:20' },
          { label: '07:35 AM (Open)', value: '07:35' },
          { label: '08:38 AM (Check-in Window)', value: '08:38' },
          { label: '08:45 AM (Departing)', value: '08:45' },
          { label: '17:00 PM (Evening Peak)', value: '17:00' },
        ].map((preset) => (
          <button
            key={preset.value}
            onClick={() => onSetTime(preset.value)}
            className={`px-2 py-1 rounded-lg text-[10px] font-mono whitespace-nowrap transition ${
              simulatedTimeStr === preset.value
                ? 'bg-blue-600 text-white font-bold'
                : 'bg-slate-800 text-slate-300 hover:bg-slate-700'
            }`}
          >
            {preset.label}
          </button>
        ))}
      </div>

      {/* Row 1: Location toggle & Standby release */}
      <div className="grid grid-cols-2 gap-2 pt-1 border-t border-slate-800/80">
        <button
          onClick={onToggleUserLocation}
          className={`px-2.5 py-1.5 rounded-xl border flex items-center justify-center gap-1 text-[11px] font-medium transition ${
            currentUser.isNearStop
              ? 'bg-emerald-950/40 border-emerald-500/40 text-emerald-300 hover:bg-emerald-950/60'
              : 'bg-amber-950/40 border-amber-500/40 text-amber-300 hover:bg-amber-950/60'
          }`}
          title="Toggle between standing inside 250m stop radius and being far away"
        >
          <MapPin className="w-3 h-3" />
          <span>{currentUser.isNearStop ? 'GPS: In 250m Zone (<50m)' : 'GPS: Outside Zone (~9km)'}</span>
        </button>

        <button
          onClick={onTriggerStandbyRelease}
          className="px-2.5 py-1.5 rounded-xl bg-purple-950/40 border border-purple-500/40 hover:bg-purple-900/50 text-purple-300 flex items-center justify-center gap-1 text-[11px] font-medium transition"
          title="Simulate a no-show on a full bus to trigger FCFS standby notification"
        >
          <Sparkles className="w-3 h-3 text-purple-400" />
          <span>Simulate No-Show</span>
        </button>
      </div>

      {/* Row 2: Penalty / Anti-Troller Testing Controls */}
      <div className="grid grid-cols-2 gap-2 pt-1 border-t border-slate-800/80">
        <button
          onClick={onAddStrike}
          className="px-2.5 py-1 rounded-xl bg-rose-950/30 border border-rose-500/30 hover:bg-rose-950/50 text-rose-300 flex items-center justify-center gap-1 text-[10px] font-medium transition"
          title="Simulate a penalty strike (+1 strike) for seat trolling / late cancellation"
        >
          <ShieldAlert className="w-3 h-3 text-rose-400" />
          <span>Test +1 Penalty Strike ({currentUser.penaltyStrikes}/3)</span>
        </button>

        <button
          onClick={onResetStrikes}
          disabled={currentUser.penaltyStrikes === 0}
          className="px-2.5 py-1 rounded-xl bg-slate-800 border border-slate-700/60 hover:bg-slate-700 disabled:opacity-40 text-slate-300 flex items-center justify-center gap-1 text-[10px] font-medium transition"
          title="Reset penalty strikes back to 0 (Clean Record)"
        >
          <RotateCcw className="w-3 h-3 text-slate-400" />
          <span>Reset Strikes (Clean)</span>
        </button>
      </div>
    </div>
  );
};
