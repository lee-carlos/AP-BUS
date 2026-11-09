import React from 'react';
import { DEMO_ACCOUNTS } from '../data/apuRoutes';
import { DemoUser } from '../types/bus';
import { MapPin, CheckCircle2, AlertTriangle, ArrowRight, Bus, ShieldCheck } from 'lucide-react';

interface DemoAccountSelectorProps {
  onSelectAccount: (user: DemoUser) => void;
}

export const DemoAccountSelector: React.FC<DemoAccountSelectorProps> = ({ onSelectAccount }) => {
  return (
    <div className="flex-1 flex flex-col px-5 py-6 space-y-6">
      {/* Brand Hero */}
      <div className="text-center space-y-2 pt-2">
        <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-gradient-to-tr from-blue-600 via-indigo-600 to-sky-400 shadow-lg shadow-blue-500/20 mb-2 border border-blue-400/30">
          <Bus className="w-8 h-8 text-white" />
        </div>
        <h1 className="text-2xl font-extrabold tracking-tight text-white">AP-BUS</h1>
        <p className="text-xs text-slate-400 max-w-xs mx-auto">
          Campus Shuttle Booking, Real-time GPS Check-in & Smart Boarding System
        </p>
      </div>

      {/* Demo Selector Prompt */}
      <div className="bg-slate-900/80 border border-slate-800 rounded-2xl p-4 shadow-sm">
        <div className="flex items-center gap-2 mb-2 text-xs font-semibold text-blue-400 uppercase tracking-wider">
          <ShieldCheck className="w-4 h-4" />
          <span>Select Demo Account to Enter</span>
        </div>
        <p className="text-xs text-slate-300 leading-relaxed">
          The difference between Demo Account 1 and 2 is the <strong className="text-white">physical GPS location</strong>. This demonstrates how AP-BUS automatically validates check-in when a student is within 10 minutes and within 250m of the bus stop!
        </p>
      </div>

      {/* Account Cards */}
      <div className="space-y-4">
        {DEMO_ACCOUNTS.map((account, idx) => {
          const isNear = account.isNearStop;
          return (
            <button
              key={account.id}
              onClick={() => onSelectAccount(account)}
              className={`w-full text-left p-4 rounded-2xl border transition-all duration-200 relative group overflow-hidden ${
                isNear
                  ? 'bg-slate-900/90 border-blue-500/50 hover:border-blue-400 hover:shadow-lg hover:shadow-blue-500/10'
                  : 'bg-slate-900/90 border-slate-800 hover:border-amber-500/50 hover:shadow-lg hover:shadow-amber-500/10'
              }`}
            >
              <div className="flex items-start gap-3.5">
                {/* Avatar */}
                <div className="relative">
                  <img
                    src={account.avatar}
                    alt={account.name}
                    className="w-13 h-13 rounded-xl object-cover ring-2 ring-slate-700/80 group-hover:ring-blue-500 transition"
                  />
                  <div
                    className={`absolute -bottom-1 -right-1 w-4 h-4 rounded-full border-2 border-slate-900 flex items-center justify-center ${
                      isNear ? 'bg-emerald-500' : 'bg-amber-500'
                    }`}
                  >
                    {isNear ? (
                      <CheckCircle2 className="w-3 h-3 text-slate-950" />
                    ) : (
                      <AlertTriangle className="w-3 h-3 text-slate-950" />
                    )}
                  </div>
                </div>

                {/* Account Details */}
                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between">
                    <div>
                      <span className="text-[10px] font-mono text-blue-400 font-semibold uppercase tracking-wider">
                        Demo Account {idx + 1}
                      </span>
                      <h3 className="text-base font-bold text-white truncate">{account.name}</h3>
                    </div>
                    <span className="text-xs font-mono text-slate-400 bg-slate-800 px-2 py-0.5 rounded-md">
                      {account.studentId}
                    </span>
                  </div>

                  {/* Physical Location Badge */}
                  <div className="mt-2.5 flex items-center gap-1.5 text-xs">
                    <MapPin
                      className={`w-3.5 h-3.5 shrink-0 ${
                        isNear ? 'text-emerald-400' : 'text-amber-400'
                      }`}
                    />
                    <span
                      className={`font-medium truncate ${
                        isNear ? 'text-emerald-300' : 'text-amber-300'
                      }`}
                    >
                      {account.currentLocationName}
                    </span>
                  </div>

                  <p className="mt-1 text-[11px] text-slate-400 line-clamp-2 leading-snug">
                    {account.description}
                  </p>
                </div>
              </div>

              {/* Action Banner */}
              <div className="mt-3.5 pt-3 border-t border-slate-800/80 flex items-center justify-between text-xs font-semibold">
                <span className={isNear ? 'text-emerald-400' : 'text-amber-400'}>
                  {isNear ? '● GPS In Proximity (<50m)' : '○ GPS Out of Range (~9km)'}
                </span>
                <span className="inline-flex items-center gap-1 text-blue-400 group-hover:translate-x-0.5 transition-transform">
                  Enter App <ArrowRight className="w-3.5 h-3.5" />
                </span>
              </div>
            </button>
          );
        })}
      </div>

      {/* Rules Footer Summary */}
      <div className="pt-2 text-center text-[11px] text-slate-500">
        Booking opens daily at 7:30 AM • 40 seats per bus • First come, first served
      </div>
    </div>
  );
};
