import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ArrowLeft } from 'lucide-react';
import api from '../api/axios';
import BottomNav from '../components/BottomNav';

const statusColors = {
  pending: 'bg-yellow-100 text-yellow-700',
  shipped: 'bg-blue-100 text-blue-700',
  delivered: 'bg-green-100 text-green-700',
  cancelled: 'bg-red-100 text-red-700',
};

export default function OrderDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api.get(`/api/v1/orders/${id}/`).then((res) => setOrder(res.data)).finally(() => setLoading(false));
  }, [id]);

  if (loading) return <p className="p-4 text-gray-400 text-sm">Loading...</p>;
  if (!order) return <p className="p-4 text-gray-400 text-sm">Order not found.</p>;

  return (
    <div className="min-h-screen bg-white pb-24">
      <div className="flex items-center gap-3 px-4 pt-4 mb-4">
        <button onClick={() => navigate(-1)}><ArrowLeft size={22} /></button>
        <h1 className="text-lg font-bold">Order #{order.id}</h1>
      </div>

      <div className="px-4">
        <div className="flex justify-between items-center mb-6">
          <span className={`text-xs font-semibold px-3 py-1 rounded-full ${statusColors[order.status] || 'bg-gray-100 text-gray-600'}`}>
            {order.status}
          </span>
          <span className="text-gray-400 text-xs">{new Date(order.created_at).toLocaleDateString()}</span>
        </div>

        <p className="text-xs font-semibold text-gray-400 uppercase mb-2">Items</p>
        <div className="space-y-3 mb-6">
          {order.items?.map((item) => (
            <div key={item.id} className="flex justify-between items-center border border-gray-100 rounded-xl p-3">
              <div>
                <p className="font-semibold text-sm">{item.product_name}</p>
                <p className="text-gray-400 text-xs">Qty: {item.quantity}</p>
              </div>
              <p className="text-primary font-bold text-sm">₦{Number(item.price * item.quantity).toLocaleString()}</p>
            </div>
          ))}
        </div>

        <p className="text-xs font-semibold text-gray-400 uppercase mb-2">Delivery Details</p>
        <div className="border border-gray-100 rounded-xl p-3 mb-6">
          <p className="text-sm mb-1">{order.shipping_address}</p>
          <p className="text-sm text-gray-500">{order.phone_number}</p>
        </div>

        <div className="flex justify-between items-center border-t border-gray-100 pt-4">
          <span className="font-semibold">Total</span>
          <span className="text-primary font-bold text-lg">₦{Number(order.total).toLocaleString()}</span>
        </div>
      </div>

      <BottomNav />
    </div>
  );
}