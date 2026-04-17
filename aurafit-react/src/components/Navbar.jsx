import React from 'react';
import { ShoppingBag, Heart, User, Search, Menu, Sun, Moon, Sparkles } from 'lucide-react';
import useStore from '../store/useStore';
import { motion } from 'framer-motion';

const Navbar = () => {
  const { cartCount, setCartOpen, setSidebarOpen, darkMode, toggleDarkMode, setFilter, filters } = useStore();

  const categories = ["All", "Spring Lookbook", "Summer Wear", "Formal", "Casual", "Accessories"];

  return (
    <>
      <nav className="glass sticky top-0 z-[60] py-5 px-6 md:px-12 border-b">
        <div className="max-w-[1800px] mx-auto flex items-center justify-between gap-8">
          {/* Left: Brand & Menu */}
          <div className="flex items-center gap-6">
            <button 
              onClick={() => setSidebarOpen(true)}
              className="p-3 bg-white/5 hover:bg-white/10 rounded-2xl transition-all border border-white/5 active:scale-90 group"
            >
              <Menu className="w-5 h-5 group-hover:text-indigo-500 transition-colors" />
            </button>
            <div className="flex items-center gap-2 cursor-pointer group">
                <div className="w-10 h-10 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-xl flex items-center justify-center shadow-lg group-hover:rotate-[10deg] transition-transform">
                    <Sparkles className="w-6 h-6 text-white" />
                </div>
                <div className="text-2xl font-black text-white tracking-[-0.05em]">
                    AURAFIT<span className="text-indigo-500">AI</span>
                </div>
            </div>
          </div>

          {/* Center: Universal Search */}
          <div className="hidden lg:flex flex-1 max-w-xl relative group">
            <Search className="absolute left-5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500 group-focus-within:text-indigo-500 transition-colors" />
            <input 
              type="text" 
              placeholder="Search AI curated collections..." 
              className="w-full bg-white/5 border border-white/5 focus:border-indigo-500/40 rounded-2xl py-3.5 px-14 focus:outline-none transition-all font-semibold text-sm placeholder:text-slate-600 focus:bg-white/10"
            />
          </div>

          {/* Right: Actions */}
          <div className="flex items-center gap-2 md:gap-4">
            <button 
              onClick={toggleDarkMode}
              className="w-12 h-12 flex items-center justify-center bg-white/5 hover:bg-white/10 rounded-2xl border border-white/5 transition-all text-slate-400"
            >
              {darkMode ? <Sun className="w-5 h-5 text-amber-400" /> : <Moon className="w-5 h-5 text-indigo-600" />}
            </button>

            <button 
              onClick={() => setCartOpen(true)}
              className="flex items-center gap-3 px-6 h-12 bg-white text-slate-900 rounded-2xl font-black text-xs uppercase tracking-widest hover:bg-slate-100 transition-all shadow-xl shadow-white/5 active:scale-95"
            >
              <div className="relative">
                <ShoppingBag className="w-4 h-4" />
                {cartCount > 0 && (
                    <motion.span 
                        initial={{ scale: 0 }}
                        animate={{ scale: 1 }}
                        className="absolute -top-2 -right-2 w-4 h-4 bg-indigo-600 text-white rounded-full text-[9px] flex items-center justify-center border-2 border-white"
                    >
                        {cartCount}
                    </motion.span>
                )}
              </div>
              Cart
            </button>
          </div>
        </div>
      </nav>
      
      {/* Dynamic Category Bar */}
      <div className="bg-[#030712] border-b border-white/5 py-4 overflow-x-auto custom-scrollbar">
        <div className="container flex items-center gap-10 whitespace-nowrap">
          {categories.map(cat => (
              <button 
                key={cat} 
                onClick={() => setFilter('season', cat)}
                className={`text-[10px] font-black uppercase tracking-[0.2em] transition-all relative py-1 ${filters.season === cat ? 'text-indigo-400' : 'text-slate-500 hover:text-white'}`}
              >
                {cat}
                {filters.season === cat && (
                    <motion.div 
                        layoutId="nav-line"
                        className="absolute -bottom-1 left-0 right-0 h-0.5 bg-indigo-500 rounded-full"
                    />
                )}
              </button>
          ))}
          <div className="h-4 w-px bg-white/10" />
          <button className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-500 hover:text-emerald-400 transition-all flex items-center gap-2">
            <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
            Live Drops
          </button>
        </div>
      </div>
    </>
  );
};

export default Navbar;
