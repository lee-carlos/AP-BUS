import test from 'node:test';
import assert from 'node:assert/strict';
import {
  isBookingWindowOpen,
  getMinutesUntilDeparture,
  evaluateCheckInStatus,
  isBusFull,
  formatTime12h,
  evaluateLateCancellation,
  validateBookingEligibility,
} from './bookingRules';
import { calculateDistanceMeters, isWithinBusStopRange } from './geo';

test('booking window opens at 07:30 AM sharp', () => {
  assert.equal(isBookingWindowOpen('06:59'), false);
  assert.equal(isBookingWindowOpen('07:29'), false);
  assert.equal(isBookingWindowOpen('07:30'), true);
  assert.equal(isBookingWindowOpen('08:45'), true);
  assert.equal(isBookingWindowOpen('18:20'), true);
});

test('calculates correct minutes until departure', () => {
  assert.equal(getMinutesUntilDeparture('08:35', '08:45'), 10);
  assert.equal(getMinutesUntilDeparture('08:00', '08:45'), 45);
  assert.equal(getMinutesUntilDeparture('08:50', '08:45'), -5);
});

test('calculates distance and checks bus stop proximity range', () => {
  // Near LRT Bukit Jalil (approx 35m)
  const userNear = { lat: 3.0587, lng: 101.6914 };
  const lrtStop = { lat: 3.0587, lng: 101.6917 };
  const distance = calculateDistanceMeters(userNear, lrtStop);
  assert.ok(distance < 50, `Distance should be < 50m, got ${distance}`);

  const checkNear = isWithinBusStopRange(userNear, lrtStop, 250);
  assert.equal(checkNear.inRange, true);

  // Far away (e.g. Cheras, ~9km)
  const userFar = { lat: 3.1205, lng: 101.7275 };
  const checkFar = isWithinBusStopRange(userFar, lrtStop, 250);
  assert.equal(checkFar.inRange, false);
  assert.ok(checkFar.distanceMeters > 5000);
});

test('check-in status evaluation enforces 10 min window and GPS range', () => {
  const lrtStop = { lat: 3.0587, lng: 101.6917 };
  const userNear = { lat: 3.0585, lng: 101.6918 };
  const userFar = { lat: 3.1205, lng: 101.7275 };

  // Case 1: 30 mins before departure -> WAITING_WINDOW
  const res1 = evaluateCheckInStatus({
    currentTimeStr: '08:15',
    departureTimeStr: '08:45',
    userCoord: userNear,
    stopCoord: lrtStop,
    alreadyCheckedIn: false,
  });
  assert.equal(res1.status, 'WAITING_WINDOW');

  // Case 2: 8 mins before departure + user NEAR -> READY_TO_CHECK_IN
  const res2 = evaluateCheckInStatus({
    currentTimeStr: '08:37',
    departureTimeStr: '08:45',
    userCoord: userNear,
    stopCoord: lrtStop,
    alreadyCheckedIn: false,
  });
  assert.equal(res2.status, 'READY_TO_CHECK_IN');

  // Case 3: 8 mins before departure + user FAR -> OUT_OF_RANGE
  const res3 = evaluateCheckInStatus({
    currentTimeStr: '08:37',
    departureTimeStr: '08:45',
    userCoord: userFar,
    stopCoord: lrtStop,
    alreadyCheckedIn: false,
  });
  assert.equal(res3.status, 'OUT_OF_RANGE');

  // Case 4: Already checked in -> CHECKED_IN
  const res4 = evaluateCheckInStatus({
    currentTimeStr: '08:40',
    departureTimeStr: '08:45',
    userCoord: userNear,
    stopCoord: lrtStop,
    alreadyCheckedIn: true,
  });
  assert.equal(res4.status, 'CHECKED_IN');
});

test('isBusFull correctly enforces 40 seat capacity', () => {
  const emptyBus: string[] = [];
  assert.equal(isBusFull(emptyBus, 40), false);

  const halfBus = Array.from({ length: 20 }, (_, i) => `${i + 1}A`);
  assert.equal(isBusFull(halfBus, 40), false);

  const fullBus = Array.from({ length: 40 }, (_, i) => `${Math.floor(i / 4) + 1}${['A', 'B', 'C', 'D'][i % 4]}`);
  assert.equal(isBusFull(fullBus, 40), true);
});

test('formatTime12h produces friendly time labels', () => {
  assert.equal(formatTime12h('07:30'), '7:30 AM');
  assert.equal(formatTime12h('12:10'), '12:10 PM');
  assert.equal(formatTime12h('18:20'), '6:20 PM');
});

test('late cancellation triggers penalty strike within 15 minutes', () => {
  const late = evaluateLateCancellation(8);
  assert.equal(late.isLateCancel, true);
  assert.equal(late.strikePenalty, 1);

  const timely = evaluateLateCancellation(45);
  assert.equal(timely.isLateCancel, false);
  assert.equal(timely.strikePenalty, 0);
});

test('validateBookingEligibility enforces maximum 2 active bookings', () => {
  const existingOne = [
    { fromStopName: 'LRT Bukit Jalil', toStopName: 'Asia Pacific University (APU Campus)' },
  ];

  // 1 booking existing -> can book a return trip or different route
  const resAllowSecond = validateBookingEligibility({
    activeBookings: existingOne,
    candidateFromStopName: 'Asia Pacific University (APU Campus)',
    candidateToStopName: 'LRT Bukit Jalil',
  });
  assert.equal(resAllowSecond.canBook, true);

  // 2 bookings existing -> cannot book a third trip
  const existingTwo = [
    { fromStopName: 'LRT Bukit Jalil', toStopName: 'Asia Pacific University (APU Campus)' },
    { fromStopName: 'Asia Pacific University (APU Campus)', toStopName: 'LRT Bukit Jalil' },
  ];
  const resBlockThird = validateBookingEligibility({
    activeBookings: existingTwo,
    candidateFromStopName: 'Parkhill Residence',
    candidateToStopName: 'Asia Pacific University (APU Campus)',
  });
  assert.equal(resBlockThird.canBook, false);
  assert.equal(resBlockThird.reason, 'MAX_LIMIT_REACHED');
});

test('validateBookingEligibility prohibits identical origin and destination (duplicate route)', () => {
  const existingLrtToApu = [
    { fromStopName: 'LRT Bukit Jalil', toStopName: 'Asia Pacific University (APU Campus)' },
  ];

  // Trying to book another LRT -> APU trip is blocked
  const resDuplicate = validateBookingEligibility({
    activeBookings: existingLrtToApu,
    candidateFromStopName: 'LRT Bukit Jalil',
    candidateToStopName: 'Asia Pacific University (APU Campus)',
  });
  assert.equal(resDuplicate.canBook, false);
  assert.equal(resDuplicate.reason, 'DUPLICATE_ROUTE');

  // Trying to book reverse trip (APU -> LRT Bukit Jalil) is ALLOWED
  const resReturn = validateBookingEligibility({
    activeBookings: existingLrtToApu,
    candidateFromStopName: 'Asia Pacific University (APU Campus)',
    candidateToStopName: 'LRT Bukit Jalil',
  });
  assert.equal(resReturn.canBook, true);

  // Trying to book completely different route is ALLOWED
  const resDifferent = validateBookingEligibility({
    activeBookings: existingLrtToApu,
    candidateFromStopName: 'Fortune Park',
    candidateToStopName: 'Asia Pacific University (APU Campus)',
  });
  assert.equal(resDifferent.canBook, true);
});

test('validateBookingEligibility blocks suspended users with 3 strikes', () => {
  const resSuspended = validateBookingEligibility({
    activeBookings: [],
    candidateFromStopName: 'LRT Bukit Jalil',
    candidateToStopName: 'Asia Pacific University (APU Campus)',
    penaltyStrikes: 3,
  });
  assert.equal(resSuspended.canBook, false);
  assert.equal(resSuspended.reason, 'SUSPENDED');
});


