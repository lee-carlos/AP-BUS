import React, { useState } from 'react';
import { BusTrip, Booking } from '../types/bus';
import { formatTime12h, isBusFull, validateBookingEligibility, MAX_ACTIVE_BOOKINGS_LIMIT } from '../utils/bookingRules';
import { APU_STOPS } from '../data/apuRoutes';
import {
  X,
  Bus,
  Clock,
  Users,
  Bell,
  BellRing,
  Trash2,
  CheckCircle,
  Filter,
  AlertCircle,
  ShieldAlert,
  Info,
} from 'lucide-react';

interface ScheduleModalProps {
  trips: BusTrip[];
  currentBookings: Booking[];
  penaltyStrikes?: number;
  onBookTrip: (trip: BusTrip) => void;
  onRequestCancel: (booking: Booking) => void;
  onToggleWaitlist: (tripId: string) => void;
  waitlistTripIds: string[];
  isBookingOpen: boolean;
  onClose: () => void;
  initialRouteFilter?: string | null;
}

export const ScheduleModal: React.FC<ScheduleModalProps> = ({
  trips,
  currentBookings,
  penaltyStrikes = 0,
  onBookTrip,
  onRequestCancel,
  onToggleWaitlist,
  waitlistTripIds,
  isBookingOpen,
  onClose,
  initialRouteFilter,
}) => {
  const [activeFilter, setActiveFilter] = useState<string>(initialRouteFilter || 'all');
  const [searchQuery, setSearchQuery] = useState('');

  // Extract unique route IDs for filter chips
  const routes = [
    { id: 'all', label: 'All Schedules' },
    { id: 'lrt', label: 'LRT Bukit Jalil' },
    { id: 'fortune-park', label: 'Fortune Park' },
    { id: 'city-of-green', label: 'City of Green' },
    { id: 'kingston', label: 'Kingston Hotel' },
    { id: 'bloomsvale', label: 'Bloomsvale' },
    { id: 'bayu-jalil', label: 'Bayu Jalil' },
    { id: 'kuchai-sentral', label: 'Kuchai Sentral' },
    { id: 'm-vertica', label: 'M Vertica' },
    { id: 'divo', label: "D'Ivo" },
    { id: 'maple', label: 'Maple' },
    { id: 'parkhill', label: 'Parkhill' },
    { id: 'mosque', label: 'Mosque (Fri)' },
  ];

  const filteredTrips = trips.filter((t) => {
    const matchesRoute = activeFilter === 'all' || t.routeId === activeFilter;
    const matchesSearch =
      t.routeName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      t.departureTime.includes(searchQuery);
    return matchesRoute && matchesSearch;
  });

  return (
    <div className="fixed inset-0 z-50 bg-slate-950/85 backdrop-blur-sm flex items-end sm:items-center justify-center p-0 sm:p-4 animate-in fade-in duration-200">
      <div className="w-full max-w-lg bg-slate-900 border border-slate-800 rounded-t-3xl sm:rounded-3xl shadow-2xl max-h-[92vh] flex flex-col overflow-hidden">
        {/* Header */}
        <div className="p-4 border-b border-slate-800 flex items-center justify-between bg-slate-950/60">
          <div>
            <div className="flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-blue-500 animate-pulse" />
              <h2 className="text-base font-extrabold text-white">APU Bus Schedules</h2>
            </div>
            <p className="text-xs text-slate-400">
              Daily assigned timetable • 40 seats per shuttle • First Come First Served
            </p>
          </div>
          <button
            onClick={onClose}
            className="w-8 h-8 rounded-xl bg-slate-800 hover:bg-slate-700 flex items-center justify-center text-slate-300 hover:text-white"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* 7:30 AM Booking Window Rule Banner */}
        {!isBookingOpen && (
          <div className="bg-amber-500/15 border-b border-amber-500/30 px-4 py-2.5 flex items-center gap-2 text-xs text-amber-300">
            <AlertCircle className="w-4 h-4 shrink-0 text-amber-400" />
            <span>
              <strong>Booking opens at 07:30 AM.</strong> Hours are locked until 7:30 AM daily per campus policy.
            </span>
          </div>
        )}

        {/* Filter Chips Bar (Horizontal Scrollable) */}
        <div className="px-4 py-2.5 border-b border-slate-800 bg-slate-950/40 flex items-center gap-1.5 overflow-x-auto no-scrollbar">
          <Filter className="w-3.5 h-3.5 text-slate-400 shrink-0 mr-1" />
          {routes.map((r) => (
            <button
              key={r.id}
              onClick={() => setActiveFilter(r.id)}
              className={`px-3 py-1 rounded-full text-xs font-semibold whitespace-nowrap transition ${
                activeFilter === r.id
                  ? 'bg-blue-600 text-white shadow-sm'
                  : 'bg-slate-800/80 text-slate-400 hover:text-slate-200 hover:bg-slate-800'
              }`}
            >
              {r.label}
            </button>
          ))}
        </div>

        {/* Vertical List of Schedules */}
        <div className="flex-1 overflow-y-auto p-4 space-y-3">
          {filteredTrips.length === 0 ? (
            <div className="text-center py-12 text-slate-500 text-xs">
              No bus schedules found for this filter.
            </div>
          ) : (
            filteredTrips.map((trip) => {
              const full = isBusFull(trip.bookedSeatIds, trip.totalSeats);
              const existingBooking = currentBookings.find((b) => b.tripId === trip.id);
              const bookedByCurrentUser = Boolean(existingBooking);
              const seatsLeft = trip.totalSeats - trip.bookedSeatIds.length;
              const isWaitlisted = waitlistTripIds.includes(trip.id);

              return (
                <div
                  key={trip.id}
                  className={`p-3.5 rounded-2xl border transition-all duration-200 relative ${
                    full
                      ? 'bg-slate-950/40 border-slate-800/60 opacity-60' // Dimmed / lowered opacity when full as requested
                      : bookedByCurrentUser
                      ? 'bg-blue-950/30 border-blue-500/50 shadow-md'
                      : 'bg-slate-900 border-slate-800 hover:border-slate-700'
                  }`}
                >
                  <div className="flex items-start justify-between gap-2">
                    {/* Left: Time and Route */}
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2">
                        <span className="text-sm font-extrabold text-white font-mono flex items-center gap-1">
                          <Clock className="w-3.5 h-3.5 text-blue-400" />
                          {formatTime12h(trip.departureTime)}
                        </span>
                        <span
                          className="w-2 h-2 rounded-full"
                          style={{ backgroundColor: trip.routeColor }}
                        />
                        {trip.notes && (
                          <span className="text-[10px] bg-slate-800 text-slate-400 px-1.5 py-0.5 rounded truncate max-w-[150px]">
                            {trip.notes}
                          </span>
                        )}
                      </div>

                      <h4 className="text-xs font-bold text-slate-200 mt-1 truncate">
                        {trip.routeName}
                      </h4>

                      {/* Capacity badge */}
                      <div className="flex items-center gap-3 mt-2 text-[11px] text-slate-400">
                        <span className="flex items-center gap-1">
                          <Users className="w-3.5 h-3.5" />
                          <strong className={full ? 'text-rose-400' : 'text-emerald-400'}>
                            {full ? 'FULL (40/40)' : `${seatsLeft} of 40 seats left`}
                          </strong>
                        </span>
                        {bookedByCurrentUser && existingBooking && (
                          <span className="text-blue-400 font-semibold flex items-center gap-1">
                            <CheckCircle className="w-3 h-3" /> Booked by you (Seat {existingBooking.seatId})
                          </span>
                        )}
                      </div>
                    </div>

                    {/* Right Action Buttons */}
                    <div className="flex items-center gap-1.5 shrink-0 self-center">
                      {/* Bell Button: Standby / FCFS notification for full bus */}
                      <button
                        onClick={() => onToggleWaitlist(trip.id)}
                        className={`p-2 rounded-xl border transition ${
                          isWaitlisted
                            ? 'bg-amber-500/20 border-amber-500/50 text-amber-400'
                            : 'bg-slate-800/80 hover:bg-slate-800 border-slate-700/60 text-slate-400 hover:text-white'
                        }`}
                        title={
                          isWaitlisted
                            ? 'Standby alerts ON: You will be notified if a seat opens up.'
                            : 'Notify me if full bus has no-shows on FCFS basis'
                        }
                        aria-label="Allow Standby Notification"
                      >
                        {isWaitlisted ? (
                          <BellRing className="w-4 h-4 text-amber-400 animate-pulse" />
                        ) : (
                          <Bell className="w-4 h-4" />
                        )}
                      </button>

                      {/* Primary Action Button: Book a Seat OR Cancel */}
                      {bookedByCurrentUser && existingBooking ? (
                        <button
                          onClick={() => onRequestCancel(existingBooking)}
                          className="px-3 py-1.5 rounded-xl bg-rose-600/20 hover:bg-rose-600/30 border border-rose-500/40 text-rose-300 text-xs font-semibold flex items-center gap-1 transition"
                        >
                          <Trash2 className="w-3.5 h-3.5" /> Cancel
                        </button>
                      ) : (
                        <button
                          disabled={full || !isBookingOpen}
                          onClick={() => onBookTrip(trip)}
                          className={`px-3 py-1.5 rounded-xl text-xs font-bold transition shadow ${
                            full
                              ? 'bg-slate-800 text-slate-500 cursor-not-allowed border border-slate-700/50'
                              : !isBookingOpen
                              ? 'bg-slate-800 text-slate-400 cursor-not-allowed'
                              : 'bg-blue-600 hover:bg-blue-500 text-white shadow-blue-600/20'
                          }`}
                        >
                          {full ? 'Full' : 'Book a Seat'}
                        </button>
                      )}
                    </div>
                  </div>
                </div>
              );
            })
          )}
        </div>

        {/* Footer info */}
        <div className="p-3 border-t border-slate-800 bg-slate-950/80 text-center text-[11px] text-slate-500">
          Seats are allocated on a First-Come, First-Served (FCFS) basis. Tap Bell to join standby.
        </div>
      </div>
    </div>
  );
};
