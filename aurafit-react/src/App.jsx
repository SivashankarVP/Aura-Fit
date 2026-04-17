import React, { useState } from 'react';
import { Sparkles, ArrowRight, ShieldCheck, Zap, BarChart3 } from 'lucide-react';
import Navbar from './components/Navbar';
import Sidebar from './components/Sidebar';
import ProductGrid from './components/ProductGrid';
import CartDrawer from './components/CartDrawer';
import VirtualStylist from './components/VirtualStylist';
import useStore from './store/useStore';
import { motion } from 'framer-motion';

function App() {
  const [stylistOpen, setStylistOpen] = useState(false);
  const { aiResult } = useStore();

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      <CartDrawer />
      
      {stylistOpen && <VirtualStylist onClose={() => setStylistOpen(false)} />}

      <main className="flex-1 container py-8 pb-20">
        <div className="flex gap-10">
          {/* Main Sidebar */}
          <Sidebar />

          {/* Main Content */}
          <div className="flex-1 flex flex-col gap-12">
            
            {/* Hero Section */}
            {!aiResult && (
              <section className="relative rounded-[3rem] overflow-hidden p-12 bg-gradient-to-br from-indigo-900 via-slate-900 to-purple-900 border border-white/5 shadow-2xl">
                <div className="absolute top-0 right-0 w-1/2 h-full opacity-20 pointer-events-none">
                  <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_50%,rgba(99,102,241,0.5),transparent_70%)]" />
                </div>
                
                <div className="max-w-2xl relative z-10">
                  <motion.div 
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    className="inline-flex items-center gap-2 px-4 py-1 rounded-full bg-white/10 border border-white/10 text-indigo-300 text-xs font-bold uppercase tracking-widest mb-6"
                  >
                    <Sparkles className="w-3.5 h-3.5" />
                    Revolutionizing Retail
                  </motion.div>
                  <h1 className="text-5xl md:text-6xl font-black text-white leading-tight mb-6">
                    Style that fits your <span className="text-indigo-400">Aura</span>.
                  </h1>
                  <p className="text-xl text-slate-300 mb-8 font-light leading-relaxed">
                    AuraFit AI uses real-time body topology and color theory to find clothes that aren't just your size, but your style.
                  </p>
                  
                  <div className="flex items-center gap-4">
                    <button 
                      onClick={() => setStylistOpen(true)}
                      className="btn-primary py-4 px-8 text-lg rounded-2xl group animate-glow"
                    >
                      Virtual Try-On 
                      <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                    </button>
                    <button className="px-8 py-4 rounded-2xl border border-white/10 hover:bg-white/5 transition-all font-semibold">
                      Shop New Arrivals
                    </button>
                  </div>
                </div>
              </section>
            )}

            {/* AI Results Header */}
            {aiResult && (
              <motion.section 
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
                className="p-8 glass rounded-[2rem] border-l-4 border-l-indigo-500 flex flex-col md:flex-row items-center justify-between gap-6"
              >
                <div>
                  <h2 className="text-2xl font-bold flex items-center gap-3">
                    <Sparkles className="w-6 h-6 text-indigo-400" />
                    Your AI Profile Active
                  </h2>
                  <p className="text-slate-400 text-sm mt-1">
                    Matching styles for <span className="text-indigo-300 font-bold">{aiResult.season}</span> palette & <span className="text-indigo-300 font-bold">{aiResult.size}</span> fit.
                  </p>
                </div>
                <div className="flex gap-3">
                  <button 
                    onClick={() => setStylistOpen(true)}
                    className="px-6 py-2 rounded-xl border border-white/10 hover:bg-white/5 text-sm font-bold transition-all"
                  >
                    Rescan
                  </button>
                  <button 
                    onClick={() => useStore.getState().setAIResult(null)}
                    className="px-6 py-2 rounded-xl bg-white/5 hover:bg-white/10 text-sm font-bold text-slate-400 transition-all"
                  >
                    Disable AI
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
