import React from 'react';
import { X, ShoppingBag, Trash2, Plus, Minus, ArrowRight } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import useStore from '../store/useStore';

const CartDrawer = () => {
  const { cart, cartOpen, setCartOpen, removeFromCart, updateQty, cartTotal } = useStore();

  return (
    <AnimatePresence>
      {cartOpen && (
        <>
          {/* Backdrop */}
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setCartOpen(false)}
            className="fixed inset-0 bg-black/60 backdrop-blur-sm z-[100]"
          />

          {/* Drawer */}
          <motion.div 
            initial={{ x: '100%' }}
            animate={{ x: 0 }}
            exit={{ x: '100%' }}
            transition={{ type: 'spring', damping: 25, stiffness: 200 }}
            className="fixed top-0 right-0 h-full w-full max-w-md bg-slate-900 shadow-2xl z-[101] flex flex-col"
          >
            <div className="p-6 border-b border-white/5 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <ShoppingBag className="w-6 h-6 text-indigo-500" />
                <h2 className="text-xl font-bold">Shopping Bag</h2>
              </div>
              <button 
                onClick={() => setCartOpen(false)}
                className="p-2 hover:bg-white/5 rounded-full transition-colors"
              >
                <X className="w-6 h-6" />
              </button>
            </div>

            <div className="flex-1 overflow-y-auto p-6 space-y-6">
              {cart.length === 0 ? (
                <div className="h-full flex flex-col items-center justify-center text-center">
                  <div className="w-20 h-20 bg-white/5 rounded-full flex items-center justify-center mb-4">
                    <ShoppingBag className="w-10 h-10 text-slate-600" />
                  </div>
                  <h3 className="text-lg font-bold mb-1">Your bag is empty</h3>
                  <p className="text-slate-500 text-sm mb-6">Looks like you haven't added anything yet.</p>
                  <button 
                    onClick={() => setCartOpen(false)}
                    className="btn-primary"
                  >
                    Start Shopping
                  </button>
                </div>
              ) : (
                cart.map(item => (
                  <div key={`${item.id}-${item.size}`} className="flex gap-4 group">
                    <div className="w-20 h-24 rounded-lg overflow-hidden flex-shrink-0 border border-white/5">
                      <img src={item.image} alt={item.name} className="w-full h-full object-cover" />
                    </div>
                    <div className="flex-1 flex flex-col">
                      <div className="flex justify-between mb-1">
                        <h4 className="font-semibold text-sm line-clamp-1">{item.name}</h4>
                        <button 
                          onClick={() => removeFromCart(item.id, item.size)}
                          className="p-1 text-slate-500 hover:text-rose-500 transition-colors"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                      <p className="text-xs text-slate-500 mb-3">Size: <span className="text-indigo-400 font-bold">{item.size}</span></p>
                      
                      <div className="flex justify-between items-center mt-auto">
                        <div className="flex items-center gap-3 bg-white/5 rounded-lg px-2 py-1">
                          <button 
                            onClick={() => updateQty(item.id, item.size, item.qty - 1)}
                            className="p-1 hover:text-white text-slate-400 transition-colors"
                          >
                            <Minus className="w-3 h-3" />
                          </button>
                          <span className="text-sm font-medium w-4 text-center">{item.qty}</span>
                          <button 
                            onClick={() => updateQty(item.id, item.size, item.qty + 1)}
                            className="p-1 hover:text-white text-slate-400 transition-colors"
                          >
                            <Plus className="w-3 h-3" />
                          </button>
                        </div>
                        <span className="font-bold text-white">₹{item.price * item.qty}</span>
                      </div>
                    </div>
                  </div>
                ))
              )}
            </div>

            {cart.length > 0 && (
              <div className="p-6 bg-slate-1000 border-t border-white/5 space-y-4">
                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span className="text-slate-400">Subtotal</span>
                    <span>₹{cartTotal}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                     <span className="text-slate-400">Shipping</span>
                     <span className="text-emerald-400 font-medium">FREE</span>
                  </div>
                  <div className="flex justify-between text-lg font-bold border-t border-white/5 pt-3 mt-2">
                    <span>Total</span>
                    <span className="text-indigo-400">₹{cartTotal}</span>
                  </div>
                </div>

                <button 
                  className="w-full btn-primary py-4 rounded-xl flex items-center justify-center gap-2 group shadow-indigo-500/10"
                  onClick={() => alert('Proceeding to secure checkout...')}
                >
                  Checkout Now
                  <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                </button>
                <p className="text-[10px] text-center text-slate-500 flex items-center justify-center gap-1 uppercase tracking-widest">
                  Secure checkout with 256-bit encryption
                </p>
              </div>
            )}
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
};

export default CartDrawer;
