import React, { useState } from 'react';
import { Booking, CheckInStatus } from '../types/bus';
import { formatTime12h, getMinutesUntilDeparture, getStudentReliabilityTier } from '../utils/bookingRules';
import {
  Bus,
  Bell,
  BellOff,
  QrCode,
  AlertCircle,
  CheckCircle,
  MapPin,
  Clock,
  ShieldCheck,
  Trash2,
  ShieldAlert,
  Info,
} from 'lucide-react';

interface BookedBusCardProps {
  bookings: Booking[];
  penaltyStrikes: number;
  currentTimeStr: string;
  onToggleNotify30: (bookingId: string) => void;
  onCheckInNow: (bookingId: string) => void;
  onOpenBoardingPass: (booking: Booking) => void;
  onRequestCancel: (booking: Booking) => void;
}

export const BookedBusCard: React.FC<BookedBusCardProps> = ({
  bookings,
  penaltyStrikes,
  currentTimeStr,
  onToggleNotify30,
  onCheckInNow,
  onOpenBoardingPass,
  onRequestCancel,
}) => {
  const [activeTab, setActiveTab] = useState<number>(0);
  const reliability = getStudentReliabilityTier(penaltyStrikes);

  if (bookings.length === 0) {
    return (
      <div className="px-4 py-3">
        {/* Anti-Trolling Status Pill */}
        <div className="flex items-center justify-between mb-2">
          <div className="flex items-center gap-1.5">
            <span className="w-2 h-2 rounded-full bg-slate-500" />
            <h2 className="text-xs font-bold text-slate-300 tracking-wider uppercase">Booked Buses (0 Active)</h2>
          </div>
          <span className={`text-[10px] font-mono px-2 py-0.5 rounded-full border ${reliability.badgeColor}`}>
            {reliability.label}
          </span>
        </div>

        <div className="bg-slate-900/60 border border-slate-800/80 rounded-2xl p-4 text-center">
          <div className="w-10 h-10 rounded-full bg-slate-800 flex items-center justify-center mx-auto mb-2 text-slate-400">
            <Bus className="w-5 h-5 text-slate-400" />
          </div>
          <h3 className="text-sm font-bold text-white">No Active Bus Bookings</h3>
          <p className="text-xs text-slate-400 mt-1 max-w-xs mx-auto">
            You can book multiple buses across different scheduled hours today. Use the BOOK button below to choose your routes.
          </p>
        </div>
      </div>
    );
  }

  // Selected booking in tab or fallback to first
  const currentIdx = activeTab >= bookings.length ? 0 : activeTab;
  const booking = bookings[currentIdx];
  const minutesUntilDeparture = getMinutesUntilDeparture(currentTimeStr, booking.departureTime);

  const isCheckedIn = booking.status === 'CHECKED_IN' || booking.status === 'BOARDED';
  const isReadyToCheckIn = booking.status === 'READY_TO_CHECK_IN';
  const isOutOfRange = booking.status === 'OUT_OF_RANGE';
  const isWaiting = booking.status === 'WAITING_WINDOW';

  return (
    <div className="px-4 py-3">
      {/* Header with Anti-Trolling Status & Multiple Booking Tabs */}
      <div className="flex items-center justify-between mb-2">
        <div className="flex items-center gap-1.5">
          <span className="w-2 h-2 rounded-full bg-blue-500 animate-pulse" />
          <h2 className="text-xs font-bold text-slate-200 tracking-wider uppercase">
            Booked Buses ({bookings.length} Active)
          </h2>
        </div>

        {/* Penalty / Anti-Troll Defense Badge */}
        <div className="flex items-center gap-1">
          <span
            className={`text-[10px] font-mono px-2 py-0.5 rounded-full border font-semibold ${reliability.badgeColor}`}
            title={reliability.description}
          >
            {penaltyStrikes > 0 ? (
              <span className="flex items-center gap-1">
                <ShieldAlert className="w-3 h-3" /> {reliability.label}
              </span>
            ) : (
              <span className="flex items-center gap-1">
                <ShieldCheck className="w-3 h-3 text-emerald-400" /> {reliability.label}
              </span>
            )}
          </span>
        </div>
      </div>

      {/* Multiple Bookings Switcher Tabs (if more than 1 booking) */}
      {bookings.length > 1 && (
        <div className="flex items-center gap-1.5 mb-2 overflow-x-auto no-scrollbar">
          {bookings.map((b, idx) => (
            <button
              key={b.id}
              onClick={() => setActiveTab(idx)}
              className={`px-3 py-1.5 rounded-xl text-xs font-semibold whitespace-nowrap transition flex items-center gap-1.5 ${
                idx === currentIdx
                  ? 'bg-blue-600 text-white shadow-md'
                  : 'bg-slate-900 border border-slate-800 text-slate-400 hover:text-white'
              }`}
            >
              <Bus className="w-3 h-3" />
              <span>{formatTime12h(b.departureTime)}</span>
              <span className="text-[10px] font-mono bg-black/30 px-1 rounded">
                Seat {b.seatId}
              </span>
            </button>
          ))}
        </div>
      )}

      {/* Main Booking Card */}
      <div className="bg-gradient-to-br from-slate-900 via-slate-900 to-blue-950/40 border border-blue-500/30 rounded-2xl p-4 shadow-lg shadow-blue-950/30 relative overflow-hidden">
        {/* Accent top gradient bar */}
        <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-blue-500 via-indigo-500 to-emerald-400" />

        {/* Route & Seat Header */}
        <div className="flex items-start justify-between">
          <div>
            <span className="text-[10px] font-mono font-semibold text-blue-400 uppercase tracking-wider">
              {booking.fromStopName.split(' ')[0]} ➔ {booking.toStopName.split(' ')[0]}
            </span>
            <h3 className="text-base font-extrabold text-white">{booking.routeName}</h3>
          </div>

          {/* Seat Number Tag */}
          <div className="bg-blue-600/20 border border-blue-500/40 px-3 py-1.5 rounded-xl text-center">
            <span className="text-[9px] uppercase tracking-wider text-blue-300 font-semibold block">
              Seat No.
            </span>
            <span className="text-sm font-black text-white font-mono">{booking.seatId}</span>
          </div>
        </div>

        {/* Bus Departure & Countdown Grid */}
        <div className="grid grid-cols-2 gap-2 mt-3 p-2.5 rounded-xl bg-slate-950/60 border border-slate-800/80">
          <div className="flex items-center gap-2">
            <Clock className="w-4 h-4 text-slate-400 shrink-0" />
            <div>
              <span className="text-[10px] text-slate-400 block">Departure</span>
              <span className="text-xs font-bold text-white font-mono">
                {formatTime12h(booking.departureTime)}
              </span>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <MapPin className="w-4 h-4 text-slate-400 shrink-0" />
            <div>
              <span className="text-[10px] text-slate-400 block">Countdown</span>
              <span className="text-xs font-bold text-blue-300 font-mono">
                {minutesUntilDeparture > 0
                  ? `${minutesUntilDeparture} mins away`
                  : minutesUntilDeparture === 0
                  ? 'Departing Now'
                  : 'Trip In Progress'}
              </span>
            </div>
          </div>
        </div>

        {/* Check-In Status Banner */}
        <div className="mt-3">
          {isCheckedIn ? (
            <div className="flex items-center justify-between p-2.5 rounded-xl bg-emerald-500/15 border border-emerald-500/30 text-emerald-300">
              <div className="flex items-center gap-2 text-xs">
                <ShieldCheck className="w-4 h-4 text-emerald-400 shrink-0" />
                <span className="font-semibold">Checked-In via GPS Proximity</span>
              </div>
              <button
                onClick={() => onOpenBoardingPass(booking)}
                className="flex items-center gap-1 bg-emerald-500 hover:bg-emerald-400 text-slate-950 px-2.5 py-1 rounded-lg text-xs font-bold transition shadow"
              >
                <QrCode className="w-3.5 h-3.5" /> Pass
              </button>
            </div>
          ) : isReadyToCheckIn ? (
            <div className="p-2.5 rounded-xl bg-blue-500/20 border border-blue-500/50 flex items-center justify-between">
              <div className="flex items-center gap-2 text-xs text-blue-200">
                <CheckCircle className="w-4 h-4 text-blue-400 shrink-0 animate-bounce" />
                <div>
                  <p className="font-bold">In Range & Within 10 Mins!</p>
                  <p className="text-[10px] text-blue-300">GPS verified inside 250m radius</p>
                </div>
              </div>
              <button
                onClick={() => onCheckInNow(booking.id)}
                className="bg-blue-600 hover:bg-blue-500 text-white font-bold text-xs px-3 py-1.5 rounded-lg shadow-md transition"
              >
                Check-In Now
              </button>
            </div>
          ) : isOutOfRange ? (
            <div className="p-2 rounded-xl bg-amber-500/10 border border-amber-500/30 flex items-center gap-2 text-xs text-amber-300">
              <AlertCircle className="w-4 h-4 text-amber-400 shrink-0" />
              <div className="text-[11px]">
                <span className="font-semibold block">GPS Outside 250m Zone</span>
                <span className="text-slate-400">
                  Must be inside departure stop circle to auto check-in.
                </span>
              </div>
            </div>
          ) : (
            <div className="p-2 rounded-xl bg-slate-800/60 border border-slate-700/60 flex items-center gap-2 text-xs text-slate-300">
              <Clock className="w-4 h-4 text-blue-400 shrink-0" />
              <span className="text-[11px] text-slate-400">
                Check-in window opens 10 mins before departure.
              </span>
            </div>
          )}
        </div>

        {/* Footer actions: 30-min Reminder toggle & Cancel button */}
        <div className="mt-3.5 pt-3 border-t border-slate-800/90 flex items-center justify-between text-xs">
          {/* Notification toggle */}
          <button
            onClick={() => onToggleNotify30(booking.id)}
            className={`flex items-center gap-1.5 px-2.5 py-1 rounded-lg border text-[11px] font-medium transition ${
              booking.notify30Min
                ? 'bg-blue-950/60 border-blue-500/40 text-blue-300'
                : 'bg-slate-900 border-slate-800 text-slate-400 hover:text-slate-200'
            }`}
            title="Notify 30 mins before departure"
          >
            {booking.notify30Min ? (
              <>
                <Bell className="w-3.5 h-3.5 text-blue-400" />
                <span>30m Alert On</span>
              </>
            ) : (
              <>
                <BellOff className="w-3.5 h-3.5 text-slate-500" />
                <span>30m Alert Off</span>
              </>
            )}
          </button>

          {/* Cancel button */}
          <button
            onClick={() => onRequestCancel(booking)}
            className="flex items-center gap-1 text-rose-400 hover:text-rose-300 hover:bg-rose-500/10 px-2.5 py-1 rounded-lg transition text-[11px]"
          >
            <Trash2 className="w-3.5 h-3.5" />
            <span>Cancel</span>
          </button>
        </div>
      </div>
    </div>
  );
};
