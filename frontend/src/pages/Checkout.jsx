import React, { useState, useEffect, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import { CreditCard, CheckCircle2, Tag } from 'lucide-react';
import api from '../api/axios';
import { CartContext } from '../context/CartContext';

const Checkout = () => {
  const { cart, clearCart } = useContext(CartContext);
  const navigate = useNavigate();

  const [addresses, setAddresses] = useState([]);
  const [selectedAddress, setSelectedAddress] = useState(null);
  const [paymentMethod, setPaymentMethod] = useState('COD');
  const [couponCode, setCouponCode] = useState('');
  const [discountPercent, setDiscountPercent] = useState(0);
  const [loading, setLoading] = useState(false);

  // Address form fields
  const [newAddress, setNewAddress] = useState({
    full_name: '',
    street_address: '',
    city: '',
    state: '',
    postal_code: '',
    phone: '',
  });

  useEffect(() => {
    fetchAddresses();
  }, []);

  const fetchAddresses = async () => {
    try {
      const res = await api.get('/accounts/addresses/');
      const list = res.data.results || res.data;
      setAddresses(list);
      if (list.length > 0) setSelectedAddress(list[0].id);
    } catch (err) {
      console.error(err);
    }
  };

  const handleCreateAddress = async (e) => {
    e.preventDefault();
    try {
      const res = await api.post('/accounts/addresses/', newAddress);
      setAddresses([...addresses, res.data]);
      setSelectedAddress(res.data.id);
      setNewAddress({ full_name: '', street_address: '', city: '', state: '', postal_code: '', phone: '' });
    } catch (err) {
      alert('Error saving address');
    }
  };

  const handleApplyCoupon = async () => {
    try {
      const res = await api.post('/orders/coupons/validate_code/', { code: couponCode });
      setDiscountPercent(res.data.discount_percentage);
      alert(`Coupon applied! ${res.data.discount_percentage}% discount granted.`);
    } catch (err) {
      alert('Invalid or expired coupon code.');
    }
  };

  const handlePlaceOrder = async () => {
    if (!selectedAddress) {
      alert('Please select or add a shipping address.');
      return;
    }

    setLoading(true);
    try {
      const checkoutRes = await api.post('/orders/checkout/', {
        shipping_address_id: selectedAddress,
        coupon_code: couponCode,
        payment_method: paymentMethod,
      });

      const order = checkoutRes.data;

      // Register payment method status
      await api.post('/payments/process/', {
        order_id: order.id,
        payment_method: paymentMethod,
      });

      await clearCart();
      navigate(`/orders/${order.id}`);
    } catch (err) {
      alert('Order checkout failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  if (!cart || cart.items.length === 0) {
    return <div className="p-12 text-center text-slate-500">Cart is empty for checkout.</div>;
  }

  const subtotal = parseFloat(cart.total_price);
  const discountAmount = (subtotal * discountPercent) / 100;
  const finalTotal = subtotal - discountAmount;

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
      {/* Address & Payment Options */}
      <div className="lg:col-span-2 space-y-6">
        {/* Shipping Address Selection */}
        <div className="bg-white p-6 rounded-3xl border border-slate-100 space-y-4">
          <h2 className="font-bold text-lg text-slate-900">1. Shipping Address</h2>

          {addresses.length > 0 && (
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {addresses.map((addr) => (
                <div
                  key={addr.id}
                  onClick={() => setSelectedAddress(addr.id)}
                  className={`p-4 rounded-2xl border cursor-pointer transition-all ${
                    selectedAddress === addr.id
                      ? 'border-sky-500 bg-sky-50/50 shadow-sm'
                      : 'border-slate-200 hover:border-slate-300'
                  }`}
                >
                  <div className="font-bold text-slate-900 text-sm">{addr.full_name}</div>
                  <div className="text-xs text-slate-600 mt-1">{addr.street_address}, {addr.city}</div>
                  <div className="text-xs text-slate-600">{addr.state} - {addr.postal_code}</div>
                  <div className="text-xs text-slate-500 mt-2">Phone: {addr.phone}</div>
                </div>
              ))}
            </div>
          )}

          {/* Add New Address Form */}
          <form onSubmit={handleCreateAddress} className="space-y-3 pt-4 border-t border-slate-100">
            <h4 className="font-semibold text-xs text-slate-700 uppercase">Add New Shipping Address</h4>
            <div className="grid grid-cols-2 gap-3">
              <input
                type="text"
                placeholder="Full Name"
                value={newAddress.full_name}
                onChange={(e) => setNewAddress({ ...newAddress, full_name: e.target.value })}
                required
                className="bg-slate-50 border border-slate-200 rounded-xl p-2.5 text-xs"
              />
              <input
                type="text"
                placeholder="Phone Number"
                value={newAddress.phone}
                onChange={(e) => setNewAddress({ ...newAddress, phone: e.target.value })}
                required
                className="bg-slate-50 border border-slate-200 rounded-xl p-2.5 text-xs"
              />
            </div>
            <input
              type="text"
              placeholder="Street Address"
              value={newAddress.street_address}
              onChange={(e) => setNewAddress({ ...newAddress, street_address: e.target.value })}
              required
              className="w-full bg-slate-50 border border-slate-200 rounded-xl p-2.5 text-xs"
            />
            <div className="grid grid-cols-3 gap-3">
              <input
                type="text"
                placeholder="City"
                value={newAddress.city}
                onChange={(e) => setNewAddress({ ...newAddress, city: e.target.value })}
                required
                className="bg-slate-50 border border-slate-200 rounded-xl p-2.5 text-xs"
              />
              <input
                type="text"
                placeholder="State"
                value={newAddress.state}
                onChange={(e) => setNewAddress({ ...newAddress, state: e.target.value })}
                required
                className="bg-slate-50 border border-slate-200 rounded-xl p-2.5 text-xs"
              />
              <input
                type="text"
                placeholder="Postal Code"
                value={newAddress.postal_code}
                onChange={(e) => setNewAddress({ ...newAddress, postal_code: e.target.value })}
                required
                className="bg-slate-50 border border-slate-200 rounded-xl p-2.5 text-xs"
              />
            </div>
            <button type="submit" className="bg-slate-900 text-white text-xs font-semibold px-4 py-2 rounded-xl">
              Save Address
            </button>
          </form>
        </div>

        {/* Payment Method */}
        <div className="bg-white p-6 rounded-3xl border border-slate-100 space-y-4">
          <h2 className="font-bold text-lg text-slate-900">2. Payment Option</h2>
          <div className="grid grid-cols-3 gap-4">
            {[
              { id: 'COD', label: 'Cash on Delivery', desc: 'Pay when delivered' },
              { id: 'STRIPE', label: 'Stripe Card', desc: 'Instant Credit/Debit' },
              { id: 'RAZORPAY', label: 'Razorpay / UPI', desc: 'UPI & Netbanking' },
            ].map((m) => (
              <div
                key={m.id}
                onClick={() => setPaymentMethod(m.id)}
                className={`p-4 rounded-2xl border cursor-pointer transition-all ${
                  paymentMethod === m.id
                    ? 'border-sky-500 bg-sky-50/50 shadow-sm'
                    : 'border-slate-200 hover:border-slate-300'
                }`}
              >
                <div className="font-bold text-slate-900 text-sm">{m.label}</div>
                <div className="text-xs text-slate-500 mt-1">{m.desc}</div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Summary */}
      <div className="bg-white p-6 rounded-3xl border border-slate-100 h-fit space-y-6">
        <h3 className="font-bold text-lg text-slate-900 border-b border-slate-100 pb-4">Checkout Total</h3>

        {/* Coupon Code Input */}
        <div className="flex gap-2">
          <input
            type="text"
            placeholder="Coupon Code"
            value={couponCode}
            onChange={(e) => setCouponCode(e.target.value)}
            className="flex-1 bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-xs"
          />
          <button onClick={handleApplyCoupon} className="bg-sky-50 text-sky-600 text-xs font-bold px-3 py-2 rounded-xl">
            Apply
          </button>
        </div>

        <div className="space-y-3 text-sm">
          <div className="flex justify-between text-slate-600">
            <span>Subtotal</span>
            <span className="font-semibold">${subtotal.toFixed(2)}</span>
          </div>
          {discountPercent > 0 && (
            <div className="flex justify-between text-emerald-600 font-semibold">
              <span>Discount ({discountPercent}%)</span>
              <span>-${discountAmount.toFixed(2)}</span>
            </div>
          )}
          <div className="flex justify-between text-slate-900 font-extrabold text-lg pt-3 border-t border-slate-100">
            <span>Total to Pay</span>
            <span className="text-sky-600">${finalTotal.toFixed(2)}</span>
          </div>
        </div>

        <button
          onClick={handlePlaceOrder}
          disabled={loading}
          className="w-full bg-sky-500 hover:bg-sky-600 text-white font-bold py-3.5 rounded-2xl shadow-lg shadow-sky-500/20 flex items-center justify-center gap-2 transition-all"
        >
          {loading ? 'Processing Order...' : 'Confirm & Place Order'}
        </button>
      </div>
    </div>
  );
};

export default Checkout;
