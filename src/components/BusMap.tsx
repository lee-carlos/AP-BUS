/// <reference types="@types/google.maps" />
import React, { useState, useEffect, useMemo, useRef } from 'react';
import { APIProvider, Map, AdvancedMarker, useMap } from '@vis.gl/react-google-maps';
import { BusStop, BusTrip, Booking, DemoUser, LocationCoord } from '../types/bus';
import { APU_STOPS, ROUTE_COLORS, ROUTE_WAYPOINTS } from '../data/apuRoutes';
import { interpolateAlongPolyline, isWithinBusStopRange } from '../utils/geo';
import { Bus, MapPin, Compass, Navigation, Radio, Target, CheckCircle2, AlertTriangle } from 'lucide-react';

interface BusMapProps {
  currentUser: DemoUser;
  selectedFrom: BusStop | null;
  selectedTo: BusStop | null;
  bookings: Booking[]; // Support multiple bookings
  trips: BusTrip[];
  apiKey?: string;
}

// Google Maps Route Polyline & 250m Radius Circle Manager
function MapOverlays({
  path,
  routeColor,
  isBooked,
  departureStop,
  userCoord,
  userInRange,
}: {
  path: LocationCoord[];
  routeColor: string;
  isBooked: boolean;
  departureStop: BusStop | null;
  userCoord: LocationCoord;
  userInRange: boolean;
}) {
  const map = useMap();
  const polylineRef = useRef<google.maps.Polyline | null>(null);
  const circleRef = useRef<google.maps.Circle | null>(null);

  // Update Route Polyline
  useEffect(() => {
    if (!map || path.length < 2) {
      if (polylineRef.current) {
        polylineRef.current.setMap(null);
        polylineRef.current = null;
      }
      return;
    }

    if (!polylineRef.current) {
      polylineRef.current = new google.maps.Polyline({
        path,
        strokeColor: isBooked ? routeColor : '#64748B',
        strokeOpacity: isBooked ? 0.95 : 0.65,
        strokeWeight: isBooked ? 6 : 4,
        map,
      });
    } else {
      polylineRef.current.setPath(path);
      polylineRef.current.setOptions({
        strokeColor: isBooked ? routeColor : '#64748B',
        strokeOpacity: isBooked ? 0.95 : 0.65,
        strokeWeight: isBooked ? 6 : 4,
      });
    }

    return () => {
      if (polylineRef.current) {
        polylineRef.current.setMap(null);
        polylineRef.current = null;
      }
    };
  }, [map, path, routeColor, isBooked]);

  // Update Departure Stop 250m Check-in Radius Circle
  useEffect(() => {
    if (!map || !departureStop) {
      if (circleRef.current) {
        circleRef.current.setMap(null);
        circleRef.current = null;
      }
      return;
    }

    const circleOptions: google.maps.CircleOptions = {
      strokeColor: userInRange ? '#10B981' : '#F59E0B',
      strokeOpacity: 0.9,
      strokeWeight: 2,
      fillColor: userInRange ? '#10B981' : '#F59E0B',
      fillOpacity: userInRange ? 0.2 : 0.12,
      center: departureStop.coords,
      radius: 250, // 250 meters departure check-in radius
      map,
    };

    if (!circleRef.current) {
      circleRef.current = new google.maps.Circle(circleOptions);
    } else {
      circleRef.current.setOptions(circleOptions);
    }

    return () => {
      if (circleRef.current) {
        circleRef.current.setMap(null);
        circleRef.current = null;
      }
    };
  }, [map, departureStop, userInRange]);

  return null;
}

export const BusMap: React.FC<BusMapProps> = ({
  currentUser,
  selectedFrom,
  selectedTo,
  bookings,
  trips,
  apiKey,
}) => {
  // Bus simulation progress (0 to 1 back and forth along waypoints)
  const [busProgress, setBusProgress] = useState(0.2);
  const [directionForward, setDirectionForward] = useState(true);
  const [mapError, setMapError] = useState(false);

  // Active route stops
  const activeFrom = selectedFrom || (bookings.length > 0 ? APU_STOPS.find(s => s.name === bookings[0].fromStopName) || null : null);
  const activeTo = selectedTo || (bookings.length > 0 ? APU_STOPS.find(s => s.name === bookings[0].toStopName) || null : null);

  const isRouteFiltered = Boolean(selectedFrom && selectedTo);

  // Check if current active route matches ANY of our booked buses
  const isBookedRoute = useMemo(() => {
    if (bookings.length === 0 || !activeFrom || !activeTo) return false;
    return bookings.some(
      (b) =>
        (b.fromStopName === activeFrom.name && b.toStopName === activeTo.name) ||
        (b.fromStopName === activeTo.name && b.toStopName === activeFrom.name)
    );
  }, [bookings, activeFrom, activeTo]);

  // Color rule: "the route will be gray if it's not our booked bus, if does then the colours will be appear"
  const routeStrokeColor = useMemo(() => {
    if (!activeFrom) return '#64748B';
    if (isBookedRoute) {
      return ROUTE_COLORS[activeFrom.id] || '#2563EB';
    }
    return '#64748B'; // Gray if not our booked bus
  }, [isBookedRoute, activeFrom]);

  // Real road waypoints for active route
  const activeWaypoints = useMemo<LocationCoord[]>(() => {
    if (!activeFrom || !activeTo) return [];

    // Check if waypoints exist for this route
    if (ROUTE_WAYPOINTS[activeFrom.id]) {
      return ROUTE_WAYPOINTS[activeFrom.id];
    }
    if (ROUTE_WAYPOINTS[activeTo.id]) {
      // Return reversed waypoints if traveling from APU to destination
      return [...ROUTE_WAYPOINTS[activeTo.id]].reverse();
    }
    // Fallback to straight segment
    return [activeFrom.coords, activeTo.coords];
  }, [activeFrom, activeTo]);

  // Animate dummy bus along road waypoints
  useEffect(() => {
    if (activeWaypoints.length < 2) return;
    const interval = setInterval(() => {
      setBusProgress((prev) => {
        if (prev >= 0.96 && directionForward) {
          setDirectionForward(false);
          return 0.96;
        } else if (prev <= 0.04 && !directionForward) {
          setDirectionForward(true);
          return 0.04;
        }
        return directionForward ? prev + 0.015 : prev - 0.015;
      });
    }, 800);
    return () => clearInterval(interval);
  }, [directionForward, activeWaypoints]);

  // Simulated live dummy bus position along road waypoints
  const dummyBusPosition = useMemo<LocationCoord | null>(() => {
    if (activeWaypoints.length < 2) return null;
    return interpolateAlongPolyline(activeWaypoints, busProgress);
  }, [activeWaypoints, busProgress]);

  // Check user proximity to departure stop
  const userProximity = useMemo(() => {
    const targetStop = activeFrom || APU_STOPS[1]; // default LRT Bukit Jalil
    return isWithinBusStopRange(currentUser.coords, targetStop.coords, 250);
  }, [currentUser.coords, activeFrom]);

  // Map Bounds Restriction strictly locked to Bukit Jalil / KL stops:
  // north: 3.135 (Cheras), south: 3.025 (Fortune Park), west: 101.650, east: 101.745
  const mapRestriction = useMemo(() => ({
    latLngBounds: {
      north: 3.135,
      south: 3.025,
      west: 101.650,
      east: 101.745,
    },
    strictBounds: true,
  }), []);

  const defaultCenter = useMemo<LocationCoord>(() => ({ lat: 3.057, lng: 101.696 }), []);

  const mapsKey = apiKey || (import.meta.env.VITE_GOOGLE_MAPS_API_KEY as string) || '';

  return (
    <div className="relative w-full overflow-hidden bg-slate-900 border-b border-slate-800">
      {/* Map Header Status Overlay */}
      <div className="absolute top-2.5 left-2.5 right-2.5 z-10 flex items-center justify-between pointer-events-none">
        <div className="bg-slate-950/90 backdrop-blur px-2.5 py-1.5 rounded-xl border border-slate-800 flex items-center gap-2 pointer-events-auto shadow-md">
          <div
            className="w-2.5 h-2.5 rounded-full"
            style={{ backgroundColor: isBookedRoute ? routeStrokeColor : '#94A3B8' }}
          />
          <span className="text-[11px] font-semibold text-white">
            {isRouteFiltered
              ? `${activeFrom?.shortCode} ➔ ${activeTo?.shortCode}`
              : 'Bukit Jalil APU Area'}
          </span>
          <span
            className={`text-[9px] px-1.5 py-0.5 rounded font-mono font-medium ${
              isBookedRoute
                ? 'bg-blue-500/20 text-blue-300 border border-blue-500/30'
                : 'bg-slate-800 text-slate-400'
            }`}
          >
            {isBookedRoute ? 'YOUR BOOKED ROUTE' : isRouteFiltered ? 'MONITORED ROUTE' : 'IDLE (NO FILTER)'}
          </span>
        </div>

        {/* 250m Proximity Status Badge */}
        <div className="bg-slate-950/90 backdrop-blur px-2.5 py-1.5 rounded-xl border border-slate-800 flex items-center gap-1.5 pointer-events-auto shadow-md text-[10px]">
          <span
            className={`w-2 h-2 rounded-full ${
              userProximity.inRange ? 'bg-emerald-400 animate-ping' : 'bg-amber-400'
            }`}
          />
          <span className={userProximity.inRange ? 'text-emerald-300 font-semibold' : 'text-amber-300 font-medium'}>
            {userProximity.inRange
              ? `${userProximity.distanceMeters}m (In 250m Zone)`
              : `${userProximity.distanceMeters}m from Stop (Outside Zone)`}
          </span>
        </div>
      </div>

      {/* Main Map Rendering Area */}
      <div className="w-full h-72 sm:h-84 relative">
        {mapsKey && !mapError ? (
          <APIProvider apiKey={mapsKey}>
            <Map
              defaultCenter={defaultCenter}
              defaultZoom={14}
              minZoom={12}
              maxZoom={17}
              restriction={mapRestriction}
              mapId="DEMO_MAP_ID"
              internalUsageAttributionIds={['gmp_mcp_codeassist_v1_aistudio']}
              gestureHandling="greedy"
              disableDefaultUI={true}
              style={{ width: '100%', height: '100%' }}
            >
              {/* Polyline and 250m Check-in Radius circle */}
              <MapOverlays
                path={activeWaypoints}
                routeColor={routeStrokeColor}
                isBooked={isBookedRoute}
                departureStop={activeFrom}
                userCoord={currentUser.coords}
                userInRange={userProximity.inRange}
              />

              {/* Stop Markers */}
              {APU_STOPS.slice(0, 10).map((stop) => {
                const isDeparture = activeFrom?.id === stop.id;
                const isDestination = activeTo?.id === stop.id;
                return (
                  <AdvancedMarker key={stop.id} position={stop.coords}>
                    <div className="flex flex-col items-center group cursor-pointer">
                      <div
                        className={`p-1.5 rounded-xl shadow-lg border-2 transition-all ${
                          isDeparture
                            ? 'bg-blue-600 border-white text-white scale-110 ring-4 ring-blue-500/30'
                            : isDestination
                            ? 'bg-emerald-600 border-white text-white scale-110 ring-4 ring-emerald-500/30'
                            : stop.isCampus
                            ? 'bg-indigo-600 border-indigo-300 text-white'
                            : 'bg-slate-900 border-slate-700 text-slate-200'
                        }`}
                      >
                        <MapPin className="w-4 h-4" />
                      </div>
                      <span className="text-[9px] font-bold px-1.5 py-0.5 bg-slate-950/95 text-white rounded-md mt-0.5 whitespace-nowrap shadow border border-slate-800">
                        {isDeparture ? `DEP: ${stop.shortCode}` : isDestination ? `DEST: ${stop.shortCode}` : stop.shortCode}
                      </span>
                    </div>
                  </AdvancedMarker>
                );
              })}

              {/* Departure 250m Radius Zone Tag */}
              {activeFrom && (
                <AdvancedMarker position={{ lat: activeFrom.coords.lat + 0.0018, lng: activeFrom.coords.lng }}>
                  <div className={`px-2 py-0.5 rounded-full text-[9px] font-bold border shadow whitespace-nowrap flex items-center gap-1 ${
                    userProximity.inRange
                      ? 'bg-emerald-950/90 text-emerald-300 border-emerald-500/40'
                      : 'bg-amber-950/90 text-amber-300 border-amber-500/40'
                  }`}>
                    <Target className="w-3 h-3" />
                    <span>250m Check-in Zone</span>
                  </div>
                </AdvancedMarker>
              )}

              {/* Student GPS Marker */}
              <AdvancedMarker position={currentUser.coords}>
                <div className="relative flex items-center justify-center">
                  <div className={`absolute w-9 h-9 rounded-full animate-ping ${
                    userProximity.inRange ? 'bg-emerald-500/30' : 'bg-amber-500/30'
                  }`} />
                  <div className={`w-6 h-6 rounded-full border-2 border-white shadow-xl flex items-center justify-center text-white text-[9px] font-black ${
                    userProximity.inRange ? 'bg-emerald-600' : 'bg-blue-600'
                  }`}>
                    ME
                  </div>
                </div>
              </AdvancedMarker>

              {/* Live Dummy Bus Marker */}
              {isRouteFiltered && dummyBusPosition && (
                <AdvancedMarker position={dummyBusPosition}>
                  <div
                    className="p-2 rounded-full shadow-2xl border-2 border-white flex items-center justify-center text-white transition-all duration-700"
                    style={{ backgroundColor: routeStrokeColor }}
                  >
                    <Bus className="w-4 h-4 animate-bounce" />
                  </div>
                </AdvancedMarker>
              )}
            </Map>
          </APIProvider>
        ) : (
          /* High-Fidelity Vector Transit Map Canvas (Bukit Jalil Restricted Zone) */
          <div className="w-full h-full bg-slate-950 relative overflow-hidden select-none">
            <svg className="w-full h-full" viewBox="0 0 400 300" preserveAspectRatio="xMidYMid slice">
              <defs>
                <pattern id="gridRoad" width="30" height="30" patternUnits="userSpaceOnUse">
                  <path d="M 30 0 L 0 0 0 30" fill="none" stroke="#1E293B" strokeWidth="0.5" />
                </pattern>
                {/* Radar pulse for departure zone */}
                <radialGradient id="radiusGradient" cx="50%" cy="50%" r="50%">
                  <stop offset="0%" stopColor={userProximity.inRange ? '#10B981' : '#F59E0B'} stopOpacity="0.35" />
                  <stop offset="100%" stopColor={userProximity.inRange ? '#10B981' : '#F59E0B'} stopOpacity="0.05" />
                </radialGradient>
              </defs>

              <rect width="400" height="300" fill="#0B132B" />
              <rect width="400" height="300" fill="url(#gridRoad)" />

              {/* Major Roads in Bukit Jalil TPM Area */}
              <g stroke="#1E293B" strokeLinecap="round">
                {/* Bukit Jalil Highway */}
                <path d="M 20 90 Q 140 130 210 170 T 380 230" fill="none" strokeWidth="12" />
                {/* Jalan Merah Caga / Stadium Link */}
                <path d="M 50 40 Q 80 100 120 180" fill="none" strokeWidth="8" />
                {/* KESAS / Kuchai Connector */}
                <path d="M 70 270 Q 150 180 210 170 T 360 70" fill="none" strokeWidth="8" />
              </g>

              {/* Road labels */}
              <text x="70" y="80" fill="#475569" fontSize="7" fontWeight="bold">JALAN MERAH CAGA</text>
              <text x="210" y="145" fill="#475569" fontSize="7" fontWeight="bold">BUKIT JALIL HIGHWAY</text>
              <text x="230" y="220" fill="#475569" fontSize="7" fontWeight="bold">TECHNOLOGY PARK MALAYSIA</text>

              {/* 250m Check-in Radius Zone around Departure Stop */}
              {activeFrom && (
                <g transform="translate(80, 100)">
                  {/* Outer pulse wave */}
                  <circle r="42" fill="none" stroke={userProximity.inRange ? '#10B981' : '#F59E0B'} strokeWidth="1.5" strokeDasharray="3,3" opacity="0.8">
                    <animate attributeName="r" values="36;46;36" dur="3s" repeatCount="indefinite" />
                    <animate attributeName="opacity" values="0.8;0.3;0.8" dur="3s" repeatCount="indefinite" />
                  </circle>
                  {/* 250m Zone Fill */}
                  <circle r="36" fill="url(#radiusGradient)" stroke={userProximity.inRange ? '#10B981' : '#F59E0B'} strokeWidth="1.5" />
                  {/* Zone Label */}
                  <rect x="-48" y="-48" width="96" height="14" rx="4" fill="#020617" stroke={userProximity.inRange ? '#10B981' : '#F59E0B'} strokeWidth="1" />
                  <text x="0" y="-38" fill={userProximity.inRange ? '#6EE7B7' : '#FCD34D'} fontSize="7" fontWeight="bold" textAnchor="middle">
                    250m Check-in Zone
                  </text>
                </g>
              )}

              {/* Authentic Road Route Polyline */}
              {isRouteFiltered ? (
                <>
                  {/* Glow layer */}
                  <path
                    d="M 80 100 Q 130 135 180 155 T 225 175"
                    fill="none"
                    stroke={routeStrokeColor}
                    strokeWidth="8"
                    strokeOpacity="0.25"
                  />
                  {/* Main Road Route path */}
                  <path
                    d="M 80 100 Q 130 135 180 155 T 225 175"
                    fill="none"
                    stroke={routeStrokeColor}
                    strokeWidth="4"
                    strokeDasharray={isBookedRoute ? 'none' : '5,4'}
                    strokeLinecap="round"
                  />
                </>
              ) : (
                <g stroke="#334155" strokeWidth="1.2" strokeDasharray="3,3">
                  <line x1="225" y1="175" x2="80" y2="100" />
                  <line x1="225" y1="175" x2="310" y2="80" />
                  <line x1="225" y1="175" x2="140" y2="240" />
                  <line x1="225" y1="175" x2="280" y2="230" />
                </g>
              )}

              {/* APU Campus Central Hub */}
              <g transform="translate(225, 175)">
                <circle r="16" fill="#2563EB" fillOpacity="0.2" className="animate-pulse" />
                <circle r="9" fill="#2563EB" stroke="#FFFFFF" strokeWidth="2" />
                <text x="0" y="20" fill="#60A5FA" fontSize="9" fontWeight="bold" textAnchor="middle">
                  APU CAMPUS
                </text>
              </g>

              {/* LRT Bukit Jalil Stop */}
              <g transform="translate(80, 100)">
                <circle r="7" fill="#3B82F6" stroke="#FFFFFF" strokeWidth="1.5" />
                <text x="0" y="-12" fill="#93C5FD" fontSize="8" fontWeight="600" textAnchor="middle">
                  LRT Bukit Jalil
                </text>
              </g>

              {/* Parkhill */}
              <g transform="translate(140, 240)">
                <circle r="5" fill="#0891B2" stroke="#FFFFFF" strokeWidth="1" />
                <text x="0" y="14" fill="#67E8F9" fontSize="7" textAnchor="middle">Parkhill</text>
              </g>

              {/* City of Green */}
              <g transform="translate(280, 230)">
                <circle r="5" fill="#DB2777" stroke="#FFFFFF" strokeWidth="1" />
                <text x="0" y="14" fill="#F472B6" fontSize="7" textAnchor="middle">City of Green</text>
              </g>

              {/* M Vertica */}
              <g transform="translate(320, 70)">
                <circle r="5" fill="#7C3AED" stroke="#FFFFFF" strokeWidth="1" />
                <text x="0" y="-8" fill="#C4B5FD" fontSize="7" textAnchor="middle">M Vertica</text>
              </g>

              {/* Animated Dummy Bus Along Road Path */}
              {isRouteFiltered && (
                <g
                  transform={`translate(${80 + busProgress * (225 - 80)}, ${
                    100 + Math.sin(busProgress * Math.PI) * 25 + busProgress * 75
                  })`}
                  style={{ transition: 'transform 0.8s linear' }}
                >
                  <circle r="12" fill={routeStrokeColor} fillOpacity="0.3" className="animate-ping" />
                  <rect
                    x="-9"
                    y="-7"
                    width="18"
                    height="14"
                    rx="3"
                    fill={routeStrokeColor}
                    stroke="#FFFFFF"
                    strokeWidth="1.5"
                  />
                  <circle cx="-4" cy="4" r="1.5" fill="#0F172A" />
                  <circle cx="4" cy="4" r="1.5" fill="#0F172A" />
                  <text x="0" y="-10" fill="#FFFFFF" fontSize="7" fontWeight="bold" textAnchor="middle">
                    BUS
                  </text>
                </g>
              )}

              {/* User Real Location Pin */}
              <g
                transform={
                  currentUser.isNearStop
                    ? 'translate(88, 115)' // Inside the 250m zone!
                    : 'translate(325, 80)' // Far at Cheras
                }
              >
                <circle
                  r="6"
                  fill={currentUser.isNearStop ? '#10B981' : '#F59E0B'}
                  stroke="#FFFFFF"
                  strokeWidth="2"
                />
                <text
                  x="0"
                  y="-9"
                  fill={currentUser.isNearStop ? '#6EE7B7' : '#FCD34D'}
                  fontSize="7"
                  fontWeight="bold"
                  textAnchor="middle"
                >
                  YOU
                </text>
              </g>
            </svg>
          </div>
        )}
      </div>

      {/* Route Info Caption below Map */}
      <div className="px-4 py-2 bg-slate-900/90 border-t border-slate-800/80 flex items-center justify-between text-[11px] text-slate-300">
        <div className="flex items-center gap-1.5">
          <Target className="w-3.5 h-3.5 text-emerald-400" />
          <span>
            {userProximity.inRange
              ? 'GPS verified within 250m departure radius.'
              : `You are ${userProximity.distanceMeters}m away from the 250m check-in radius.`}
          </span>
        </div>
        <div className="flex items-center gap-2">
          <span className="flex items-center gap-1">
            <span
              className="w-2.5 h-1.5 rounded-full"
              style={{ backgroundColor: routeStrokeColor }}
            />
            <span className="text-[10px] text-slate-400">
              {isBookedRoute ? 'Your Booked Route' : isRouteFiltered ? 'Unbooked Route (Gray)' : 'Overview'}
            </span>
          </span>
        </div>
      </div>
    </div>
  );
};
