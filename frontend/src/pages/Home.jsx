import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight, Sparkles, Zap, Tag } from 'lucide-react';
import ProductCard from '../components/ProductCard';
import api from '../api/axios';

const Home = () => {
  const [featuredProducts, setFeaturedProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchFeatured();
  }, []);

  const fetchFeatured = async () => {
    try {
      const res = await api.get('/products/items/?featured=true');
      setFeaturedProducts(res.data.results || res.data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-16">
      {/* Hero Banner */}
      <section className="relative overflow-hidden bg-gradient-to-r from-slate-900 via-indigo-950 to-slate-900 text-white rounded-3xl p-8 sm:p-16 shadow-2xl">
        <div className="relative z-10 max-w-2xl">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-sky-500/20 text-sky-300 text-xs font-bold uppercase tracking-wider mb-6 border border-sky-500/30">
            <Zap className="w-3.5 h-3.5" /> Summer Collection 2026
          </div>
          <h1 className="text-4xl sm:text-6xl font-extrabold tracking-tight leading-tight mb-6">
            Next-Gen Shopping <br />
            <span className="bg-gradient-to-r from-sky-400 to-indigo-300 bg-clip-text text-transparent">
              Powered by Intelligence
            </span>
          </h1>
          <p className="text-slate-300 text-base sm:text-lg mb-8 leading-relaxed">
            Discover curated luxury hardware, minimalist apparel, and ergonomic living essentials with instant AI recommendations and seamless checkout.
          </p>
          <div className="flex flex-wrap gap-4">
            <Link
              to="/products"
              className="bg-sky-500 hover:bg-sky-400 text-white font-bold px-7 py-3.5 rounded-2xl shadow-lg shadow-sky-500/30 flex items-center gap-2 transition-all hover:gap-3"
            >
              Explore Products <ArrowRight className="w-5 h-5" />
            </Link>
            <div className="flex items-center gap-2 px-4 py-3 bg-white/10 backdrop-blur-md rounded-2xl border border-white/10 text-sm">
              <Tag className="w-4 h-4 text-sky-400" /> Use Code: <span className="font-bold text-sky-300">WELCOME10</span>
            </div>
          </div>
        </div>
      </section>

      {/* Featured Products */}
      <section>
        <div className="flex justify-between items-end mb-8">
          <div>
            <h2 className="text-2xl font-bold text-slate-900">Featured Releases</h2>
            <p className="text-sm text-slate-500">Handpicked premium products with top ratings</p>
          </div>
          <Link to="/products" className="text-sm font-bold text-sky-600 hover:text-sky-700 flex items-center gap-1">
            View All <ArrowRight className="w-4 h-4" />
          </Link>
        </div>

        {loading ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {[1, 2, 3, 4].map((n) => (
              <div key={n} className="h-72 bg-slate-200 animate-pulse rounded-2xl"></div>
            ))}
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {featuredProducts.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        )}
      </section>
    </div>
  );
};

export default Home;
