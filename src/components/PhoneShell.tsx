import React, { useState, useEffect } from 'react';
import { Wifi, BatteryMedium, Signal, Smartphone, Monitor } from 'lucide-react';

interface PhoneShellProps {
  children: React.ReactNode;
  simulatedTimeStr?: string;
}

export const PhoneShell: React.FC<PhoneShellProps> = ({ children, simulatedTimeStr }) => {
  const [realTime, setRealTime] = useState<string>('');
  const [isPhoneFrame, setIsPhoneFrame] = useState<boolean>(true);

  // Real-time ticking clock
  useEffect(() => {
    const updateTime = () => {
      const now = new Date();
      setRealTime(
        now.toLocaleTimeString('en-US', {
          hour: '2-digit',
          minute: '2-digit',
          second: '2-digit',
          hour12: true,
        })
      );
    };
    updateTime();
    const interval = setInterval(updateTime, 1000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="min-h-screen bg-slate-950 flex flex-col items-center justify-start sm:p-4 text-slate-100 font-sans selection:bg-blue-600">
      {/* Top Device View Toggle & Quick Bar */}
      <header className="w-full max-w-md md:max-w-xl flex items-center justify-between px-3 py-2 text-xs text-slate-400 border-b border-slate-800/80 mb-2">
        <div className="flex items-center gap-2">
          <div className="w-2.5 h-2.5 rounded-full bg-blue-500 animate-pulse" />
          <span className="font-semibold text-slate-200 tracking-wide">AP-BUS Live</span>
          <span className="text-[10px] bg-blue-950/80 text-blue-400 px-1.5 py-0.5 rounded border border-blue-800/40">
            APU Campus Connect
          </span>
        </div>
        <div className="flex items-center gap-2">
          <button
            onClick={() => setIsPhoneFrame(!isPhoneFrame)}
            className="flex items-center gap-1.5 bg-slate-900 hover:bg-slate-800 text-slate-300 hover:text-white px-2.5 py-1 rounded-lg border border-slate-800 text-[11px] transition"
            title="Toggle between Mobile Phone Frame and Expanded View"
          >
            {isPhoneFrame ? (
              <>
                <Monitor className="w-3.5 h-3.5 text-blue-400" />
                <span className="hidden sm:inline">Expanded View</span>
              </>
            ) : (
              <>
                <Smartphone className="w-3.5 h-3.5 text-emerald-400" />
                <span className="hidden sm:inline">Phone Frame</span>
              </>
            )}
          </button>
        </div>
      </header>

      {/* Main Container - Phone Shell or Expanded View */}
      <div
        className={`w-full transition-all duration-300 ${
          isPhoneFrame
            ? 'max-w-[420px] rounded-[44px] border-[10px] border-slate-900 shadow-2xl shadow-blue-950/40 bg-slate-950 relative overflow-hidden flex flex-col my-auto'
            : 'max-w-2xl rounded-2xl border border-slate-800/80 bg-slate-950 shadow-xl overflow-hidden'
        }`}
        style={{ minHeight: isPhoneFrame ? '844px' : 'auto' }}
      >
        {/* Phone Notch / Status Bar with Real-Time Clock */}
        <div className="bg-slate-900/90 backdrop-blur border-b border-slate-800/60 px-5 pt-3 pb-2 flex items-center justify-between text-xs text-slate-300 select-none z-30 sticky top-0">
          {/* Real-time ticking clock like phone navigation */}
          <div className="flex items-center gap-1.5 font-mono font-medium tracking-tight text-white text-[12px]">
            <span>{simulatedTimeStr || realTime || '07:30:00 AM'}</span>
            {simulatedTimeStr && (
              <span className="text-[9px] bg-amber-500/20 text-amber-300 px-1 py-0.2 rounded font-sans uppercase">
                Sim
              </span>
            )}
          </div>

          {/* Dynamic Island Pill */}
          <div className="hidden sm:flex items-center gap-2 bg-black px-3 py-1 rounded-full border border-slate-800/80 shadow-inner">
            <div className="w-2 h-2 rounded-full bg-emerald-500 animate-ping" />
            <span className="text-[10px] font-semibold text-slate-200">AP-BUS Live</span>
          </div>

          {/* Mobile indicators */}
          <div className="flex items-center gap-1.5 text-slate-300">
            <Signal className="w-3.5 h-3.5 text-slate-300" />
            <Wifi className="w-3.5 h-3.5 text-slate-300" />
            <div className="flex items-center gap-1 text-[11px] font-mono">
              <span>98%</span>
              <BatteryMedium className="w-4 h-4 text-emerald-400" />
            </div>
          </div>
        </div>

        {/* Content area */}
        <div className="flex-1 flex flex-col relative pb-6">{children}</div>

        {/* Phone Home Bar Indicator */}
        {isPhoneFrame && (
          <div className="w-full flex justify-center py-2 bg-slate-950">
            <div className="w-32 h-1 bg-slate-700/60 rounded-full" />
          </div>
        )}
      </div>
    </div>
  );
};
