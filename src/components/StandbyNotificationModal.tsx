import React from 'react';
import { BusTrip } from '../types/bus';
import { formatTime12h } from '../utils/bookingRules';
import { BellRing, ShieldCheck, Check, X, Clock } from 'lucide-react';

interface StandbyNotificationModalProps {
  trip: BusTrip;
  releasedSeatId: string;
  onAcceptSeat: (tripId: string, seatId: string) => void;
  onDecline: () => void;
}

export const StandbyNotificationModal: React.FC<StandbyNotificationModalProps> = ({
  trip,
  releasedSeatId,
  onAcceptSeat,
  onDecline,
}) => {
  return (
    <div className="fixed inset-0 z-50 bg-slate-950/85 backdrop-blur-sm flex items-center justify-center p-4 animate-in fade-in duration-200">
      <div className="w-full max-w-sm bg-gradient-to-b from-slate-900 to-slate-950 border-2 border-amber-500/60 rounded-3xl p-5 shadow-2xl space-y-4">
        {/* Animated Bell Badge */}
        <div className="w-13 h-13 rounded-2xl bg-amber-500/20 border border-amber-500/40 text-amber-400 flex items-center justify-center mx-auto animate-bounce">
          <BellRing className="w-7 h-7 text-amber-400" />
        </div>

        <div className="text-center space-y-1">
          <span className="text-[10px] font-mono font-bold uppercase tracking-wider text-amber-400 bg-amber-950/60 px-2 py-0.5 rounded border border-amber-800/40">
            FCFS Standby Notification
          </span>
          <h3 className="text-base font-extrabold text-white">Seat Available on Full Bus!</h3>
          <p className="text-xs text-slate-300">
            A passenger did not check-in within the 10-minute departure window. Because you enabled notifications and your GPS tracker confirms you are in range, this seat has been offered to you!
          </p>
        </div>

        {/* Seat Offer Details */}
        <div className="bg-slate-950 rounded-2xl border border-slate-800 p-3 space-y-2 text-xs">
          <div className="flex justify-between">
            <span className="text-slate-400">Route</span>
            <span className="font-semibold text-white truncate max-w-[180px]">{trip.routeName}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-slate-400">Departure</span>
            <span className="font-bold text-blue-400 font-mono">
              {formatTime12h(trip.departureTime)}
            </span>
          </div>
          <div className="flex justify-between">
            <span className="text-slate-400">Offered Seat</span>
            <span className="font-bold text-emerald-400 font-mono">Seat {releasedSeatId}</span>
          </div>
          <div className="flex items-center gap-1.5 text-[11px] text-emerald-300 pt-1 border-t border-slate-800">
            <ShieldCheck className="w-3.5 h-3.5" />
            <span>GPS Verified: You are at the stop and ready</span>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="grid grid-cols-2 gap-3 pt-1">
          <button
            onClick={onDecline}
            className="py-2.5 px-3 rounded-xl border border-slate-700 bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-semibold transition"
          >
            Decline
          </button>
          <button
            onClick={() => onAcceptSeat(trip.id, releasedSeatId)}
            className="py-2.5 px-3 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold transition shadow-lg shadow-emerald-600/30 flex items-center justify-center gap-1.5"
          >
            <Check className="w-4 h-4" /> Claim Seat Now
          </button>
        </div>
      </div>
    </div>
  );
};
