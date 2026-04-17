import React from 'react';
import { X, SlidersHorizontal, ChevronRight, Star } from 'lucide-react';
import useStore from '../store/useStore';
import { SEASONS, TYPES, PRICE_RANGES, SPECIAL_TAGS, SIZES } from '../data/products';
import { motion, AnimatePresence } from 'framer-motion';

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
    <AnimatePresence>
      {sidebarOpen && (
        <>
          {/* Global Backdrop */}
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setSidebarOpen(false)}
            className="fixed inset-0 bg-black/60 backdrop-blur-sm z-[100]"
          />

          {/* Filtering Panel */}
          <motion.aside 
            initial={{ x: '-100%' }}
            animate={{ x: 0 }}
            exit={{ x: '-100%' }}
            transition={{ type: 'spring', damping: 25, stiffness: 200 }}
            className="fixed inset-y-0 left-0 w-full max-w-sm bg-white dark:bg-slate-900 z-[110] shadow-[0_0_50px_rgba(0,0,0,0.3)] flex flex-col border-r dark:border-white/5"
          >
            <div className="px-8 py-8 border-b dark:border-white/5 flex items-center justify-between bg-white dark:bg-slate-900 sticky top-0 z-10">
              <div className="flex items-center gap-4">
                <div className="w-10 h-10 rounded-xl bg-indigo-500/10 flex items-center justify-center">
                  <SlidersHorizontal className="w-5 h-5 text-indigo-500" />
                </div>
                <div>
                  <h2 className="text-xl font-black tracking-tighter uppercase leading-none">Smart Filters</h2>
                  <p className="text-[10px] text-slate-500 font-bold uppercase tracking-widest mt-1">Refine your aura</p>
                </div>
              </div>
              <button 
                onClick={() => setSidebarOpen(false)} 
                className="p-3 hover:bg-black/5 dark:hover:bg-white/5 rounded-2xl transition-all group"
              >
                <X className="w-6 h-6 text-slate-400 group-hover:rotate-90 transition-transform" />
              </button>
            </div>

            <div className="flex-1 overflow-y-auto custom-scrollbar p-8 space-y-10">
              {/* Seasonal Collections */}
              <section>
                <div className="flex items-center justify-between mb-5">
                  <h3 className="text-sm font-black text-current uppercase tracking-widest">Seasonal</h3>
                  <span className="text-[10px] text-indigo-500 font-bold px-2 py-0.5 bg-indigo-500/10 rounded-full">Primary</span>
                </div>
                <div className="flex flex-wrap gap-2.5">
                  {SEASONS.map(season => (
                    <button
                      key={season}
                      onClick={() => setFilter('season', season)}
                      className={`px-5 py-2.5 rounded-xl text-xs font-bold transition-all border ${
                        filters.season === season 
                        ? 'bg-indigo-600 text-white border-indigo-600 shadow-lg shadow-indigo-600/20' 
                        : 'bg-black/5 dark:bg-white/5 text-slate-500 border-transparent hover:border-indigo-500 hover:text-indigo-500'
                      }`}
                    >
                      {season}
                    </button>
                  ))}
                </div>
              </section>

              {/* Product Types */}
              <section>
                <h3 className="text-sm font-black text-current uppercase tracking-widest mb-5">Categories</h3>
                <div className="grid grid-cols-1 gap-1.5">
                  {TYPES.map(type => (
                    <button
                      key={type}
                      onClick={() => setFilter('type', type)}
                      className={`w-full text-left px-4 py-3 rounded-xl text-sm font-bold flex items-center justify-between group transition-all border ${
                        filters.type === type 
                        ? 'bg-indigo-600/10 text-indigo-500 border-indigo-500/20' 
                        : 'text-slate-500 border-transparent hover:bg-black/5 dark:hover:bg-white/5'
                      }`}
                    >
                      {type}
                      <ChevronRight className={`w-4 h-4 transition-transform ${filters.type === type ? 'rotate-90 text-indigo-500' : 'text-slate-700 group-hover:translate-x-1'}`} />
                    </button>
                  ))}
                </div>
              </section>

              {/* Price Ranges */}
              <section>
                <h3 className="text-sm font-black text-current uppercase tracking-widest mb-5">Budget</h3>
                <div className="space-y-4">
                  {PRICE_RANGES.map((range, idx) => (
                    <label key={range.label} className="flex items-center gap-4 cursor-pointer group">
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
                        <div className="w-5 h-5 border-2 border-slate-300 dark:border-slate-700 rounded-lg peer-checked:border-indigo-500 peer-checked:bg-indigo-500 transition-all flex items-center justify-center after:content-[''] after:w-2 after:h-2 after:bg-white after:rounded-sm after:scale-0 peer-checked:after:rotate-45 peer-checked:after:scale-100 after:transition-transform"></div>
                      </div>
                      <span className="text-sm font-bold text-slate-500 group-hover:text-current transition-colors">{range.label}</span>
                    </label>
                  ))}
                </div>
              </section>

              {/* Sizes */}
              <section>
                <h3 className="text-sm font-black text-current uppercase tracking-widest mb-5">Available Sizes</h3>
                <div className="grid grid-cols-4 gap-2.5">
                  {SIZES.filter(s => s !== "All").map(size => (
                    <button
                      key={size}
                      onClick={() => handleToggleSize(size)}
                      className={`py-3 rounded-xl border text-[11px] font-black tracking-tighter transition-all ${
                        filters.sizes.includes(size)
                        ? 'border-indigo-500 bg-indigo-500/10 text-indigo-500'
                        : 'border-black/5 dark:border-white/5 bg-black/5 dark:bg-white/5 text-slate-500 hover:border-indigo-500/50'
                      }`}
                    >
                      {size}
                    </button>
                  ))}
                </div>
              </section>

              {/* Ratings */}
              <section>
                <h3 className="text-sm font-black text-current uppercase tracking-widest mb-5">Customer Rating</h3>
                <div className="space-y-3">
                  {[4, 3, 2].map(rating => (
                    <button
                      key={rating}
                      onClick={() => setFilter('rating', rating)}
                      className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all border ${
                        filters.rating === rating ? 'bg-amber-400/10 border-amber-400/20' : 'border-transparent hover:bg-black/5 dark:hover:bg-white/5'
                      }`}
                    >
                       <div className="flex text-amber-500">
                        {[...Array(5)].map((_, i) => (
                          <Star key={i} className={`w-4 h-4 ${i < rating ? 'fill-current' : 'text-slate-300 dark:text-slate-700'}`} />
                        ))}
                       </div>
                       <span className="text-xs font-black text-slate-500 uppercase tracking-widest">& Up</span>
                    </button>
                  ))}
                </div>
              </section>
            </div>

            <div className="p-8 border-t dark:border-white/5 bg-white dark:bg-slate-900">
              <button 
                onClick={resetFilters}
                className="w-full py-4 text-xs font-black uppercase tracking-[0.2em] text-slate-500 border-2 border-dashed border-slate-300 dark:border-slate-700 rounded-2xl hover:bg-indigo-600 hover:text-white hover:border-indigo-600 transition-all active:scale-[0.98]"
              >
                Reset All Parameters
              </button>
            </div>
          </motion.aside>
        </>
      )}
    </AnimatePresence>
  );
};

export default Sidebar;
