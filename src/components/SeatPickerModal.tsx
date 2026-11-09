import React, { useState } from 'react';
import { BusTrip } from '../types/bus';
import { formatTime12h } from '../utils/bookingRules';
import { X, Check, Info, ShieldCheck, ArrowRight, User } from 'lucide-react';

import { DemoUser } from '../types/bus';

interface SeatPickerModalProps {
  trip: BusTrip;
  currentUser: DemoUser;
  onConfirmSeat: (tripId: string, seatId: string) => void;
  onClose: () => void;
}

export const SeatPickerModal: React.FC<SeatPickerModalProps> = ({
  trip,
  currentUser,
  onConfirmSeat,
  onClose,
}) => {
  const [selectedSeat, setSelectedSeat] = useState<string | null>(null);
  const [step, setStep] = useState<'pick' | 'confirm'>('pick');

  const rows = Array.from({ length: 10 }, (_, i) => i + 1);

  const isSeatBooked = (seatId: string) => trip.bookedSeatIds.includes(seatId);

  const getSeatPositionName = (seatId: string) => {
    const col = seatId.slice(-1);
    const row = seatId.slice(0, -1);
    const type = col === 'A' || col === 'D' ? 'Window' : 'Aisle';
    const side = col === 'A' || col === 'B' ? 'Left' : 'Right';
    return `Row ${row} - ${type} (${side})`;
  };

  const handleSeatClick = (seatId: string) => {
    if (isSeatBooked(seatId)) return;
    setSelectedSeat(seatId);
  };

  return (
    <div className="fixed inset-0 z-50 bg-slate-950/85 backdrop-blur-sm flex items-end sm:items-center justify-center p-0 sm:p-4 animate-in fade-in duration-200">
      <div className="w-full max-w-md bg-slate-900 border border-slate-800 rounded-t-3xl sm:rounded-3xl shadow-2xl max-h-[92vh] flex flex-col overflow-hidden">
        {/* Header */}
        <div className="p-4 border-b border-slate-800 flex items-center justify-between bg-slate-950/40">
          <div>
            <div className="flex items-center gap-2">
              <span className="text-[10px] font-mono font-semibold px-2 py-0.5 rounded bg-blue-500/20 text-blue-400 border border-blue-500/30">
                40-Seat Bus
              </span>
              <span className="text-xs text-slate-400 font-mono">
                {formatTime12h(trip.departureTime)} Departure
              </span>
            </div>
            <h3 className="font-extrabold text-white text-base mt-0.5 truncate max-w-xs">
              {trip.routeName}
            </h3>
          </div>
          <button
            onClick={onClose}
            className="w-8 h-8 rounded-xl bg-slate-800 hover:bg-slate-700 flex items-center justify-center text-slate-300 hover:text-white"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {step === 'pick' ? (
          <>
            {/* Bus Layout Body */}
            <div className="flex-1 overflow-y-auto p-4 space-y-4">
              {/* Legend */}
              <div className="flex items-center justify-around py-2 px-3 bg-slate-950/60 rounded-xl border border-slate-800/80 text-[11px] text-slate-300">
                <div className="flex items-center gap-1.5">
                  <div className="w-4 h-4 rounded bg-slate-800 border border-slate-700" />
                  <span>Available</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <div className="w-4 h-4 rounded bg-blue-600 border border-white text-white flex items-center justify-center text-[9px] font-bold">
                    ✓
                  </div>
                  <span>Selected</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <div className="w-4 h-4 rounded bg-slate-800/50 border border-slate-800 text-slate-600 flex items-center justify-center text-[9px]">
                    ✕
                  </div>
                  <span>Occupied</span>
                </div>
              </div>

              {/* The Bus Frame */}
              <div className="bg-slate-950/80 rounded-3xl border-2 border-slate-800 p-4 max-w-xs mx-auto shadow-inner relative">
                {/* Windshield & Driver Area */}
                <div className="border-b border-slate-800 pb-3 mb-3 flex items-center justify-between text-xs text-slate-400">
                  <div className="flex items-center gap-1.5 bg-slate-900 px-2.5 py-1 rounded-lg border border-slate-800">
                    <User className="w-3.5 h-3.5 text-blue-400" />
                    <span className="text-[10px] font-semibold text-slate-300">Driver Bay</span>
                  </div>
                  <div className="text-[10px] font-mono text-emerald-400 uppercase tracking-wider bg-emerald-950/40 border border-emerald-800/40 px-2 py-0.5 rounded">
                    Front Door ➔
                  </div>
                </div>

                {/* 10 Rows of Seats (2 left, aisle, 2 right) */}
                <div className="space-y-2">
                  {rows.map((row) => (
                    <div key={row} className="flex items-center justify-between gap-1">
                      {/* Left Side: A & B */}
                      <div className="flex items-center gap-1.5">
                        {['A', 'B'].map((col) => {
                          const seatId = `${row}${col}`;
                          const booked = isSeatBooked(seatId);
                          const isSelected = selectedSeat === seatId;
                          return (
                            <button
                              key={seatId}
                              disabled={booked}
                              onClick={() => handleSeatClick(seatId)}
                              className={`w-9 h-9 rounded-lg text-xs font-mono font-bold flex flex-col items-center justify-center transition-all ${
                                isSelected
                                  ? 'bg-blue-600 text-white border-2 border-white shadow-lg shadow-blue-500/40 scale-105'
                                  : booked
                                  ? 'bg-slate-900/60 border border-slate-800/80 text-slate-600 cursor-not-allowed opacity-50'
                                  : 'bg-slate-800/90 hover:bg-slate-700 border border-slate-700 text-slate-200 hover:border-blue-400'
                              }`}
                              title={`${seatId}: ${getSeatPositionName(seatId)} ${
                                booked ? '(Occupied)' : '(Available)'
                              }`}
                            >
                              <span>{seatId}</span>
                            </button>
                          );
                        })}
                      </div>

                      {/* Center Aisle */}
                      <div className="w-6 text-center text-[10px] font-mono text-slate-600 select-none">
                        R{row}
                      </div>

                      {/* Right Side: C & D */}
                      <div className="flex items-center gap-1.5">
                        {['C', 'D'].map((col) => {
                          const seatId = `${row}${col}`;
                          const booked = isSeatBooked(seatId);
                          const isSelected = selectedSeat === seatId;
                          return (
                            <button
                              key={seatId}
                              disabled={booked}
                              onClick={() => handleSeatClick(seatId)}
                              className={`w-9 h-9 rounded-lg text-xs font-mono font-bold flex flex-col items-center justify-center transition-all ${
                                isSelected
                                  ? 'bg-blue-600 text-white border-2 border-white shadow-lg shadow-blue-500/40 scale-105'
                                  : booked
                                  ? 'bg-slate-900/60 border border-slate-800/80 text-slate-600 cursor-not-allowed opacity-50'
                                  : 'bg-slate-800/90 hover:bg-slate-700 border border-slate-700 text-slate-200 hover:border-blue-400'
                              }`}
                              title={`${seatId}: ${getSeatPositionName(seatId)} ${
                                booked ? '(Occupied)' : '(Available)'
                              }`}
                            >
                              <span>{seatId}</span>
                            </button>
                          );
                        })}
                      </div>
                    </div>
                  ))}
                </div>

                {/* Rear of Bus */}
                <div className="mt-3 pt-2 border-t border-slate-800 text-center text-[10px] text-slate-600 uppercase tracking-widest font-mono">
                  Rear Bus Deck • 40 Capacity
                </div>
              </div>
            </div>

            {/* Bottom Bar: Selection summary and next button */}
            <div className="p-4 border-t border-slate-800 bg-slate-950 flex items-center justify-between">
              <div>
                <span className="text-[10px] text-slate-400 block">Selected Seat</span>
                {selectedSeat ? (
                  <span className="text-sm font-bold text-white font-mono flex items-center gap-1.5">
                    Seat {selectedSeat}{' '}
                    <span className="text-xs font-sans text-blue-400 font-normal">
                      ({getSeatPositionName(selectedSeat)})
                    </span>
                  </span>
                ) : (
                  <span className="text-xs text-amber-400">Please tap a seat to select</span>
                )}
              </div>

              <button
                disabled={!selectedSeat}
                onClick={() => setStep('confirm')}
                className="bg-blue-600 hover:bg-blue-500 disabled:opacity-40 disabled:hover:bg-blue-600 text-white font-bold text-xs px-5 py-2.5 rounded-xl flex items-center gap-1.5 transition shadow-lg shadow-blue-600/20"
              >
                Continue <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          </>
        ) : (
          /* STEP 2: Confirmation Dialog as requested: "after that, they have to confirm whether they're confirm to book or not." */
          <div className="p-6 space-y-5">
            <div className="text-center space-y-1">
              <div className="w-12 h-12 rounded-2xl bg-blue-600/20 border border-blue-500/40 text-blue-400 flex items-center justify-center mx-auto mb-2">
                <ShieldCheck className="w-6 h-6" />
              </div>
              <h4 className="text-lg font-bold text-white">Confirm Seat Reservation?</h4>
              <p className="text-xs text-slate-400">
                Please review your bus trip details before locking your seat.
              </p>
            </div>

            {/* Summary card */}
            <div className="bg-slate-950 rounded-2xl border border-slate-800 p-4 space-y-3 text-xs">
              <div className="flex justify-between py-1 border-b border-slate-800/80">
                <span className="text-slate-400">Route</span>
                <span className="font-semibold text-white">{trip.routeName}</span>
              </div>
              <div className="flex justify-between py-1 border-b border-slate-800/80">
                <span className="text-slate-400">Departure Time</span>
                <span className="font-bold text-blue-400 font-mono">
                  {formatTime12h(trip.departureTime)}
                </span>
              </div>
              <div className="flex justify-between py-1 border-b border-slate-800/80">
                <span className="text-slate-400">Assigned Seat</span>
                <span className="font-bold text-emerald-400 font-mono">
                  Seat {selectedSeat} ({selectedSeat ? getSeatPositionName(selectedSeat) : ''})
                </span>
              </div>
              <div className="flex justify-between py-1">
                <span className="text-slate-400">Total Fare</span>
                <span className="font-semibold text-emerald-400">Complimentary (Campus ID)</span>
              </div>
            </div>

            {/* Boarding rule & Anti-Troll reminder */}
            <div className="p-3 rounded-xl bg-amber-500/10 border border-amber-500/20 space-y-1.5 text-[11px] text-amber-300">
              <div className="flex items-start gap-2">
                <Info className="w-4 h-4 shrink-0 mt-0.5 text-amber-400" />
                <span>
                  <strong>GPS Boarding Policy:</strong> Automatic check-in requires you to be physically inside the 250m departure radius within 10 minutes of departure.
                </span>
              </div>
              <div className="pt-1 border-t border-amber-500/20 text-slate-300">
                <strong>Anti-Troll Policy:</strong> You can book multiple buses. However, canceling within 15 minutes of departure or failing to board (no-show) incurs +1 strike penalty (3 strikes = 7-day booking suspension).
              </div>
            </div>

            {/* Actions */}
            <div className="grid grid-cols-2 gap-3 pt-2">
              <button
                onClick={() => setStep('pick')}
                className="py-2.5 px-4 rounded-xl border border-slate-700 bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-semibold transition"
              >
                Change Seat
              </button>
              <button
                onClick={() => selectedSeat && onConfirmSeat(trip.id, selectedSeat)}
                className="py-2.5 px-4 rounded-xl bg-blue-600 hover:bg-blue-500 text-white text-xs font-bold transition shadow-lg shadow-blue-600/30 flex items-center justify-center gap-1.5"
              >
                <Check className="w-4 h-4" /> Confirm Booking
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
