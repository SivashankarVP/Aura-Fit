import React from 'react';
import { ShoppingBag, Heart, User, Search, Menu, Sun, Moon } from 'lucide-react';
import useStore from '../store/useStore';

const Navbar = () => {
  const { cartCount, setCartOpen, setSidebarOpen, darkMode, toggleDarkMode } = useStore();

  const categories = ["Best Sellers", "New Releases", "Spring Lookbook", "Men", "Women", "Accessories", "Tech Wear", "Sustainability"];

  return (
    <>
      <nav className="glass sticky top-0 z-50 py-4 px-6 md:px-10 border-b">
        <div className="max-w-[1700px] mx-auto flex items-center justify-between gap-4 md:gap-8">
          <div className="flex items-center gap-3">
            <button 
              onClick={() => setSidebarOpen(true)}
              className="flex items-center gap-2 p-2 px-3 hover:bg-black/5 dark:hover:bg-white/5 rounded-xl transition-all border border-transparent hover:border-indigo-500/20 group"
            >
              <Menu className="w-6 h-6 group-hover:text-indigo-500 transition-colors" />
              <span className="hidden sm:block text-sm font-black uppercase tracking-widest text-slate-500 group-hover:text-indigo-500 transition-colors">All Filters</span>
            </button>
            <div className="text-2xl md:text-3xl font-black bg-gradient-to-r from-indigo-500 to-purple-600 bg-clip-text text-transparent tracking-tighter cursor-pointer ml-4">
              AURAFIT<span className="text-current ml-px">AI</span>
            </div>
          </div>

          <div className="hidden lg:flex flex-1 max-w-2xl relative">
            <input 
              type="text" 
              placeholder="Search collections..." 
              className="w-full bg-black/5 dark:bg-white/5 border border-transparent focus:border-indigo-500/50 rounded-2xl py-3 px-12 focus:outline-none transition-all font-medium text-sm"
            />
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
          </div>

          <div className="flex items-center gap-1 md:gap-4">
            <button 
              onClick={toggleDarkMode}
              className="p-2.5 hover:bg-black/5 dark:hover:bg-white/5 rounded-xl transition-all"
            >
              {darkMode ? <Sun className="w-5 h-5 text-amber-400" /> : <Moon className="w-5 h-5 text-indigo-600" />}
            </button>
            
            <button className="hidden sm:p-2.5 hover:bg-black/5 dark:hover:bg-white/5 rounded-xl transition-colors">
              <Heart className="w-5 h-5" />
            </button>

            <button 
              onClick={() => setCartOpen(true)}
              className="flex items-center gap-2 px-4 md:px-6 py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white rounded-2xl transition-all shadow-lg shadow-indigo-500/20 active:scale-95 group font-bold"
            >
              <div className="relative">
                <ShoppingBag className="w-5 h-5 group-hover:-translate-y-0.5 transition-transform" />
                {cartCount > 0 && (
                    <span className="absolute -top-1.5 -right-1.5 w-4 h-4 bg-rose-500 rounded-full text-[10px] flex items-center justify-center border-2 border-indigo-600 animate-in fade-in zoom-in">{cartCount}</span>
                )}
              </div>
              <span className="hidden md:block text-sm">Cart</span>
            </button>
          </div>
        </div>
      </nav>
      
      {/* Category Bar */}
      <div className="bg-slate-100 dark:bg-slate-900/50 border-b dark:border-white/5 py-2 overflow-x-auto custom-scrollbar whitespace-nowrap px-6 md:px-10 flex gap-6 md:gap-10">
        {categories.map(cat => (
            <button key={cat} className="text-[11px] font-black uppercase tracking-widest text-slate-500 hover:text-indigo-500 transition-colors py-1">
                {cat}
            </button>
        ))}
      </div>
    </>
  );
};

export default Navbar;
