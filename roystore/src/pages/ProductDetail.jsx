import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ArrowLeft, Minus, Plus, ShoppingCart } from 'lucide-react';
import api from '../api/axios';
import { useCart } from '../context/CartContext';
import BottomNav from '../components/BottomNav';

export default function ProductDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { refreshCart } = useCart();
  const [product, setProduct] = useState(null);
  const [qty, setQty] = useState(1);
  const [adding, setAdding] = useState(false);

  useEffect(() => {
    api.get(`/api/v1/products/${id}/`).then((res) => setProduct(res.data));
  }, [id]);

  const handleAddToCart = async () => {
    setAdding(true);
    try {
      await api.post('/api/v1/cart-items/', { product_id: product.id, quantity: qty });
      refreshCart();
      navigate('/cart');
    } finally {
      setAdding(false);
    }
  };

  if (!product) return <p className="p-4 text-gray-400 text-sm">Loading...</p>;
  const inStock = product.stock > 0;

  return (
    <div className="min-h-screen bg-white pb-28">
      <div className="relative">
        <img src={product.image} alt={product.name} loading="lazy" className="w-full h-80 object-cover" />
        <button onClick={() => navigate(-1)} className="absolute top-4 left-4 bg-white rounded-full p-2 shadow-md">
          <ArrowLeft size={20} />
        </button>
      </div>

      <div className="px-5 -mt-6 relative bg-white rounded-t-3xl pt-6">
        {inStock ? (
          <span className="inline-block bg-orange-50 text-orange-500 text-xs font-bold px-3 py-1 rounded-full mb-3">{product.stock} in stock</span>
        ) : (
          <span className="inline-block bg-gray-100 text-gray-500 text-xs font-bold px-3 py-1 rounded-full mb-3">Out of stock</span>
        )}
        <h1 className="text-2xl font-extrabold mb-2">{product.name}</h1>
        <p className="text-primary font-extrabold text-3xl mb-5">₦{Number(product.price).toLocaleString()}</p>

        {product.description && <p className="text-gray-500 text-sm leading-relaxed mb-6">{product.description}</p>}

        {inStock && (
          <div className="flex items-center gap-4 mb-4">
            <span className="text-sm font-medium">Quantity</span>
            <div className="flex items-center border border-gray-200 rounded-xl">
              <button onClick={() => setQty(Math.max(1, qty - 1))} className="p-2"><Minus size={16} /></button>
              <span className="px-4 text-sm font-semibold">{qty}</span>
              <button onClick={() => setQty(Math.min(product.stock, qty + 1))} className="p-2"><Plus size={16} /></button>
            </div>
          </div>
        )}
      </div>

      {inStock && (
        <div className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-100 p-4 z-50">
          <button onClick={handleAddToCart} disabled={adding} className="w-full bg-primary text-white font-semibold rounded-xl py-3 flex items-center justify-center gap-2 disabled:opacity-60">
            <ShoppingCart size={18} />
            {adding ? 'Adding...' : 'Add to Cart'}
          </button>
        </div>
      )}
    </div>
  );
}