import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { CheckCircle2, ArrowLeft } from 'lucide-react';
import api from '../api/axios';
import { useCart } from '../context/CartContext';
import { SkeletonBlock } from '../components/Skeletons';

export default function Checkout() {
  const [address, setAddress] = useState('');
  const [phone, setPhone] = useState('');
  const [placing, setPlacing] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);
  const [cartLoading, setCartLoading] = useState(true);
  const { refreshCart } = useCart();
  const navigate = useNavigate();
  const [cartTotal, setCartTotal] = useState(0)


  useEffect(() => {
  api.get('/api/v1/cart/').then((res) => {
    const items = res.data.items || [];
    setCartTotal(items.reduce((sum, i) => sum + i.product.price * i.quantity, 0));
  }).finally(() => setCartLoading(false));
}, []);

  const handlePlaceOrder = async (e) => {
    e.preventDefault();
    setError('');
    setPlacing(true);
    try {
      console.log("sending request")
      await api.post('/api/v1/orders/checkout/', { shipping_address: address, phone_number: phone });
      refreshCart();
      setSuccess(true);
    } catch (err) {
      setError(err.response?.data?.error || 'Something went wrong. Please try again.');
    } finally {
      setPlacing(false);
    }
  };

  if (success) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center px-6 text-center relative">
        <button
          onClick={() => navigate(-1)}
          className="absolute top-4 left-4 flex items-center justify-center w-10 h-10 rounded-full bg-white shadow-sm text-gray-700"
          aria-label="Go back"
        >
          <ArrowLeft size={18} />
        </button>
        <CheckCircle2 size={64} className="text-primary mb-4" />
        <h1 className="text-xl font-bold mb-2">Order placed successfully!</h1>
        <p className="text-gray-500 text-sm mb-8">We'll be in touch shortly to confirm your order.</p>
        <button onClick={() => navigate('/dashboard')} className="bg-primary text-white font-semibold rounded-xl px-6 py-3">Continue Shopping</button>
      </div>
    );
  }

  if (cartLoading) {
    return (
      <div role="status" aria-label="Loading checkout" className="min-h-screen bg-white px-5 pt-6">
        <div className="mx-auto max-w-md space-y-5">
          <SkeletonBlock className="h-10 w-56" />
          <SkeletonBlock className="h-4 w-64" />
          <SkeletonBlock className="h-28 w-full rounded-xl" />
          <SkeletonBlock className="h-12 w-full rounded-xl" />
          <SkeletonBlock className="h-32 w-full rounded-2xl" />
          <SkeletonBlock className="h-12 w-full rounded-xl" />
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white px-5 pt-6 pb-10">
      <div className="mx-auto max-w-md">
        <div className="flex items-center gap-3 mb-4">
          <button
            onClick={() => navigate(-1)}
            className="flex items-center justify-center w-10 h-10 rounded-full bg-gray-100 text-gray-700"
            aria-label="Go back"
          >
            <ArrowLeft size={18} />
          </button>
          <h1 className="text-xl font-bold mb-0">Shipping Information</h1>
        </div>
        <p className="text-gray-500 text-sm mb-6">Where should we deliver your order?</p>

        <form onSubmit={handlePlaceOrder} className="w-full">
          {error && <p className="text-red-500 text-sm mb-4">{error}</p>}

          <label className="text-sm font-medium block mb-1">Delivery Address</label>
          <textarea value={address} onChange={(e) => setAddress(e.target.value)} rows={3} required placeholder="Enter your full address"
            className="w-full border border-gray-200 rounded-xl px-4 py-3 mb-4 text-sm focus:ring-2 focus:ring-primary focus:border-primary outline-none transition-all resize-none" />

          <label className="text-sm font-medium block mb-1">Phone Number</label>
          <input type="tel" value={phone} onChange={(e) => setPhone(e.target.value)} required placeholder="080..."
            className="w-full border border-gray-200 rounded-xl px-4 py-3 mb-8 text-sm focus:ring-2 focus:ring-primary focus:border-primary outline-none transition-all" />
          <div className="border border-gray-100 rounded-2xl p-4 mb-6 space-y-2">
            <div className="flex justify-between text-sm">
              <span className="text-gray-500">Subtotal</span>
              <span>₦{Number(cartTotal).toLocaleString()}</span>
            </div>

            <div className="flex justify-between text-sm">
              <span className="text-gray-500">Delivery Fee</span>
              <span className="text-green-600 font-semibold">Free</span>
            </div>
            <div className="flex justify-between items-center pt-2 border-t border-gray-100">
              <span className="font-semibold">Total</span>
              <span className="text-primary font-bold text-lg">₦{Number(cartTotal).toLocaleString()}</span>
            </div>
          </div>

          <button type="submit" disabled={placing} className="w-full bg-primary text-white font-semibold rounded-xl py-3 disabled:opacity-60">
            {placing ? 'Placing order...' : 'Place Order'}
          </button>
        </form>
      </div>
    </div>
  );
}