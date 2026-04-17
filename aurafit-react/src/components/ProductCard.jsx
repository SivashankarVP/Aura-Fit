import React from 'react';
import { Star, Heart, ShoppingCart, Info, Sparkles } from 'lucide-react';
import useStore from '../store/useStore';
import { motion } from 'framer-motion';

const ProductCard = ({ product }) => {
  const { addToCart, toggleWishlist, isWishlisted, aiResult, setSelectedProduct } = useStore();

  const isAIMatch = aiResult && product.skinTone.includes(aiResult.season);

  return (
    <motion.div 
      layout
      initial={{ opacity: 0, y: 30 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, scale: 0.9 }}
      transition={{ duration: 0.5 }}
      className="glass-card group overflow-hidden flex flex-col h-full"
    >
      <div className="relative aspect-[4/5] overflow-hidden">
        {/* Main Image */}
        <img 
          src={product.image} 
          alt={product.name}
          className="w-full h-full object-cover transition-transform duration-1000 cubic-bezier(0.19, 1, 0.22, 1) group-hover:scale-110"
        />
        
        {/* Overlay for depth */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />

        {/* Badges */}
        <div className="absolute top-4 left-4 flex flex-col gap-2 z-20">
          {product.badge && (
            <span className={`px-3 py-1 rounded-lg text-[9px] font-black uppercase tracking-[0.15em] shadow-lg ${
              product.badge === 'Sale' ? 'bg-rose-500 text-white' : 
              product.badge === 'New' ? 'bg-indigo-600 text-white' : 'bg-emerald-500 text-white'
            }`}>
              {product.badge}
            </span>
          )}
          {isAIMatch && (
            <span className="badge-ai flex items-center gap-1.5 animate-pulse">
                <Sparkles className="w-3 h-3 fill-current" />
                AI Perfect Match
            </span>
          )}
          {product.discount && (
            <span className="bg-amber-400 text-black px-3 py-1 rounded-lg text-[9px] font-black uppercase tracking-widest shadow-lg">
              -{product.discount}%
            </span>
          )}
        </div>

        {/* Floating Action Buttons */}
        <div className="absolute top-4 right-4 flex flex-col gap-3 z-20 translate-x-16 group-hover:translate-x-0 transition-transform duration-500 ease-out">
          <button 
            onClick={() => toggleWishlist(product)}
            className={`w-11 h-11 rounded-2xl glass flex items-center justify-center transition-all duration-300 hover:scale-110 active:scale-90 ${isWishlisted(product.id) ? 'text-rose-500 bg-white/20' : 'text-white'}`}
          >
            <Heart className={`w-5 h-5 ${isWishlisted(product.id) ? 'fill-current' : ''}`} />
          </button>
          <button 
            onClick={() => setSelectedProduct(product)}
            className="w-11 h-11 rounded-2xl glass flex items-center justify-center text-white transition-all duration-300 hover:scale-110 active:scale-90"
          >
            <Info className="w-5 h-5" />
          </button>
        </div>

        {/* Express Purchase Interaction */}
        <div className="absolute inset-x-6 bottom-6 translate-y-[120%] group-hover:translate-y-0 transition-transform duration-500 ease-out z-20">
          <button 
            onClick={() => addToCart(product, product.sizes[0])}
            className="w-full bg-white text-slate-900 py-4 rounded-2xl flex items-center justify-center gap-3 text-[10px] font-black uppercase tracking-[0.1em] shadow-2xl hover:bg-slate-100 transition-colors"
          >
            <ShoppingCart className="w-4 h-4 fill-current" />
            Express Purchase
          </button>
        </div>
      </div>

      <div className="p-8 flex-1 flex flex-col">
        <div className="flex justify-between items-start mb-3">
          <p className="text-[10px] text-indigo-500 font-extrabold uppercase tracking-[0.2em]">{product.brand}</p>
          <div className="flex items-center gap-1 bg-amber-400/10 px-2 py-0.5 rounded-full">
            <Star className="w-3 h-3 text-amber-500 fill-current" />
            <span className="text-[10px] font-black text-amber-600">{product.rating}</span>
          </div>
        </div>
        
        <h4 className="text-lg font-bold text-current mb-4 leading-tight group-hover:text-indigo-500 transition-colors">
            {product.name}
        </h4>
        
        <div className="mt-auto flex items-end justify-between">
          <div className="flex items-end gap-3">
            <span className="text-2xl font-black text-current">₹{product.price}</span>
            {product.originalPrice && (
              <span className="text-sm text-slate-400 line-through font-medium mb-1">₹{product.originalPrice}</span>
            )}
          </div>
          <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest bg-slate-400/5 px-2 py-1 rounded-md">
            {product.type}
          </p>
        </div>
      </div>
    </motion.div>
  );
};

export default ProductCard;
