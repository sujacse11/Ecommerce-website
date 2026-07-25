import React, { useEffect, useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import ProductCard from '../components/ProductCard';
import api from '../api/axios';
import { Filter, Search } from 'lucide-react';

const ProductList = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);

  const search = searchParams.get('search') || '';
  const category = searchParams.get('category') || '';

  useEffect(() => {
    fetchCategories();
  }, []);

  useEffect(() => {
    fetchProducts();
  }, [searchParams]);

  const fetchCategories = async () => {
    try {
      const res = await api.get('/products/categories/');
      setCategories(res.data.results || res.data);
    } catch (err) {
      console.error(err);
    }
  };

  const fetchProducts = async () => {
    setLoading(true);
    try {
      let query = `/products/items/?search=${encodeURIComponent(search)}`;
      if (category) query += `&category=${encodeURIComponent(category)}`;

      const res = await api.get(query);
      setProducts(res.data.results || res.data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
      {/* Sidebar Filters */}
      <div className="bg-white p-6 rounded-2xl border border-slate-100 h-fit space-y-6">
        <div className="flex items-center gap-2 font-bold text-slate-900 text-lg">
          <Filter className="w-5 h-5 text-sky-600" /> Filters
        </div>

        {/* Categories Filter */}
        <div>
          <h3 className="font-semibold text-sm text-slate-700 mb-3">Categories</h3>
          <div className="space-y-2 text-sm">
            <button
              onClick={() => {
                searchParams.delete('category');
                setSearchParams(searchParams);
              }}
              className={`block w-full text-left px-3 py-1.5 rounded-lg transition-colors ${
                !category ? 'bg-sky-50 text-sky-600 font-bold' : 'hover:bg-slate-50 text-slate-600'
              }`}
            >
              All Categories
            </button>
            {categories.map((cat) => (
              <button
                key={cat.id}
                onClick={() => setSearchParams({ category: cat.slug, search })}
                className={`block w-full text-left px-3 py-1.5 rounded-lg transition-colors ${
                  category === cat.slug ? 'bg-sky-50 text-sky-600 font-bold' : 'hover:bg-slate-50 text-slate-600'
                }`}
              >
                {cat.name}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Main Product Grid */}
      <div className="md:col-span-3 space-y-6">
        <div className="flex justify-between items-center bg-white p-4 rounded-2xl border border-slate-100">
          <span className="text-sm font-medium text-slate-600">
            Showing <strong className="text-slate-900">{products.length}</strong> products
          </span>
        </div>

        {loading ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {[1, 2, 3, 4, 5, 6].map((n) => (
              <div key={n} className="h-72 bg-slate-200 animate-pulse rounded-2xl"></div>
            ))}
          </div>
        ) : products.length === 0 ? (
          <div className="bg-white p-12 rounded-2xl text-center text-slate-500">
            No products found matching your search.
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {products.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default ProductList;
