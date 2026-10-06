import { useState, useEffect, useRef, useCallback } from 'react';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';

// Custom branded map pin matching Sahib Decorators & Caterers theme (#e0575c)
const createPinIcon = () => {
  return L.divIcon({
    className: 'sdc-map-pin',
    html: `
      <div style="position: relative; width: 40px; height: 40px; transform: translate(-50%, -100%); pointer-events: auto;">
        <div style="
          width: 40px;
          height: 40px;
          background: linear-gradient(135deg, #fb6b6e, #e0575c);
          border: 3px solid #ffffff;
          border-radius: 50% 50% 50% 0;
          transform: rotate(-45deg);
          box-shadow: 0 6px 18px rgba(224, 87, 92, 0.5);
          display: flex;
          align-items: center;
          justify-content: center;
        ">
          <span style="transform: rotate(45deg); font-size: 18px; line-height: 1;">📍</span>
        </div>
        <div style="
          width: 14px;
          height: 5px;
          background: rgba(0,0,0,0.3);
          border-radius: 50%;
          position: absolute;
          bottom: -4px;
          left: 13px;
          filter: blur(1.5px);
        "></div>
      </div>
    `,
    iconSize: [40, 40],
    iconAnchor: [20, 40],
  });
};

// Default center: Ludhiana, Punjab (SDC base)
const DEFAULT_CENTER = { lat: 30.9010, lng: 75.8573 };

// Reverse geocode lat,lng using Photon (Komoot) with BigDataCloud fallback
async function fetchReverseAddress(lat, lng) {
  try {
    const res = await fetch(`https://photon.komoot.io/reverse?lat=${lat}&lon=${lng}`);
    if (res.ok) {
      const data = await res.json();
      if (data.features && data.features.length > 0) {
        const p = data.features[0].properties || {};
        const parts = [
          p.name,
          p.street,
          p.district || p.suburb,
          p.city || p.county,
          p.state || 'Punjab',
        ].filter(Boolean);
        const clean = Array.from(new Set(parts));
        if (clean.length > 0) return clean.join(', ');
      }
    }
  } catch (err) {
    console.warn('Photon reverse geocode failed, using fallback', err);
  }

  // Fallback to client reverse geocode
  try {
    const res2 = await fetch(
      `https://api.bigdatacloud.net/data/reverse-geocode-client?latitude=${lat}&longitude=${lng}&localityLanguage=en`
    );
    if (res2.ok) {
      const d = await res2.json();
      const parts = [d.locality, d.city, d.principalSubdivision].filter(Boolean);
      const clean = Array.from(new Set(parts));
      if (clean.length > 0) return clean.join(', ');
    }
  } catch {}

  return `Location (${lat.toFixed(4)}, ${lng.toFixed(4)})`;
}

// Forward search places using Photon API biased around Punjab / current coords
async function searchPlaces(query, biasLat = 30.9, biasLon = 75.85) {
  if (!query || !query.trim()) return [];
  try {
    const url = `https://photon.komoot.io/api/?q=${encodeURIComponent(query.trim())}&lat=${biasLat}&lon=${biasLon}&limit=6`;
    const res = await fetch(url);
    if (!res.ok) return [];
    const data = await res.json();
    if (!data.features) return [];

    return data.features.map(f => {
      const p = f.properties || {};
      const parts = [
        p.name,
        p.street,
        p.district || p.suburb,
        p.city,
        p.state,
      ].filter(Boolean);
      const displayName = Array.from(new Set(parts)).join(', ');
      return {
        id: f.properties.osm_id || Math.random(),
        name: p.name || displayName,
        displayName: displayName || p.name || 'Selected place',
        lat: f.geometry.coordinates[1],
        lng: f.geometry.coordinates[0],
      };
    });
  } catch (err) {
    console.warn('Photon search error:', err);
    return [];
  }
}

export default function LocationPickerModal({
  isOpen,
  onClose,
  initialLocation = '',
  initialCoords = null,
  onConfirm,
}) {
  const mapContainerRef = useRef(null);
  const mapInstanceRef  = useRef(null);
  const markerRef       = useRef(null);
  const isInitializedRef= useRef(false);

  const [coords, setCoords]           = useState(initialCoords || DEFAULT_CENTER);
  const [addressText, setAddressText] = useState(initialLocation || '');
  const [isDetecting, setIsDetecting] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState([]);
  const [isSearching, setIsSearching] = useState(false);
  const [statusMessage, setStatusMessage] = useState('');

  // Move the pin and update coords + address
  const movePin = useCallback(async (lat, lng, shouldReverse = true) => {
    setCoords({ lat, lng });

    // Update Leaflet marker
    if (markerRef.current) {
      markerRef.current.setLatLng([lat, lng]);
    }

    if (shouldReverse) {
      setStatusMessage('Finding address details…');
      const resolved = await fetchReverseAddress(lat, lng);
      setAddressText(resolved);
      setStatusMessage('');
    }
  }, []);

  // Sync state with initialCoords and initialLocation whenever modal opens
  useEffect(() => {
    if (isOpen) {
      if (initialCoords && initialCoords.lat && initialCoords.lng) {
        setCoords(initialCoords);
      }
      if (initialLocation) {
        setAddressText(initialLocation);
      }
    }
  }, [isOpen, initialCoords, initialLocation]);

  // Initialize Leaflet map whenever modal is opened
  useEffect(() => {
    if (!isOpen) {
      if (mapInstanceRef.current) {
        try {
          mapInstanceRef.current.remove();
        } catch {}
        mapInstanceRef.current = null;
        markerRef.current = null;
      }
      return;
    }

    const timer = setTimeout(() => {
      const container = mapContainerRef.current;
      if (!container) return;

      const startLat = initialCoords?.lat || coords.lat || DEFAULT_CENTER.lat;
      const startLng = initialCoords?.lng || coords.lng || DEFAULT_CENTER.lng;

      // Ensure any existing map instance is removed
      if (mapInstanceRef.current) {
        try {
          mapInstanceRef.current.remove();
        } catch {}
        mapInstanceRef.current = null;
        markerRef.current = null;
      }

      if (container._leaflet_id) {
        container._leaflet_id = null;
      }

      const map = L.map(container, {
        center: [startLat, startLng],
        zoom: 15,
        zoomControl: true,
        attributionControl: false,
        tap: false, // Fix iOS Safari tap bug
      });

      L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        maxZoom: 19,
      }).addTo(map);

      // Create draggable pin
      const pin = L.marker([startLat, startLng], {
        icon: createPinIcon(),
        draggable: true,
      }).addTo(map);

      // Pin drag event
      pin.on('dragend', (e) => {
        const pos = e.target.getLatLng();
        movePin(pos.lat, pos.lng, true);
      });

      // Map click / tap event — moves pin to clicked spot
      map.on('click', (e) => {
        movePin(e.latlng.lat, e.latlng.lng, true);
      });

      mapInstanceRef.current = map;
      markerRef.current = pin;

      // Invalidate size in multiple intervals to ensure tiles paint properly
      const invalidate = () => {
        if (mapInstanceRef.current) {
          mapInstanceRef.current.invalidateSize();
        }
      };
      setTimeout(invalidate, 80);
      setTimeout(invalidate, 250);
      setTimeout(invalidate, 500);
    }, 100);

    return () => {
      clearTimeout(timer);
      if (mapInstanceRef.current) {
        try {
          mapInstanceRef.current.remove();
        } catch {}
        mapInstanceRef.current = null;
        markerRef.current = null;
      }
    };
  }, [isOpen]); // Depend on isOpen so map correctly mounts on the newly rendered DOM container

  // Live debounced search as user types
  useEffect(() => {
    const q = searchQuery.trim();
    if (q.length < 2) {
      setSearchResults([]);
      return;
    }

    const timer = setTimeout(async () => {
      setIsSearching(true);
      setStatusMessage('');
      const results = await searchPlaces(q, coords.lat, coords.lng);
      setSearchResults(results);
      setIsSearching(false);
      if (results.length === 0) {
        setStatusMessage('No venues found. Try typing city name too (e.g. Ludhiana).');
      }
    }, 380);

    return () => clearTimeout(timer);
  }, [searchQuery, coords.lat, coords.lng]);

  // Explicit Search submit
  const handleSearchSubmit = async (e) => {
    e?.preventDefault();
    const q = searchQuery.trim();
    if (!q) return;
    setIsSearching(true);
    setStatusMessage('');
    const results = await searchPlaces(q, coords.lat, coords.lng);
    setSearchResults(results);
    setIsSearching(false);
    if (results.length === 0) {
      setStatusMessage('No venues found. You can tap directly on the map to place the pin.');
    }
  };

  // Select place from search suggestions
  const handleSelectPlace = (place) => {
    setSearchQuery('');
    setSearchResults([]);
    setStatusMessage('');

    if (mapInstanceRef.current) {
      mapInstanceRef.current.flyTo([place.lat, place.lng], 16, { duration: 1 });
    }
    movePin(place.lat, place.lng, false);
    setAddressText(place.displayName || place.name);
  };

  // Center pin on current map center
  const handlePinAtMapCenter = () => {
    if (!mapInstanceRef.current) return;
    const center = mapInstanceRef.current.getCenter();
    movePin(center.lat, center.lng, true);
  };

  // Browser GPS (Current Location)
  const handleUseCurrentLocation = () => {
    if (!navigator.geolocation) {
      setStatusMessage('⚠️ Geolocation not supported by your browser');
      return;
    }

    setIsDetecting(true);
    setStatusMessage('Fetching GPS location…');

    navigator.geolocation.getCurrentPosition(
      (pos) => {
        setIsDetecting(false);
        const { latitude, longitude } = pos.coords;
        if (mapInstanceRef.current) {
          mapInstanceRef.current.flyTo([latitude, longitude], 16, { duration: 1.2 });
        }
        movePin(latitude, longitude, true);
      },
      (err) => {
        setIsDetecting(false);
        let msg = '⚠️ Could not get your current location.';
        if (err.code === 1) msg = '⚠️ Location permission was denied by browser.';
        else if (err.code === 2) msg = '⚠️ Location unavailable on this network.';
        else if (err.code === 3) msg = '⚠️ Location request timed out.';
        setStatusMessage(msg);
      },
      { enableHighAccuracy: true, timeout: 10000, maximumAge: 30000 }
    );
  };

  // Confirm selection
  const handleConfirm = () => {
    const finalLocation = addressText.trim() || `Location (${coords.lat.toFixed(4)}, ${coords.lng.toFixed(4)})`;
    onConfirm({
      location: finalLocation,
      coords: { lat: coords.lat, lng: coords.lng },
    });
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[150] flex items-center justify-center p-2 sm:p-4 bg-black/70 backdrop-blur-sm animate-fadeIn">
      <div
        className="w-full max-w-2xl bg-white rounded-2xl sm:rounded-3xl shadow-2xl border border-sdc-coral/30 overflow-hidden flex flex-col max-h-[96vh] sm:max-h-[90vh]"
        style={{ background: 'linear-gradient(165deg, #fffdfb, #fff7ee)' }}
      >
        {/* Header */}
        <div className="px-4 py-3 sm:py-3.5 border-b border-sdc-coral/15 flex items-center justify-between bg-white/90 shrink-0">
          <div>
            <h3 className="font-playfair font-bold text-sdc-teal text-base sm:text-lg flex items-center gap-2">
              <span>📍</span> Locate Event Venue on Map
            </h3>
            <p className="font-poppins text-sdc-mute text-[0.7rem] sm:text-xs">
              Search a place, tap the map, or use current location.
            </p>
          </div>
          <button
            type="button"
            onClick={onClose}
            aria-label="Close Map"
            className="w-8 h-8 rounded-full bg-sdc-coral/10 hover:bg-sdc-coral/25 text-sdc-coral font-bold flex items-center justify-center transition-colors text-base"
          >
            ✕
          </button>
        </div>

        {/* Search & Actions Bar (Clean, mobile-first responsive layout) */}
        <div className="p-3 border-b border-sdc-coral/10 bg-white/70 space-y-2 shrink-0">
          <form onSubmit={handleSearchSubmit} className="flex gap-2">
            <div className="relative flex-1 min-w-0">
              <span className="absolute left-3 top-1/2 -translate-y-1/2 text-sdc-mute text-sm pointer-events-none">🔍</span>
              <input
                type="text"
                value={searchQuery}
                onChange={e => setSearchQuery(e.target.value)}
                placeholder="Search resort, hotel, palace or road…"
                className="w-full pl-9 pr-8 py-2 rounded-xl border border-sdc-coral/30 bg-white font-poppins text-sdc-ink text-xs sm:text-sm
                  focus:outline-none focus:border-sdc-coral focus:ring-1 focus:ring-sdc-coral/30"
              />
              {searchQuery && (
                <button
                  type="button"
                  onClick={() => { setSearchQuery(''); setSearchResults([]); }}
                  className="absolute right-2.5 top-1/2 -translate-y-1/2 text-sdc-mute hover:text-sdc-ink text-xs font-bold"
                >
                  ✕
                </button>
              )}
            </div>
            <button
              type="submit"
              disabled={isSearching}
              className="px-3.5 sm:px-4 py-2 rounded-xl bg-sdc-teal hover:bg-[#162122] text-white font-montserrat font-bold text-xs shrink-0 transition-colors shadow-sm"
            >
              {isSearching ? '…' : 'Search'}
            </button>
          </form>

          {/* Quick Buttons: GPS Current Location & Center Pin */}
          <div className="flex flex-wrap items-center gap-2">
            <button
              type="button"
              onClick={handleUseCurrentLocation}
              disabled={isDetecting}
              className="flex-1 sm:flex-none px-3 py-1.5 rounded-lg border border-sdc-coral/40 bg-sdc-coral/10 hover:bg-sdc-coral/20 text-sdc-coral font-montserrat font-bold text-[0.72rem] flex items-center justify-center gap-1.5 transition-colors active:scale-95"
            >
              <span className={isDetecting ? 'animate-spin' : ''}>🎯</span>
              <span>{isDetecting ? 'Detecting GPS…' : 'Use Current Location'}</span>
            </button>

            <button
              type="button"
              onClick={handlePinAtMapCenter}
              className="flex-1 sm:flex-none px-3 py-1.5 rounded-lg border border-sdc-teal/30 bg-white hover:bg-sdc-teal/5 text-sdc-teal font-montserrat font-bold text-[0.72rem] flex items-center justify-center gap-1.5 transition-colors active:scale-95"
            >
              <span>📌</span>
              <span>Drop Pin in Center</span>
            </button>
          </div>

          {/* Search suggestions dropdown */}
          {searchResults.length > 0 && (
            <div className="bg-white rounded-xl border border-sdc-coral/30 shadow-xl overflow-hidden max-h-48 overflow-y-auto divide-y divide-sdc-coral/10">
              {searchResults.map((item) => (
                <button
                  key={`${item.id}-${item.lat}`}
                  type="button"
                  onClick={() => handleSelectPlace(item)}
                  className="w-full px-3 py-2 text-left text-xs font-poppins text-sdc-ink hover:bg-sdc-coral/10 transition-colors flex items-start gap-2"
                >
                  <span className="text-sdc-coral mt-0.5 text-sm shrink-0">📍</span>
                  <div className="min-w-0 flex-1">
                    <p className="font-semibold text-sdc-teal line-clamp-1">{item.name}</p>
                    <p className="text-[0.68rem] text-sdc-mute line-clamp-1">{item.displayName}</p>
                  </div>
                </button>
              ))}
            </div>
          )}

          {statusMessage && (
            <p className="font-poppins text-[0.72rem] text-sdc-coral font-medium flex items-center gap-1">
              <span>ℹ️</span> {statusMessage}
            </p>
          )}
        </div>

        {/* Map Canvas */}
        <div className="relative flex-1 min-h-[260px] sm:min-h-[340px] w-full bg-slate-100 overflow-hidden">
          <div ref={mapContainerRef} className="w-full h-full absolute inset-0 z-0" />
          <div className="absolute top-2 right-2 z-[400] bg-white/90 backdrop-blur-sm px-2.5 py-1 rounded-lg shadow-sm border border-sdc-coral/20 text-[0.68rem] font-montserrat text-sdc-teal font-semibold pointer-events-none">
            💡 Tap anywhere or drag pin
          </div>
        </div>

        {/* Bottom Details & Confirmation */}
        <div className="p-3 sm:p-4 bg-white border-t border-sdc-coral/15 flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-2.5 shrink-0">
          <div className="min-w-0 flex-1">
            <label className="font-montserrat text-[0.68rem] tracking-wider uppercase font-bold text-sdc-teal block mb-1">
              Selected Venue / Address
            </label>
            <input
              type="text"
              value={addressText}
              onChange={e => setAddressText(e.target.value)}
              placeholder="e.g. Grand City Resort, Pakhowal Road, Ludhiana"
              className="w-full px-3 py-1.5 rounded-lg border border-sdc-coral/30 bg-white font-poppins text-sdc-ink text-xs sm:text-sm focus:outline-none focus:border-sdc-coral"
            />
          </div>

          <div className="flex items-center gap-2 shrink-0">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 sm:flex-none px-4 py-2.5 rounded-xl border border-sdc-coral/30 font-montserrat font-bold text-xs text-sdc-mute hover:text-sdc-ink hover:bg-black/5 transition-colors"
            >
              Cancel
            </button>
            <button
              type="button"
              onClick={handleConfirm}
              className="flex-1 sm:flex-none px-5 py-2.5 rounded-xl bg-sdc-coral hover:bg-[#e0575c] text-white font-montserrat font-bold text-xs shadow-md shadow-sdc-coral/30 active:scale-95 transition-all"
            >
              ✓ Confirm Location
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
