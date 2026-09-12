import { useNavigate } from 'react-router-dom';
import { ShoppingCart } from 'lucide-react';
import api from '../api/axios';

export default function ProductCard({ product, className = '' }) {
  const navigate = useNavigate();
  const inStock = product.stock > 0;

  const handleAddToCart = async (e) => {
    e.stopPropagation();
    try {
      await api.post('/api/v1/cart-items/', { product_id: product.id, quantity: 1 });
    } catch (err) {}
  };

  return (
    <button onClick={() => navigate(`/products/${product.id}`)} className={`border border-gray-200 rounded-xl overflow-hidden text-left ${className}`}>
      <div className="relative w-full h-32 bg-gray-50">
        <img src={product.image} alt={product.name} loading="lazy" className={`w-full h-full object-cover ${inStock ? '' : 'opacity-40'}`} />
        {inStock && (
          <button onClick={handleAddToCart} className="absolute bottom-2 right-2 bg-white shadow-md rounded-full p-2">
            <ShoppingCart size={15} className="text-primary" />
          </button>
        )}
      </div>
      <div className="p-3">
        <p className="font-semibold text-sm truncate mb-1">{product.name}</p>
        {inStock ? (
          <p className="text-primary font-bold text-sm">₦{Number(product.price).toLocaleString()}</p>
        ) : (
          <p className="text-red-500 text-xs font-semibold">Out of stock</p>
        )}
      </div>
    </button>
  );
}