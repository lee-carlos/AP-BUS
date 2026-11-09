import React, { useState } from 'react';
import { APU_STOPS } from '../data/apuRoutes';
import { BusStop } from '../types/bus';
import { ArrowUpDown, MapPin, Navigation, X, Check } from 'lucide-react';

interface RouteFilterProps {
  selectedFrom: BusStop | null;
  selectedTo: BusStop | null;
  onSelectFrom: (stop: BusStop | null) => void;
  onSelectTo: (stop: BusStop | null) => void;
  onSwap: () => void;
}

export const RouteFilter: React.FC<RouteFilterProps> = ({
  selectedFrom,
  selectedTo,
  onSelectFrom,
  onSelectTo,
  onSwap,
}) => {
  const [openSelect, setOpenSelect] = useState<'from' | 'to' | null>(null);
  const [searchQuery, setSearchQuery] = useState('');

  const filteredStops = APU_STOPS.filter((s) =>
    s.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    s.shortCode.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleSelect = (stop: BusStop) => {
    if (openSelect === 'from') {
      onSelectFrom(stop);
      // Auto-set To as APU if From is not APU and To is empty
      if (!selectedTo && stop.id !== 'apu') {
        const apu = APU_STOPS.find((s) => s.id === 'apu') || null;
        onSelectTo(apu);
      }
    } else if (openSelect === 'to') {
      onSelectTo(stop);
    }
    setOpenSelect(null);
    setSearchQuery('');
  };

  const isFiltered = Boolean(selectedFrom && selectedTo);

  return (
    <div className="px-4 py-3 bg-slate-900/60 border-b border-slate-800">
      <div className="relative bg-slate-900 border border-slate-800/90 rounded-2xl p-3 shadow-inner">
        {/* FROM INPUT (Up) */}
        <div className="relative flex items-center">
          <div className="w-8 h-8 rounded-lg bg-blue-500/10 border border-blue-500/30 flex items-center justify-center text-blue-400 shrink-0">
            <MapPin className="w-4 h-4" />
          </div>
          <button
            type="button"
            onClick={() => {
              setOpenSelect(openSelect === 'from' ? null : 'from');
              setSearchQuery('');
            }}
            className="flex-1 text-left px-3 py-2 text-xs truncate focus:outline-none"
          >
            <span className="block text-[10px] uppercase font-mono text-slate-400 font-semibold tracking-wider">
              From (Departure)
            </span>
            <span className={`block font-medium truncate ${selectedFrom ? 'text-white' : 'text-slate-500'}`}>
              {selectedFrom ? selectedFrom.name : 'Choose departure point...'}
            </span>
          </button>
          {selectedFrom && (
            <button
              onClick={() => onSelectFrom(null)}
              className="p-1 hover:bg-slate-800 rounded-md text-slate-400 hover:text-white"
              title="Clear From"
            >
              <X className="w-3.5 h-3.5" />
            </button>
          )}
        </div>

        {/* SWAP BUTTON (Placed in between Up and Down) */}
        <div className="relative flex items-center justify-center my-1 z-10">
          <div className="absolute left-4 right-4 h-px bg-slate-800" />
          <button
            type="button"
            onClick={onSwap}
            disabled={!selectedFrom && !selectedTo}
            className="relative z-10 w-7 h-7 rounded-full bg-slate-800 hover:bg-blue-600 border border-slate-700 hover:border-blue-400 text-slate-300 hover:text-white flex items-center justify-center transition-all shadow-md active:scale-95 disabled:opacity-40 disabled:hover:bg-slate-800"
            title="Reverse departure and destination locations"
            aria-label="Reverse location searched"
          >
            <ArrowUpDown className="w-3.5 h-3.5" />
          </button>
        </div>

        {/* TO INPUT (Down) */}
        <div className="relative flex items-center">
          <div className="w-8 h-8 rounded-lg bg-emerald-500/10 border border-emerald-500/30 flex items-center justify-center text-emerald-400 shrink-0">
            <Navigation className="w-4 h-4" />
          </div>
          <button
            type="button"
            onClick={() => {
              setOpenSelect(openSelect === 'to' ? null : 'to');
              setSearchQuery('');
            }}
            className="flex-1 text-left px-3 py-2 text-xs truncate focus:outline-none"
          >
            <span className="block text-[10px] uppercase font-mono text-slate-400 font-semibold tracking-wider">
              To (Destination)
            </span>
            <span className={`block font-medium truncate ${selectedTo ? 'text-white' : 'text-slate-500'}`}>
              {selectedTo ? selectedTo.name : 'Choose destination...'}
            </span>
          </button>
          {selectedTo && (
            <button
              onClick={() => onSelectTo(null)}
              className="p-1 hover:bg-slate-800 rounded-md text-slate-400 hover:text-white"
              title="Clear To"
            >
              <X className="w-3.5 h-3.5" />
            </button>
          )}
        </div>

        {/* Status helper text based on user requirement */}
        <div className="mt-2.5 pt-2 border-t border-slate-800/80 flex items-center justify-between text-[11px]">
          <span className="text-slate-400">
            {isFiltered ? (
              <span className="text-emerald-400 flex items-center gap-1 font-medium">
                <Check className="w-3.5 h-3.5" /> Filter active • Live tracking enabled
              </span>
            ) : (
              <span className="text-amber-400/90">
                Route filter required to activate live bus tracking
              </span>
            )}
          </span>
          {isFiltered && (
            <button
              onClick={() => {
                onSelectFrom(null);
                onSelectTo(null);
              }}
              className="text-slate-400 hover:text-white text-[10px] underline"
            >
              Reset Filter
            </button>
          )}
        </div>
      </div>

      {/* Dropdown Modal for Stop Selection */}
      {openSelect && (
        <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-sm flex items-end sm:items-center justify-center p-0 sm:p-4 animate-in fade-in duration-150">
          <div className="w-full max-w-md bg-slate-900 border border-slate-800 rounded-t-3xl sm:rounded-2xl shadow-2xl max-h-[85vh] flex flex-col overflow-hidden">
            <div className="p-4 border-b border-slate-800 flex items-center justify-between">
              <div>
                <h3 className="font-bold text-white text-sm">
                  Select {openSelect === 'from' ? 'Departure Location' : 'Destination'}
                </h3>
                <p className="text-[11px] text-slate-400">14 official APU campus stops & residences</p>
              </div>
              <button
                onClick={() => setOpenSelect(null)}
                className="w-8 h-8 rounded-lg bg-slate-800 hover:bg-slate-700 flex items-center justify-center text-slate-300"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Quick search input */}
            <div className="p-3 border-b border-slate-800 bg-slate-950/50">
              <input
                type="text"
                placeholder="Type location name (e.g. LRT, Fortune Park, M Vertica)..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                autoFocus
                className="w-full bg-slate-900 border border-slate-800 rounded-xl px-3 py-2 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-blue-500"
              />
            </div>

            {/* Stops list */}
            <div className="flex-1 overflow-y-auto p-2 divide-y divide-slate-800/60">
              {filteredStops.map((stop) => {
                const isCurrent =
                  (openSelect === 'from' && selectedFrom?.id === stop.id) ||
                  (openSelect === 'to' && selectedTo?.id === stop.id);
                return (
                  <button
                    key={stop.id}
                    onClick={() => handleSelect(stop)}
                    className={`w-full text-left p-3 rounded-xl flex items-center justify-between hover:bg-slate-800 transition ${
                      isCurrent ? 'bg-blue-600/15 border border-blue-500/40 text-blue-300' : 'text-slate-200'
                    }`}
                  >
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="font-semibold text-xs text-white">{stop.name}</span>
                        <span className="text-[10px] font-mono px-1.5 py-0.5 rounded bg-slate-800 text-slate-300 border border-slate-700">
                          {stop.shortCode}
                        </span>
                        {stop.isCampus && (
                          <span className="text-[9px] bg-blue-500/20 text-blue-400 px-1 rounded">Campus Hub</span>
                        )}
                        {stop.fridayOnly && (
                          <span className="text-[9px] bg-emerald-500/20 text-emerald-400 px-1 rounded">Friday Solat</span>
                        )}
                      </div>
                      <p className="text-[10px] text-slate-400 truncate max-w-xs mt-0.5">{stop.address}</p>
                    </div>
                    {isCurrent && <Check className="w-4 h-4 text-blue-400 shrink-0" />}
                  </button>
                );
              })}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
