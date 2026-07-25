import React, { useContext } from 'react';
import { Link } from 'react-router-dom';
import { ShoppingCart, Heart, Star } from 'lucide-react';
import { CartContext } from '../context/CartContext';

const ProductCard = ({ product }) => {
  const { addToCart } = useContext(CartContext);

  const defaultImage = 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=800&auto=format&fit=crop&q=60';

  return (
    <div className="group relative bg-white rounded-2xl p-4 border border-slate-100 shadow-sm hover:shadow-xl transition-all duration-300 flex flex-col justify-between">
      <div>
        {/* Product Image */}
        <div className="relative aspect-square rounded-xl bg-slate-100 overflow-hidden mb-4">
          <img
            src={product.main_image || defaultImage}
            alt={product.title}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
          />
          {product.discount_price && (
            <span className="absolute top-2 left-2 bg-red-500 text-white font-bold text-[10px] px-2 py-0.5 rounded-full uppercase tracking-wider">
              Sale
            </span>
          )}
        </div>

        {/* Category & Title */}
        <div className="text-xs text-sky-600 font-semibold mb-1">
          {product.category_details?.name || 'Category'}
        </div>
        <Link to={`/products/${product.id}`} className="block font-semibold text-slate-800 text-sm hover:text-sky-600 line-clamp-1 mb-2">
          {product.title}
        </Link>
      </div>

      {/* Rating & Pricing */}
      <div>
        <div className="flex items-center gap-1 text-amber-400 text-xs mb-3">
          <Star className="w-3.5 h-3.5 fill-current" />
          <span className="font-semibold text-slate-700">4.8</span>
          <span className="text-slate-400">(24)</span>
        </div>

        <div className="flex items-center justify-between pt-2 border-t border-slate-100">
          <div>
            <span className="font-bold text-slate-900 text-lg">₹{product.current_price}</span>
            {product.discount_price && (
              <span className="text-xs text-slate-400 line-through ml-2">₹{product.price}</span>
            )}
          </div>
          <button
            onClick={() => addToCart(product.id)}
            className="w-9 h-9 rounded-xl bg-sky-50 hover:bg-sky-500 text-sky-600 hover:text-white flex items-center justify-center transition-colors"
            title="Add to Cart"
          >
            <ShoppingCart className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );
};

export default ProductCard;
