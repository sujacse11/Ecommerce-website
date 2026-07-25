import React, { useEffect, useState } from 'react';
import { Shield, Users, DollarSign, ShoppingBag, Package } from 'lucide-react';
import api from '../api/axios';

const AdminDashboard = () => {
  const [analytics, setAnalytics] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchAnalytics();
  }, []);

  const fetchAnalytics = async () => {
    try {
      const res = await api.get('/analytics/dashboard/');
      setAnalytics(res.data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  if (loading) return <div className="p-12 text-center text-slate-500">Loading System Analytics...</div>;

  return (
    <div className="space-y-8">
      <div className="bg-white p-6 rounded-3xl border border-slate-100 flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">Admin Command Center</h1>
          <p className="text-xs text-slate-500">Overall platform performance, users, and gross merchandise value</p>
        </div>
      </div>

      {/* Metrics */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="bg-white p-6 rounded-3xl border border-slate-100 space-y-2">
          <div className="text-xs text-slate-500 font-semibold">Total Platform Sales</div>
          <div className="text-2xl font-extrabold text-slate-900">₹{analytics?.metrics?.total_sales || 0}</div>
        </div>
        <div className="bg-white p-6 rounded-3xl border border-slate-100 space-y-2">
          <div className="text-xs text-slate-500 font-semibold">Total Orders Placed</div>
          <div className="text-2xl font-extrabold text-slate-900">{analytics?.metrics?.total_orders || 0}</div>
        </div>
        <div className="bg-white p-6 rounded-3xl border border-slate-100 space-y-2">
          <div className="text-xs text-slate-500 font-semibold">Registered Customers</div>
          <div className="text-2xl font-extrabold text-slate-900">{analytics?.metrics?.total_customers || 0}</div>
        </div>
        <div className="bg-white p-6 rounded-3xl border border-slate-100 space-y-2">
          <div className="text-xs text-slate-500 font-semibold">Catalog Products</div>
          <div className="text-2xl font-extrabold text-slate-900">{analytics?.metrics?.total_products || 0}</div>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;
