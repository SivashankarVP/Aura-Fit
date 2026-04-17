import React from 'react';
import { ShoppingBag, Heart, User, Search, Menu } from 'lucide-react';
import useStore from '../store/useStore';

const Navbar = () => {
  const { cartCount, setCartOpen, setSidebarOpen } = useStore();

  return (
    <nav className="glass sticky top-0 z-50 py-4 px-6 mb-8 border-b border-white/5">
      <div className="max-w-[1600px] mx-auto flex items-center justify-between">
        <div className="flex items-center gap-4">
          <button 
            onClick={() => setSidebarOpen(true)}
            className="lg:hidden p-2 hover:bg-white/10 rounded-full transition-colors"
          >
            <Menu className="w-6 h-6" />
          </button>
          <div className="text-3xl font-black bg-gradient-to-r from-blue-400 to-purple-500 bg-clip-text text-transparent tracking-tighter cursor-pointer">
            AURAFIT<span className="text-white ml-1">AI</span>
          </div>
        </div>

        <div className="hidden md:flex flex-1 max-w-xl mx-8 relative">
          <input 
            type="text" 
            placeholder="Search for styles, colors, collections..." 
            className="w-full bg-white/5 border border-white/10 rounded-full py-2.5 px-6 pl-12 focus:outline-none focus:border-indigo-500 transition-all font-light"
          />
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
        </div>

        <div className="flex items-center gap-2 md:gap-5">
          <button className="hidden sm:flex items-center gap-2 px-4 py-2 hover:bg-white/5 rounded-lg transition-colors text-sm font-medium">
            <User className="w-5 h-5" />
            <span>Account</span>
          </button>
          <button className="p-2 hover:bg-white/5 rounded-full relative">
            <Heart className="w-6 h-6" />
          </button>
          <button 
            onClick={() => setCartOpen(true)}
            className="flex items-center gap-2 px-5 py-2.5 bg-indigo-600 hover:bg-indigo-700 rounded-full transition-all shadow-lg shadow-indigo-500/20 active:scale-95 group"
          >
            <ShoppingBag className="w-5 h-5 group-hover:-translate-y-0.5 transition-transform" />
            <span className="font-semibold text-sm">{cartCount}</span>
          </button>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
