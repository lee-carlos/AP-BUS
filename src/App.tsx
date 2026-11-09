import React, { useState, useEffect, useMemo, useCallback } from 'react';
import { BusStop, BusTrip, Booking, DemoUser } from './types/bus';
import { APU_STOPS, INITIAL_TRIPS, DEMO_ACCOUNTS } from './data/apuRoutes';
import { evaluateCheckInStatus, isBookingWindowOpen, getMinutesUntilDeparture } from './utils/bookingRules';
import { PhoneShell } from './components/PhoneShell';
import { DemoAccountSelector } from './components/DemoAccountSelector';
import { TopBar } from './components/TopBar';
import { RouteFilter } from './components/RouteFilter';
import { BusMap } from './components/BusMap';
import { BookedBusCard } from './components/BookedBusCard';
import { ScheduleModal } from './components/ScheduleModal';
import { SeatPickerModal } from './components/SeatPickerModal';
import { CancelConfirmModal } from './components/CancelConfirmModal';
import { BoardingPassModal } from './components/BoardingPassModal';
import { SimulationBar } from './components/SimulationBar';
import { StandbyNotificationModal } from './components/StandbyNotificationModal';
import { SearchModal } from './components/SearchModal';
import { ScheduleDocModal } from './components/ScheduleDocModal';
import { Bus, Calendar, Sparkles, ShieldAlert } from 'lucide-react';

export default function App() {
  // Demo User State (null = on first landing page)
  const [currentUser, setCurrentUser] = useState<DemoUser | null>(null);

  // Trips & Bookings (supports multiple bookings per user!)
  const [trips, setTrips] = useState<BusTrip[]>(INITIAL_TRIPS);
  const [userBookings, setUserBookings] = useState<Record<string, Booking[]>>({
    'user-1': [
      {
        id: 'bk-0845-lrt',
        userId: 'user-1',
        tripId: 'lrt-0845',
        seatId: '12A',
        routeId: 'lrt',
        routeName: 'LRT Bukit Jalil ➔ APU',
        fromStopName: 'LRT Bukit Jalil',
        toStopName: 'Asia Pacific University (APU Campus)',
        departureTime: '08:45',
        notify30Min: true,
        status: 'READY_TO_CHECK_IN',
        bookedAt: '07:32 AM',
        qrCodeToken: 'APU-PASS-TP068412-LRT0845-12A',
      },
    ],
  });

  // Standby waitlist subscriptions (Trip IDs)
  const [waitlistTripIds, setWaitlistTripIds] = useState<string[]>(['lrt-1000']);

  // Route Filter state
  const [selectedFrom, setSelectedFrom] = useState<BusStop | null>(null);
  const [selectedTo, setSelectedTo] = useState<BusStop | null>(null);

  // Simulated Time (HH:mm)
  const [simulatedTimeStr, setSimulatedTimeStr] = useState<string>('08:38');

  // Modals & Active selections
  const [isScheduleOpen, setIsScheduleOpen] = useState(false);
  const [seatPickerTrip, setSeatPickerTrip] = useState<BusTrip | null>(null);
  const [cancelingBooking, setCancelingBooking] = useState<Booking | null>(null);
  const [selectedBookingForPass, setSelectedBookingForPass] = useState<Booking | null>(null);
  const [isBoardingPassOpen, setIsBoardingPassOpen] = useState(false);
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [isPdfModalOpen, setIsPdfModalOpen] = useState(false);
  const [showSimulator, setShowSimulator] = useState(true);

  // Standby notification offer state (Rule 5)
  const [standbyOffer, setStandbyOffer] = useState<{ trip: BusTrip; seatId: string } | null>(null);

  // Google Maps Quota state (Case A)
  const [quotaExceeded, setQuotaExceeded] = useState(false);

  useEffect(() => {
    const handleQuota = () => setQuotaExceeded(true);
    window.addEventListener('gmp-quota-exceeded', handleQuota);
    return () => window.removeEventListener('gmp-quota-exceeded', handleQuota);
  }, []);

  // Current user's active bookings (array)
  const currentUserBookings = useMemo(() => {
    if (!currentUser) return [];
    return userBookings[currentUser.id] || [];
  }, [currentUser, userBookings]);

  // Is daily booking window open? (At 7:30 AM)
  const isBookingOpen = useMemo(() => {
    return isBookingWindowOpen(simulatedTimeStr);
  }, [simulatedTimeStr]);

  // Re-evaluate check-in status for all active user bookings on clock/location updates
  useEffect(() => {
    if (!currentUser || currentUserBookings.length === 0) return;

    let hasChanges = false;
    const updated = currentUserBookings.map((b) => {
      const fromStop = APU_STOPS.find((s) => s.name === b.fromStopName) || APU_STOPS[1];
      const evalRes = evaluateCheckInStatus({
        currentTimeStr: simulatedTimeStr,
        departureTimeStr: b.departureTime,
        userCoord: currentUser.coords,
        stopCoord: fromStop.coords,
        alreadyCheckedIn: b.status === 'CHECKED_IN' || b.status === 'BOARDED',
      });

      if (evalRes.status !== b.status && b.status !== 'BOARDED') {
        hasChanges = true;
        return { ...b, status: evalRes.status };
      }
      return b;
    });

    if (hasChanges) {
      setUserBookings((prev) => ({
        ...prev,
        [currentUser.id]: updated,
      }));
    }
  }, [simulatedTimeStr, currentUser, currentUserBookings]);

  // Handle route reversal (swap button)
  const handleSwapStops = useCallback(() => {
    setSelectedFrom((prevFrom) => {
      setSelectedTo(prevFrom);
      return selectedTo;
    });
  }, [selectedTo]);

  // Toggle 30m Notification
  const handleToggleNotify30 = (bookingId: string) => {
    if (!currentUser) return;
    setUserBookings((prev) => ({
      ...prev,
      [currentUser.id]: (prev[currentUser.id] || []).map((b) =>
        b.id === bookingId ? { ...b, notify30Min: !b.notify30Min } : b
      ),
    }));
  };

  // Check in now
  const handleCheckInNow = (bookingId: string) => {
    if (!currentUser) return;
    let checkedBooking: Booking | null = null;
    setUserBookings((prev) => ({
      ...prev,
      [currentUser.id]: (prev[currentUser.id] || []).map((b) => {
        if (b.id === bookingId) {
          const updated = { ...b, status: 'CHECKED_IN' as const, checkedInAt: simulatedTimeStr };
          checkedBooking = updated;
          return updated;
        }
        return b;
      }),
    }));
    if (checkedBooking) {
      setSelectedBookingForPass(checkedBooking);
      setIsBoardingPassOpen(true);
    }
  };

  // Board Bus
  const handleBoardBus = () => {
    if (!currentUser || !selectedBookingForPass) return;
    setUserBookings((prev) => ({
      ...prev,
      [currentUser.id]: (prev[currentUser.id] || []).map((b) =>
        b.id === selectedBookingForPass.id ? { ...b, status: 'BOARDED' as const } : b
      ),
    }));
    setSelectedBookingForPass((prev) => (prev ? { ...prev, status: 'BOARDED' } : null));
  };

  // Seat booking confirmation (supports multiple bookings)
  const handleConfirmSeat = (tripId: string, seatId: string) => {
    if (!currentUser) return;

    // Check penalty suspension
    if (currentUser.penaltyStrikes >= 3) {
      alert('Your shuttle privileges are suspended (3/3 strikes). You cannot book a seat at this time.');
      return;
    }

    const trip = trips.find((t) => t.id === tripId);
    if (!trip) return;

    // Update trip booked seats
    setTrips((prevTrips) =>
      prevTrips.map((t) =>
        t.id === tripId ? { ...t, bookedSeatIds: [...t.bookedSeatIds, seatId] } : t
      )
    );

    const fromStop = APU_STOPS.find((s) => s.id === trip.fromStopId) || APU_STOPS[0];
    const toStop = APU_STOPS.find((s) => s.id === trip.toStopId) || APU_STOPS[1];

    const newBooking: Booking = {
      id: `bk-${Date.now()}`,
      userId: currentUser.id,
      tripId: trip.id,
      seatId,
      routeId: trip.routeId,
      routeName: trip.routeName,
      fromStopName: fromStop.name,
      toStopName: toStop.name,
      departureTime: trip.departureTime,
      notify30Min: true,
      status: 'WAITING_WINDOW',
      bookedAt: simulatedTimeStr,
      qrCodeToken: `APU-${currentUser.studentId}-${trip.id}-${seatId}`,
    };

    // Add to user's bookings list
    setUserBookings((prev) => ({
      ...prev,
      [currentUser.id]: [...(prev[currentUser.id] || []), newBooking],
    }));

    // Auto set route filter to this trip
    setSelectedFrom(fromStop);
    setSelectedTo(toStop);

    setSeatPickerTrip(null);
    setIsScheduleOpen(false);
  };

  // Cancel booking confirmation with Penalty enforcement
  const handleConfirmCancel = (bookingId: string, isLate: boolean) => {
    if (!currentUser) return;

    const bookingToCancel = currentUserBookings.find((b) => b.id === bookingId);
    if (!bookingToCancel) return;

    // Free the seat in trips
    setTrips((prevTrips) =>
      prevTrips.map((t) =>
        t.id === bookingToCancel.tripId
          ? { ...t, bookedSeatIds: t.bookedSeatIds.filter((s) => s !== bookingToCancel.seatId) }
          : t
      )
    );

    // Remove from bookings
    setUserBookings((prev) => ({
      ...prev,
      [currentUser.id]: (prev[currentUser.id] || []).filter((b) => b.id !== bookingId),
    }));

    // If late cancel: increment strike penalty to defend against seat trollers
    if (isLate) {
      const updatedStrikes = Math.min(3, (currentUser.penaltyStrikes || 0) + 1);
      setCurrentUser((prev) => (prev ? { ...prev, penaltyStrikes: updatedStrikes } : null));
    }

    setCancelingBooking(null);
  };

  // Standby waitlist toggle (bell button)
  const handleToggleWaitlist = (tripId: string) => {
    setWaitlistTripIds((prev) =>
      prev.includes(tripId) ? prev.filter((id) => id !== tripId) : [...prev, tripId]
    );
  };

  // Toggle user simulated location (In range vs Out of range)
  const handleToggleUserLocation = () => {
    if (!currentUser) return;
    const isNowNear = !currentUser.isNearStop;
    const updatedUser: DemoUser = {
      ...currentUser,
      isNearStop: isNowNear,
      coords: isNowNear
        ? { lat: 3.0585, lng: 101.6919 } // LRT Bukit Jalil Waiting Bay (<50m, in 250m zone)
        : { lat: 3.1205, lng: 101.7275 }, // Cheras / M Vertica (~9km)
      currentLocationName: isNowNear
        ? 'LRT Bukit Jalil Waiting Bay (In 250m Zone)'
        : 'Cheras Private Accommodation (Outside Zone)',
    };
    setCurrentUser(updatedUser);
  };

  // Add strike penalty manually for testing
  const handleAddStrike = () => {
    if (!currentUser) return;
    const newStrikes = Math.min(3, (currentUser.penaltyStrikes || 0) + 1);
    setCurrentUser({ ...currentUser, penaltyStrikes: newStrikes });
  };

  // Reset strikes
  const handleResetStrikes = () => {
    if (!currentUser) return;
    setCurrentUser({ ...currentUser, penaltyStrikes: 0 });
  };

  // Simulate no-show on full bus (Rule 5)
  const handleTriggerStandbyRelease = () => {
    const fullTrip = trips.find((t) => t.id === 'lrt-1000' || t.bookedSeatIds.length >= 40) || trips[0];
    const releasedSeat = '4A';
    setStandbyOffer({
      trip: fullTrip,
      seatId: releasedSeat,
    });
  };

  const handleAcceptStandbySeat = (tripId: string, seatId: string) => {
    setStandbyOffer(null);
    handleConfirmSeat(tripId, seatId);
  };

  // Reset demo bookings
  const handleResetData = () => {
    setTrips(INITIAL_TRIPS);
    setUserBookings({});
    setSelectedFrom(null);
    setSelectedTo(null);
    if (currentUser) {
      setCurrentUser({ ...currentUser, penaltyStrikes: 0 });
    }
  };

  return (
    <PhoneShell simulatedTimeStr={simulatedTimeStr}>
      {/* Client-Side Quota Defense Amber Banner (Mandatory GMP requirement) */}
      {quotaExceeded && (
        <div className="bg-amber-50 border-b border-amber-200 text-amber-900 px-4 py-2.5 text-xs md:text-sm text-center sticky top-0 z-50 shadow-sm">
          <span>
            Google Maps Platform quota reached. If you are the app owner, visit{' '}
            <a
              href="https://developers.google.com/maps/ai/ai-studio?utm_campaign=gmp_mcp_codeassist_v1_aistudio#quota_exceeded_errors"
              target="_blank"
              rel="noopener noreferrer"
              className="underline font-semibold text-amber-950 hover:text-amber-800"
            >
              maps developer site
            </a>{' '}
            for instructions to update your account.
          </span>
        </div>
      )}

      {/* Screen 1: Demo Account 1 and 2 Selection (if not selected) */}
      {!currentUser ? (
        <DemoAccountSelector
          onSelectAccount={(user) => {
            setCurrentUser(user);
            if (user.id === 'user-1') {
              setSelectedFrom(APU_STOPS[1]);
              setSelectedTo(APU_STOPS[0]);
            }
          }}
        />
      ) : (
        /* Screen 2: Main AP-BUS View */
        <div className="flex-1 flex flex-col">
          {/* Top Bar with Search, 3 Dots & User Profile Avatar */}
          <TopBar
            currentUser={currentUser}
            onOpenSearch={() => setIsSearchOpen(true)}
            onSwitchUser={() => setCurrentUser(null)}
            onResetData={handleResetData}
            onToggleSimulator={() => setShowSimulator(!showSimulator)}
            onViewScheduleDoc={() => setIsPdfModalOpen(true)}
          />

          {/* 2 Search Bars (From & To) with Reversed Swap Button */}
          <RouteFilter
            selectedFrom={selectedFrom}
            selectedTo={selectedTo}
            onSelectFrom={setSelectedFrom}
            onSelectTo={setSelectedTo}
            onSwap={handleSwapStops}
          />

          {/* Map with Route Tracking, Road Geometry, and 250m Departure Radius Circle */}
          <BusMap
            currentUser={currentUser}
            selectedFrom={selectedFrom}
            selectedTo={selectedTo}
            bookings={currentUserBookings}
            trips={trips}
          />

          {/* Booked Buses Information Section (Supports Multiple Bookings & Penalty Defense) */}
          <BookedBusCard
            bookings={currentUserBookings}
            penaltyStrikes={currentUser.penaltyStrikes || 0}
            currentTimeStr={simulatedTimeStr}
            onToggleNotify30={handleToggleNotify30}
            onCheckInNow={handleCheckInNow}
            onOpenBoardingPass={(b) => {
              setSelectedBookingForPass(b);
              setIsBoardingPassOpen(true);
            }}
            onRequestCancel={(b) => setCancelingBooking(b)}
          />

          {/* Prominent Primary BOOK THE BUS Button */}
          <div className="px-4 py-3">
            <button
              onClick={() => setIsScheduleOpen(true)}
              className="w-full py-3.5 px-6 rounded-2xl bg-gradient-to-r from-blue-600 via-indigo-600 to-blue-500 hover:from-blue-500 hover:to-indigo-500 text-white font-extrabold text-sm flex items-center justify-center gap-2 shadow-xl shadow-blue-600/30 active:scale-[0.98] transition-all group"
            >
              <Bus className="w-5 h-5 group-hover:scale-110 transition-transform" />
              <span>BOOK A BUS SEAT</span>
              <span className="text-[10px] bg-white/20 px-2 py-0.5 rounded-full font-mono uppercase tracking-wider">
                Multi-Trip Timetable
              </span>
            </button>
          </div>

          {/* Floating/Docked Simulator Bar */}
          {showSimulator && (
            <div className="mt-auto">
              <SimulationBar
                simulatedTimeStr={simulatedTimeStr}
                onSetTime={setSimulatedTimeStr}
                currentUser={currentUser}
                onToggleUserLocation={handleToggleUserLocation}
                onTriggerStandbyRelease={handleTriggerStandbyRelease}
                onAddStrike={handleAddStrike}
                onResetStrikes={handleResetStrikes}
              />
            </div>
          )}
        </div>
      )}

      {/* MODAL 1: Schedule Drawer / Modal */}
      {isScheduleOpen && (
        <ScheduleModal
          trips={trips}
          currentBookings={currentUserBookings}
          onBookTrip={(trip) => {
            setSeatPickerTrip(trip);
            setIsScheduleOpen(false);
          }}
          onRequestCancel={(b) => {
            setIsScheduleOpen(false);
            setCancelingBooking(b);
          }}
          onToggleWaitlist={handleToggleWaitlist}
          waitlistTripIds={waitlistTripIds}
          isBookingOpen={isBookingOpen}
          onClose={() => setIsScheduleOpen(false)}
          initialRouteFilter={selectedFrom?.id}
        />
      )}

      {/* MODAL 2: Interactive 40-Seat Bus Picker & Confirmation */}
      {seatPickerTrip && currentUser && (
        <SeatPickerModal
          trip={seatPickerTrip}
          currentUser={currentUser}
          onConfirmSeat={handleConfirmSeat}
          onClose={() => setSeatPickerTrip(null)}
        />
      )}

      {/* MODAL 3: Cancel Booking Confirmation with Late Cancellation Penalty Check */}
      {cancelingBooking && (
        <CancelConfirmModal
          booking={cancelingBooking}
          currentTimeStr={simulatedTimeStr}
          onConfirmCancel={handleConfirmCancel}
          onClose={() => setCancelingBooking(null)}
        />
      )}

      {/* MODAL 4: Digital Boarding Pass with QR Code */}
      {isBoardingPassOpen && selectedBookingForPass && currentUser && (
        <BoardingPassModal
          booking={selectedBookingForPass}
          user={currentUser}
          onBoardBus={handleBoardBus}
          onClose={() => setIsBoardingPassOpen(false)}
        />
      )}

      {/* MODAL 5: Search Modal */}
      {isSearchOpen && (
        <SearchModal
          onSelectRoute={(from, to) => {
            setSelectedFrom(from);
            setSelectedTo(to);
          }}
          onOpenBooking={() => setIsScheduleOpen(true)}
          onClose={() => setIsSearchOpen(false)}
        />
      )}

      {/* MODAL 6: Official PDF Schedule Modal */}
      {isPdfModalOpen && (
        <ScheduleDocModal onClose={() => setIsPdfModalOpen(false)} />
      )}

      {/* MODAL 7: Standby FCFS Offer Notification (Rule 5) */}
      {standbyOffer && (
        <StandbyNotificationModal
          trip={standbyOffer.trip}
          releasedSeatId={standbyOffer.seatId}
          onAcceptSeat={handleAcceptStandbySeat}
          onDecline={() => setStandbyOffer(null)}
        />
      )}
    </PhoneShell>
  );
}
