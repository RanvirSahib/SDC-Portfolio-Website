import { useState, useMemo, useEffect, useRef } from 'react';
import { vegMenuItems, nonVegMenuItems, menuCategories } from '../data/menuData';

export default function CateringMenuModal({ isOpen, onClose, onOpenPlanEvent }) {
  const [dietFilter, setDietFilter] = useState('all'); // 'all' | 'veg' | 'non-veg'
  const [selectedCat, setSelectedCat] = useState('all');
  const [search, setSearch] = useState('');
  const modalContentRef = useRef(null);

  // Close on Escape key
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === 'Escape' && isOpen) onClose();
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose]);

  // Lock body scroll when modal is open
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => {
      document.body.style.overflow = '';
    };
  }, [isOpen]);

  // Combine items with flags
  const allDishes = useMemo(() => {
    const list = [
      ...vegMenuItems.map(i => ({ ...i, type: 'veg' })),
      ...nonVegMenuItems.map(i => ({ ...i, type: 'non-veg' })),
    ];
    return list;
  }, []);

  // Filter based on diet, category, and search query
  const filteredDishes = useMemo(() => {
    return allDishes.filter(item => {
      // Diet filter
      if (dietFilter === 'veg' && item.type !== 'veg') return false;
      if (dietFilter === 'non-veg' && item.type !== 'non-veg') return false;

      // Category filter
      if (selectedCat !== 'all') {
        const catObj = menuCategories.find(c => c.id === selectedCat);
        if (catObj && item.category !== catObj.label) return false;
      }

      // Search query
      if (search.trim()) {
        const q = search.trim().toLowerCase();
        const matchesName = item.name.toLowerCase().includes(q);
        const matchesCat  = item.category.toLowerCase().includes(q);
        const matchesDesc = item.desc ? item.desc.toLowerCase().includes(q) : false;
        if (!matchesName && !matchesCat && !matchesDesc) return false;
      }

      return true;
    });
  }, [allDishes, dietFilter, selectedCat, search]);

  // Group filtered dishes by category
  const groupedDishes = useMemo(() => {
    return filteredDishes.reduce((acc, item) => {
      if (!acc[item.category]) acc[item.category] = [];
      acc[item.category].push(item);
      return acc;
    }, {});
  }, [filteredDishes]);

  // Category counts based on current diet filter
  const categoryCounts = useMemo(() => {
    const counts = { all: 0 };
    allDishes.forEach(item => {
      if (dietFilter === 'veg' && item.type !== 'veg') return;
      if (dietFilter === 'non-veg' && item.type !== 'non-veg') return;
      counts.all = (counts.all || 0) + 1;
      const catObj = menuCategories.find(c => c.label === item.category);
      if (catObj) {
        counts[catObj.id] = (counts[catObj.id] || 0) + 1;
      }
    });
    return counts;
  }, [allDishes, dietFilter]);

  if (!isOpen) return null;

  const handleBookWithMenu = () => {
    onClose();
    if (onOpenPlanEvent) {
      onOpenPlanEvent();
    } else {
      const planSection = document.getElementById('plan');
      if (planSection) {
        planSection.scrollIntoView({ behavior: 'smooth' });
      }
    }
  };

  return (
    <div
      className="fixed inset-0 z-[9999] flex items-center justify-center p-2 sm:p-4 bg-sdc-teal/80 backdrop-blur-md transition-opacity duration-300"
      role="dialog"
      aria-modal="true"
      aria-labelledby="catering-modal-title"
    >
      <div
        ref={modalContentRef}
        className="relative w-full max-w-5xl h-[92vh] max-h-[920px] rounded-3xl bg-[#fffdf9] border border-sdc-coral/30 shadow-2xl flex flex-col overflow-hidden animate-in fade-in zoom-in-95 duration-200"
      >
        {/* ── Modal Header ────────────────────────────────────────── */}
        <div
          className="px-5 sm:px-8 pt-5 pb-4 border-b border-sdc-coral/20 shrink-0 relative"
          style={{ background: 'linear-gradient(135deg, #fff7ee 0%, #fffdf9 100%)' }}
        >
          <div className="flex items-start justify-between gap-4">
            <div>
              <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-sdc-coral/10 border border-sdc-coral/30 mb-2">
                <span className="text-sdc-coral text-xs">👑</span>
                <span className="font-montserrat font-bold text-[0.68rem] sm:text-[0.7rem] uppercase tracking-wider text-sdc-teal whitespace-nowrap">
                  Royal Punjabi Catering
                </span>
              </div>
              <h2
                id="catering-modal-title"
                className="font-playfair font-black text-sdc-teal text-xl sm:text-3xl leading-tight"
              >
                Sahib Official Catering Menu
              </h2>
              <p className="font-poppins text-sdc-mute text-xs sm:text-sm mt-1">
                Explore our authentic Punjabi delicacies prepared fresh for weddings and royal banquets.
              </p>
            </div>

            {/* Close Button */}
            <button
              onClick={onClose}
              aria-label="Close menu modal"
              className="w-10 h-10 rounded-full bg-white border border-sdc-coral/30 text-sdc-teal hover:text-sdc-coral hover:border-sdc-coral flex items-center justify-center text-lg font-bold shadow-sm transition-all hover:scale-105 active:scale-95 shrink-0"
            >
              ✕
            </button>
          </div>

          {/* ── Search & Filter Controls ──────────────────────────── */}
          <div className="mt-4 flex flex-col sm:flex-row items-stretch sm:items-center gap-3">
            {/* Search Input */}
            <div className="relative flex-1">
              <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-sdc-mute text-sm pointer-events-none">
                🔍
              </span>
              <input
                type="text"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Search any dish (e.g. Dal Makhani, Butter Chicken, Amritsari Kulcha, Kulfi)..."
                className="w-full pl-10 pr-9 py-2.5 rounded-xl border border-sdc-coral/30 bg-white font-poppins text-sdc-ink text-xs sm:text-sm placeholder:text-sdc-mute/60 focus:outline-none focus:border-sdc-coral focus:ring-2 focus:ring-sdc-coral/20 transition-all shadow-xs"
              />
              {search && (
                <button
                  type="button"
                  onClick={() => setSearch('')}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-sdc-mute hover:text-sdc-coral text-xs font-bold p-1"
                >
                  ✕
                </button>
              )}
            </div>

            {/* Diet Filter Chips (Equal width grid on mobile, no numbers) */}
            <div className="grid grid-cols-3 sm:flex items-center gap-1 p-1 bg-white/90 border border-sdc-coral/25 rounded-xl w-full sm:w-auto shrink-0 shadow-xs">
              <button
                type="button"
                onClick={() => setDietFilter('all')}
                className={`px-3 py-2 rounded-lg font-montserrat font-bold text-xs text-center transition-all ${
                  dietFilter === 'all'
                    ? 'bg-sdc-teal text-white shadow-xs'
                    : 'text-sdc-mute hover:text-sdc-teal'
                }`}
              >
                All Dishes
              </button>
              <button
                type="button"
                onClick={() => setDietFilter('veg')}
                className={`flex items-center justify-center gap-1.5 px-3 py-2 rounded-lg font-montserrat font-bold text-xs text-center transition-all ${
                  dietFilter === 'veg'
                    ? 'bg-[#1b7938] text-white shadow-xs'
                    : 'text-sdc-mute hover:text-[#1b7938]'
                }`}
              >
                <span className="w-2 h-2 rounded-full bg-[#27ae60] shrink-0 inline-block"></span>
                <span>Pure Veg</span>
              </button>
              <button
                type="button"
                onClick={() => setDietFilter('non-veg')}
                className={`flex items-center justify-center gap-1.5 px-3 py-2 rounded-lg font-montserrat font-bold text-xs text-center transition-all ${
                  dietFilter === 'non-veg'
                    ? 'bg-[#b33939] text-white shadow-xs'
                    : 'text-sdc-mute hover:text-[#b33939]'
                }`}
              >
                <span className="w-2 h-2 rounded-full bg-[#e74c3c] shrink-0 inline-block"></span>
                <span>Non-Veg</span>
              </button>
            </div>
          </div>

          {/* ── Category Horizontal Scrollable Tabs (Clean pills without numbers) ── */}
          <div className="mt-3.5 flex items-center gap-2 overflow-x-auto pb-1 scrollbar-none">
            {menuCategories
              .filter(cat => {
                if (cat.id === 'all') return true;
                if (dietFilter === 'veg' && cat.type === 'non-veg') return false;
                if (dietFilter === 'non-veg' && cat.type === 'veg') return false;
                return true;
              })
              .map(cat => {
                const count = categoryCounts[cat.id] || 0;
                if (cat.id !== 'all' && count === 0) return null;
                const isSelected = selectedCat === cat.id;

                return (
                  <button
                    key={cat.id}
                    type="button"
                    onClick={() => setSelectedCat(cat.id)}
                    className={`whitespace-nowrap px-3.5 py-1.5 rounded-full font-montserrat text-xs font-semibold flex items-center gap-1.5 transition-all shrink-0 ${
                      isSelected
                        ? 'bg-sdc-coral text-white shadow-sm scale-102'
                        : 'bg-white border border-sdc-coral/20 text-sdc-ink hover:border-sdc-coral hover:text-sdc-coral'
                    }`}
                  >
                    <span>{cat.icon}</span>
                    <span>{cat.label}</span>
                  </button>
                );
              })}
          </div>
        </div>

        {/* ── Dish Catalog Body ───────────────────────────────────── */}
        <div className="flex-1 overflow-y-auto px-5 sm:px-8 py-5 space-y-6">
          {Object.keys(groupedDishes).length === 0 ? (
            <div className="text-center py-16 px-4">
              <span className="text-4xl block mb-2">🍽️</span>
              <p className="font-playfair font-bold text-sdc-teal text-lg">No dishes found</p>
              <p className="font-poppins text-sdc-mute text-xs mt-1">
                No items match &ldquo;{search}&rdquo; with the selected filters.
              </p>
              <button
                type="button"
                onClick={() => { setSearch(''); setDietFilter('all'); setSelectedCat('all'); }}
                className="mt-4 px-4 py-2 rounded-xl bg-sdc-coral/10 border border-sdc-coral/30 text-sdc-coral font-montserrat font-bold text-xs hover:bg-sdc-coral hover:text-white transition-all"
              >
                Reset Filters
              </button>
            </div>
          ) : (
            Object.entries(groupedDishes).map(([categoryName, dishes]) => (
              <div key={categoryName} className="scroll-mt-6">
                {/* Section Header */}
                <div className="flex items-center gap-3 mb-3.5 pb-2 border-b border-sdc-coral/15">
                  <h3 className="font-playfair font-bold text-sdc-coral text-base sm:text-lg">
                    {categoryName}
                  </h3>
                </div>

                {/* Cards Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                  {dishes.map((dish) => (
                    <div
                      key={dish.id}
                      className="p-3.5 rounded-2xl bg-white border border-sdc-coral/15 hover:border-sdc-coral/50 hover:shadow-md transition-all duration-200 flex flex-col justify-between group"
                    >
                      <div>
                        <div className="flex items-start justify-between gap-2 mb-1.5">
                          <h4 className="font-montserrat font-bold text-sdc-ink text-sm sm:text-[0.92rem] group-hover:text-sdc-coral transition-colors flex items-center gap-2">
                            <span
                              className={`w-2.5 h-2.5 rounded-full shrink-0 ${
                                dish.type === 'veg' ? 'bg-[#27ae60]' : 'bg-[#e74c3c]'
                              }`}
                              title={dish.type === 'veg' ? 'Vegetarian' : 'Non-Vegetarian'}
                            />
                            <span>{dish.name}</span>
                          </h4>
                          <span className={`text-[0.62rem] uppercase font-bold tracking-wider px-2 py-0.5 rounded-md shrink-0 ${
                            dish.type === 'veg'
                              ? 'bg-[#27ae60]/10 text-[#1b7938]'
                              : 'bg-[#e74c3c]/10 text-[#b33939]'
                          }`}>
                            {dish.type === 'veg' ? 'Veg' : 'Non-Veg'}
                          </span>
                        </div>
                        {dish.desc && (
                          <p className="font-poppins text-sdc-mute text-xs leading-relaxed pl-4.5">
                            {dish.desc}
                          </p>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            ))
          )}
        </div>

        {/* ── Modal Footer ────────────────────────────────────────── */}
        <div
          className="px-4 sm:px-8 py-3 sm:py-3.5 border-t border-sdc-coral/20 shrink-0 flex flex-col sm:flex-row items-center justify-between gap-3"
          style={{ background: 'linear-gradient(90deg, #fff7ee 0%, #fffdf9 100%)' }}
        >
          <div className="text-center sm:text-left">
            <p className="font-montserrat font-bold text-sdc-teal text-xs">
              Authentic Royal Punjabi Catering
            </p>
            <p className="font-poppins text-sdc-mute text-[0.7rem] hidden sm:block">
              Full culinary customisation &bull; Live master chef counters available for all occasions
            </p>
          </div>

          <div className="flex items-center gap-2.5 w-full sm:w-auto">
            <a
              href="https://wa.me/919888129647?text=Hello%20Sunny%20Ji%2C%20I%20reviewed%20your%20catering%20menu%20on%20the%20website%20and%20would%20like%20to%20discuss%20a%20catering%20package."
              target="_blank"
              rel="noopener noreferrer"
              className="flex-1 sm:flex-none h-11 px-4 rounded-xl sm:rounded-full border border-sdc-coral/40 text-sdc-teal hover:border-sdc-coral hover:bg-sdc-coral/10 font-montserrat font-bold text-xs uppercase tracking-wider flex items-center justify-center gap-1.5 whitespace-nowrap transition-all shadow-xs"
            >
              <span>💬</span>
              <span>WhatsApp</span>
            </a>
            <button
              type="button"
              onClick={handleBookWithMenu}
              className="flex-1 sm:flex-none h-11 px-5 rounded-xl sm:rounded-full bg-gradient-to-r from-[#fb6b6e] to-[#e0575c] text-white font-montserrat font-bold text-xs uppercase tracking-wider flex items-center justify-center gap-1.5 whitespace-nowrap hover:shadow-lg hover:-translate-y-0.5 active:scale-95 transition-all shadow-md"
            >
              <span>✨</span>
              <span>Plan Event</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
