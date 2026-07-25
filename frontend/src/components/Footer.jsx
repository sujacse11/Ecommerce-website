import React from 'react';
import { Sparkles, ShieldCheck, Truck, Headphones, CreditCard } from 'lucide-react';

const Footer = () => {
  return (
    <footer className="bg-slate-900 text-slate-400 mt-20 pt-16 pb-8 border-t border-slate-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Value Props */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6 pb-12 border-b border-slate-800">
          <div className="flex items-center gap-3">
            <Truck className="w-8 h-8 text-sky-400" />
            <div>
              <h4 className="text-sm font-semibold text-white">Free Express Delivery</h4>
              <p className="text-xs text-slate-400">On all orders over $99</p>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <ShieldCheck className="w-8 h-8 text-sky-400" />
            <div>
              <h4 className="text-sm font-semibold text-white">Secure Payments</h4>
              <p className="text-xs text-slate-400">COD, Stripe & Razorpay</p>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <Headphones className="w-8 h-8 text-sky-400" />
            <div>
              <h4 className="text-sm font-semibold text-white">AI Assistant 24/7</h4>
              <p className="text-xs text-slate-400">Instant order tracking & FAQs</p>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <CreditCard className="w-8 h-8 text-sky-400" />
            <div>
              <h4 className="text-sm font-semibold text-white">Easy Returns</h4>
              <p className="text-xs text-slate-400">30-day money back guarantee</p>
            </div>
          </div>
        </div>

        {/* Links Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 py-12">
          <div>
            <div className="flex items-center gap-2 font-bold text-xl text-white mb-4">
              <Sparkles className="w-5 h-5 text-sky-400" /> AuraStore
            </div>
            <p className="text-sm text-slate-400">
              Next-generation full-stack e-commerce marketplace.
            </p>
          </div>
          <div>
            <h5 className="font-semibold text-white text-sm mb-3">Shop Categories</h5>
            <ul className="space-y-2 text-sm">
              <li>Electronics & Hardware</li>
              <li>Apparel & Fashion</li>
              <li>Home Decor & Lighting</li>
              <li>Featured Collections</li>
            </ul>
          </div>
          <div>
            <h5 className="font-semibold text-white text-sm mb-3">Customer Service</h5>
            <ul className="space-y-2 text-sm">
              <li>Order Tracking</li>
              <li>Returns & Refunds</li>
              <li>Shipping Rates</li>
              <li>Contact Support</li>
            </ul>
          </div>
        </div>

        <div className="text-center text-xs text-slate-500 pt-8 border-t border-slate-800">
          © {new Date().getFullYear()} AuraStore Inc. All rights reserved.
        </div>
      </div>
    </footer>
  );
};

export default Footer;
