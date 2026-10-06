import { useState, useEffect, useRef, useCallback } from 'react';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';

// Custom sleek branded pin icon matching SDC Coral (#e0575c)
const createPinIcon = () => {
  return L.divIcon({
    className: 'sdc-map-pin',
    html: `
      <div style="position: relative; width: 38px; height: 38px; transform: translate(-50%, -100%);">
        <div style="
          width: 38px;
          height: 38px;
          background: linear-gradient(135deg, #fb6b6e, #e0575c);
          border: 3px solid #ffffff;
          border-radius: 50% 50% 50% 0;
          transform: rotate(-45deg);
          box-shadow: 0 6px 16px rgba(224, 87, 92, 0.45);
          display: flex;
          align-items: center;
          justify-content: center;
        ">
          <span style="transform: rotate(45deg); font-size: 16px; line-height: 1;">📍</span>
        </div>
        <div style="
          width: 14px;
          height: 6px;
          background: rgba(0,0,0,0.25);
          border-radius: 50%;
          position: absolute;
          bottom: -4px;
          left: 12px;
          filter: blur(1.5px);
        "></div>
      </div>
    `,
    iconSize: [38, 38],
    iconAnchor: [19, 38],
  });
};

// Default center: Ludhiana, Punjab (base of Sahib Decorators & Caterers)
const DEFAULT_CENTER = { lat: 30.9010, lng: 75.8573, name: 'Ludhiana, Punjab' };

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

  const [coords, setCoords]           = useState(initialCoords || DEFAULT_CENTER);
  const [addressText, setAddressText] = useState(initialLocation || '');
  const [isDetecting, setIsDetecting] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState([]);
  const [isSearching, setIsSearching] = useState(false);
  const [statusMessage, setStatusMessage] = useState('');

  // Reverse geocode lat,lng using OpenStreetMap Nominatim
  const reverseGeocode = useCallback(async (lat, lng) => {
    try {
      setStatusMessage('Finding address details…');
      const res = await fetch(
        `https://nominatim.openstreetmap.org/reverse?format=jsonv2&lat=${lat}&lon=${lng}&zoom=18&addressdetails=1`,
        { headers: { 'Accept-Language': 'en' } }
      );
      if (!res.ok) throw new Error('Geocoding failed');
      const data = await res.json();
      
      const addr = data.address || {};
      const parts = [
        addr.amenity || addr.building || addr.hotel || addr.tourism || addr.leisure || data.name,
        addr.road || addr.suburb || addr.neighbourhood,
        addr.city || addr.town || addr.village || addr.county || 'Ludhiana',
        addr.state || 'Punjab',
      ].filter(Boolean);

      // Deduplicate parts
      const cleanParts = Array.from(new Set(parts));
      const formatted = cleanParts.length > 0 ? cleanParts.join(', ') : (data.display_name?.split(',').slice(0, 3).join(',') || `Lat: ${lat.toFixed(4)}, Lng: ${lng.toFixed(4)}`);
      
      setAddressText(formatted);
      setStatusMessage('');
    } catch {
      setStatusMessage('');
      if (!addressText) {
        setAddressText(`Pin location (${lat.toFixed(4)}, ${lng.toFixed(4)})`);
      }
    }
  }, [addressText]);

  // Handle Map Pin movement
  const updatePinPosition = useCallback((lat, lng, shouldReverse = true) => {
    setCoords({ lat, lng });
    if (markerRef.current) {
      markerRef.current.setLatLng([lat, lng]);
    }
    if (shouldReverse) {
      reverseGeocode(lat, lng);
    }
  }, [reverseGeocode]);

  // Initialize Leaflet Map once modal opens
  useEffect(() => {
    if (!isOpen) return;

    // Small delay to allow modal transition and container sizing
    const timer = setTimeout(() => {
      if (!mapContainerRef.current) return;

      const startLat = initialCoords?.lat || coords.lat || DEFAULT_CENTER.lat;
      const startLng = initialCoords?.lng || coords.lng || DEFAULT_CENTER.lng;

      if (!mapInstanceRef.current) {
        const map = L.map(mapContainerRef.current, {
          center: [startLat, startLng],
          zoom: 14,
          zoomControl: true,
          attributionControl: false,
        });

        L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
          maxZoom: 19,
        }).addTo(map);

        const pin = L.marker([startLat, startLng], {
          icon: createPinIcon(),
          draggable: true,
        }).addTo(map);

        pin.on('dragend', (e) => {
          const pos = e.target.getLatLng();
          updatePinPosition(pos.lat, pos.lng, true);
        });

        map.on('click', (e) => {
          updatePinPosition(e.latlng.lat, e.latlng.lng, true);
        });

        mapInstanceRef.current = map;
        markerRef.current = pin;
      } else {
        mapInstanceRef.current.invalidateSize();
        mapInstanceRef.current.setView([startLat, startLng], 14);
        if (markerRef.current) {
          markerRef.current.setLatLng([startLat, startLng]);
        }
      }
    }, 150);

    return () => {
      clearTimeout(timer);
    };
  }, [isOpen, initialCoords, coords.lat, coords.lng, updatePinPosition]);

  // Clean up map when component unmounts
  useEffect(() => {
    return () => {
      if (mapInstanceRef.current) {
        mapInstanceRef.current.remove();
        mapInstanceRef.current = null;
      }
    };
  }, []);

  // Browser Geolocation (Current Location)
  const handleUseCurrentLocation = useCallback(() => {
    if (!navigator.geolocation) {
      setStatusMessage('⚠️ Geolocation is not supported by your browser');
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
        updatePinPosition(latitude, longitude, true);
      },
      (err) => {
        setIsDetecting(false);
        let msg = '⚠️ Could not get your current location.';
        if (err.code === 1) msg = '⚠️ Location permission was denied.';
        else if (err.code === 2) msg = '⚠️ Location unavailable.';
        else if (err.code === 3) msg = '⚠️ Location request timed out.';
        setStatusMessage(msg);
      },
      { enableHighAccuracy: true, timeout: 10000, maximumAge: 30000 }
    );
  }, [updatePinPosition]);

  // Search Address / Landmark via Nominatim
  const handleSearch = useCallback(async (e) => {
    e?.preventDefault();
    const query = searchQuery.trim();
    if (!query) return;

    setIsSearching(true);
    setStatusMessage('');
    try {
      const res = await fetch(
        `https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(query)}&limit=5&countrycodes=in`,
        { headers: { 'Accept-Language': 'en' } }
      );
      const data = await res.json();
      setSearchResults(data || []);
      if (!data || data.length === 0) {
        setStatusMessage('No locations found. Try adding city name (e.g. Ludhiana).');
      }
    } catch {
      setStatusMessage('Error searching locations. Try clicking directly on the map.');
    } finally {
      setIsSearching(false);
    }
  }, [searchQuery]);

  const handleSelectSearchResult = (result) => {
    const lat = parseFloat(result.lat);
    const lng = parseFloat(result.lon);
    setSearchQuery('');
    setSearchResults([]);

    if (mapInstanceRef.current) {
      mapInstanceRef.current.flyTo([lat, lng], 16, { duration: 1 });
    }
    setCoords({ lat, lng });
    if (markerRef.current) {
      markerRef.current.setLatLng([lat, lng]);
    }
    const shortName = result.display_name.split(',').slice(0, 3).join(',');
    setAddressText(shortName);
  };

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
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-3 sm:p-5 bg-black/60 backdrop-blur-sm animate-fadeIn">
      <div
        className="w-full max-w-2xl bg-white rounded-2xl sm:rounded-3xl shadow-2xl border border-sdc-coral/25 overflow-hidden flex flex-col max-h-[92vh]"
        style={{ background: 'linear-gradient(165deg, #fffdfb, #fff7ee)' }}
      >
        {/* Header */}
        <div className="px-4 sm:px-6 py-3.5 border-b border-sdc-coral/15 flex items-center justify-between bg-white/80">
          <div>
            <h3 className="font-playfair font-bold text-sdc-teal text-base sm:text-lg flex items-center gap-2">
              <span>📍</span> Locate Event Venue on Map
            </h3>
            <p className="font-poppins text-sdc-mute text-[0.72rem] sm:text-xs">
              Click anywhere on the map, search a venue, or use your current location.
            </p>
          </div>
          <button
            type="button"
            onClick={onClose}
            aria-label="Close Map"
            className="w-8 h-8 rounded-full bg-sdc-coral/10 hover:bg-sdc-coral/20 text-sdc-teal font-bold flex items-center justify-center transition-colors text-sm"
          >
            ✕
          </button>
        </div>

        {/* Search & Actions Bar */}
        <div className="p-3 sm:p-4 border-b border-sdc-coral/10 space-y-2.5 bg-white/50">
          <div className="flex flex-col sm:flex-row gap-2">
            {/* Search Input */}
            <form onSubmit={handleSearch} className="flex-1 relative">
              <span className="absolute left-3 top-1/2 -translate-y-1/2 text-sdc-mute text-sm pointer-events-none">🔍</span>
              <input
                type="text"
                value={searchQuery}
                onChange={e => setSearchQuery(e.target.value)}
                placeholder="Search resort, hotel, road or city…"
                className="w-full pl-9 pr-20 py-2 rounded-xl border border-sdc-coral/25 bg-white font-poppins text-sdc-ink text-xs sm:text-sm
                  focus:outline-none focus:border-sdc-coral focus:ring-1 focus:ring-sdc-coral/30"
              />
              <button
                type="submit"
                disabled={isSearching}
                className="absolute right-1.5 top-1/2 -translate-y-1/2 px-3 py-1 rounded-lg bg-sdc-teal text-white font-montserrat font-bold text-xs hover:bg-[#162122] transition-colors"
              >
                {isSearching ? '…' : 'Search'}
              </button>
            </form>

            {/* GPS Location Button */}
            <button
              type="button"
              onClick={handleUseCurrentLocation}
              disabled={isDetecting}
              className="px-3.5 py-2 rounded-xl border border-sdc-coral/40 bg-sdc-coral/10 hover:bg-sdc-coral/20 text-sdc-coral font-montserrat font-bold text-xs flex items-center justify-center gap-1.5 transition-colors whitespace-nowrap active:scale-95"
            >
              <span className={isDetecting ? 'animate-spin' : ''}>🎯</span>
              <span>{isDetecting ? 'Detecting…' : 'Use Current Location'}</span>
            </button>
          </div>

          {/* Search suggestions dropdown */}
          {searchResults.length > 0 && (
            <div className="bg-white rounded-xl border border-sdc-coral/20 shadow-lg overflow-hidden max-h-40 overflow-y-auto divide-y divide-sdc-coral/10">
              {searchResults.map((item) => (
                <button
                  key={item.place_id}
                  type="button"
                  onClick={() => handleSelectSearchResult(item)}
                  className="w-full px-3 py-2 text-left text-xs font-poppins text-sdc-ink hover:bg-sdc-coral/10 transition-colors flex items-start gap-2"
                >
                  <span className="text-sdc-coral mt-0.5">📍</span>
                  <span className="line-clamp-1">{item.display_name}</span>
                </button>
              ))}
            </div>
          )}

          {statusMessage && (
            <p className="font-poppins text-[0.72rem] text-sdc-coral font-medium">
              {statusMessage}
            </p>
          )}
        </div>

        {/* Leaflet Map Canvas */}
        <div className="relative flex-1 min-h-[260px] sm:min-h-[340px] w-full bg-slate-100">
          <div ref={mapContainerRef} className="w-full h-full absolute inset-0 z-0" />
          <div className="absolute top-2 right-2 z-[400] bg-white/90 backdrop-blur-sm px-2.5 py-1 rounded-lg shadow-sm border border-sdc-coral/20 text-[0.68rem] font-montserrat text-sdc-mute font-medium pointer-events-none">
            💡 Click or drag pin to adjust
          </div>
        </div>

        {/* Selected Location Details & Confirmation */}
        <div className="p-3 sm:p-4 bg-white/95 border-t border-sdc-coral/15 flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3">
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
