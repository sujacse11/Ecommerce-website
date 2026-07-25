import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { Package, ChevronRight } from 'lucide-react';
import api from '../api/axios';

const Orders = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchOrders();
  }, []);

  const fetchOrders = async () => {
    try {
      const res = await api.get('/orders/');
      setOrders(res.data.results || res.data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  if (loading) return <div className="p-12 text-center text-slate-500">Loading order history...</div>;

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-2 bg-white p-6 rounded-3xl border border-slate-100">
        <Package className="w-6 h-6 text-sky-600" />
        <h1 className="text-2xl font-bold text-slate-900">My Orders History</h1>
      </div>

      {orders.length === 0 ? (
        <div className="bg-white p-12 rounded-3xl text-center text-slate-500">
          You have not placed any orders yet.
        </div>
      ) : (
        <div className="space-y-4">
          {orders.map((order) => (
            <div key={order.id} className="bg-white p-6 rounded-3xl border border-slate-100 flex items-center justify-between">
              <div>
                <div className="font-bold text-slate-900 text-base">Order #{order.id}</div>
                <div className="text-xs text-slate-500 mt-1">
                  Placed on {new Date(order.created_at).toLocaleDateString()} • {order.items.length} items
                </div>
                <div className="mt-2 flex items-center gap-2">
                  <span className="text-xs font-bold px-2.5 py-0.5 rounded-full bg-sky-50 text-sky-600">
                    Status: {order.status}
                  </span>
                  <span className="text-xs font-semibold text-slate-600">
                    Total: ₹{order.final_amount}
                  </span>
                </div>
              </div>

              <Link to={`/orders/${order.id}`} className="bg-slate-100 hover:bg-slate-200 p-3 rounded-2xl transition-colors">
                <ChevronRight className="w-5 h-5 text-slate-600" />
              </Link>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default Orders;
