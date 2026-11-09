import { LocationCoord } from '../types/bus';

/**
 * Calculates Haversine great-circle distance between two GPS coordinates in meters.
 */
export function calculateDistanceMeters(coord1: LocationCoord, coord2: LocationCoord): number {
  const R = 6371e3; // Earth radius in meters
  const lat1Rad = (coord1.lat * Math.PI) / 180;
  const lat2Rad = (coord2.lat * Math.PI) / 180;
  const deltaLat = ((coord2.lat - coord1.lat) * Math.PI) / 180;
  const deltaLng = ((coord2.lng - coord1.lng) * Math.PI) / 180;

  const a =
    Math.sin(deltaLat / 2) * Math.sin(deltaLat / 2) +
    Math.cos(lat1Rad) * Math.cos(lat2Rad) * Math.sin(deltaLng / 2) * Math.sin(deltaLng / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));

  return Math.round(R * c);
}

/**
 * Standard bus stop proximity radius for AP-BUS (250 meters).
 */
export const MAX_CHECK_IN_DISTANCE_METERS = 250;

/**
 * Checks whether user coordinates are within allowable bus stop range.
 */
export function isWithinBusStopRange(
  userCoord: LocationCoord,
  stopCoord: LocationCoord,
  thresholdMeters: number = MAX_CHECK_IN_DISTANCE_METERS
): { inRange: boolean; distanceMeters: number } {
  const dist = calculateDistanceMeters(userCoord, stopCoord);
  return {
    inRange: dist <= thresholdMeters,
    distanceMeters: dist,
  };
}

/**
 * Interpolates coordinates along a multi-point polyline given progress 0..1
 */
export function interpolateAlongPolyline(points: LocationCoord[], progress: number): LocationCoord {
  if (points.length === 0) return { lat: 3.0558, lng: 101.7003 };
  if (points.length === 1) return points[0];

  const clamped = Math.max(0, Math.min(1, progress));
  const totalSegments = points.length - 1;
  const targetIndex = clamped * totalSegments;
  const segmentIndex = Math.min(Math.floor(targetIndex), totalSegments - 1);
  const segmentProgress = targetIndex - segmentIndex;

  const p1 = points[segmentIndex];
  const p2 = points[segmentIndex + 1];

  return {
    lat: p1.lat + (p2.lat - p1.lat) * segmentProgress,
    lng: p1.lng + (p2.lng - p1.lng) * segmentProgress,
  };
}

