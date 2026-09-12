import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ArrowLeft, Minus, Plus } from 'lucide-react';
import api from '../api/axios';
import BottomNav from '../components/BottomNav';

export default function ProductDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
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
      navigate('/cart');
    } finally {
      setAdding(false);
    }
  };

  if (!product) return <p className="p-4 text-gray-400 text-sm">Loading...</p>;

  const inStock = product.stock > 0;

  return (
    <div className="min-h-screen bg-white pb-24">
      <div className="flex items-center px-4 pt-4">
        <button onClick={() => navigate(-1)}><ArrowLeft size={22} /></button>
      </div>
      <img src={product.image} alt={product.name} loading="lazy" className="w-full h-72 object-cover mt-4" />
      <div className="px-4 mt-4">
        <h1 className="text-xl font-bold mb-1">{product.name}</h1>
        <p className={`text-sm mb-2 ${inStock ? 'text-orange-500' : 'text-red-500'}`}>
          {inStock ? `${product.stock} in stock` : 'Out of stock'}
        </p>
        <p className="text-primary font-bold text-2xl mb-4">₦{Number(product.price).toLocaleString()}</p>
        {product.description && <p className="text-gray-500 text-sm mb-6 leading-relaxed">{product.description}</p>}
        {inStock && (
          <>
            <div className="flex items-center gap-4 mb-6">
              <span className="text-sm font-medium">Quantity</span>
              <div className="flex items-center border border-gray-200 rounded-xl">
                <button onClick={() => setQty(Math.max(1, qty - 1))} className="p-2"><Minus size={16} /></button>
                <span className="px-3 text-sm">{qty}</span>
                <button onClick={() => setQty(Math.min(product.stock, qty + 1))} className="p-2"><Plus size={16} /></button>
              </div>
            </div>
            <button onClick={handleAddToCart} disabled={adding} className="w-full bg-primary text-white font-semibold rounded-xl py-3 disabled:opacity-60">
              {adding ? 'Adding...' : 'Add to Cart'}
            </button>
          </>
        )}
      </div>
      <BottomNav />
    </div>
  );
}