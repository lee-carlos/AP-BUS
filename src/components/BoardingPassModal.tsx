import React from 'react';
import { Booking, DemoUser } from '../types/bus';
import { formatTime12h } from '../utils/bookingRules';
import { X, ShieldCheck, Bus, Check, Share2, Download } from 'lucide-react';

interface BoardingPassModalProps {
  booking: Booking;
  user: DemoUser;
  onBoardBus: () => void;
  onClose: () => void;
}

export const BoardingPassModal: React.FC<BoardingPassModalProps> = ({
  booking,
  user,
  onBoardBus,
  onClose,
}) => {
  const isBoarded = booking.status === 'BOARDED';

  return (
    <div className="fixed inset-0 z-50 bg-slate-950/85 backdrop-blur-sm flex items-center justify-center p-4 animate-in fade-in duration-200">
      <div className="w-full max-w-sm bg-gradient-to-b from-slate-900 to-slate-950 border border-slate-800 rounded-3xl p-5 shadow-2xl relative overflow-hidden">
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 w-8 h-8 rounded-xl bg-slate-800 hover:bg-slate-700 flex items-center justify-center text-slate-300"
        >
          <X className="w-4 h-4" />
        </button>

        {/* Pass Header */}
        <div className="text-center space-y-1 mb-4">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-500/15 border border-emerald-500/30 text-emerald-400 text-xs font-semibold">
            <ShieldCheck className="w-3.5 h-3.5" />
            <span>GPS Proximity Verified</span>
          </div>
          <h3 className="text-lg font-black text-white tracking-tight">AP-BUS BOARDING PASS</h3>
          <p className="text-[11px] text-slate-400 font-mono">Asia Pacific University of Technology</p>
        </div>

        {/* Boarding Pass Ticket Body */}
        <div className="bg-slate-950 rounded-2xl border border-slate-800 p-4 space-y-4 relative shadow-inner">
          {/* Student Info */}
          <div className="flex items-center gap-3 pb-3 border-b border-slate-800/80">
            <img
              src={user.avatar}
              alt={user.name}
              className="w-12 h-12 rounded-xl object-cover ring-2 ring-blue-500"
            />
            <div className="flex-1 min-w-0">
              <span className="text-[10px] text-slate-400 uppercase font-mono tracking-wider">
                Passenger
              </span>
              <h4 className="text-sm font-bold text-white truncate">{user.name}</h4>
              <p className="text-xs font-mono text-blue-400">{user.studentId}</p>
            </div>
            <div className="text-right">
              <span className="text-[9px] uppercase font-mono text-slate-400 block">Seat</span>
              <span className="text-base font-black text-white font-mono">{booking.seatId}</span>
            </div>
          </div>

          {/* Route & Times */}
          <div className="grid grid-cols-2 gap-2 text-xs">
            <div>
              <span className="text-[10px] text-slate-400 block">Origin Stop</span>
              <span className="font-semibold text-slate-200">{booking.fromStopName}</span>
            </div>
            <div>
              <span className="text-[10px] text-slate-400 block">Destination</span>
              <span className="font-semibold text-slate-200">{booking.toStopName}</span>
            </div>
            <div>
              <span className="text-[10px] text-slate-400 block">Departure</span>
              <span className="font-bold text-blue-400 font-mono">
                {formatTime12h(booking.departureTime)}
              </span>
            </div>
            <div>
              <span className="text-[10px] text-slate-400 block">Status</span>
              <span
                className={`font-bold uppercase text-[10px] px-2 py-0.5 rounded inline-block ${
                  isBoarded
                    ? 'bg-blue-500/20 text-blue-300'
                    : 'bg-emerald-500/20 text-emerald-300'
                }`}
              >
                {isBoarded ? 'Boarded' : 'Ready to Board'}
              </span>
            </div>
          </div>

          {/* Digital QR Code */}
          <div className="pt-2 text-center">
            <div className="w-36 h-36 bg-white p-2.5 rounded-2xl mx-auto shadow-md relative flex items-center justify-center">
              {/* Dynamic QR SVG Pattern */}
              <svg className="w-full h-full" viewBox="0 0 100 100">
                <rect width="100" height="100" fill="white" />
                {/* 3 Position Corners */}
                <rect x="5" y="5" width="25" height="25" fill="#0F172A" rx="2" />
                <rect x="10" y="10" width="15" height="15" fill="white" rx="1" />
                <rect x="13" y="13" width="9" height="9" fill="#0F172A" />

                <rect x="70" y="5" width="25" height="25" fill="#0F172A" rx="2" />
                <rect x="75" y="10" width="15" height="15" fill="white" rx="1" />
                <rect x="78" y="13" width="9" height="9" fill="#0F172A" />

                <rect x="5" y="70" width="25" height="25" fill="#0F172A" rx="2" />
                <rect x="10" y="75" width="15" height="15" fill="white" rx="1" />
                <rect x="13" y="78" width="9" height="9" fill="#0F172A" />

                {/* Data modules */}
                <rect x="35" y="10" width="6" height="6" fill="#0F172A" />
                <rect x="45" y="15" width="6" height="6" fill="#0F172A" />
                <rect x="55" y="10" width="6" height="6" fill="#0F172A" />
                <rect x="35" y="25" width="12" height="6" fill="#0F172A" />
                <rect x="10" y="40" width="6" height="10" fill="#0F172A" />
                <rect x="25" y="45" width="8" height="6" fill="#0F172A" />
                <rect x="40" y="40" width="20" height="20" fill="#2563EB" rx="3" />
                <rect x="65" y="45" width="8" height="15" fill="#0F172A" />
                <rect x="80" y="38" width="10" height="6" fill="#0F172A" />
                <rect x="35" y="70" width="10" height="8" fill="#0F172A" />
                <rect x="50" y="75" width="15" height="6" fill="#0F172A" />
                <rect x="70" y="70" width="6" height="12" fill="#0F172A" />
                <rect x="80" y="80" width="10" height="10" fill="#0F172A" />
              </svg>

              {/* Animated Scan Line */}
              {!isBoarded && (
                <div className="absolute left-2 right-2 h-0.5 bg-blue-500 shadow-sm animate-[ping_2.5s_cubic-bezier(0,0,0.2,1)_infinite]" />
              )}
            </div>
            <p className="text-[10px] font-mono text-slate-400 mt-2">
              Present to shuttle scanner or bus marshal
            </p>
          </div>
        </div>

        {/* Action Button */}
        <div className="mt-4 pt-1">
          {!isBoarded ? (
            <button
              onClick={onBoardBus}
              className="w-full py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs flex items-center justify-center gap-1.5 transition shadow-lg shadow-emerald-600/20"
            >
              <Bus className="w-4 h-4" /> Simulate Driver Scan & Board
            </button>
          ) : (
            <div className="text-center py-2 text-xs text-blue-300 font-semibold bg-blue-950/60 rounded-xl border border-blue-800/40">
              ✓ Passenger is successfully onboard. Safe travels!
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
