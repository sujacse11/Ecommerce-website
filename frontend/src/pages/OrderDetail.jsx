import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { Truck, CheckCircle, Clock, AlertTriangle } from 'lucide-react';
import api from '../api/axios';

const OrderDetail = () => {
  const { id } = useParams();
  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchOrder();
  }, [id]);

  const fetchOrder = async () => {
    try {
      const res = await api.get(`/orders/${id}/`);
      setOrder(res.data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleCancelOrder = async () => {
    try {
      const res = await api.post(`/orders/${id}/cancel/`);
      setOrder(res.data.order);
      alert('Order cancelled successfully.');
    } catch (err) {
      alert('Could not cancel order.');
    }
  };

  if (loading) return <div className="p-12 text-center text-slate-500">Loading tracking info...</div>;
  if (!order) return <div className="p-12 text-center text-red-500">Order not found.</div>;

  const statuses = ['PLACED', 'PROCESSING', 'SHIPPED', 'DELIVERED'];
  const currentIndex = statuses.indexOf(order.status);

  return (
    <div className="space-y-8">
      {/* Header & Status Stepper */}
      <div className="bg-white p-8 rounded-3xl border border-slate-100 space-y-6">
        <div className="flex flex-wrap justify-between items-center gap-4 border-b border-slate-100 pb-6">
          <div>
            <h1 className="text-2xl font-bold text-slate-900">Order #{order.id}</h1>
            <p className="text-xs text-slate-500 mt-1">Tracking ID: <strong className="text-sky-600">{order.tracking_number}</strong></p>
          </div>
          {order.status !== 'CANCELLED' && order.status !== 'DELIVERED' && (
            <button onClick={handleCancelOrder} className="text-xs font-bold text-red-500 bg-red-50 hover:bg-red-100 px-4 py-2 rounded-xl">
              Cancel Order
            </button>
          )}
        </div>

        {/* Tracking Stepper */}
        {order.status === 'CANCELLED' ? (
          <div className="flex items-center gap-2 text-red-500 font-bold text-sm bg-red-50 p-4 rounded-2xl">
            <AlertTriangle className="w-5 h-5" /> This order has been cancelled.
          </div>
        ) : (
          <div className="grid grid-cols-4 gap-2 pt-2">
            {statuses.map((s, idx) => (
              <div key={s} className="flex flex-col items-center">
                <div
                  className={`w-8 h-8 rounded-full flex items-center justify-center font-bold text-xs ${
                    idx <= currentIndex ? 'bg-sky-500 text-white' : 'bg-slate-100 text-slate-400'
                  }`}
                >
                  {idx + 1}
                </div>
                <span className="text-[11px] font-bold text-slate-700 mt-2">{s}</span>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Items Breakdown */}
      <div className="bg-white p-6 rounded-3xl border border-slate-100 space-y-4">
        <h3 className="font-bold text-lg text-slate-900">Ordered Items</h3>
        <div className="divide-y divide-slate-100">
          {order.items.map((item) => (
            <div key={item.id} className="py-4 flex justify-between items-center">
              <div>
                <div className="font-bold text-slate-800 text-sm">{item.product_details?.title}</div>
                <div className="text-xs text-slate-500">₹{item.price} x {item.quantity}</div>
              </div>
              <div className="font-bold text-slate-900 text-sm">₹{item.subtotal}</div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default OrderDetail;
