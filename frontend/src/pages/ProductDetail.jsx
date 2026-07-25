import React, { useEffect, useState, useContext } from 'react';
import { useParams } from 'react-router-dom';
import { ShoppingCart, Star, ShieldCheck, Truck, RefreshCw } from 'lucide-react';
import api from '../api/axios';
import { CartContext } from '../context/CartContext';

const ProductDetail = () => {
  const { id } = useParams();
  const { addToCart } = useContext(CartContext);
  const [product, setProduct] = useState(null);
  const [reviews, setReviews] = useState([]);
  const [loading, setLoading] = useState(true);
  const [quantity, setQuantity] = useState(1);

  useEffect(() => {
    fetchProduct();
    fetchReviews();
  }, [id]);

  const fetchProduct = async () => {
    try {
      const res = await api.get(`/products/items/${id}/`);
      setProduct(res.data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const fetchReviews = async () => {
    try {
      const res = await api.get(`/reviews/?product=${id}`);
      setReviews(res.data.results || res.data);
    } catch (err) {
      console.error(err);
    }
  };

  if (loading) return <div className="p-12 text-center text-slate-500">Loading product detail...</div>;
  if (!product) return <div className="p-12 text-center text-red-500">Product not found.</div>;

  const defaultImage = 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=800&auto=format&fit=crop&q=60';

  return (
    <div className="space-y-12">
      <div className="bg-white rounded-3xl p-8 border border-slate-100 grid grid-cols-1 md:grid-cols-2 gap-12">
        {/* Gallery */}
        <div className="aspect-square bg-slate-100 rounded-2xl overflow-hidden">
          <img src={product.main_image || defaultImage} alt={product.title} className="w-full h-full object-cover" />
        </div>

        {/* Product Meta & Actions */}
        <div className="space-y-6 flex flex-col justify-between">
          <div>
            <div className="text-xs font-bold text-sky-600 uppercase tracking-wider mb-2">
              {product.category_details?.name} • SKU: {product.sku}
            </div>
            <h1 className="text-3xl font-extrabold text-slate-900 mb-4">{product.title}</h1>
            <div className="flex items-center gap-2 text-amber-400 text-sm mb-6">
              <Star className="w-4 h-4 fill-current" />
              <span className="font-bold text-slate-800">4.8</span>
              <span className="text-slate-400">({reviews.length} reviews)</span>
            </div>

            <div className="text-3xl font-extrabold text-slate-900 mb-6">
              ${product.current_price}
              {product.discount_price && <span className="text-lg text-slate-400 line-through ml-3">${product.price}</span>}
            </div>

            <p className="text-slate-600 text-sm leading-relaxed mb-6">{product.description}</p>
          </div>

          <div className="space-y-4 pt-6 border-t border-slate-100">
            <div className="flex items-center gap-4">
              <input
                type="number"
                min="1"
                value={quantity}
                onChange={(e) => setQuantity(Math.max(1, parseInt(e.target.value) || 1))}
                className="w-20 border border-slate-200 rounded-xl px-3 py-2 text-center font-bold"
              />
              <button
                onClick={() => addToCart(product.id, quantity)}
                className="flex-1 bg-sky-500 hover:bg-sky-600 text-white font-bold py-3.5 px-6 rounded-2xl shadow-lg shadow-sky-500/20 flex items-center justify-center gap-2 transition-all"
              >
                <ShoppingCart className="w-5 h-5" /> Add to Shopping Cart
              </button>
            </div>

            <div className="grid grid-cols-3 gap-2 pt-4 text-xs text-slate-500 border-t border-slate-100">
              <div className="flex items-center gap-1.5"><Truck className="w-4 h-4 text-sky-500" /> Fast Delivery</div>
              <div className="flex items-center gap-1.5"><ShieldCheck className="w-4 h-4 text-sky-500" /> 1 Year Warranty</div>
              <div className="flex items-center gap-1.5"><RefreshCw className="w-4 h-4 text-sky-500" /> 30-Day Return</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProductDetail;
