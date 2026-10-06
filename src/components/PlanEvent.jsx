import { useState, useEffect, useCallback, useMemo, useRef, Component } from 'react';
import Text3DFlip from './ui/text-3d-flip';
import { vegMenuItems, nonVegMenuItems } from '../data/menuData';
import LocationPickerModal from './LocationPickerModal';

// ─────────────────────────────────────────────────────────────────────────────
// Error Boundary — prevents a crash in the menu from blanking the whole page
// ─────────────────────────────────────────────────────────────────────────────
class PlanEventErrorBoundary extends Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false };
  }
  static getDerivedStateFromError() {
    return { hasError: true };
  }
  render() {
    if (this.state.hasError) {
      return (
        <section id="plan" className="py-20 px-4 text-center">
          <div className="max-w-md mx-auto rounded-2xl border border-sdc-coral/30 p-8 bg-white/80">
            <p className="font-playfair font-bold text-sdc-coral text-xl mb-2">Something went wrong</p>
            <p className="font-poppins text-sdc-mute text-sm mb-4">Please refresh the page to plan your event.</p>
            <button
              onClick={() => window.location.reload()}
              className="px-5 py-2.5 rounded-full bg-sdc-coral text-white font-montserrat font-bold text-sm hover:bg-[#e0575c] transition-colors"
            >
              Refresh Page
            </button>
          </div>
        </section>
      );
    }
    return this.props.children;
  }
}

const EVENT_TYPES = [
  'Wedding',
  'Reception',
  'Anand Karaj',
  'Ring Ceremony & Roka',
  'Mehndi',
  'Haldi',
  'Sangeet',
  'Jaggo Night',
  'Cocktail & DJ Party',
  'Birthday Party',
  'Anniversary',
  'Baby Shower',
  'Akhand Path & Kirtan',
  'Mata Ki Chowki',
  'House Warming',
  'Corporate Event',
  'Other',
];
const FOOD_OPTIONS = ['Veg', 'Non-Veg', 'Both'];
const SERVICE_OPTS = ['Decorators & Catering', 'Decorators only', 'Catering only'];

// ─────────────────────────────────────────────────────────────────────────────
// Chip-group (single or multi-select)
// ─────────────────────────────────────────────────────────────────────────────
function ChipGroup({ options, value, onChange, groupLabel, multiple = false }) {
  return (
    <div className="flex flex-wrap gap-2" role="group" aria-label={groupLabel}>
      {options.map((opt) => {
        const active = multiple
          ? Array.isArray(value) && value.includes(opt)
          : value === opt;

        const handleClick = () => {
          if (multiple) {
            const arr = Array.isArray(value) ? value : [];
            if (arr.includes(opt)) {
              const next = arr.filter((x) => x !== opt);
              onChange(next);
            } else {
              onChange([...arr, opt]);
            }
          } else {
            onChange(opt);
          }
        };

        return (
          <button
            key={opt}
            type="button"
            onClick={handleClick}
            aria-pressed={active}
            className={`px-2.5 sm:px-4 py-1.5 sm:py-2 rounded-full
              text-[0.76rem] sm:text-[0.85rem] font-montserrat font-semibold border
              transition-all duration-200 active:scale-95 touch-manipulation flex items-center gap-1.5
              ${active
                ? 'bg-sdc-coral text-white border-sdc-coral shadow-md shadow-sdc-coral/25 chip-selected'
                : 'bg-transparent text-sdc-ink border-sdc-coral/40 hover:border-sdc-coral hover:bg-sdc-coral/10'
              }`}
          >
            {multiple && active && (
              <span className="text-[0.7rem] font-bold leading-none">✓</span>
            )}
            <span>{opt}</span>
          </button>
        );
      })}
    </div>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// Food Item Checkbox
// ─────────────────────────────────────────────────────────────────────────────
function FoodItemCheckbox({ item, checked, onToggle, type }) {
  const isVeg = type === 'veg';

  const handleClick = useCallback(() => {
    onToggle(item.id);
  }, [item.id, onToggle]);

  const handleKeyDown = useCallback((e) => {
    if (e.key === ' ' || e.key === 'Enter') {
      e.preventDefault();
      onToggle(item.id);
    }
  }, [item.id, onToggle]);

  return (
    <div
      role="checkbox"
      aria-checked={checked}
      tabIndex={0}
      onClick={handleClick}
      onKeyDown={handleKeyDown}
      className={`flex items-start gap-3 p-2.5 rounded-xl cursor-pointer border transition-all duration-150 select-none
        ${checked
          ? isVeg
            ? 'border-emerald-500/60 bg-emerald-50/70 shadow-sm'
            : 'border-orange-500/60 bg-orange-50/70 shadow-sm'
          : 'border-transparent hover:border-sdc-coral/20 hover:bg-sdc-coral/5'
        }`}
    >
      <div className="flex-shrink-0 mt-0.5">
        <div
          className={`w-5 h-5 rounded-md border-2 flex items-center justify-center transition-all duration-150
            ${checked
              ? isVeg ? 'bg-emerald-500 border-emerald-500' : 'bg-orange-500 border-orange-500'
              : 'border-sdc-coral/40 bg-white'
            }`}
        >
          {checked && (
            <svg className="w-3 h-3 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
            </svg>
          )}
        </div>
      </div>
      <div className="min-w-0 flex-1">
        <div className="flex items-center gap-1.5 flex-wrap">
          <span className={`font-montserrat font-semibold text-[0.8rem] sm:text-[0.87rem] leading-snug
            ${checked ? (isVeg ? 'text-emerald-700' : 'text-orange-700') : 'text-sdc-ink'}`}>
            {item.name}
          </span>
          <span className={`text-[0.6rem] font-bold uppercase px-1.5 py-0.5 rounded-full flex-shrink-0
            ${isVeg ? 'bg-emerald-100 text-emerald-700' : 'bg-orange-100 text-orange-700'}`}>
            {isVeg ? '🟢 Veg' : '🔴 Non-Veg'}
          </span>
        </div>
        {item.desc && (
          <p className="font-poppins text-sdc-mute text-[0.7rem] mt-0.5 leading-snug line-clamp-1">{item.desc}</p>
        )}
      </div>
    </div>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// Menu Selector Panel
// ─────────────────────────────────────────────────────────────────────────────
function MenuSelectorPanel({ foodPref, selectedItems, onToggle, onClearAll, otherFood, onOtherChange }) {
  const [search, setSearch] = useState('');
  const searchRef = useRef(null);

  const showVeg    = foodPref === 'Veg'     || foodPref === 'Both';
  const showNonVeg = foodPref === 'Non-Veg' || foodPref === 'Both';

  const allItems = useMemo(() => {
    const list = [];
    if (showVeg)    list.push(...vegMenuItems.map(i => ({ ...i, _type: 'veg' })));
    if (showNonVeg) list.push(...nonVegMenuItems.map(i => ({ ...i, _type: 'non-veg' })));
    return list;
  }, [showVeg, showNonVeg]);

  const filtered = useMemo(() => {
    const q = search.trim().toLowerCase();
    if (!q) return allItems;
    return allItems.filter(i =>
      i.name.toLowerCase().includes(q) ||
      i.category.toLowerCase().includes(q) ||
      (i.desc && i.desc.toLowerCase().includes(q))
    );
  }, [allItems, search]);

  const grouped = useMemo(() => {
    return filtered.reduce((acc, item) => {
      if (!acc[item.category]) acc[item.category] = [];
      acc[item.category].push(item);
      return acc;
    }, {});
  }, [filtered]);

  const selectedCount = selectedItems.size;
  const totalCount    = allItems.length;

  // clearAll is passed from parent — directly resets the Set in one state update

  return (
    <div
      className="mt-3 rounded-2xl border border-sdc-coral/25 overflow-hidden"
      style={{ background: 'linear-gradient(160deg, #fffdf9, #fff7ee)' }}
    >
      {/* Header */}
      <div
        className="px-4 py-3 border-b border-sdc-coral/15 flex flex-wrap items-center justify-between gap-2"
        style={{ background: 'linear-gradient(90deg, #fff7ee, #fdebd0)' }}
      >
        <div>
          <p className="font-montserrat font-bold text-sdc-teal text-xs tracking-wider uppercase">
            🍽️ Choose Your Menu Items
          </p>
          <p className="font-poppins text-sdc-mute text-[0.7rem] mt-0.5">
            {selectedCount > 0
              ? <span className="text-sdc-coral font-semibold">{selectedCount} item{selectedCount > 1 ? 's' : ''} selected</span>
              : `Select from ${totalCount} available dishes`}
          </p>
        </div>
        {selectedCount > 0 && (
          <button
            type="button"
            onClick={onClearAll}
            className="text-[0.7rem] font-montserrat font-bold text-sdc-mute hover:text-sdc-coral transition-colors px-2 py-1 rounded-lg hover:bg-sdc-coral/10"
          >
            Clear all
          </button>
        )}
      </div>

      {/* Search Bar */}
      <div className="px-4 py-3 border-b border-sdc-coral/10">
        <div className="relative">
          <span className="absolute left-3 top-1/2 -translate-y-1/2 text-sdc-mute text-sm pointer-events-none">🔍</span>
          <input
            ref={searchRef}
            type="text"
            value={search}
            onChange={e => setSearch(e.target.value)}
            placeholder={`Search ${foodPref === 'Both' ? 'veg & non-veg' : foodPref.toLowerCase()} dishes…`}
            className="w-full pl-9 pr-8 py-2 rounded-xl border border-sdc-coral/25 bg-white font-poppins text-sdc-ink text-sm
              placeholder:text-sdc-mute/60 focus:outline-none focus:border-sdc-coral focus:ring-1 focus:ring-sdc-coral/30 transition-all"
          />
          {search && (
            <button
              type="button"
              onClick={() => setSearch('')}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-sdc-mute hover:text-sdc-coral text-xs font-bold"
            >
              ✕
            </button>
          )}
        </div>
        {search && (
          <p className="font-poppins text-sdc-mute text-[0.68rem] mt-1.5">
            {filtered.length === 0
              ? 'No dishes match your search.'
              : `${filtered.length} result${filtered.length !== 1 ? 's' : ''} found`}
          </p>
        )}
      </div>

      {/* Grouped Items */}
      <div
        className="px-3 py-2 max-h-[380px] overflow-y-auto overscroll-contain"
        style={{ scrollbarWidth: 'thin' }}
      >
        {Object.keys(grouped).length === 0 ? (
          <p className="text-center font-poppins text-sdc-mute text-sm py-8">
            No dishes match &ldquo;{search}&rdquo;
          </p>
        ) : (
          Object.entries(grouped).map(([cat, items]) => (
            <div key={cat} className="mb-3">
              <p className="font-montserrat font-bold text-[0.68rem] tracking-widest uppercase text-sdc-teal/80 px-1 py-1.5 sticky top-0 bg-gradient-to-r from-[#fffdf9] to-[#fff7ee] z-10">
                {cat}
                <span className="ml-1.5 font-normal text-sdc-mute/70">({items.length})</span>
              </p>
              <div className="grid grid-cols-1 gap-0.5">
                {items.map(item => (
                  <FoodItemCheckbox
                    key={item.id}
                    item={item}
                    checked={selectedItems.has(item.id)}
                    onToggle={onToggle}
                    type={item._type}
                  />
                ))}
              </div>
            </div>
          ))
        )}
      </div>

      {/* "Other" free text field */}
      <div
        className="px-4 py-3 border-t border-sdc-coral/15"
        style={{ background: 'linear-gradient(90deg, #fdebd0, #fff7ee)' }}
      >
        <label htmlFor="other-food-input" className="font-montserrat font-bold text-sdc-teal text-xs tracking-wider uppercase block mb-2">
          ✏️ Other / Special Request
        </label>
        <textarea
          id="other-food-input"
          value={otherFood}
          onChange={e => onOtherChange(e.target.value)}
          placeholder="Mention any dish not listed above — e.g. Chana Bhatura, Pav Bhaji, specific family recipe, dietary restrictions…"
          rows={2}
          className="w-full px-3 py-2 rounded-xl border border-sdc-coral/25 bg-white font-poppins text-sdc-ink text-sm
            placeholder:text-sdc-mute/50 focus:outline-none focus:border-sdc-coral focus:ring-1 focus:ring-sdc-coral/30 transition-all resize-none"
        />
      </div>
    </div>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// PlanEvent Content component
// ─────────────────────────────────────────────────────────────────────────────
function PlanEventContent() {
  const [personName,     setPersonName]     = useState('');
  const [eventTypes,     setEventTypes]     = useState([]); // Starts empty — user must select
  const [otherEventType, setOtherEventType] = useState('');
  const [eventDate,      setEventDate]      = useState('');
  const [location,       setLocation]       = useState('');
  const [mapCoords,      setMapCoords]      = useState(null);
  const [isMapOpen,      setIsMapOpen]      = useState(false);
  const [isQuickLocating,setIsQuickLocating]= useState(false);
  const [locationNotice, setLocationNotice] = useState('');
  const [guests,         setGuests]         = useState(350);
  const [food,           setFood]           = useState(''); // Starts empty — chosen by user
  const [services,       setServices]       = useState(''); // Starts empty — chosen by user
  const [selectedItems,  setSelectedItems]  = useState(new Set());
  const [otherFood,      setOtherFood]      = useState('');
  const [inView,         setInView]         = useState(false);
  const [errors,         setErrors]         = useState({});
  const sectionRef = useRef(null);

  // Catering is included when user picks 'Decorators & Catering' or 'Catering only'
  const hasCatering = services.includes('Catering');

  // Show menu selector only when catering is chosen AND food preference is chosen
  const showMenuSelector = hasCatering && Boolean(food);

  // Clear errors as soon as user types or selects
  const handleNameChange = (val) => {
    setPersonName(val);
    if (errors.personName && val.trim()) {
      setErrors(prev => ({ ...prev, personName: undefined }));
    }
  };

  const handleEventTypesChange = (types) => {
    setEventTypes(types);
    if (errors.eventTypes && types.length > 0) {
      setErrors(prev => ({ ...prev, eventTypes: undefined }));
    }
    if (!types.includes('Other') && errors.otherEventType) {
      setErrors(prev => ({ ...prev, otherEventType: undefined }));
    }
  };

  const handleOtherEventChange = (val) => {
    setOtherEventType(val);
    if (errors.otherEventType && val.trim()) {
      setErrors(prev => ({ ...prev, otherEventType: undefined }));
    }
  };

  const handleDateChange = (val) => {
    setEventDate(val);
    if (errors.eventDate && val) {
      setErrors(prev => ({ ...prev, eventDate: undefined }));
    }
  };

  const handleLocationChange = (val) => {
    setLocation(val);
    setMapCoords(null);
    if (errors.location && val.trim()) {
      setErrors(prev => ({ ...prev, location: undefined }));
    }
  };

  const handleLocationConfirm = ({ location: confirmedLoc, coords }) => {
    setLocation(confirmedLoc);
    setMapCoords(coords);
    setLocationNotice('Location pinned on map ✓');
    setTimeout(() => setLocationNotice(''), 4000);
    if (errors.location) {
      setErrors(prev => ({ ...prev, location: undefined }));
    }
  };

  const handleQuickCurrentLocation = () => {
    if (!navigator.geolocation) {
      alert('Geolocation is not supported by your browser.');
      return;
    }
    setIsQuickLocating(true);
    setLocationNotice('Detecting GPS location…');

    navigator.geolocation.getCurrentPosition(
      async (pos) => {
        setIsQuickLocating(false);
        const { latitude, longitude } = pos.coords;
        const coords = { lat: latitude, lng: longitude };
        setMapCoords(coords);

        try {
          const res = await fetch(`https://photon.komoot.io/reverse?lat=${latitude}&lon=${longitude}`);
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
              const cleanParts = Array.from(new Set(parts));
              if (cleanParts.length > 0) {
                setLocation(cleanParts.join(', '));
              } else {
                setLocation(`Current Location (${latitude.toFixed(4)}, ${longitude.toFixed(4)})`);
              }
            } else {
              setLocation(`Current Location (${latitude.toFixed(4)}, ${longitude.toFixed(4)})`);
            }
          } else {
            // BigDataCloud fallback
            const res2 = await fetch(`https://api.bigdatacloud.net/data/reverse-geocode-client?latitude=${latitude}&longitude=${longitude}&localityLanguage=en`);
            if (res2.ok) {
              const d = await res2.json();
              const parts = [d.locality, d.city, d.principalSubdivision].filter(Boolean);
              setLocation(parts.join(', ') || `Current Location (${latitude.toFixed(4)}, ${longitude.toFixed(4)})`);
            }
          }
        } catch {
          setLocation(`Current Location (${latitude.toFixed(4)}, ${longitude.toFixed(4)})`);
        }
        setLocationNotice('Current location detected ✓');
        setTimeout(() => setLocationNotice(''), 4000);

        if (errors.location) {
          setErrors(prev => ({ ...prev, location: undefined }));
        }
      },
      (err) => {
        setIsQuickLocating(false);
        let msg = 'Could not detect your current location.';
        if (err.code === 1) msg = 'Location permission denied by browser.';
        setLocationNotice(msg);
        setTimeout(() => setLocationNotice(''), 4000);
      },
      { enableHighAccuracy: true, timeout: 10000, maximumAge: 30000 }
    );
  };

  const handleServicesChange = (val) => {
    setServices(val);
    if (errors.services) {
      setErrors(prev => ({ ...prev, services: undefined }));
    }
    if (!val.includes('Catering')) {
      // Clear food selection, food errors, and menu selections
      setFood('');
      if (errors.food) {
        setErrors(prev => ({ ...prev, food: undefined }));
      }
      setSelectedItems(new Set());
      setOtherFood('');
    }
  };

  // When food preference changes, clear the item selection
  const handleFoodChange = (val) => {
    setFood(val);
    if (errors.food) {
      setErrors(prev => ({ ...prev, food: undefined }));
    }
    setSelectedItems(new Set());
    setOtherFood('');
  };

  const toggleItem = useCallback((id) => {
    setSelectedItems(prev => {
      const next = new Set(prev);
      next.has(id) ? next.delete(id) : next.add(id);
      return next;
    });
  }, []);

  const handleClearAll = useCallback(() => {
    setSelectedItems(new Set());
  }, []);

  // React-controlled entrance reveal (once revealed, never unmounts or disappears)
  useEffect(() => {
    const el = sectionRef.current;
    if (!el) return;
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setInView(true);
        }
      },
      { threshold: 0.05 }
    );
    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  // Build WhatsApp message with validation
  const sendWhatsApp = useCallback(() => {
    // ── Field Validation ─────────────────────────────────────────────────
    const newErrors = {};
    if (!personName.trim()) {
      newErrors.personName = 'Please enter your name';
    }
    if (eventTypes.length === 0) {
      newErrors.eventTypes = 'Please select at least one event type';
    }
    if (eventTypes.includes('Other') && !otherEventType.trim()) {
      newErrors.otherEventType = 'Please enter your other event name';
    }
    if (!eventDate) {
      newErrors.eventDate = 'Please select your event date';
    }
    if (!location.trim()) {
      newErrors.location = 'Please enter your event location or venue';
    }
    if (!services) {
      newErrors.services = 'Please select a service';
    }
    if (hasCatering && !food) {
      newErrors.food = 'Please select your food preference';
    }

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      // Auto-scroll to first invalid element
      const firstKey = Object.keys(newErrors)[0];
      const idMap = {
        personName: 'person-name-input',
        eventTypes: 'event-types-section',
        otherEventType: 'other-event-type-input',
        eventDate: 'event-date-input',
        location: 'event-location-input',
        services: 'services-section',
        food: 'food-preference-section',
      };
      const el = document.getElementById(idMap[firstKey]);
      if (el) {
        el.scrollIntoView({ behavior: 'smooth', block: 'center' });
        el.focus?.();
      }
      return;
    }

    setErrors({});

    const allItems = [...vegMenuItems, ...nonVegMenuItems];
    const chosen   = allItems.filter(i => selectedItems.has(i.id));

    const name = personName.trim();
    const loc  = location.trim();

    // Format date cleanly (e.g. "24 Oct 2026")
    let formattedDate = eventDate;
    try {
      const [y, m, d] = eventDate.split('-');
      const dateObj = new Date(Number(y), Number(m) - 1, Number(d));
      formattedDate = dateObj.toLocaleDateString('en-IN', {
        day: 'numeric',
        month: 'short',
        year: 'numeric',
      });
    } catch {
      formattedDate = eventDate;
    }

    const resolvedEventTypes = eventTypes.map(t => {
      if (t === 'Other') {
        return otherEventType.trim() ? `Other (${otherEventType.trim()})` : 'Other';
      }
      return t;
    });

    const eventTypeStr = resolvedEventTypes.join(', ');
    const eventTypeLabel = resolvedEventTypes.length > 1 ? 'Event Types' : 'Event Type';

    // ── Section 1: Event Details ──────────────────────────────────────────
    const mapUrl = mapCoords ? ` (📍 Map: https://maps.google.com/?q=${mapCoords.lat},${mapCoords.lng})` : '';
    const eventDetails = [
      `• Name        : ${name}`,
      `• ${eventTypeLabel} : ${eventTypeStr}`,
      `• Date       : ${formattedDate}`,
      `• Location   : ${loc}${mapUrl}`,
      `• Guest Count: ${guests} Guests`,
      `• Services   : ${services}`,
    ];
    if (hasCatering && food) {
      eventDetails.push(`• Food Pref  : ${food}`);
    }

    // ── Section 2: Menu Items (clean separate block, no broken unicode) ───
    const menuSection = [];
    if (chosen.length > 0) {
      menuSection.push('');
      menuSection.push('----------------------------------------');
      menuSection.push('*MENU ITEMS REQUESTED:*');
      menuSection.push('----------------------------------------');
      // Group by category for readability
      const grouped = {};
      chosen.forEach(i => {
        if (!grouped[i.category]) grouped[i.category] = [];
        grouped[i.category].push(i.name);
      });
      Object.entries(grouped).forEach(([cat, names]) => {
        menuSection.push(`*• ${cat}:*`);
        names.forEach(n => menuSection.push(`   - ${n}`));
      });
    }

    // ── Section 3: Other / Special request ───────────────────────────────
    const otherSection = otherFood.trim()
      ? [
          '',
          '----------------------------------------',
          '*SPECIAL / OTHER FOOD REQUEST:*',
          '----------------------------------------',
          otherFood.trim(),
        ]
      : [];

    const msg = [
      'Sat Sri Akal Jatinderpal ji (Sunny ji),',
      `My name is ${name}. I would like to inquire about booking Sahib Decorators & Caterers for an event:`,
      '',
      ...eventDetails,
      ...menuSection,
      ...otherSection,
      '',
      'Please share your availability and estimated package.',
    ].join('\n');

    window.open(`https://wa.me/919888129647?text=${encodeURIComponent(msg)}`, '_blank', 'noopener,noreferrer');
  }, [personName, eventTypes, otherEventType, eventDate, location, guests, food, services, selectedItems, otherFood]);

  const selectedCount = selectedItems.size;

  return (
    <section
      ref={sectionRef}
      id="plan"
      className="relative overflow-hidden pt-14 pb-20 sm:pt-20 sm:pb-28 lg:pt-24 lg:pb-32 px-4 sm:px-6"
      aria-labelledby="plan-heading"
      style={{ background: 'linear-gradient(180deg, #fbf6ec 0%, #f5ead8 100%)' }}
    >
      {/* Background Watermark */}
      <div
        className="absolute top-10 left-0 right-0 pointer-events-none select-none overflow-hidden opacity-[0.06] z-0"
        aria-hidden="true"
      >
        <div className="watermark-glide-right font-cinzel font-black whitespace-nowrap text-[5rem] sm:text-[8rem] lg:text-[10rem] text-sdc-teal leading-none">
          <span>SAHIB DECORATORS &amp; CATERERS • SAHIB DECORATORS &amp; CATERERS • SAHIB DECORATORS &amp; CATERERS •&nbsp;</span>
          <span>SAHIB DECORATORS &amp; CATERERS • SAHIB DECORATORS &amp; CATERERS • SAHIB DECORATORS &amp; CATERERS •&nbsp;</span>
        </div>
      </div>

      <div className="max-w-[1200px] mx-auto relative z-10">
        {/* Header */}
        <div className={`text-center mb-8 sm:mb-10 transition-all duration-700 ease-out ${
          inView ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-6'
        }`}>
          <span
            className="inline-block border border-sdc-coral/40 text-sdc-teal px-4 py-1.5 rounded-full text-xs sm:text-sm tracking-[0.2em] uppercase font-times font-bold mb-3 bg-sdc-coral/5 shadow-sm"
            style={{ fontFamily: '"Times New Roman", Times, serif' }}
          >
            Instant Estimate
          </span>
          <h2
            id="plan-heading"
            className="group font-playfair font-bold text-sdc-coral mb-3 leading-tight cursor-pointer"
            style={{ fontSize: 'clamp(1.5rem, 5vw, 2.6rem)' }}
          >
            <Text3DFlip
              text="Plan Your Event"
              className="text-sdc-coral"
              staggerDelay={26}
              autoFlipInterval={7000}
            />
          </h2>
          <p className="font-poppins text-sdc-mute max-w-sm mx-auto text-sm sm:text-base">
            Tell us the basics and send your enquiry straight to Sunny ji on WhatsApp.
          </p>
        </div>

        {/* Estimator card — solid React visibility so it never vanishes on state changes */}
        <div
          className={`max-w-[720px] mx-auto rounded-2xl sm:rounded-[22px] p-4 sm:p-7 lg:p-9 transition-all duration-700 ease-out ${
            inView ? 'opacity-100 scale-100' : 'opacity-0 scale-[0.98]'
          }`}
          style={{
            background: 'linear-gradient(160deg, #fff, #fbf1dd)',
            border: '1px solid #e0575c55',
            boxShadow: '0 18px 40px rgba(31,45,46,0.10)',
          }}
        >
          {/* Your Name (Required) */}
          <div className="mb-4 sm:mb-6">
            <label
              htmlFor="person-name-input"
              className="font-montserrat text-sdc-teal text-xs tracking-wider uppercase font-bold mb-2 flex items-center gap-1"
            >
              <span>Your Name</span>
              <span className="text-red-500 font-bold">*</span>
            </label>
            <div className="relative">
              <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-sdc-mute/70 text-base pointer-events-none select-none">👤</span>
              <input
                id="person-name-input"
                type="text"
                value={personName}
                onChange={e => handleNameChange(e.target.value)}
                placeholder="Enter your name…"
                maxLength={60}
                autoComplete="name"
                className={`w-full pl-10 pr-4 py-2.5 rounded-xl border bg-white font-poppins text-sdc-ink text-sm
                  placeholder:text-sdc-mute/50 focus:outline-none transition-all ${
                    errors.personName
                      ? 'border-red-500 ring-2 ring-red-400/25 bg-red-50/20'
                      : 'border-sdc-coral/30 focus:border-sdc-coral focus:ring-2 focus:ring-sdc-coral/20'
                  }`}
              />
            </div>
            {errors.personName && (
              <p className="text-red-500 font-poppins text-[0.72rem] mt-1.5 flex items-center gap-1 font-medium">
                <span>⚠️</span> {errors.personName}
              </p>
            )}
          </div>

          {/* Event type (Multi-select, Required) */}
          <div id="event-types-section" className="mb-4 sm:mb-6 scroll-mt-24">
            <div className="flex items-center justify-between mb-2">
              <p className="font-montserrat text-sdc-teal text-xs tracking-wider uppercase font-bold flex items-center gap-1">
                <span>Event type</span>
                <span className="text-red-500 font-bold">*</span>
              </p>
              <span className="text-[0.68rem] font-poppins text-sdc-mute font-medium">
                (Select one or more)
              </span>
            </div>
            <div className={`transition-all rounded-2xl p-1 ${
              errors.eventTypes ? 'border border-red-500/50 bg-red-50/25 ring-2 ring-red-400/20' : ''
            }`}>
              <ChipGroup
                options={EVENT_TYPES}
                value={eventTypes}
                onChange={handleEventTypesChange}
                multiple={true}
                groupLabel="Event type selection"
              />
            </div>
            {errors.eventTypes && (
              <p className="text-red-500 font-poppins text-[0.72rem] mt-1.5 flex items-center gap-1 font-medium">
                <span>⚠️</span> {errors.eventTypes}
              </p>
            )}

            {/* Other Event Type Input — appears when 'Other' chip is selected */}
            {eventTypes.includes('Other') && (
              <div className="mt-3 p-3 sm:p-3.5 rounded-xl border border-sdc-coral/30 bg-sdc-coral/5 transition-all">
                <label
                  htmlFor="other-event-type-input"
                  className="font-montserrat text-sdc-teal text-xs tracking-wider uppercase font-bold mb-1.5 flex items-center gap-1"
                >
                  <span>✏️ Specify Your Event Name</span>
                  <span className="text-red-500 font-bold">*</span>
                </label>
                <div className="relative">
                  <input
                    id="other-event-type-input"
                    type="text"
                    value={otherEventType}
                    onChange={e => handleOtherEventChange(e.target.value)}
                    placeholder="e.g. Retirement Party, Sufi Night, Reunion, Family Function…"
                    maxLength={80}
                    autoFocus
                    className={`w-full px-3.5 py-2.5 rounded-xl border bg-white font-poppins text-sdc-ink text-sm
                      placeholder:text-sdc-mute/50 focus:outline-none transition-all ${
                        errors.otherEventType
                          ? 'border-red-500 ring-2 ring-red-400/25 bg-red-50/20'
                          : 'border-sdc-coral/30 focus:border-sdc-coral focus:ring-2 focus:ring-sdc-coral/20'
                      }`}
                  />
                </div>
                {errors.otherEventType && (
                  <p className="text-red-500 font-poppins text-[0.72rem] mt-1.5 flex items-center gap-1 font-medium">
                    <span>⚠️</span> {errors.otherEventType}
                  </p>
                )}
              </div>
            )}
          </div>

          {/* Event Date & Location / Venue (Required) */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4 mb-4 sm:mb-6 min-w-0 w-full">
            {/* Event Date */}
            <div className="min-w-0 w-full">
              <label
                htmlFor="event-date-input"
                className="font-montserrat text-sdc-teal text-xs tracking-wider uppercase font-bold mb-2 flex items-center gap-1"
              >
                <span>📅 Event Date</span>
                <span className="text-red-500 font-bold">*</span>
              </label>
              <div className="relative min-w-0 w-full">
                <input
                  id="event-date-input"
                  type="date"
                  min={new Date().toISOString().split('T')[0]}
                  value={eventDate}
                  onChange={e => handleDateChange(e.target.value)}
                  className={`w-full min-w-0 max-w-full box-border block px-3.5 py-2.5 rounded-xl border bg-white font-poppins text-sdc-ink text-sm
                    focus:outline-none transition-all cursor-pointer ${
                      errors.eventDate
                        ? 'border-red-500 ring-2 ring-red-400/25 bg-red-50/20'
                        : 'border-sdc-coral/30 focus:border-sdc-coral focus:ring-2 focus:ring-sdc-coral/20'
                    }`}
                  style={{
                    maxWidth: '100%',
                    boxSizing: 'border-box',
                    WebkitAppearance: 'none',
                    MozAppearance: 'none',
                    appearance: 'none',
                  }}
                />
              </div>
              {errors.eventDate && (
                <p className="text-red-500 font-poppins text-[0.72rem] mt-1.5 flex items-center gap-1 font-medium">
                  <span>⚠️</span> {errors.eventDate}
                </p>
              )}
            </div>

            {/* Event Location / Venue */}
            <div>
              <div className="flex items-center justify-between mb-2">
                <label
                  htmlFor="event-location-input"
                  className="font-montserrat text-sdc-teal text-xs tracking-wider uppercase font-bold flex items-center gap-1"
                >
                  <span>📍 Location / Venue</span>
                  <span className="text-red-500 font-bold">*</span>
                </label>
                {mapCoords && (
                  <span className="text-[0.66rem] font-montserrat font-bold text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded-full border border-emerald-200 flex items-center gap-1">
                    <span>✓</span> Pinned
                  </span>
                )}
              </div>
              <div className="relative">
                <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-sdc-mute/70 text-base pointer-events-none select-none">📍</span>
                <input
                  id="event-location-input"
                  type="text"
                  value={location}
                  onChange={e => handleLocationChange(e.target.value)}
                  placeholder="e.g. Ludhiana, Grand City Resort…"
                  maxLength={120}
                  className={`w-full pl-10 pr-4 py-2.5 rounded-xl border bg-white font-poppins text-sdc-ink text-sm
                    placeholder:text-sdc-mute/50 focus:outline-none transition-all ${
                      errors.location
                        ? 'border-red-500 ring-2 ring-red-400/25 bg-red-50/20'
                        : 'border-sdc-coral/30 focus:border-sdc-coral focus:ring-2 focus:ring-sdc-coral/20'
                    }`}
                />
              </div>

              {/* Quick Action Map & Current Location Buttons */}
              <div className="flex flex-wrap items-center gap-2 mt-2">
                <button
                  type="button"
                  onClick={() => setIsMapOpen(true)}
                  className="px-2.5 py-1.5 rounded-lg border border-sdc-coral/40 bg-sdc-coral/10 hover:bg-sdc-coral/20 text-sdc-coral font-montserrat font-bold text-[0.72rem] flex items-center gap-1.5 transition-all active:scale-95 shadow-sm"
                >
                  <span>🗺️</span>
                  <span>Locate on Map</span>
                </button>
                <button
                  type="button"
                  onClick={handleQuickCurrentLocation}
                  disabled={isQuickLocating}
                  className="px-2.5 py-1.5 rounded-lg border border-sdc-coral/30 bg-white hover:bg-sdc-coral/10 text-sdc-ink font-montserrat font-bold text-[0.72rem] flex items-center gap-1.5 transition-all active:scale-95 shadow-sm"
                >
                  <span className={isQuickLocating ? 'animate-spin' : ''}>🎯</span>
                  <span>{isQuickLocating ? 'Detecting GPS…' : 'Use Current Location'}</span>
                </button>
              </div>

              {locationNotice && (
                <p className="text-sdc-teal font-poppins text-[0.7rem] mt-1.5 font-medium flex items-center gap-1">
                  <span>ℹ️</span> {locationNotice}
                </p>
              )}

              {errors.location && (
                <p className="text-red-500 font-poppins text-[0.72rem] mt-1.5 flex items-center gap-1 font-medium">
                  <span>⚠️</span> {errors.location}
                </p>
              )}
            </div>
          </div>

          {/* Guest count */}
          <div className="mb-4 sm:mb-6">
            <p className="font-montserrat text-sdc-teal text-xs tracking-wider uppercase font-bold mb-1">
              Guests:{' '}
              <span className="font-playfair text-sdc-coral text-xl sm:text-2xl ml-1 tabular-nums font-bold">{guests}</span>
            </p>
            <input
              id="guest-slider"
              type="range"
              min={50}
              max={2000}
              step={50}
              value={guests}
              onChange={(e) => setGuests(Number(e.target.value))}
              className="w-full mt-2 cursor-pointer h-5 touch-manipulation"
              style={{ accentColor: '#e0575c' }}
              aria-valuemin={50}
              aria-valuemax={2000}
              aria-valuenow={guests}
              aria-label="Number of guests"
            />
            <div className="flex justify-between font-montserrat text-sdc-mute text-xs mt-1 font-semibold">
              <span>50</span><span>2000</span>
            </div>
          </div>

          {/* Services (Required) */}
          <div id="services-section" className="mb-4 sm:mb-6 scroll-mt-24">
            <p className="font-montserrat text-sdc-teal text-xs tracking-wider uppercase font-bold mb-2 flex items-center gap-1">
              <span>Services</span>
              <span className="text-red-500 font-bold">*</span>
            </p>
            <div className={`transition-all rounded-2xl p-1 ${
              errors.services ? 'border border-red-500/50 bg-red-50/25 ring-2 ring-red-400/20' : ''
            }`}>
              <ChipGroup
                options={SERVICE_OPTS}
                value={services}
                onChange={handleServicesChange}
                groupLabel="Services selection"
              />
            </div>
            {errors.services && (
              <p className="text-red-500 font-poppins text-[0.72rem] mt-1.5 flex items-center gap-1 font-medium">
                <span>⚠️</span> {errors.services}
              </p>
            )}
          </div>

          {/* Food preference (Appears only when Catering is chosen) + Menu selector */}
          {hasCatering && (
            <div id="food-preference-section" className="mb-5 sm:mb-7 scroll-mt-24">
              <p className="font-montserrat text-sdc-teal text-xs tracking-wider uppercase font-bold mb-2 flex items-center gap-1">
                <span>Food preference</span>
                <span className="text-red-500 font-bold">*</span>
              </p>
              <div className={`transition-all rounded-2xl p-1 ${
                errors.food ? 'border border-red-500/50 bg-red-50/25 ring-2 ring-red-400/20' : ''
              }`}>
                <ChipGroup
                  options={FOOD_OPTIONS}
                  value={food}
                  onChange={handleFoodChange}
                  groupLabel="Food preference selection"
                />
              </div>
              {errors.food && (
                <p className="text-red-500 font-poppins text-[0.72rem] mt-1.5 flex items-center gap-1 font-medium">
                  <span>⚠️</span> {errors.food}
                </p>
              )}

              {showMenuSelector && (
              <div className="mt-3">
                {/* Summary pills of selected items */}
                {(selectedCount > 0 || otherFood) && (
                  <div className="flex flex-wrap gap-1.5 mb-2">
                    {[...selectedItems].slice(0, 5).map(id => {
                      const item = [...vegMenuItems, ...nonVegMenuItems].find(i => i.id === id);
                      return item ? (
                        <span key={id} className="text-[0.68rem] font-montserrat font-semibold px-2 py-0.5 rounded-full bg-sdc-coral/10 text-sdc-coral border border-sdc-coral/20">
                          {item.name}
                        </span>
                      ) : null;
                    })}
                    {selectedCount > 5 && (
                      <span className="text-[0.68rem] font-montserrat font-semibold px-2 py-0.5 rounded-full bg-sdc-teal/10 text-sdc-teal border border-sdc-teal/20">
                        +{selectedCount - 5} more
                      </span>
                    )}
                  </div>
                )}

                <MenuSelectorPanel
                  foodPref={food}
                  selectedItems={selectedItems}
                  onToggle={toggleItem}
                  onClearAll={handleClearAll}
                  otherFood={otherFood}
                  onOtherChange={setOtherFood}
                />
              </div>
            )}
          </div>
        )}

          {/* Validation Alert Banner */}
          {Object.keys(errors).length > 0 && (
            <div className="mb-4 p-3 rounded-xl bg-red-50 border border-red-300 text-red-600 text-xs font-montserrat font-semibold flex items-center gap-2">
              <span className="text-sm">⚠️</span>
              <span>Please fill in all required fields (marked with *) before sending your enquiry.</span>
            </div>
          )}

          {/* WhatsApp CTA */}
          <button
            id="plan-whatsapp-btn"
            type="button"
            onClick={sendWhatsApp}
            className="btn-shine w-full py-3.5 sm:py-4 px-4 sm:px-6 rounded-full font-montserrat font-bold text-white
              text-[0.78rem] sm:text-[0.92rem] tracking-wide sm:tracking-wider uppercase
              hover:-translate-y-1 hover:shadow-xl active:scale-95
              transition-all duration-300 touch-manipulation flex items-center justify-center gap-2"
            style={{
              background: 'linear-gradient(135deg, #fb6b6e, #e0575c)',
              boxShadow: '0 8px 25px rgba(224,87,92,0.35)',
            }}
            aria-label="Send enquiry on WhatsApp to Sahib Decorators & Caterers"
          >
            <span className="text-base sm:text-lg shrink-0">💬</span>
            <span className="whitespace-nowrap">Send Enquiry on WhatsApp</span>
          </button>
        </div>
      </div>

      {/* Location Picker Modal */}
      <LocationPickerModal
        isOpen={isMapOpen}
        onClose={() => setIsMapOpen(false)}
        initialLocation={location}
        initialCoords={mapCoords}
        onConfirm={handleLocationConfirm}
      />
    </section>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// Default export wrapped in Error Boundary
// ─────────────────────────────────────────────────────────────────────────────
export default function PlanEvent() {
  return (
    <PlanEventErrorBoundary>
      <PlanEventContent />
    </PlanEventErrorBoundary>
  );
}
