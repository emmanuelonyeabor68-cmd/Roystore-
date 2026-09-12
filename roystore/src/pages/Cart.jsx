import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Trash2, Minus, Plus } from 'lucide-react';
import api from '../api/axios';
import BottomNav from '../components/BottomNav';

export default function Cart() {
  const [cart, setCart] = useState(null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  const loadCart = () => {
    api.get('/api/v1/cart/').then((res) => setCart(res.data)).finally(() => setLoading(false));
  };

  useEffect(() => { loadCart(); }, []);

  const updateQty = async (itemId, quantity) => {
    if (quantity < 1) return;
    await api.patch(`/api/v1/cart-items/${itemId}/`, { quantity });
    loadCart();
  };

  const removeItem = async (itemId) => {
    await api.delete(`/api/v1/cart-items/${itemId}/`);
    loadCart();
  };

  const handleCheckout = () => navigate('/checkout');

  if (loading) return <p className="p-4 text-gray-400 text-sm">Loading...</p>;

  const items = cart?.items || [];
  const total = items.reduce((sum, i) => sum + i.product.price * i.quantity, 0);

  return (
    <div className="min-h-screen bg-white pb-24">
      <h1 className="text-xl font-bold px-4 pt-4 mb-4">Your Cart</h1>

      {items.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-20 px-4 text-center">
          <p className="text-gray-500 mb-4">Your cart is empty</p>
          <button onClick={() => navigate('/products')} className="bg-primary text-white font-semibold rounded-xl px-6 py-3">
            Continue Shopping
          </button>
        </div>
      ) : (
        <>
          <div className="px-4 space-y-3">
            {items.map((item) => {
              const inStock = item.product.stock > 0;
              return (
                <div key={item.id} className="border border-gray-200 rounded-xl p-3 flex gap-3">
                  <img
                    src={item.product.image}
                    alt={item.product.name}
                    className={`w-20 h-20 rounded-lg object-cover ${inStock ? '' : 'opacity-40'}`}
                  />
                  <div className="flex-1">
                    <div className="flex justify-between">
                      <p className="font-semibold text-sm">{item.product.name}</p>
                      <button onClick={() => removeItem(item.id)}><Trash2 size={16} className="text-gray-400" /></button>
                    </div>
                    {inStock ? (
                      <>
                        <p className="text-primary font-bold text-sm mb-2">₦{Number(item.product.price).toLocaleString()}</p>
                        <div className="flex items-center border border-gray-200 rounded-lg w-fit">
                          <button onClick={() => updateQty(item.id, item.quantity - 1)} className="p-1.5"><Minus size={14} /></button>
                          <span className="px-3 text-sm">{item.quantity}</span>
                          <button onClick={() => updateQty(item.id, item.quantity + 1)} className="p-1.5"><Plus size={14} /></button>
                        </div>
                      </>
                    ) : (
                      <p className="text-red-500 text-xs font-semibold">No longer available — please remove</p>
                    )}
                  </div>
                </div>
              );
            })}
          </div>

          <div className="px-4 mt-6 border-t border-gray-100 pt-4">
            <div className="flex justify-between mb-4">
              <span className="font-semibold">Total</span>
              <span className="font-bold text-primary">₦{total.toLocaleString()}</span>
            </div>
            <button onClick={handleCheckout} className="w-full bg-primary text-white font-semibold rounded-xl py-3">
              Proceed to Checkout
            </button>
          </div>
        </>
      )}

      <BottomNav cartCount={items.length} />
    </div>
  );
}