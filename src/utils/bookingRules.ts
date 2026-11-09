import { CheckInStatus, LocationCoord } from '../types/bus';
import { isWithinBusStopRange, MAX_CHECK_IN_DISTANCE_METERS } from './geo';

/**
 * Checks if daily booking is open.
 * Rule: At 7:30 AM, booking opens for all hours of the day.
 */
export function isBookingWindowOpen(currentTimeStr: string): boolean {
  const [hours, minutes] = currentTimeStr.split(':').map(Number);
  const totalMinutes = hours * 60 + minutes;
  const openMinutes = 7 * 60 + 30; // 07:30 AM
  return totalMinutes >= openMinutes;
}

/**
 * Calculates minutes until a given departure time (HH:mm) from the current time (HH:mm).
 * Returns negative if departure time has already passed.
 */
export function getMinutesUntilDeparture(currentTimeStr: string, departureTimeStr: string): number {
  const [cHours, cMins] = currentTimeStr.split(':').map(Number);
  const [dHours, dMins] = departureTimeStr.split(':').map(Number);

  const curTotal = cHours * 60 + cMins;
  const depTotal = dHours * 60 + dMins;

  return depTotal - curTotal;
}

/**
 * Determines check-in status:
 * 1. Must be within 10 minutes before departure (0 <= minsLeft <= 10)
 * 2. Must be within proximity range of the departure bus stop (<= 250m)
 */
export function evaluateCheckInStatus(params: {
  currentTimeStr: string;
  departureTimeStr: string;
  userCoord: LocationCoord;
  stopCoord: LocationCoord;
  alreadyCheckedIn: boolean;
}): {
  status: CheckInStatus;
  minutesUntil: number;
  distanceMeters: number;
  inRange: boolean;
  inTimeWindow: boolean;
  message: string;
} {
  const { currentTimeStr, departureTimeStr, userCoord, stopCoord, alreadyCheckedIn } = params;
  const minutesUntil = getMinutesUntilDeparture(currentTimeStr, departureTimeStr);
  const { inRange, distanceMeters } = isWithinBusStopRange(userCoord, stopCoord, MAX_CHECK_IN_DISTANCE_METERS);

  if (alreadyCheckedIn) {
    if (minutesUntil < -15) {
      return {
        status: 'BOARDED',
        minutesUntil,
        distanceMeters,
        inRange,
        inTimeWindow: false,
        message: 'Bus has boarded and departed.',
      };
    }
    return {
      status: 'CHECKED_IN',
      minutesUntil,
      distanceMeters,
      inRange,
      inTimeWindow: minutesUntil <= 10 && minutesUntil >= -10,
      message: 'Verified! You are checked in and ready to board.',
    };
  }

  // If departure passed more than 5 mins ago and not checked in
  if (minutesUntil < -5) {
    return {
      status: 'EXPIRED',
      minutesUntil,
      distanceMeters,
      inRange,
      inTimeWindow: false,
      message: 'Departure time has passed. Seat released.',
    };
  }

  // Not yet in the 10-minute check-in window
  if (minutesUntil > 10) {
    return {
      status: 'WAITING_WINDOW',
      minutesUntil,
      distanceMeters,
      inRange,
      inTimeWindow: false,
      message: `Check-in opens 10 mins before departure (${minutesUntil - 10}m remaining).`,
    };
  }

  // Within 10 mins window, but out of range
  if (!inRange) {
    return {
      status: 'OUT_OF_RANGE',
      minutesUntil,
      distanceMeters,
      inRange: false,
      inTimeWindow: true,
      message: `Outside stop range (${distanceMeters}m away, need < ${MAX_CHECK_IN_DISTANCE_METERS}m). Move closer to check-in.`,
    };
  }

  // Within 10 mins window AND in range
  return {
    status: 'READY_TO_CHECK_IN',
    minutesUntil,
    distanceMeters,
    inRange: true,
    inTimeWindow: true,
    message: `In range (${distanceMeters}m)! Automatic GPS check-in ready.`,
  };
}

/**
 * Checks if a bus is completely full (capacity = 40).
 */
export function isBusFull(bookedSeatIds: string[], maxCapacity: number = 40): boolean {
  return bookedSeatIds.length >= maxCapacity;
}

/**
 * Formats 24h time to 12h AM/PM string (e.g. "08:45" -> "8:45 AM")
 */
export function formatTime12h(time24: string): string {
  const [hStr, mStr] = time24.split(':');
  const h = parseInt(hStr, 10);
  const m = parseInt(mStr, 10);
  const period = h >= 12 ? 'PM' : 'AM';
  const displayH = h % 12 === 0 ? 12 : h % 12;
  const displayM = m < 10 ? `0${m}` : m;
  return `${displayH}:${displayM} ${period}`;
}

/**
 * Campus Anti-Troller Defense & Penalty System
 * Prevents phantom bus bookings that deny other students seats.
 */
export const PENALTY_THRESHOLDS = {
  LATE_CANCEL_MINUTES: 15, // Canceling less than 15 mins before departure is a late cancel
  MAX_STRIKES_BEFORE_SUSPENSION: 3,
};

/**
 * Maximum concurrent active bookings allowed per student per campus policy.
 * Rule: At most 2 active bookings concurrently, provided departure and destination
 * are not identical (e.g. student cannot book two "LRT Bukit Jalil ➔ APU", but CAN book
 * one "LRT Bukit Jalil ➔ APU" and one return "APU ➔ LRT Bukit Jalil").
 */
export const MAX_ACTIVE_BOOKINGS_LIMIT = 2;

export interface BookingEligibilityResult {
  canBook: boolean;
  reason?: 'MAX_LIMIT_REACHED' | 'DUPLICATE_ROUTE' | 'SUSPENDED';
  message?: string;
}

/**
 * Validates whether a user can book a candidate trip according to APU's rules:
 * 1. Account not suspended (strikes < 3).
 * 2. Active bookings count < 2.
 * 3. Origin and Destination must not be identical to an already active booking.
 */
export function validateBookingEligibility(params: {
  activeBookings: Array<{ fromStopName: string; toStopName: string; tripId?: string; id?: string }>;
  candidateFromStopName: string;
  candidateToStopName: string;
  penaltyStrikes?: number;
}): BookingEligibilityResult {
  const { activeBookings, candidateFromStopName, candidateToStopName, penaltyStrikes = 0 } = params;

  // 1. Suspension check
  if (penaltyStrikes >= PENALTY_THRESHOLDS.MAX_STRIKES_BEFORE_SUSPENSION) {
    return {
      canBook: false,
      reason: 'SUSPENDED',
      message: 'Account suspended due to 3 penalty strikes. Please contact APU Student Services.',
    };
  }

  // 2. Max 2 active bookings check
  if (activeBookings.length >= MAX_ACTIVE_BOOKINGS_LIMIT) {
    return {
      canBook: false,
      reason: 'MAX_LIMIT_REACHED',
      message: `Maximum active bookings reached (${MAX_ACTIVE_BOOKINGS_LIMIT}/2). Cancel an existing booking to reserve another trip.`,
    };
  }

  // Normalize string for safe comparison
  const normalize = (val: string) => val.trim().toLowerCase();

  // 3. Duplicate route check (origin and destination cannot be identical)
  const isDuplicate = activeBookings.some((b) => {
    return (
      normalize(b.fromStopName) === normalize(candidateFromStopName) &&
      normalize(b.toStopName) === normalize(candidateToStopName)
    );
  });

  if (isDuplicate) {
    return {
      canBook: false,
      reason: 'DUPLICATE_ROUTE',
      message: `Duplicate route not allowed: You already have an active booking for "${candidateFromStopName} ➔ ${candidateToStopName}". You can book the return trip or a different destination.`,
    };
  }

  return {
    canBook: true,
  };
}

export function evaluateLateCancellation(minutesUntilDeparture: number): {
  isLateCancel: boolean;
  strikePenalty: number;
  message: string;
} {
  if (minutesUntilDeparture < PENALTY_THRESHOLDS.LATE_CANCEL_MINUTES) {
    return {
      isLateCancel: true,
      strikePenalty: 1,
      message: `Late Cancellation Warning: Canceling within ${PENALTY_THRESHOLDS.LATE_CANCEL_MINUTES} mins of departure incurs +1 strike to prevent seat trolling.`,
    };
  }
  return {
    isLateCancel: false,
    strikePenalty: 0,
    message: 'Free cancellation: canceled with more than 15 minutes notice.',
  };
}

export function getStudentReliabilityTier(strikes: number): {
  tier: 'CLEAN' | 'WARNING' | 'PROBATION' | 'SUSPENDED';
  label: string;
  badgeColor: string;
  description: string;
} {
  if (strikes >= 3) {
    return {
      tier: 'SUSPENDED',
      label: 'Booking Suspended (3/3 Strikes)',
      badgeColor: 'bg-rose-500/20 text-rose-300 border-rose-500/40',
      description: 'Account temporarily suspended for repeated no-shows. Visit APU Student Services to appeal.',
    };
  }
  if (strikes === 2) {
    return {
      tier: 'PROBATION',
      label: 'Probation (2/3 Strikes)',
      badgeColor: 'bg-amber-500/20 text-amber-300 border-amber-500/40',
      description: 'One more no-show will suspend your shuttle privileges for 7 days.',
    };
  }
  if (strikes === 1) {
    return {
      tier: 'WARNING',
      label: 'Warning (1/3 Strike)',
      badgeColor: 'bg-yellow-500/20 text-yellow-300 border-yellow-500/40',
      description: '1 penalty strike recorded. Please ensure you board your reserved buses.',
    };
  }
  return {
    tier: 'CLEAN',
    label: 'Clean Record (0 Strikes)',
    badgeColor: 'bg-emerald-500/20 text-emerald-300 border-emerald-500/40',
    description: 'Good standing. You can book multiple buses across different hours.',
  };
}

