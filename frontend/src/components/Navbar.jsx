import React, { useContext, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { ShoppingBag, Heart, User, Search, LogOut, LayoutDashboard, Sparkles } from 'lucide-react';
import { AuthContext } from '../context/AuthContext';
import { CartContext } from '../context/CartContext';

const Navbar = () => {
  const { user, logout } = useContext(AuthContext);
  const { cart } = useContext(CartContext);
  const [query, setQuery] = useState('');
  const navigate = useNavigate();

  const handleSearch = (e) => {
    e.preventDefault();
    if (query.trim()) {
      navigate(`/products?search=${encodeURIComponent(query)}`);
    }
  };

  return (
    <header className="sticky top-0 z-40 bg-white/90 backdrop-blur-md border-b border-slate-100 shadow-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between gap-4">
        {/* Brand Logo */}
        <Link to="/" className="flex items-center gap-2 font-extrabold text-xl tracking-tight text-slate-900">
          <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-sky-500 to-indigo-600 flex items-center justify-center text-white shadow-md shadow-sky-500/20">
            <Sparkles className="w-5 h-5" />
          </div>
          <span>Aura<span className="text-sky-500">Store</span></span>
        </Link>

        {/* Search Bar */}
        <form onSubmit={handleSearch} className="flex-1 max-w-md hidden md:block">
          <div className="relative">
            <input
              type="text"
              placeholder="Search products, brands & categories..."
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              className="w-full bg-slate-100/80 hover:bg-slate-100 focus:bg-white text-slate-800 text-sm pl-10 pr-4 py-2.5 rounded-full border border-transparent focus:border-sky-500 focus:outline-none transition-all"
            />
            <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-3" />
          </div>
        </form>

        {/* Actions */}
        <div className="flex items-center gap-5 text-slate-600">
          <Link to="/products" className="text-sm font-medium hover:text-sky-600 transition-colors hidden sm:inline">
            Catalog
          </Link>

          {user && (
            <Link to="/wishlist" className="relative hover:text-sky-600 transition-colors">
              <Heart className="w-5 h-5" />
            </Link>
          )}

          <Link to="/cart" className="relative hover:text-sky-600 transition-colors">
            <ShoppingBag className="w-5 h-5" />
            {cart && cart.total_items > 0 && (
              <span className="absolute -top-2 -right-2 bg-sky-500 text-white font-bold text-[10px] w-4 h-4 rounded-full flex items-center justify-center">
                {cart.total_items}
              </span>
            )}
          </Link>

          {user ? (
            <div className="flex items-center gap-3 border-l border-slate-200 pl-4">
              {user.role === 'SELLER' && (
                <Link to="/seller-dashboard" className="text-xs font-semibold bg-sky-50 text-sky-600 px-3 py-1.5 rounded-lg flex items-center gap-1 hover:bg-sky-100">
                  <LayoutDashboard className="w-3.5 h-3.5" /> Seller Hub
                </Link>
              )}
              {user.role === 'ADMIN' && (
                <Link to="/admin-dashboard" className="text-xs font-semibold bg-indigo-50 text-indigo-600 px-3 py-1.5 rounded-lg flex items-center gap-1 hover:bg-indigo-100">
                  <LayoutDashboard className="w-3.5 h-3.5" /> Admin Panel
                </Link>
              )}
              <Link to="/profile" className="flex items-center gap-1.5 text-sm font-semibold text-slate-800 hover:text-sky-600">
                <User className="w-4 h-4" /> {user.first_name || 'Account'}
              </Link>
              <button onClick={logout} title="Log Out" className="hover:text-red-500 transition-colors">
                <LogOut className="w-4 h-4" />
              </button>
            </div>
          ) : (
            <div className="flex items-center gap-2">
              <Link to="/login" className="text-sm font-semibold px-4 py-2 hover:text-sky-600">
                Log In
              </Link>
              <Link to="/register" className="text-sm font-semibold bg-sky-500 hover:bg-sky-600 text-white px-4 py-2 rounded-xl transition-all shadow-md shadow-sky-500/20">
                Sign Up
              </Link>
            </div>
          )}
        </div>
      </div>
    </header>
  );
};

export default Navbar;
