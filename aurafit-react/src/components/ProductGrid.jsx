import React, { useMemo } from 'react';
import { AnimatePresence } from 'framer-motion';
import ProductCard from './ProductCard';
import useStore from '../store/useStore';
import { PRODUCTS } from '../data/products';

const ProductGrid = () => {
  const { filters } = useStore();

  const filteredProducts = useMemo(() => {
    return PRODUCTS.filter(product => {
      // Seasonal Filter
      if (filters.season !== 'All' && !product.season.includes(filters.season)) return false;

      // Type Filter
      if (filters.type !== 'All' && product.type !== filters.type) return false;

      // Price Filter
      if (product.price < filters.priceRange.min || product.price > filters.priceRange.max) return false;

      // Special Filter (e.g., Best Sellers)
      if (filters.special.length > 0) {
        if (!filters.special.some(tag => product.tags?.includes(tag))) return false;
      }

      // Size Filter
      if (filters.sizes.length > 0) {
        if (!filters.sizes.some(size => product.sizes.includes(size))) return false;
      }

      // Rating Filter
      if (filters.rating > 0 && product.rating < filters.rating) return false;

      return true;
    });
  }, [filters]);

  return (
    <div className="flex-1">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-3xl font-extrabold text-white mb-1">Explore Collections</h1>
          <p className="text-slate-400 text-sm">{filteredProducts.length} premium styles found</p>
        </div>
        
        <div className="flex items-center gap-4">
          <select className="bg-white/5 border border-white/10 rounded-lg px-4 py-2 text-sm focus:outline-none focus:border-indigo-500 cursor-pointer">
            <option className="bg-slate-900">Recommended</option>
            <option className="bg-slate-900">Price: Low to High</option>
            <option className="bg-slate-900">Price: High to Low</option>
            <option className="bg-slate-900">Popularity</option>
          </select>
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        <AnimatePresence>
          {filteredProducts.map(product => (
            <ProductCard key={product.id} product={product} />
          ))}
        </AnimatePresence>
      </div>

      {filteredProducts.length === 0 && (
        <div className="text-center py-24 glass rounded-3xl mt-12">
          <div className="w-16 h-16 bg-white/5 rounded-full flex items-center justify-center mx-auto mb-4">
            <span className="text-2xl">🔍</span>
          </div>
          <h3 className="text-xl font-bold text-white mb-2">No styles found</h3>
          <p className="text-slate-400">Try adjusting your filters or search terms.</p>
          <button 
            onClick={() => useStore.getState().resetFilters()}
            className="mt-6 text-indigo-400 font-semibold hover:underline"
          >
            Reset all filters
          </button>
        </div>
      )}
    </div>
  );
};

export default ProductGrid;
