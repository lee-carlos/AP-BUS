import React from 'react';
import { Booking } from '../types/bus';
import { formatTime12h, getMinutesUntilDeparture, evaluateLateCancellation } from '../utils/bookingRules';
import { AlertTriangle, X, Trash2, ShieldAlert, CheckCircle2 } from 'lucide-react';

interface CancelConfirmModalProps {
  booking: Booking;
  currentTimeStr: string;
  onConfirmCancel: (bookingId: string, isLate: boolean) => void;
  onClose: () => void;
}

export const CancelConfirmModal: React.FC<CancelConfirmModalProps> = ({
  booking,
  currentTimeStr,
  onConfirmCancel,
  onClose,
}) => {
  const minutesUntil = getMinutesUntilDeparture(currentTimeStr, booking.departureTime);
  const penaltyCheck = evaluateLateCancellation(minutesUntil);

  return (
    <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-sm flex items-center justify-center p-4 animate-in fade-in duration-150">
      <div className="w-full max-w-sm bg-slate-900 border border-slate-800 rounded-3xl p-5 shadow-2xl space-y-4">
        {/* Warning Icon */}
        <div className={`w-12 h-12 rounded-2xl flex items-center justify-center mx-auto ${
          penaltyCheck.isLateCancel
            ? 'bg-rose-500/20 border border-rose-500/30 text-rose-400'
            : 'bg-amber-500/20 border border-amber-500/30 text-amber-400'
        }`}>
          <AlertTriangle className="w-6 h-6" />
        </div>

        <div className="text-center space-y-1">
          <h3 className="text-base font-bold text-white">Cancel Bus Reservation?</h3>
          <p className="text-xs text-slate-400">
            Are you sure you want to release your seat? This seat will immediately become available for other students on standby.
          </p>
        </div>

        {/* Booking details card */}
        <div className="bg-slate-950/70 rounded-2xl border border-slate-800/80 p-3 space-y-2 text-xs">
          <div className="flex justify-between">
            <span className="text-slate-400">Route</span>
            <span className="font-semibold text-white">{booking.routeName}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-slate-400">Departure</span>
            <span className="font-bold text-blue-400 font-mono">
              {formatTime12h(booking.departureTime)}
            </span>
          </div>
          <div className="flex justify-between">
            <span className="text-slate-400">Seat Number</span>
            <span className="font-bold text-rose-400 font-mono">Seat {booking.seatId}</span>
          </div>
        </div>

        {/* Anti-Trolling Penalty Notice */}
        <div className={`p-2.5 rounded-xl border text-[11px] flex items-start gap-2 ${
          penaltyCheck.isLateCancel
            ? 'bg-rose-950/40 border-rose-500/40 text-rose-300'
            : 'bg-emerald-950/30 border-emerald-500/30 text-emerald-300'
        }`}>
          {penaltyCheck.isLateCancel ? (
            <ShieldAlert className="w-4 h-4 shrink-0 mt-0.5 text-rose-400" />
          ) : (
            <CheckCircle2 className="w-4 h-4 shrink-0 mt-0.5 text-emerald-400" />
          )}
          <span>{penaltyCheck.message}</span>
        </div>

        {/* Buttons */}
        <div className="grid grid-cols-2 gap-3 pt-1">
          <button
            onClick={onClose}
            className="py-2.5 px-3 rounded-xl border border-slate-700 bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-semibold transition"
          >
            Keep My Seat
          </button>
          <button
            onClick={() => onConfirmCancel(booking.id, penaltyCheck.isLateCancel)}
            className="py-2.5 px-3 rounded-xl bg-rose-600 hover:bg-rose-500 text-white text-xs font-bold transition shadow-lg shadow-rose-600/30 flex items-center justify-center gap-1.5"
          >
            <Trash2 className="w-3.5 h-3.5" /> Yes, Cancel
          </button>
        </div>
      </div>
    </div>
  );
};
