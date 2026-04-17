import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { CreditCard, Truck, ShieldCheck, MapPin, CheckCircle2, ArrowLeft } from 'lucide-react';
import useStore from '../store/useStore';

const Checkout = () => {
    const { cart, cartTotal, setView, clearCart } = useStore();
    const [step, setStep] = useState(1); // 1: Shipping, 2: Payment, 3: Success

    const handlePlaceOrder = () => {
        setStep(3);
        setTimeout(() => {
            clearCart();
        }, 2000);
    };

    if (step === 3) {
        return (
            <motion.div 
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                className="max-w-xl mx-auto py-20 text-center"
            >
                <div className="w-24 h-24 bg-emerald-500/20 rounded-full flex items-center justify-center mx-auto mb-8 border border-emerald-500/20">
                    <CheckCircle2 className="w-12 h-12 text-emerald-500" />
                </div>
                <h2 className="text-4xl font-black mb-4">Order Confirmed!</h2>
                <p className="text-slate-500 mb-10 leading-relaxed">
                    Your AuraFit package is being prepared. We've matched your AI profile with our fulfillment center for optimized shipping.
                </p>
                <button 
                    onClick={() => setView('store')}
                    className="btn-primary py-4 px-10 rounded-2xl"
                >
                    Return to Store
                </button>
            </motion.div>
        );
    }

    return (
        <div className="max-w-6xl mx-auto py-12 px-6">
            <button 
                onClick={() => setView('store')}
                className="flex items-center gap-2 text-slate-500 hover:text-indigo-500 transition-colors mb-10 font-bold uppercase tracking-widest text-xs"
            >
                <ArrowLeft className="w-4 h-4" />
                Back to Shopping
            </button>

            <div className="flex flex-col lg:flex-row gap-16">
                {/* Form Side */}
                <div className="flex-1 space-y-12">
                    <div className="flex gap-4 mb-2">
                        {[1, 2].map(s => (
                            <div key={s} className={`h-1.5 flex-1 rounded-full transition-colors ${step >= s ? 'bg-indigo-600' : 'bg-slate-200 dark:bg-white/5'}`} />
                        ))}
                    </div>

                    {step === 1 ? (
                        <motion.section 
                            initial={{ opacity: 0, x: -20 }}
                            animate={{ opacity: 1, x: 0 }}
                            className="space-y-8"
                        >
                            <div className="flex items-center gap-4">
                                <div className="p-3 bg-indigo-500/10 rounded-2xl">
                                    <MapPin className="w-6 h-6 text-indigo-500" />
                                </div>
                                <h3 className="text-2xl font-black">Shipping Address</h3>
                            </div>

                            <div className="grid grid-cols-2 gap-6">
                                <div className="col-span-2 md:col-span-1 space-y-2">
                                    <label className="text-[10px] font-black uppercase text-slate-500 ml-1">First Name</label>
                                    <input type="text" className="w-full bg-black/5 dark:bg-white/5 border-2 border-transparent focus:border-indigo-500/50 rounded-2xl p-4 focus:outline-none transition-all" placeholder="John" />
                                </div>
                                <div className="col-span-2 md:col-span-1 space-y-2">
                                    <label className="text-[10px] font-black uppercase text-slate-500 ml-1">Last Name</label>
                                    <input type="text" className="w-full bg-black/5 dark:bg-white/5 border-2 border-transparent focus:border-indigo-500/50 rounded-2xl p-4 focus:outline-none transition-all" placeholder="Doe" />
                                </div>
                                <div className="col-span-2 space-y-2">
                                    <label className="text-[10px] font-black uppercase text-slate-500 ml-1">Street Address</label>
                                    <input type="text" className="w-full bg-black/5 dark:bg-white/5 border-2 border-transparent focus:border-indigo-500/50 rounded-2xl p-4 focus:outline-none transition-all" placeholder="123 Luxury Lane" />
                                </div>
                                <div className="col-span-1 space-y-2">
                                    <label className="text-[10px] font-black uppercase text-slate-500 ml-1">City</label>
                                    <input type="text" className="w-full bg-black/5 dark:bg-white/5 border-2 border-transparent focus:border-indigo-500/50 rounded-2xl p-4 focus:outline-none transition-all" placeholder="New York" />
                                </div>
                                <div className="col-span-1 space-y-2">
                                    <label className="text-[10px] font-black uppercase text-slate-500 ml-1">Postal Code</label>
                                    <input type="text" className="w-full bg-black/5 dark:bg-white/5 border-2 border-transparent focus:border-indigo-500/50 rounded-2xl p-4 focus:outline-none transition-all" placeholder="10001" />
                                </div>
                            </div>

                            <button 
                                onClick={() => setStep(2)}
                                className="w-full btn-primary py-5 rounded-2xl justify-center text-lg shadow-xl shadow-indigo-600/20"
                            >
                                Continue to Payment
                                <Truck className="w-5 h-5" />
                            </button>
                        </motion.section>
                    ) : (
                        <motion.section 
                            initial={{ opacity: 0, x: -20 }}
                            animate={{ opacity: 1, x: 0 }}
                            className="space-y-8"
                        >
                            <div className="flex items-center gap-4">
                                <div className="p-3 bg-indigo-500/10 rounded-2xl">
                                    <CreditCard className="w-6 h-6 text-indigo-500" />
                                </div>
                                <h3 className="text-2xl font-black">Payment Method</h3>
                            </div>

                            <div className="p-8 rounded-[2rem] bg-indigo-600 shadow-2xl relative overflow-hidden group">
                                <div className="absolute top-0 right-0 p-8">
                                    <ShieldCheck className="w-10 h-10 text-white/20" />
                                </div>
                                <div className="relative z-10 text-white">
                                    <p className="text-[10px] font-black uppercase tracking-[0.3em] opacity-60 mb-8">Secure AuraPay Card</p>
                                    <p className="text-2xl font-black tracking-widest mb-10">4582 •••• •••• 1024</p>
                                    <div className="flex justify-between items-end">
                                        <div>
                                            <p className="text-[10px] font-black uppercase opacity-60">Card Holder</p>
                                            <p className="font-bold">SIVASHANKAR V P</p>
                                        </div>
                                        <div className="text-right">
                                            <p className="text-[10px] font-black uppercase opacity-60">Expires</p>
                                            <p className="font-bold">12/28</p>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            <div className="space-y-4">
                                <div className="p-5 rounded-2xl bg-black/5 dark:bg-white/5 border-2 border-indigo-500/20 flex items-center justify-between">
                                    <div className="flex items-center gap-4">
                                        <div className="w-10 h-10 bg-white rounded-lg flex items-center justify-center p-1">
                                            <img src="https://upload.wikimedia.org/wikipedia/commons/b/b5/PayPal.svg" alt="PP" className="w-full h-full object-contain" />
                                        </div>
                                        <span className="font-bold">PayPal Express</span>
                                    </div>
                                    <input type="radio" name="pay" className="w-5 h-5 accent-indigo-600" />
                                </div>
                                <div className="p-5 rounded-2xl bg-black/5 dark:bg-white/5 border-2 border-transparent flex items-center justify-between">
                                    <div className="flex items-center gap-4">
                                        <div className="w-10 h-10 bg-black rounded-lg flex items-center justify-center p-1">
                                            <img src="https://upload.wikimedia.org/wikipedia/commons/b/b0/Apple_Pay_logo.svg" alt="AP" className="w-full h-full object-contain invert" />
                                        </div>
                                        <span className="font-bold">Apple Pay</span>
                                    </div>
                                    <input type="radio" name="pay" className="w-5 h-5 accent-indigo-600" />
                                </div>
                            </div>

                            <button 
                                onClick={handlePlaceOrder}
                                className="w-full btn-primary py-5 rounded-2xl justify-center text-lg shadow-xl shadow-indigo-600/20"
                            >
                                Pay ₹{cartTotal}
                                <ShieldCheck className="w-5 h-5" />
                            </button>
                        </motion.section>
                    )}
                </div>

                {/* Sidebar Side */}
                <div className="w-full lg:w-[400px]">
                    <div className="glass-card p-10 sticky top-32">
                        <h4 className="text-sm font-black uppercase tracking-widest mb-8">Order Summary</h4>
                        <div className="space-y-6 mb-8 max-h-[300px] overflow-y-auto custom-scrollbar pr-4">
                            {cart.map(item => (
                                <div key={item.cartId} className="flex gap-4">
                                    <div className="w-16 h-16 rounded-xl bg-black/5 overflow-hidden flex-shrink-0">
                                        <img src={item.image} alt={item.name} className="w-full h-full object-cover" />
                                    </div>
                                    <div className="flex-1 min-w-0">
                                        <p className="font-bold text-sm truncate">{item.name}</p>
                                        <p className="text-[10px] text-slate-500 uppercase font-bold">{item.size} • Qty {item.quantity}</p>
                                        <p className="text-sm font-black mt-1">₹{item.price * item.quantity}</p>
                                    </div>
                                </div>
                            ))}
                        </div>
                        <div className="space-y-3 pt-6 border-t dark:border-white/5">
                            <div className="flex justify-between text-sm text-slate-500">
                                <span>Subtotal</span>
                                <span>₹{cartTotal}</span>
                            </div>
                            <div className="flex justify-between text-sm text-slate-500">
                                <span>Shipping</span>
                                <span className="text-emerald-500 font-bold">FREE</span>
                            </div>
                            <div className="flex justify-between text-xl font-black pt-4 border-t dark:border-white/10 mt-4">
                                <span>Total</span>
                                <span>₹{cartTotal}</span>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Checkout;
