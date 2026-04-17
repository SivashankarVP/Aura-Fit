import React from 'react';
import { X, SlidersHorizontal, ChevronRight, Star } from 'lucide-react';
import useStore from '../store/useStore';
import { SEASONS, TYPES, PRICE_RANGES, SPECIAL_TAGS, SIZES } from '../data/products';

const Sidebar = () => {
  const { filters, setFilter, resetFilters, sidebarOpen, setSidebarOpen } = useStore();

  const handleToggleSize = (size) => {
    const newSizes = filters.sizes.includes(size)
      ? filters.sizes.filter(s => s !== size)
      : [...filters.sizes, size];
    setFilter('sizes', newSizes);
  };

  const handleToggleSpecial = (tag) => {
    const newSpecial = filters.special.includes(tag)
      ? filters.special.filter(t => t !== tag)
      : [...filters.special, tag];
    setFilter('special', newSpecial);
  };

  return (
    <div className={`fixed inset-y-0 left-0 z-[60] w-72 transform bg-slate-900 shadow-2xl transition-transform lg:relative lg:translate-x-0 ${sidebarOpen ? 'translate-x-0' : '-translate-x-full'}`}>
      <div className="flex flex-col h-full bg-slate-1000 border-r border-white/5 overflow-y-auto custom-scrollbar">
        <div className="px-6 py-6 border-b border-white/5 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <SlidersHorizontal className="w-5 h-5 text-indigo-400" />
            <h2 className="text-xl font-bold tracking-tight">Smart Filters</h2>
          </div>
          <button onClick={() => setSidebarOpen(false)} className="lg:hidden p-1.5 hover:bg-white/5 rounded-md">
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="p-6 space-y-8">
          {/* Seasonal Collections */}
          <section>
            <h3 className="text-xs font-bold text-slate-500 uppercase tracking-widest mb-4">Seasonal Collections</h3>
            <div className="flex flex-wrap gap-2">
              {SEASONS.map(season => (
                <button
                  key={season}
                  onClick={() => setFilter('season', season)}
                  className={`px-4 py-1.5 rounded-full text-xs font-medium transition-all ${
                    filters.season === season 
                    ? 'bg-indigo-600 text-white shadow-lg shadow-indigo-600/20' 
                    : 'bg-white/5 text-slate-400 hover:bg-white/10'
                  }`}
                >
                  {season}
                </button>
              ))}
            </div>
          </section>

          {/* Product Types */}
          <section>
            <h3 className="text-xs font-bold text-slate-500 uppercase tracking-widest mb-4">Product Types</h3>
            <div className="space-y-1">
              {TYPES.map(type => (
                <button
                  key={type}
                  onClick={() => setFilter('type', type)}
                  className={`w-full text-left px-3 py-2 rounded-lg text-sm flex items-center justify-between group transition-colors ${
                    filters.type === type ? 'bg-white/10 text-white' : 'text-slate-400 hover:text-white hover:bg-white/5'
                  }`}
                >
                  {type}
                  <ChevronRight className={`w-4 h-4 transition-transform ${filters.type === type ? 'rotate-90 text-indigo-400' : 'text-slate-600 group-hover:translate-x-0.5'}`} />
                </button>
              ))}
            </div>
          </section>

          {/* Price Ranges */}
          <section>
            <h3 className="text-xs font-bold text-slate-500 uppercase tracking-widest mb-4">Price Range</h3>
            <div className="space-y-3">
              {PRICE_RANGES.map((range, idx) => (
                <label key={range.label} className="flex items-center gap-3 cursor-pointer group">
                  <div className="relative flex items-center">
                    <input 
                      type="radio" 
                      name="price" 
                      className="peer sr-only"
                      checked={filters.priceLabelIndex === idx}
                      onChange={() => {
                        setFilter('priceLabelIndex', idx);
                        setFilter('priceRange', { min: range.min, max: range.max });
                      }}
                    />
                    <div className="w-4 h-4 border-2 border-slate-600 rounded-full peer-checked:border-indigo-500 peer-checked:bg-indigo-500 transition-all flex items-center justify-center after:content-[''] after:w-1.5 after:h-1.5 after:bg-white after:rounded-full after:scale-0 peer-checked:after:scale-100 after:transition-transform"></div>
                  </div>
                  <span className="text-sm text-slate-400 group-hover:text-slate-200 transition-colors">{range.label}</span>
                </label>
              ))}
            </div>
          </section>

          {/* Sizes */}
          <section>
            <h3 className="text-xs font-bold text-slate-500 uppercase tracking-widest mb-4">Sizes</h3>
            <div className="grid grid-cols-4 gap-2">
              {SIZES.filter(s => s !== "All").map(size => (
                <button
                  key={size}
                  onClick={() => handleToggleSize(size)}
                  className={`py-2 rounded-md border text-xs font-bold transition-all ${
                    filters.sizes.includes(size)
                    ? 'border-indigo-500 bg-indigo-500/10 text-indigo-400'
                    : 'border-white/5 bg-white/5 text-slate-400 hover:border-white/20'
                  }`}
                >
                  {size}
                </button>
              ))}
            </div>
          </section>

          {/* Special Tags */}
          <section>
            <h3 className="text-xs font-bold text-slate-500 uppercase tracking-widest mb-4">Special</h3>
            <div className="space-y-2">
              {SPECIAL_TAGS.map(tag => (
                <label key={tag} className="flex items-center gap-3 cursor-pointer group">
                  <input 
                    type="checkbox" 
                    className="w-4 h-4 rounded border-slate-600 bg-white/5 text-indigo-600 focus:ring-indigo-500"
                    checked={filters.special.includes(tag)}
                    onChange={() => handleToggleSpecial(tag)}
                  />
                  <span className="text-sm text-slate-400 group-hover:text-slate-200">{tag}</span>
                </label>
              ))}
            </div>
          </section>

           {/* Ratings */}
           <section>
            <h3 className="text-xs font-bold text-slate-500 uppercase tracking-widest mb-4">Ratings</h3>
            <div className="space-y-2">
              {[4, 3, 2].map(rating => (
                <button
                  key={rating}
                  onClick={() => setFilter('rating', rating)}
                  className={`w-full flex items-center gap-2 px-2 py-1.5 rounded-lg transition-colors ${
                    filters.rating === rating ? 'bg-white/5' : 'hover:bg-white/5'
                  }`}
                >
                   <div className="flex text-amber-400">
                    {[...Array(5)].map((_, i) => (
                      <Star key={i} className={`w-3.5 h-3.5 ${i < rating ? 'fill-current' : 'text-slate-700'}`} />
                    ))}
                   </div>
                   <span className="text-xs text-slate-400">& Up</span>
                </button>
              ))}
            </div>
          </section>

          <button 
            onClick={resetFilters}
            className="w-full py-3 mt-4 text-sm font-medium text-slate-400 border border-white/5 rounded-xl hover:bg-white/5 hover:text-white transition-all"
          >
            Clear All Filters
          </button>
        </div>
      </div>
    </div>
  );
};

export default Sidebar;
