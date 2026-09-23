import { useNavigate } from 'react-router-dom';
import { ShoppingCart } from 'lucide-react';
import api from '../api/axios';
import { useCart } from '../context/CartContext';

export default function ProductCard({ product, className = '' }) {
  const navigate = useNavigate();
  const { refreshCart } = useCart();
  const inStock = product.stock > 0;

  if (!inStock) return null;

  const handleAddToCart = async (e) => {
    e.stopPropagation();
    try {
      await api.post('/api/v1/cart-items/', { product_id: product.id, quantity: 1 });
      refreshCart();
    } catch (err) {}
  };

  return (
    <button onClick={() => navigate(`/products/${product.id}`)} className={`border border-gray-200 rounded-xl overflow-hidden text-left ${className}`}>
      <div className="relative w-full h-32 bg-gray-50">
        <img src={product.image} alt={product.name} loading="lazy" className="w-full h-full object-cover" />
        <span className="absolute bottom-2 left-2 bg-primary text-white text-xs font-bold px-2 py-1 rounded-lg">
          ₦{Number(product.price).toLocaleString()}
        </span>
        <button onClick={handleAddToCart} className="absolute bottom-2 right-2 bg-white shadow-md rounded-full p-2">
          <ShoppingCart size={15} className="text-primary" />
        </button>
      </div>
      <div className="p-3">
        <p className="font-semibold text-sm truncate mb-1">{product.name}</p>
        <p className="text-orange-500 text-xs font-medium">{product.stock} in stock</p>
      </div>
    </button>
  );
}