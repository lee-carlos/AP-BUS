import { BusStop, BusTrip, DemoUser } from '../types/bus';

// 14 Real APU Stops in Bukit Jalil 57000 & Klang Valley
export const APU_STOPS: BusStop[] = [
  {
    id: 'apu',
    name: 'Asia Pacific University (APU Campus)',
    shortCode: 'APU',
    coords: { lat: 3.0558, lng: 101.7003 },
    address: 'Technology Park Malaysia, Bukit Jalil, 57000 Kuala Lumpur',
    isCampus: true,
  },
  {
    id: 'lrt',
    name: 'LRT Bukit Jalil',
    shortCode: 'LRT',
    coords: { lat: 3.0587, lng: 101.6917 },
    address: 'Stesen LRT Bukit Jalil, Jalan Merah Caga, 57000 Kuala Lumpur',
  },
  {
    id: 'm-vertica',
    name: 'M Vertica',
    shortCode: 'MV',
    coords: { lat: 3.1205, lng: 101.7275 },
    address: 'Jalan Cheras, Taman Pertama, Kuala Lumpur',
  },
  {
    id: 'city-of-green',
    name: 'City of Green Condominium',
    shortCode: 'COG',
    coords: { lat: 3.0508, lng: 101.6946 },
    address: 'Bukit Jalil Highway, Technology Park Malaysia, 57000 Kuala Lumpur',
  },
  {
    id: 'bloomsvale',
    name: 'Bloomsvale',
    shortCode: 'BV',
    coords: { lat: 3.0782, lng: 101.6667 },
    address: 'Jalan Puchong, Old Klang Road, Kuala Lumpur',
  },
  {
    id: 'kuchai-sentral',
    name: 'Kuchai Sentral',
    shortCode: 'KS',
    coords: { lat: 3.0874, lng: 101.6885 },
    address: 'Jalan Kuchai Sentral 1, Kuchai Entrepreneurs Park, Kuala Lumpur',
  },
  {
    id: 'divo',
    name: "D'Ivo Residence",
    shortCode: 'DV',
    coords: { lat: 3.0970, lng: 101.6760 },
    address: 'Old Klang Road, Taman Desa, Kuala Lumpur',
  },
  {
    id: 'parkhill',
    name: 'Parkhill Residence',
    shortCode: 'PH',
    coords: { lat: 3.0543, lng: 101.6938 },
    address: 'Technology Park Malaysia, Bukit Jalil, 57000 Kuala Lumpur',
  },
  {
    id: 'bayu-jalil',
    name: 'Bayu Jalil',
    shortCode: 'BJ',
    coords: { lat: 3.0610, lng: 101.6740 },
    address: 'Jalan Jalil Perkasa 1, Bukit Jalil, 57000 Kuala Lumpur',
  },
  {
    id: 'kingston',
    name: 'UniStay @ Kingston Hotel',
    shortCode: 'UNIS',
    coords: { lat: 3.0512, lng: 101.6931 },
    address: 'Jalan Persiaran Barat, Bukit Jalil, 57000 Kuala Lumpur',
  },
  {
    id: 'harmony',
    name: 'Harmony Residence',
    shortCode: 'HM',
    coords: { lat: 3.0754, lng: 101.6712 },
    address: 'Jalan Puchong Mesra, Bukit Jalil vicinity, Kuala Lumpur',
  },
  {
    id: 'fortune-park',
    name: 'Fortune Park',
    shortCode: 'F.PARK',
    coords: { lat: 3.0332, lng: 101.7118 },
    address: 'Jalan 1/144A, One South Seri Kembangan / Bukit Jalil border',
  },
  {
    id: 'maple',
    name: 'The Maple Residence',
    shortCode: 'MP',
    coords: { lat: 3.0645, lng: 101.6872 },
    address: 'W City OUG / Bukit Jalil West, 57000 Kuala Lumpur',
  },
  {
    id: 'mosque',
    name: 'Mosque (Friday Prayer)',
    shortCode: 'MSQ',
    coords: { lat: 3.0673, lng: 101.6987 },
    address: 'Masjid Jamek Seri Petaling / Bukit Jalil community',
    fridayOnly: true,
  },
];

// Helper to generate seat layout for 40 seats: 10 rows x 4 seats (A, B, C, D)
export const ALL_SEAT_IDS: string[] = [];
for (let row = 1; row <= 10; row++) {
  ALL_SEAT_IDS.push(`${row}A`, `${row}B`, `${row}C`, `${row}D`);
}

// Route color palette for visual distinction
export const ROUTE_COLORS: Record<string, string> = {
  lrt: '#2563EB', // Blue
  'fortune-park': '#EA580C', // Orange
  'city-of-green': '#DB2777', // Pink/Magenta
  kingston: '#D97706', // Amber
  bloomsvale: '#059669', // Emerald
  'bayu-jalil': '#0284C7', // Sky Blue
  'kuchai-sentral': '#0D9488', // Teal
  'm-vertica': '#7C3AED', // Purple
  divo: '#E11D48', // Rose
  maple: '#16A34A', // Green
  parkhill: '#0891B2', // Cyan
  mosque: '#15803D', // Dark Green
};

// Initial Seed Trips from the official schedule PDF
export const INITIAL_TRIPS: BusTrip[] = [
  // LRT BUKIT JALIL TO APU
  {
    id: 'lrt-0730',
    routeId: 'lrt',
    routeName: 'LRT Bukit Jalil ➔ APU',
    fromStopId: 'lrt',
    toStopId: 'apu',
    departureTime: '07:30',
    totalSeats: 40,
    bookedSeatIds: ['1A', '1B', '2A', '2B', '3A', '3B', '4A', '4B', '5A', '5B', '6A', '6B', '7A', '7B', '8A', '8B', '9A', '9B', '10A', '10B', '1C', '1D', '2C', '2D', '3C', '3D', '4C', '4D', '5C', '5D', '6C', '6D', '7C', '7D', '8C', '8D', '9C', '9D', '10C', '10D'], // FULL
    routeColor: ROUTE_COLORS.lrt,
    notes: 'Morning Peak. Departs sharp at 07:30.',
  },
  {
    id: 'lrt-0845',
    routeId: 'lrt',
    routeName: 'LRT Bukit Jalil ➔ APU',
    fromStopId: 'lrt',
    toStopId: 'apu',
    departureTime: '08:45',
    totalSeats: 40,
    bookedSeatIds: ['1A', '1B', '2A', '3A', '4A', '5B', '6C', '7D', '8A', '9B', '10C'], // 11 seats booked
    routeColor: ROUTE_COLORS.lrt,
    notes: 'Regular scheduled interval.',
  },
  {
    id: 'lrt-0900',
    routeId: 'lrt',
    routeName: 'LRT Bukit Jalil ➔ APU',
    fromStopId: 'lrt',
    toStopId: 'apu',
    departureTime: '09:00',
    totalSeats: 40,
    bookedSeatIds: ['1C', '2D', '3B'],
    routeColor: ROUTE_COLORS.lrt,
  },
  {
    id: 'lrt-0930',
    routeId: 'lrt',
    routeName: 'LRT Bukit Jalil ➔ APU',
    fromStopId: 'lrt',
    toStopId: 'apu',
    departureTime: '09:30',
    totalSeats: 40,
    bookedSeatIds: ['1A', '2A', '3A', '4A'],
    routeColor: ROUTE_COLORS.lrt,
  },
  {
    id: 'lrt-1000',
    routeId: 'lrt',
    routeName: 'LRT Bukit Jalil ➔ APU',
    fromStopId: 'lrt',
    toStopId: 'apu',
    departureTime: '10:00',
    totalSeats: 40,
    bookedSeatIds: ['1A', '1B', '2A', '2B', '3A', '3B', '4A', '4B', '5A', '5B', '6A', '6B', '7A', '7B', '8A', '8B', '9A', '9B', '10A', '10B', '1C', '1D', '2C', '2D', '3C', '3D', '4C', '4D', '5C', '5D', '6C', '6D', '7C', '7D', '8C', '8D', '9C', '9D', '10C', '10D'], // FULL
    routeColor: ROUTE_COLORS.lrt,
    notes: 'Full Capacity trip.',
  },
  {
    id: 'lrt-1110',
    routeId: 'lrt',
    routeName: 'LRT Bukit Jalil ➔ APU',
    fromStopId: 'lrt',
    toStopId: 'apu',
    departureTime: '11:10',
    totalSeats: 40,
    bookedSeatIds: ['1A', '2B'],
    routeColor: ROUTE_COLORS.lrt,
  },
  {
    id: 'lrt-1300',
    routeId: 'lrt',
    routeName: 'LRT Bukit Jalil ➔ APU',
    fromStopId: 'lrt',
    toStopId: 'apu',
    departureTime: '13:00',
    totalSeats: 40,
    bookedSeatIds: ['1A', '2B', '3C', '4D'],
    routeColor: ROUTE_COLORS.lrt,
  },
  // APU TO LRT
  {
    id: 'apu-lrt-1330',
    routeId: 'lrt',
    routeName: 'APU ➔ LRT Bukit Jalil',
    fromStopId: 'apu',
    toStopId: 'lrt',
    departureTime: '13:30',
    totalSeats: 40,
    bookedSeatIds: ['1A', '1C'],
    routeColor: ROUTE_COLORS.lrt,
  },
  {
    id: 'apu-lrt-1700',
    routeId: 'lrt',
    routeName: 'APU ➔ LRT Bukit Jalil',
    fromStopId: 'apu',
    toStopId: 'lrt',
    departureTime: '17:00',
    totalSeats: 40,
    bookedSeatIds: ['1A', '1B', '2A', '2B', '3A', '3B', '4A', '4B', '5A', '5B', '6A', '6B', '7A', '7B', '8A', '8B', '9A', '9B', '10A', '10B', '1C', '1D', '2C', '2D', '3C', '3D', '4C', '4D', '5C', '5D', '6C', '6D', '7C', '7D', '8C', '8D', '9C', '9D', '10C', '10D'], // FULL
    routeColor: ROUTE_COLORS.lrt,
    notes: 'Peak Evening Full Bus.',
  },
  {
    id: 'apu-lrt-1730',
    routeId: 'lrt',
    routeName: 'APU ➔ LRT Bukit Jalil',
    fromStopId: 'apu',
    toStopId: 'lrt',
    departureTime: '17:30',
    totalSeats: 40,
    bookedSeatIds: ['1A', '2A', '3A', '4A', '5A'],
    routeColor: ROUTE_COLORS.lrt,
  },

  // FORTUNE PARK
  {
    id: 'fpark-0800',
    routeId: 'fortune-park',
    routeName: 'Fortune Park ➔ APU',
    fromStopId: 'fortune-park',
    toStopId: 'apu',
    departureTime: '08:00',
    totalSeats: 40,
    bookedSeatIds: ['1A', '1B', '2A', '2B', '3A', '3B', '4A', '4B', '5A', '5B', '6A', '6B', '7A', '7B', '8A', '8B', '9A', '9B', '10A', '10B', '1C', '1D', '2C', '2D', '3C', '3D', '4C', '4D', '5C', '5D', '6C', '6D', '7C', '7D', '8C', '8D', '9C', '9D', '10C', '10D'], // FULL
    routeColor: ROUTE_COLORS['fortune-park'],
    notes: 'Monthly pass RM75 required for private accommodation.',
  },
  {
    id: 'fpark-0830',
    routeId: 'fortune-park',
    routeName: 'Fortune Park (One South) ➔ APU',
    fromStopId: 'fortune-park',
    toStopId: 'apu',
    departureTime: '08:30',
    totalSeats: 40,
    bookedSeatIds: ['1A', '2A', '3A', '4B', '5C'],
    routeColor: ROUTE_COLORS['fortune-park'],
  },
  {
    id: 'fpark-1000',
    routeId: 'fortune-park',
    routeName: 'Fortune Park ➔ APU',
    fromStopId: 'fortune-park',
    toStopId: 'apu',
    departureTime: '10:00',
    totalSeats: 40,
    bookedSeatIds: ['1A', '2B', '3C'],
    routeColor: ROUTE_COLORS['fortune-park'],
  },
  {
    id: 'apu-fpark-1700',
    routeId: 'fortune-park',
    routeName: 'APU ➔ Fortune Park',
    fromStopId: 'apu',
    toStopId: 'fortune-park',
    departureTime: '17:00',
    totalSeats: 40,
    bookedSeatIds: ['1A', '1B', '2A', '2B', '3A'],
    routeColor: ROUTE_COLORS['fortune-park'],
  },

  // CITY OF GREEN [COG]
  {
    id: 'cog-0745',
    routeId: 'city-of-green',
    routeName: 'City of Green ➔ APU',
    fromStopId: 'city-of-green',
    toStopId: 'apu',
    departureTime: '07:45',
    totalSeats: 40,
    bookedSeatIds: ['1A', '2A', '3A', '4A', '5A', '6A', '7A', '8A'],
    routeColor: ROUTE_COLORS['city-of-green'],
  },
  {
    id: 'cog-0900',
    routeId: 'city-of-green',
    routeName: 'City of Green ➔ APU',
    fromStopId: 'city-of-green',
    toStopId: 'apu',
    departureTime: '09:00',
    totalSeats: 40,
    bookedSeatIds: ['1A', '1B', '2C'],
    routeColor: ROUTE_COLORS['city-of-green'],
  },
  {
    id: 'apu-cog-1740',
    routeId: 'city-of-green',
    routeName: 'APU ➔ City of Green',
    fromStopId: 'apu',
    toStopId: 'city-of-green',
    departureTime: '17:40',
    totalSeats: 40,
    bookedSeatIds: ['1A', '2B'],
    routeColor: ROUTE_COLORS['city-of-green'],
  },

  // KINGSTON HOTEL [UNIS]
  {
    id: 'kingston-0750',
    routeId: 'kingston',
    routeName: 'UniStay @ Kingston Hotel ➔ APU',
    fromStopId: 'kingston',
    toStopId: 'apu',
    departureTime: '07:50',
    totalSeats: 40,
    bookedSeatIds: ['1A', '1B', '2A', '2B', '3A', '3B', '4A', '4B', '5A', '5B', '6A', '6B', '7A', '7B', '8A', '8B', '9A', '9B', '10A', '10B', '1C', '1D', '2C', '2D', '3C', '3D', '4C', '4D', '5C', '5D', '6C', '6D', '7C', '7D', '8C', '8D', '9C', '9D', '10C', '10D'], // FULL
    routeColor: ROUTE_COLORS.kingston,
  },
  {
    id: 'kingston-0830',
    routeId: 'kingston',
    routeName: 'UniStay @ Kingston Hotel ➔ APU',
    fromStopId: 'kingston',
    toStopId: 'apu',
    departureTime: '08:30',
    totalSeats: 40,
    bookedSeatIds: ['1A', '2B', '3C'],
    routeColor: ROUTE_COLORS.kingston,
  },

  // BLOOMSVALE & HARMONY
  {
    id: 'bv-0745',
    routeId: 'bloomsvale',
    routeName: 'Bloomsvale / Harmony ➔ APU',
    fromStopId: 'bloomsvale',
    toStopId: 'apu',
    departureTime: '07:45',
    totalSeats: 40,
    bookedSeatIds: ['1A', '1B', '2A', '3A', '4B'],
    routeColor: ROUTE_COLORS.bloomsvale,
  },
  {
    id: 'bv-0930',
    routeId: 'bloomsvale',
    routeName: 'Bloomsvale / Harmony ➔ APU',
    fromStopId: 'bloomsvale',
    toStopId: 'apu',
    departureTime: '09:30',
    totalSeats: 40,
    bookedSeatIds: ['1A', '2A'],
    routeColor: ROUTE_COLORS.bloomsvale,
  },

  // BAYU JALIL [BJ]
  {
    id: 'bj-0745',
    routeId: 'bayu-jalil',
    routeName: 'Bayu Jalil ➔ APU',
    fromStopId: 'bayu-jalil',
    toStopId: 'apu',
    departureTime: '07:45',
    totalSeats: 40,
    bookedSeatIds: ['1A', '2B', '3C', '4D'],
    routeColor: ROUTE_COLORS['bayu-jalil'],
  },
  {
    id: 'bj-1100',
    routeId: 'bayu-jalil',
    routeName: 'Bayu Jalil ➔ APU',
    fromStopId: 'bayu-jalil',
    toStopId: 'apu',
    departureTime: '11:00',
    totalSeats: 40,
    bookedSeatIds: ['1A'],
    routeColor: ROUTE_COLORS['bayu-jalil'],
  },

  // KUCHAI SENTRAL [KS]
  {
    id: 'ks-0745',
    routeId: 'kuchai-sentral',
    routeName: 'Kuchai Sentral ➔ APU',
    fromStopId: 'kuchai-sentral',
    toStopId: 'apu',
    departureTime: '07:45',
    totalSeats: 40,
    bookedSeatIds: ['1A', '1B', '2A', '2B', '3A', '3B'],
    routeColor: ROUTE_COLORS['kuchai-sentral'],
  },
  {
    id: 'ks-1000',
    routeId: 'kuchai-sentral',
    routeName: 'Kuchai Sentral ➔ APU',
    fromStopId: 'kuchai-sentral',
    toStopId: 'apu',
    departureTime: '10:00',
    totalSeats: 40,
    bookedSeatIds: ['1A', '2A'],
    routeColor: ROUTE_COLORS['kuchai-sentral'],
  },

  // M VERTICA [MV]
  {
    id: 'mv-0745',
    routeId: 'm-vertica',
    routeName: 'M Vertica ➔ APU',
    fromStopId: 'm-vertica',
    toStopId: 'apu',
    departureTime: '07:45',
    totalSeats: 40,
    bookedSeatIds: ['1A', '1B', '2A', '2B', '3A', '3B', '4A', '4B', '5A', '5B', '6A', '6B', '7A', '7B', '8A', '8B', '9A', '9B', '10A', '10B', '1C', '1D', '2C', '2D', '3C', '3D', '4C', '4D', '5C', '5D', '6C', '6D', '7C', '7D', '8C', '8D', '9C', '9D', '10C', '10D'], // FULL
    routeColor: ROUTE_COLORS['m-vertica'],
  },
  {
    id: 'mv-0930',
    routeId: 'm-vertica',
    routeName: 'M Vertica ➔ APU',
    fromStopId: 'm-vertica',
    toStopId: 'apu',
    departureTime: '09:30',
    totalSeats: 40,
    bookedSeatIds: ['1A', '2B', '3C'],
    routeColor: ROUTE_COLORS['m-vertica'],
  },

  // D'IVO ROUTE [DV]
  {
    id: 'dv-0745',
    routeId: 'divo',
    routeName: "D'Ivo Residence ➔ APU",
    fromStopId: 'divo',
    toStopId: 'apu',
    departureTime: '07:45',
    totalSeats: 40,
    bookedSeatIds: ['1A', '2A', '3B'],
    routeColor: ROUTE_COLORS.divo,
  },

  // MAPLE [MP]
  {
    id: 'mp-0805',
    routeId: 'maple',
    routeName: 'The Maple Residence ➔ APU',
    fromStopId: 'maple',
    toStopId: 'apu',
    departureTime: '08:05',
    totalSeats: 40,
    bookedSeatIds: ['1A', '2B', '3A'],
    routeColor: ROUTE_COLORS.maple,
  },

  // PARKHILL [PH]
  {
    id: 'ph-0745',
    routeId: 'parkhill',
    routeName: 'Parkhill Residence ➔ APU',
    fromStopId: 'parkhill',
    toStopId: 'apu',
    departureTime: '07:45',
    totalSeats: 40,
    bookedSeatIds: ['1A', '1B', '2A', '2B', '3A', '3B', '4A', '4B', '5A', '5B', '6A', '6B', '7A', '7B', '8A', '8B', '9A', '9B', '10A', '10B', '1C', '1D', '2C', '2D', '3C', '3D', '4C', '4D', '5C', '5D', '6C', '6D', '7C', '7D', '8C', '8D', '9C', '9D', '10C', '10D'], // FULL
    routeColor: ROUTE_COLORS.parkhill,
  },
  {
    id: 'ph-0815',
    routeId: 'parkhill',
    routeName: 'Parkhill Residence ➔ APU',
    fromStopId: 'parkhill',
    toStopId: 'apu',
    departureTime: '08:15',
    totalSeats: 40,
    bookedSeatIds: ['1A', '2A', '3A', '4A'],
    routeColor: ROUTE_COLORS.parkhill,
  },

  // MOSQUE (FRIDAY)
  {
    id: 'msq-1230',
    routeId: 'mosque',
    routeName: 'APU ➔ Mosque (Friday Solat)',
    fromStopId: 'apu',
    toStopId: 'mosque',
    departureTime: '12:30',
    totalSeats: 40,
    bookedSeatIds: ['1A', '2B', '3C', '4D', '5A', '6B'],
    routeColor: ROUTE_COLORS.mosque,
    notes: 'Complimentary Friday prayer shuttle for all Muslim students.',
  },
  {
    id: 'msq-1410',
    routeId: 'mosque',
    routeName: 'Mosque ➔ APU (Return)',
    fromStopId: 'mosque',
    toStopId: 'apu',
    departureTime: '14:10',
    totalSeats: 40,
    bookedSeatIds: ['1A', '2B'],
    routeColor: ROUTE_COLORS.mosque,
  },
];

// The 2 Demo Accounts specified in the prompt
export const DEMO_ACCOUNTS: DemoUser[] = [
  {
    id: 'user-1',
    name: 'Alex Tan',
    studentId: 'TP068412',
    avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=200&q=80',
    role: 'Student',
    currentLocationName: 'LRT Bukit Jalil Waiting Bay (In Range)',
    coords: { lat: 3.0585, lng: 101.6919 }, // 30 meters from LRT bus bay!
    isNearStop: true,
    penaltyStrikes: 0,
    description: 'Physically at the Bukit Jalil LRT bus bay. Proximity GPS tracker confirms < 50m range (Check-in Ready).',
  },
  {
    id: 'user-2',
    name: 'Sarah Lim',
    studentId: 'TP071904',
    avatar: 'https://images.unsplash.com/photo-1517841905240-472988babdf9?auto=format&fit=crop&w=200&q=80',
    role: 'Student',
    currentLocationName: 'M Vertica Condominium, Cheras (Out of Range)',
    coords: { lat: 3.1205, lng: 101.7275 }, // ~9 km away
    isNearStop: false,
    penaltyStrikes: 0,
    description: 'At private accommodation in Cheras. Currently out of GPS range until arrival at the departure bus stop.',
  },
];

// Realistic road waypoints following actual Bukit Jalil / KL road network
export const ROUTE_WAYPOINTS: Record<string, { lat: number; lng: number }[]> = {
  // LRT Bukit Jalil ➔ APU via Jalan Merah Caga & TPM Highway
  lrt: [
    { lat: 3.0587, lng: 101.6917 }, // LRT Station Bay
    { lat: 3.0580, lng: 101.6925 },
    { lat: 3.0568, lng: 101.6938 }, // Merah Caga junction
    { lat: 3.0552, lng: 101.6958 }, // National Stadium curve
    { lat: 3.0540, lng: 101.6978 }, // TPM West Flyover
    { lat: 3.0545, lng: 101.6992 }, // TPM Entrance Roundabout
    { lat: 3.0558, lng: 101.7003 }, // APU Campus Terminal
  ],
  // Fortune Park ➔ APU via Sg Besi / Besraya Highway
  'fortune-park': [
    { lat: 3.0332, lng: 101.7118 }, // Fortune Park One South
    { lat: 3.0375, lng: 101.7092 },
    { lat: 3.0430, lng: 101.7065 }, // Besraya Link
    { lat: 3.0485, lng: 101.7035 }, // TPM South Gate
    { lat: 3.0535, lng: 101.7015 },
    { lat: 3.0558, lng: 101.7003 }, // APU Campus Terminal
  ],
  // City of Green ➔ APU via TPM West
  'city-of-green': [
    { lat: 3.0508, lng: 101.6946 }, // City of Green
    { lat: 3.0520, lng: 101.6960 },
    { lat: 3.0535, lng: 101.6978 },
    { lat: 3.0545, lng: 101.6992 },
    { lat: 3.0558, lng: 101.7003 }, // APU Campus Terminal
  ],
  // Parkhill ➔ APU
  parkhill: [
    { lat: 3.0543, lng: 101.6938 }, // Parkhill
    { lat: 3.0540, lng: 101.6960 },
    { lat: 3.0544, lng: 101.6985 },
    { lat: 3.0558, lng: 101.7003 }, // APU Campus Terminal
  ],
  // Kingston Hotel ➔ APU
  kingston: [
    { lat: 3.0512, lng: 101.6931 }, // Kingston Hotel
    { lat: 3.0528, lng: 101.6955 },
    { lat: 3.0545, lng: 101.6990 },
    { lat: 3.0558, lng: 101.7003 }, // APU Campus Terminal
  ],
  // Bayu Jalil ➔ APU via Jalil Perkasa
  'bayu-jalil': [
    { lat: 3.0610, lng: 101.6740 }, // Bayu Jalil
    { lat: 3.0602, lng: 101.6810 },
    { lat: 3.0580, lng: 101.6885 },
    { lat: 3.0550, lng: 101.6960 },
    { lat: 3.0558, lng: 101.7003 }, // APU Campus Terminal
  ],
  // Kuchai Sentral ➔ APU
  'kuchai-sentral': [
    { lat: 3.0874, lng: 101.6885 }, // Kuchai Sentral
    { lat: 3.0780, lng: 101.6910 },
    { lat: 3.0680, lng: 101.6950 },
    { lat: 3.0590, lng: 101.6985 },
    { lat: 3.0558, lng: 101.7003 }, // APU Campus Terminal
  ],
  // M Vertica ➔ APU via MRR2 / Sg Besi
  'm-vertica': [
    { lat: 3.1205, lng: 101.7275 }, // M Vertica Cheras
    { lat: 3.1020, lng: 101.7200 },
    { lat: 3.0850, lng: 101.7120 },
    { lat: 3.0680, lng: 101.7040 },
    { lat: 3.0558, lng: 101.7003 }, // APU Campus Terminal
  ],
  // D'Ivo ➔ APU
  divo: [
    { lat: 3.0970, lng: 101.6760 }, // D'Ivo Old Klang Road
    { lat: 3.0850, lng: 101.6820 },
    { lat: 3.0710, lng: 101.6890 },
    { lat: 3.0580, lng: 101.6960 },
    { lat: 3.0558, lng: 101.7003 }, // APU Campus Terminal
  ],
  // Bloomsvale / Harmony ➔ APU
  bloomsvale: [
    { lat: 3.0782, lng: 101.6667 }, // Bloomsvale
    { lat: 3.0754, lng: 101.6712 }, // Harmony
    { lat: 3.0680, lng: 101.6790 },
    { lat: 3.0590, lng: 101.6895 },
    { lat: 3.0558, lng: 101.7003 }, // APU Campus Terminal
  ],
  // Maple ➔ APU
  maple: [
    { lat: 3.0645, lng: 101.6872 }, // The Maple
    { lat: 3.0610, lng: 101.6920 },
    { lat: 3.0560, lng: 101.6975 },
    { lat: 3.0558, lng: 101.7003 }, // APU Campus Terminal
  ],
  // Mosque ➔ APU
  mosque: [
    { lat: 3.0673, lng: 101.6987 }, // Mosque
    { lat: 3.0625, lng: 101.6998 },
    { lat: 3.0585, lng: 101.7002 },
    { lat: 3.0558, lng: 101.7003 }, // APU Campus Terminal
  ],
};
