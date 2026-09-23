import { useEffect, useState } from 'react';
import api from '../api/axios';
import BottomNav from '../components/BottomNav';

const statusColors = {
  pending: 'bg-yellow-100 text-yellow-700',
  shipped: 'bg-blue-100 text-blue-700',
  delivered: 'bg-green-100 text-green-700',
  cancelled: 'bg-red-100 text-red-700',
};

export default function Orders() {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api.get('/api/v1/orders/').then((res) => setOrders(res.data.results || [])).finally(() => setLoading(false));
  }, []);

  return (
    <div className="min-h-screen bg-white pb-24">
      <h1 className="text-xl font-bold px-4 pt-4 mb-4">My Orders</h1>
      {loading ? (
        <p className="text-gray-400 text-sm px-4">Loading...</p>
      ) : orders.length === 0 ? (
        <p className="text-gray-500 text-sm px-4">You haven't placed any orders yet.</p>
      ) : (
        <div className="px-4 space-y-3">
          {orders.map((order) => (
            <div key={order.id} className="border border-gray-200 rounded-xl p-4">
              <div className="flex justify-between items-start mb-2">
                <p className="font-semibold text-sm">Order #{order.id}</p>
                <span className={`text-xs font-semibold px-2 py-1 rounded-full ${statusColors[order.status] || 'bg-gray-100 text-gray-600'}`}>{order.status}</span>
              </div>
              <p className="text-gray-400 text-xs mb-2">{new Date(order.created_at).toLocaleDateString()} • {order.items?.length || 0} item(s)</p>
              <p className="text-primary font-bold">₦{Number(order.total).toLocaleString()}</p>
            </div>
          ))}
        </div>
      )}
      <BottomNav />
    </div>
  );
}