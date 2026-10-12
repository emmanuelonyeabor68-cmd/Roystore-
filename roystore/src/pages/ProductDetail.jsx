import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ArrowLeft, Minus, Plus, ShoppingCart } from 'lucide-react';
import api from '../api/axios';
import { useCart } from '../context/CartContext';
import { SkeletonBlock } from '../components/Skeletons';

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

  if (!product) {
    return (
      <div role="status" aria-label="Loading product" className="min-h-screen bg-white">
        <div className="mx-auto max-w-5xl lg:pl-64">
          <SkeletonBlock className="h-72 w-full rounded-none md:h-[28rem]" />
          <div className="space-y-4 rounded-t-3xl bg-white px-5 pt-6 lg:px-8">
            <SkeletonBlock className="h-5 w-24 rounded-full" />
            <SkeletonBlock className="h-8 w-3/4" />
            <SkeletonBlock className="h-8 w-1/3" />
            <SkeletonBlock className="h-24 w-full" />
            <SkeletonBlock className="h-12 w-full rounded-xl" />
          </div>
        </div>
      </div>
    );
  }
  const inStock = product.stock > 0;

  return (
    <div className="bg-white">
      <div className="mx-auto max-w-5xl lg:pl-64">
        <div className="relative">
          <img src={product.image} alt={product.name} loading="lazy" className="w-full h-full object-cover md:h-[28rem]" />
          <button onClick={() => navigate(-1)} className="absolute top-4 left-4 bg-white rounded-full p-2 shadow-md">
            <ArrowLeft size={20} />
          </button>
        </div>

        <div className="px-5 -mt-6 relative bg-white rounded-t-3xl pt-6 pb-2 lg:px-8 lg:pt-8 lg:pb-3">
          {inStock ? (
            <span className="inline-block bg-orange-50 text-orange-500 text-xs font-bold px-3 py-1 rounded-full mb-3">{product.stock} in stock</span>
          ) : (
            <span className="inline-block bg-gray-100 text-gray-500 text-xs font-bold px-3 py-1 rounded-full mb-3">Out of stock</span>
          )}
          <h1 className="text-2xl font-extrabold mb-2 lg:text-4xl">{product.name}</h1>
          <p className="text-primary font-extrabold text-3xl mb-5 lg:text-4xl">₦{Number(product.price).toLocaleString()}</p>

          {product.description && <p className="text-gray-500 text-sm leading-relaxed mb-6 lg:text-base">{product.description}</p>}

          {inStock && (
            <>
              <div className="flex items-center gap-4 mb-4">
                <span className="text-sm font-medium">Quantity</span>
                <div className="flex items-center border border-gray-200 rounded-xl">
                  <button onClick={() => setQty(Math.max(1, qty - 1))} className="p-2"><Minus size={16} /></button>
                  <span className="px-4 text-sm font-semibold">{qty}</span>
                  <button onClick={() => setQty(Math.min(product.stock, qty + 1))} className="p-2"><Plus size={16} /></button>
                </div>
              </div>
              <button
                onClick={handleAddToCart}
                disabled={adding}
                className="w-full bg-primary text-white font-semibold rounded-xl py-3 flex items-center justify-center gap-2 disabled:opacity-60 mt-2"
              >
                <ShoppingCart size={18} />
                {adding ? 'Adding...' : 'Add to Cart'}
              </button>
            </>
          )}
        </div>
      </div>
    </div>
  );
}