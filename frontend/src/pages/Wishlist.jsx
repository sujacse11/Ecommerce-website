import React, { useEffect, useState } from 'react';
import { Heart } from 'lucide-react';
import api from '../api/axios';
import ProductCard from '../components/ProductCard';

const Wishlist = () => {
  const [wishlist, setWishlist] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchWishlist();
  }, []);

  const fetchWishlist = async () => {
    try {
      const res = await api.get('/orders/wishlist/');
      setWishlist(res.data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  if (loading) return <div className="p-12 text-center text-slate-500">Loading saved wishlist...</div>;

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-2 bg-white p-6 rounded-3xl border border-slate-100">
        <Heart className="w-6 h-6 text-red-500 fill-current" />
        <h1 className="text-2xl font-bold text-slate-900">My Saved Wishlist</h1>
      </div>

      {!wishlist || !wishlist.products || wishlist.products.length === 0 ? (
        <div className="bg-white p-12 rounded-3xl text-center text-slate-500">
          Your wishlist is currently empty.
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {wishlist.products.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      )}
    </div>
  );
};

export default Wishlist;
