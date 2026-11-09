export interface LocationCoord {
  lat: number;
  lng: number;
}

export interface BusStop {
  id: string;
  name: string;
  shortCode: string;
  coords: LocationCoord;
  address: string;
  isCampus?: boolean;
  fridayOnly?: boolean;
}

export interface BusTrip {
  id: string;
  routeId: string;
  routeName: string;
  fromStopId: string;
  toStopId: string;
  departureTime: string; // e.g. "08:45" (24-hour format)
  returnTime?: string;
  totalSeats: number; // 40 seats
  bookedSeatIds: string[]; // e.g. ["1A", "1B"]
  routeColor: string; // hex or tailwind color
  notes?: string;
  isPeakContinuous?: boolean;
}

export interface Seat {
  id: string; // e.g. "1A", "1B", "1C", "1D"
  row: number; // 1 to 10
  col: 'A' | 'B' | 'C' | 'D'; // A, B (Left), C, D (Right)
  isBooked: boolean;
  bookedByUserId?: string;
}

export type CheckInStatus = 'WAITING_WINDOW' | 'OUT_OF_RANGE' | 'READY_TO_CHECK_IN' | 'CHECKED_IN' | 'BOARDED' | 'EXPIRED';

export interface Booking {
  id: string;
  userId: string;
  tripId: string;
  seatId: string;
  routeId: string;
  routeName: string;
  fromStopName: string;
  toStopName: string;
  departureTime: string;
  notify30Min: boolean;
  status: CheckInStatus;
  bookedAt: string;
  checkedInAt?: string;
  qrCodeToken: string;
}

export interface DemoUser {
  id: string;
  name: string;
  studentId: string;
  avatar: string;
  role: 'Student';
  currentLocationName: string;
  coords: LocationCoord;
  isNearStop: boolean; // Demo 1 is near Bukit Jalil / APU; Demo 2 is far away (e.g. Cheras / Home)
  description: string;
  penaltyStrikes: number; // 0 to 3 strikes for anti-troller defense
  isSuspended?: boolean;
}

export interface WaitlistEntry {
  tripId: string;
  userId: string;
  joinedAt: string;
  notified: boolean;
}
