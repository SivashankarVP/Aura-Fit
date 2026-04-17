import React from 'react';
import { Star, Heart, ShoppingCart, Info } from 'lucide-react';
import useStore from '../store/useStore';
import { motion } from 'framer-motion';

const ProductCard = ({ product }) => {
  const { addToCart, toggleWishlist, isWishlisted, aiResult, setSelectedProduct } = useStore();

  const isAIMatch = aiResult && product.skinTone.includes(aiResult.season);

  return (
    <motion.div 
      layout
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, scale: 0.9 }}
      className="glass-card group overflow-hidden"
    >
      <div className="relative aspect-[4/5] overflow-hidden">
        <img 
          src={product.image} 
          alt={product.name}
          className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
        />
        
        {/* Badges */}
        <div className="absolute top-3 left-3 flex flex-col gap-2">
          {product.badge && (
            <span className={`px-2.5 py-1 rounded-md text-[10px] font-bold uppercase tracking-wider ${
              product.badge === 'Sale' ? 'bg-red-500' : 
              product.badge === 'New' ? 'bg-blue-500' : 'bg-green-500'
            }`}>
              {product.badge}
            </span>
          )}
          {isAIMatch && (
            <span className="badge-ai text-[10px]">✨ AI Choice</span>
          )}
          {product.discount && (
            <span className="bg-amber-500 text-slate-900 px-2.5 py-1 rounded-md text-[10px] font-bold">
              -{product.discount}%
            </span>
          )}
        </div>

        {/* Action Buttons */}
        <div className="absolute top-3 right-3 flex flex-col gap-2 translate-x-12 group-hover:translate-x-0 transition-transform duration-300">
          <button 
            onClick={() => toggleWishlist(product)}
            className={`p-2.5 rounded-full glass hover:bg-white/20 transition-all ${isWishlisted(product.id) ? 'text-rose-500 fill-rose-500' : 'text-white'}`}
          >
            <Heart className="w-5 h-5" />
          </button>
          <button 
            onClick={() => setSelectedProduct(product)}
            className="p-2.5 rounded-full glass hover:bg-white/20 text-white transition-all"
          >
            <Info className="w-5 h-5" />
          </button>
        </div>

        {/* Quick Add Button */}
        <div className="absolute inset-x-0 bottom-0 p-4 translate-y-full group-hover:translate-y-0 transition-transform duration-300">
          <button 
            onClick={() => addToCart(product, product.sizes[0])}
            className="w-full btn-primary py-2.5 !rounded-lg justify-center text-xs"
          >
            <ShoppingCart className="w-4 h-4" />
            Add to Bag
          </button>
        </div>
      </div>

      <div className="p-4">
        <div className="flex justify-between items-start mb-1">
          <p className="text-[10px] text-indigo-400 font-bold uppercase tracking-widest">{product.brand}</p>
          <div className="flex items-center gap-1 text-amber-400">
            <Star className="w-3.5 h-3.5 fill-current" />
            <span className="text-xs font-medium text-slate-300">{product.rating}</span>
          </div>
        </div>
        <h4 className="font-semibold text-slate-100 mb-2 truncate group-hover:text-indigo-400 transition-colors">{product.name}</h4>
        
        <div className="flex items-end gap-2">
          <span className="text-lg font-bold text-white">₹{product.price}</span>
          {product.originalPrice && (
            <span className="text-xs text-slate-500 line-through mb-0.5">₹{product.originalPrice}</span>
          )}
        </div>
      </div>
    </motion.div>
  );
};

export default ProductCard;
