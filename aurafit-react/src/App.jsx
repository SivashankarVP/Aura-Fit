import React, { useState } from 'react';
import { Sparkles, ArrowRight, ShieldCheck, Zap, BarChart3 } from 'lucide-react';
import Navbar from './components/Navbar';
import Sidebar from './components/Sidebar';
import ProductGrid from './components/ProductGrid';
import CartDrawer from './components/CartDrawer';
import VirtualStylist from './components/VirtualStylist';
import useStore from './store/useStore';
import { motion, AnimatePresence } from 'framer-motion';

import Checkout from './components/Checkout';

function App() {
  const [stylistOpen, setStylistOpen] = useState(false);
  const { aiResult, darkMode, sidebarOpen, setSidebarOpen, view } = useStore();

  return (
    <div className={`min-h-screen flex flex-col transition-colors duration-300 ${darkMode ? 'dark' : 'light'}`}>
      <Navbar />
      <CartDrawer />
      
      {stylistOpen && <VirtualStylist onClose={() => setStylistOpen(false)} />}
      <Sidebar />

      <main className="flex-1 container py-6 md:py-10 pb-20">
        {view === 'checkout' ? (
          <Checkout />
        ) : (
          <div className="flex gap-8 lg:gap-12">
            {/* Main Content */}
            <div className="flex-1 flex flex-col gap-12">
              
              {/* Hero Section */}
              {!aiResult && (
                <section className="relative rounded-[4rem] overflow-hidden p-16 md:p-24 bg-[#030712] border border-white/10 shadow-[0_40px_100px_rgba(0,0,0,0.5)]">
                  {/* Immersive Background Decor */}
                  <div className="absolute top-0 right-0 w-3/4 h-full pointer-events-none overflow-hidden">
                    <div className="absolute top-[-20%] right-[-10%] w-[800px] h-[800px] bg-indigo-600/20 blur-[120px] rounded-full" />
                    <div className="absolute bottom-[-20%] right-[20%] w-[600px] h-[600px] bg-purple-600/10 blur-[100px] rounded-full" />
                  </div>
                  
                  <div className="max-w-3xl relative z-10">
                    <motion.div 
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      className="inline-flex items-center gap-3 px-6 py-2 rounded-full bg-white/5 border border-white/10 text-indigo-400 text-xs font-black uppercase tracking-[0.3em] mb-10 shadow-2xl"
                    >
                      <Sparkles className="w-4 h-4" />
                      State of the Art AI Styling
                    </motion.div>
                    <h1 className="text-6xl md:text-8xl font-black text-white leading-[1.05] mb-10 tracking-[-0.04em]">
                      Find your <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-500 via-purple-500 to-rose-500">Perfect Fit</span> instantly.
                    </h1>
                    <p className="text-2xl text-slate-400 mb-12 font-medium leading-relaxed max-w-xl">
                      High-precision body topology matching and seasonal color theory, powered by AuraFit V3.0.
                    </p>
                    
                    <div className="flex flex-wrap items-center gap-6">
                      <button 
                        onClick={() => setStylistOpen(true)}
                        className="btn-primary !px-10 !py-5 !text-lg !rounded-[2rem] group"
                      >
                        <Zap className="w-6 h-6 fill-current group-hover:scale-125 transition-transform" />
                        Start Smart Scan 
                      </button>
                      <button className="px-10 py-5 rounded-[2rem] border-2 border-white/10 hover:bg-white/5 transition-all font-black text-sm uppercase tracking-widest text-slate-300">
                        Explore Collections
                      </button>
                    </div>
                  </div>
                </section>
              )}

            {/* AI Profile Intelligence Banner */}
            {aiResult && (
              <motion.section 
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                className="p-10 glass-card !rounded-[3rem] flex flex-col md:flex-row items-center justify-between gap-10 border-l-8 border-l-indigo-500"
              >
                <div className="flex items-center gap-8">
                  <div className="w-20 h-20 rounded-3xl bg-indigo-500/10 flex items-center justify-center border border-indigo-500/20 shadow-inner">
                    <Sparkles className="w-10 h-10 text-indigo-500" />
                  </div>
                  <div>
                    <h2 className="text-3xl font-black tracking-tight flex items-center gap-3">
                      AI Active: {aiResult.season} Profile
                    </h2>
                    <div className="flex items-center gap-4 mt-2">
                      <span className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-500">Recommended Size</span>
                      <span className="text-sm font-black text-indigo-400 bg-indigo-400/10 px-3 py-1 rounded-lg border border-indigo-400/20">{aiResult.size}</span>
                    </div>
                  </div>
                </div>

                <div className="flex flex-col items-center gap-4">
                  <p className="text-[10px] font-black uppercase text-slate-500 tracking-[0.2em]">Suitable Palette</p>
                  <div className="flex gap-2">
                    {aiResult.suggested.map((c, j) => (
                      <div key={j} className="w-8 h-8 rounded-full border-2 border-white/10 shadow-lg" style={{ backgroundColor: c }} />
                    ))}
                  </div>
                </div>

                <div className="flex gap-4">
                  <button 
                    onClick={() => setStylistOpen(true)}
                    className="px-8 py-3 rounded-2xl bg-white/5 border border-white/10 hover:border-indigo-500 text-xs font-black uppercase tracking-widest transition-all"
                  >
                    Recalibrate
                  </button>
                  <button 
                    onClick={() => useStore.getState().setAIResult(null)}
                    className="px-8 py-3 rounded-2xl bg-rose-500/10 text-rose-500 border border-rose-500/20 text-xs font-black uppercase tracking-widest transition-all"
                  >
                    Clear AI
                  </button>
                </div>
              </motion.section>
            )}

              {/* Stats/Benefits */}
              <section className="grid grid-cols-2 lg:grid-cols-4 gap-6">
                {[
                  { icon: ShieldCheck, label: "Trust Guarantee", sub: "Verified Sellers" },
                  { icon: Zap, label: "Instant Fit", sub: "99.8% Accuracy" },
                  { icon: BarChart3, label: "Smart Analytics", sub: "Personal Trends" },
                  { icon: Sparkles, label: "Daily Drops", sub: "New Styles Daily" }
                ].map((stat, i) => (
                  <div key={i} className="glass-card p-6 border border-white/5 rounded-2xl">
                    <stat.icon className="w-8 h-8 text-indigo-400 mb-4" />
                    <h4 className="font-bold text-white">{stat.label}</h4>
                    <p className="text-xs text-slate-500 mt-1">{stat.sub}</p>
                  </div>
                ))}
              </section>

              {/* Product Display */}
              <ProductGrid />

              {/* How It Works Section */}
              <section className="py-20 border-t border-white/5">
                  <div className="text-center mb-16">
                      <h2 className="text-4xl font-black mb-4">How AuraFit Transforms Your Style</h2>
                      <p className="text-slate-400 max-w-xl mx-auto">Our tri-layer AI logic process ensures you never have to return an item again.</p>
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
                      <div className="text-center group">
                          <div className="w-16 h-16 bg-white/5 rounded-2xl flex items-center justify-center mx-auto mb-6 group-hover:scale-110 transition-transform">
                              <span className="text-2xl">📏</span>
                          </div>
                          <h3 className="text-xl font-bold mb-3">Body Measurements</h3>
                          <p className="text-sm text-slate-400 leading-relaxed">AI analyzes your body proportions in 3D space to determine skeletal landmarks.</p>
                      </div>
                      <div className="text-center group">
                          <div className="w-16 h-16 bg-white/5 rounded-2xl flex items-center justify-center mx-auto mb-6 group-hover:scale-110 transition-transform">
                              <span className="text-2xl">🛍️</span>
                          </div>
                          <h3 className="text-xl font-bold mb-3">Size Recommendation</h3>
                          <p className="text-sm text-slate-400 leading-relaxed">We compare your topology against tens of thousands of fit patterns to find your match.</p>
                      </div>
                      <div className="text-center group">
                          <div className="w-16 h-16 bg-white/5 rounded-2xl flex items-center justify-center mx-auto mb-6 group-hover:scale-110 transition-transform">
                              <span className="text-2xl">🎨</span>
                          </div>
                          <h3 className="text-xl font-bold mb-3">Style Suggestions</h3>
                          <p className="text-sm text-slate-400 leading-relaxed">Colors and silhouettes are customized to your specific skin undertones and height.</p>
                      </div>
                  </div>
              </section>

            </div>
          </div>
        )}
      </main>

      <footer className="glass py-12 mt-auto border-t border-white/5">
        <div className="container text-center text-slate-500 text-sm">
            <p>© 2026 AuraFit AI. A Revolution in Personal Fashion. Design by Antigravity.</p>
        </div>
      </footer>
    </div>
  );
}

export default App;
