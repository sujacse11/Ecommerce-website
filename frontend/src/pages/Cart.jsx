import React, { useContext } from 'react';
import { Link } from 'react-router-dom';
import { Trash2, ShoppingBag, ArrowRight } from 'lucide-react';
import { CartContext } from '../context/CartContext';

const Cart = () => {
  const { cart, updateQuantity, removeItem, clearCart, loading } = useContext(CartContext);

  if (loading) return <div className="p-12 text-center text-slate-500">Loading cart items...</div>;
  if (!cart || cart.items.length === 0) {
    return (
      <div className="bg-white p-16 rounded-3xl text-center space-y-4 max-w-lg mx-auto border border-slate-100">
        <ShoppingBag className="w-16 h-16 text-slate-300 mx-auto" />
        <h2 className="text-2xl font-bold text-slate-900">Your shopping cart is empty</h2>
        <p className="text-slate-500 text-sm">Explore our catalog and find something great!</p>
        <Link to="/products" className="inline-block bg-sky-500 text-white font-bold px-6 py-3 rounded-2xl hover:bg-sky-600">
          Start Shopping
        </Link>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
      <div className="lg:col-span-2 space-y-4">
        <div className="flex justify-between items-center bg-white p-4 rounded-2xl border border-slate-100">
          <h1 className="text-xl font-bold text-slate-900">Shopping Cart ({cart.total_items} items)</h1>
          <button onClick={clearCart} className="text-xs font-semibold text-red-500 hover:underline">
            Clear All
          </button>
        </div>

        <div className="bg-white rounded-3xl border border-slate-100 divide-y divide-slate-100">
          {cart.items.map((item) => (
            <div key={item.id} className="p-4 flex items-center justify-between gap-4">
              <div className="flex items-center gap-4">
                <img
                  src={item.product_details?.main_image || 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=800&auto=format&fit=crop&q=60'}
                  alt={item.product_details?.title}
                  className="w-16 h-16 object-cover rounded-xl bg-slate-100"
                />
                <div>
                  <h4 className="font-semibold text-slate-900 text-sm line-clamp-1">{item.product_details?.title}</h4>
                  <div className="text-sky-600 font-bold text-sm">₹{item.product_details?.current_price}</div>
                </div>
              </div>

              <div className="flex items-center gap-6">
                <input
                  type="number"
                  min="1"
                  value={item.quantity}
                  onChange={(e) => updateQuantity(item.id, parseInt(e.target.value) || 1)}
                  className="w-16 border border-slate-200 rounded-lg p-1 text-center font-bold text-sm"
                />
                <div className="font-bold text-slate-900 text-sm min-w-[70px] text-right">₹{item.subtotal}</div>
                <button onClick={() => removeItem(item.id)} className="text-slate-400 hover:text-red-500">
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Order Summary */}
      <div className="bg-white p-6 rounded-3xl border border-slate-100 h-fit space-y-6">
        <h3 className="font-bold text-lg text-slate-900 border-b border-slate-100 pb-4">Order Summary</h3>

        <div className="space-y-3 text-sm">
          <div className="flex justify-between text-slate-600">
            <span>Subtotal</span>
            <span className="font-semibold text-slate-900">₹{cart.total_price}</span>
          </div>
          <div className="flex justify-between text-slate-600">
            <span>Shipping Fee</span>
            <span className="font-semibold text-emerald-600">FREE</span>
          </div>
          <div className="flex justify-between text-slate-900 font-extrabold text-lg pt-3 border-t border-slate-100">
            <span>Total</span>
            <span className="text-sky-600">₹{cart.total_price}</span>
          </div>
        </div>

        <Link
          to="/checkout"
          className="w-full bg-sky-500 hover:bg-sky-600 text-white font-bold py-3.5 rounded-2xl shadow-lg shadow-sky-500/20 flex items-center justify-center gap-2 transition-all"
        >
          Proceed to Checkout <ArrowRight className="w-4 h-4" />
        </Link>
      </div>
    </div>
  );
};

export default Cart;
