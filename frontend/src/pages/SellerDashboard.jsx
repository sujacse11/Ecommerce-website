import React, { useEffect, useState } from 'react';
import { LayoutDashboard, Package, DollarSign, ShoppingBag, Plus } from 'lucide-react';
import api from '../api/axios';

const SellerDashboard = () => {
  const [analytics, setAnalytics] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchDashboard();
  }, []);

  const fetchDashboard = async () => {
    try {
      const res = await api.get('/analytics/dashboard/');
      setAnalytics(res.data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  if (loading) return <div className="p-12 text-center text-slate-500">Loading Seller Dashboard...</div>;

  return (
    <div className="space-y-8">
      <div className="flex justify-between items-center bg-white p-6 rounded-3xl border border-slate-100">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">Seller Dashboard</h1>
          <p className="text-xs text-slate-500">Manage your products, sales & store performance</p>
        </div>
      </div>

      {/* Metrics Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white p-6 rounded-3xl border border-slate-100 flex items-center gap-4">
          <div className="w-12 h-12 rounded-2xl bg-sky-50 text-sky-600 flex items-center justify-center">
            <Package className="w-6 h-6" />
          </div>
          <div>
            <div className="text-xs text-slate-500 font-semibold">Active Products</div>
            <div className="text-2xl font-bold text-slate-900">{analytics?.metrics?.total_products || 0}</div>
          </div>
        </div>

        <div className="bg-white p-6 rounded-3xl border border-slate-100 flex items-center gap-4">
          <div className="w-12 h-12 rounded-2xl bg-emerald-50 text-emerald-600 flex items-center justify-center">
            <ShoppingBag className="w-6 h-6" />
          </div>
          <div>
            <div className="text-xs text-slate-500 font-semibold">Orders Received</div>
            <div className="text-2xl font-bold text-slate-900">{analytics?.metrics?.total_orders || 0}</div>
          </div>
        </div>

        <div className="bg-white p-6 rounded-3xl border border-slate-100 flex items-center gap-4">
          <div className="w-12 h-12 rounded-2xl bg-indigo-50 text-indigo-600 flex items-center justify-center">
            <DollarSign className="w-6 h-6" />
          </div>
          <div>
            <div className="text-xs text-slate-500 font-semibold">Total Revenue</div>
            <div className="text-2xl font-bold text-slate-900">${analytics?.metrics?.total_revenue || 0}</div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SellerDashboard;
