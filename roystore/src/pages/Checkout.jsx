import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { CheckCircle2 } from 'lucide-react';
import api from '../api/axios';
import { useCart } from '../context/CartContext';

export default function Checkout() {
  const [address, setAddress] = useState('');
  const [phone, setPhone] = useState('');
  const [placing, setPlacing] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);
  const { refreshCart } = useCart();
  const navigate = useNavigate();

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
      <div className="min-h-screen flex flex-col items-center justify-center px-6 text-center">
        <CheckCircle2 size={64} className="text-primary mb-4" />
        <h1 className="text-xl font-bold mb-2">Order placed successfully!</h1>
        <p className="text-gray-500 text-sm mb-8">We'll be in touch shortly to confirm your order.</p>
        <button onClick={() => navigate('/dashboard')} className="bg-primary text-white font-semibold rounded-xl px-6 py-3">Continue Shopping</button>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white px-5 pt-6 pb-10">
      <h1 className="text-xl font-bold mb-1">Shipping Information</h1>
      <p className="text-gray-500 text-sm mb-6">Where should we deliver your order?</p>

      <form onSubmit={handlePlaceOrder}>
        {error && <p className="text-red-500 text-sm mb-4">{error}</p>}

        <label className="text-sm font-medium block mb-1">Delivery Address</label>
        <textarea value={address} onChange={(e) => setAddress(e.target.value)} rows={3} required placeholder="Enter your full address"
          className="w-full border border-gray-200 rounded-xl px-4 py-3 mb-4 text-sm focus:ring-2 focus:ring-primary focus:border-primary outline-none transition-all resize-none" />

        <label className="text-sm font-medium block mb-1">Phone Number</label>
        <input type="tel" value={phone} onChange={(e) => setPhone(e.target.value)} required placeholder="080..."
          className="w-full border border-gray-200 rounded-xl px-4 py-3 mb-8 text-sm focus:ring-2 focus:ring-primary focus:border-primary outline-none transition-all" />

        <button type="submit" disabled={placing} className="w-full bg-primary text-white font-semibold rounded-xl py-3 disabled:opacity-60">
          {placing ? 'Placing order...' : 'Place Order'}
        </button>
      </form>
    </div>
  );
}