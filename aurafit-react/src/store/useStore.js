import { create } from 'zustand';

const useStore = create((set, get) => ({
  // ---- Cart ----
  cart: [],
  addToCart: (product, size) => {
    const current = get().cart;
    const existing = current.find(i => i.id === product.id && i.size === size);
    if (existing) {
      set({ cart: current.map(i => i.id === product.id && i.size === size ? { ...i, qty: i.qty + 1 } : i) });
    } else {
      set({ cart: [...current, { ...product, size, qty: 1 }] });
    }
  },
  removeFromCart: (id, size) => set({ cart: get().cart.filter(i => !(i.id === id && i.size === size)) }),
  updateQty: (id, size, qty) => {
    if (qty < 1) { get().removeFromCart(id, size); return; }
    set({ cart: get().cart.map(i => i.id === id && i.size === size ? { ...i, qty } : i) });
  },
  clearCart: () => set({ cart: [] }),
  get cartCount() { return get().cart.reduce((s, i) => s + i.qty, 0); },
  get cartTotal() { return get().cart.reduce((s, i) => s + i.price * i.qty, 0); },

  // ---- Wishlist ----
  wishlist: [],
  toggleWishlist: (product) => {
    const wl = get().wishlist;
    if (wl.find(p => p.id === product.id)) {
      set({ wishlist: wl.filter(p => p.id !== product.id) });
    } else {
      set({ wishlist: [...wl, product] });
    }
  },
  isWishlisted: (id) => get().wishlist.some(p => p.id === id),

  // ---- Filters ----
  filters: {
    season: 'All',
    type: 'All',
    priceRange: { min: 0, max: Infinity },
    priceLabelIndex: 0,
    sizes: [],
    special: [],
    rating: 0,
    customMin: '',
    customMax: '',
    colors: [],
  },
  setFilter: (key, value) => set(s => ({ filters: { ...s.filters, [key]: value } })),
  resetFilters: () => set({
    filters: { season: 'All', type: 'All', priceRange: { min: 0, max: Infinity }, priceLabelIndex: 0, sizes: [], special: [], rating: 0, customMin: '', customMax: '', colors: [] }
  }),

  // ---- AI Stylist ----
  aiResult: null,
  setAIResult: (r) => set({ aiResult: r }),

  // ---- UI ----
  view: 'store', // 'store' or 'checkout'
  setView: (v) => set({ view: v }),
  darkMode: true,
  toggleDarkMode: () => set(s => ({ darkMode: !s.darkMode })),
  cartOpen: false,
  setCartOpen: (v) => set({ cartOpen: v }),
  sidebarOpen: false, // Default closed on mobile
  setSidebarOpen: (v) => set({ sidebarOpen: v }),
  selectedProduct: null,
  setSelectedProduct: (p) => set({ selectedProduct: p }),
}));

export default useStore;
