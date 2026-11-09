import React, { useState } from 'react';
import { APU_STOPS } from '../data/apuRoutes';
import { BusStop } from '../types/bus';
import { Search, MapPin, X, ArrowRight, ShieldCheck, Bus } from 'lucide-react';

interface SearchModalProps {
  onSelectRoute: (fromStop: BusStop, toStop: BusStop) => void;
  onOpenBooking: () => void;
  onClose: () => void;
}

export const SearchModal: React.FC<SearchModalProps> = ({
  onSelectRoute,
  onOpenBooking,
  onClose,
}) => {
  const [query, setQuery] = useState('');

  const apuStop = APU_STOPS.find((s) => s.id === 'apu') || APU_STOPS[0];

  const matchedStops = APU_STOPS.filter(
    (s) =>
      s.name.toLowerCase().includes(query.toLowerCase()) ||
      s.shortCode.toLowerCase().includes(query.toLowerCase()) ||
      s.address.toLowerCase().includes(query.toLowerCase())
  );

  return (
    <div className="fixed inset-0 z-50 bg-slate-950/85 backdrop-blur-sm flex items-start sm:items-center justify-center p-4 pt-14 animate-in fade-in duration-150">
      <div className="w-full max-w-md bg-slate-900 border border-slate-800 rounded-3xl shadow-2xl overflow-hidden flex flex-col max-h-[80vh]">
        {/* Search Input Bar */}
        <div className="p-3 border-b border-slate-800 flex items-center gap-2 bg-slate-950/50">
          <Search className="w-4 h-4 text-blue-400 shrink-0 ml-1" />
          <input
            type="text"
            placeholder="Search stops, routes, residences (e.g. LRT, Fortune Park, M Vertica)..."
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            autoFocus
            className="flex-1 bg-transparent border-none text-xs text-white placeholder-slate-500 focus:outline-none"
          />
          <button
            onClick={onClose}
            className="p-1 rounded-lg hover:bg-slate-800 text-slate-400 hover:text-white"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Quick Actions */}
        <div className="p-3 border-b border-slate-800/80 bg-slate-900/60 flex items-center justify-between text-xs">
          <span className="text-[11px] text-slate-400">Quick Actions:</span>
          <button
            onClick={() => {
              onClose();
              onOpenBooking();
            }}
            className="text-blue-400 hover:text-blue-300 font-semibold flex items-center gap-1"
          >
            <Bus className="w-3.5 h-3.5" /> View Full Timetable
          </button>
        </div>

        {/* Results */}
        <div className="flex-1 overflow-y-auto p-2 divide-y divide-slate-800/50">
          {matchedStops.map((stop) => (
            <div
              key={stop.id}
              className="p-3 hover:bg-slate-800/80 rounded-xl transition flex items-center justify-between group"
            >
              <div className="flex items-start gap-2.5">
                <div className="w-7 h-7 rounded-lg bg-slate-800 border border-slate-700 flex items-center justify-center text-slate-300 shrink-0 mt-0.5">
                  <MapPin className="w-3.5 h-3.5 text-blue-400" />
                </div>
                <div>
                  <div className="flex items-center gap-1.5">
                    <span className="text-xs font-bold text-white">{stop.name}</span>
                    <span className="text-[9px] font-mono px-1 py-0.5 rounded bg-slate-800 text-slate-300">
                      {stop.shortCode}
                    </span>
                  </div>
                  <p className="text-[10px] text-slate-400 truncate max-w-xs">{stop.address}</p>
                </div>
              </div>

              {stop.id !== 'apu' && (
                <button
                  onClick={() => {
                    onSelectRoute(stop, apuStop);
                    onClose();
                  }}
                  className="px-2.5 py-1 rounded-lg bg-blue-600/20 hover:bg-blue-600 text-blue-300 hover:text-white text-[11px] font-medium transition flex items-center gap-1 shrink-0"
                >
                  <span>Route to APU</span>
                  <ArrowRight className="w-3 h-3" />
                </button>
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
