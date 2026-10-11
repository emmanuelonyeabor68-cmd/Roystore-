import { useEffect, useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Bell, Search, ChevronRight } from 'lucide-react';
import api from '../api/axios';
import BottomNav from '../components/BottomNav';

const TABS = ['All', 'Pending', 'Shipped', 'Delivered', 'Cancelled'];

const STATUS_STYLES = {
  pending: 'bg-yellow-100 text-yellow-700',
  shipped: 'bg-blue-100 text-blue-700',
  delivered: 'bg-green-100 text-green-700',
  cancelled: 'bg-red-100 text-red-700',
};

export default function Orders() {
  const [orders, setOrders] = useState([]);
  const [nextUrl, setNextUrl] = useState(null);
  const [loading, setLoading] = useState(true);
  const [loadingMore, setLoadingMore] = useState(false);
  const [tab, setTab] = useState('All');
  const [q, setQ] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    api.get('/api/v1/orders/').then((res) => {
      setOrders(res.data.results || []);
      setNextUrl(res.data.next);
    }).finally(() => setLoading(false));
  }, []);

  const loadMore = async () => {
    if (!nextUrl) return;
    setLoadingMore(true);
    const res = await api.get(nextUrl);
    setOrders((prev) => [...prev, ...(res.data.results || [])]);
    setNextUrl(res.data.next);
    setLoadingMore(false);
  };

  const filtered = useMemo(() => {
    const term = q.trim().toLowerCase().replace('#', '');
    return orders.filter((o) => {
      const matchesTab = tab === 'All' || o.status === tab.toLowerCase();
      const matchesQ = !term || String(o.id).includes(term);
      return matchesTab && matchesQ;
    });
  }, [orders, tab, q]);

  return (
    <div className="min-h-screen bg-white pb-24 lg:pb-12">
      <div className="mx-auto max-w-5xl lg:pl-64">
        <div className="sticky top-0 z-40 flex justify-between items-center px-4 pt-4 pb-4 mb-4 bg-white">
          <h1 className="text-xl font-extrabold">My Orders</h1>
          <button
            type="button"
            onClick={() => navigate('/notifications')}
            aria-label="Notifications"
            className="text-gray-700"
          >
            <Bell size={22} />
          </button>
        </div>

        <div className="flex items-center border border-gray-200 rounded-xl mx-4 px-3 py-2.5 mb-4">
          <Search size={18} className="text-gray-400 mr-2" />
          <input
            value={q}
            onChange={(e) => setQ(e.target.value)}
            placeholder="Search your orders..."
            className="w-full outline-none text-sm"
          />
        </div>

        <div className="flex gap-2 overflow-x-auto px-4 mb-5 pb-1" style={{ scrollbarWidth: 'none' }}>
          {TABS.map((t) => (
            <button
              key={t}
              onClick={() => setTab(t)}
              className={`shrink-0 px-4 py-2 rounded-full text-sm font-medium border ${
                tab === t ? 'border-primary text-primary bg-primary/5' : 'border-gray-200 text-gray-600'
              }`}
            >
              {t}
            </button>
          ))}
        </div>

        <div className="px-4 space-y-3">
          {loading ? (
            <p className="text-gray-400 text-sm">Loading...</p>
          ) : filtered.length === 0 ? (
            <p className="text-gray-500 text-sm">No orders found.</p>
          ) : (
            filtered.map((order) => (
              <button
                key={order.id}
                onClick={() => navigate(`/orders/${order.id}`)}
                className="w-full flex items-center gap-3 border border-gray-100 rounded-2xl p-3 text-left"
              >
                <img
                  src={order.product_image}
                  alt=""
                  className="w-16 h-16 rounded-xl object-cover bg-gray-50 shrink-0"
                />
                <div className="flex-1 min-w-0">
                  <div className="flex justify-between items-start gap-2">
                    <p className="font-bold text-sm truncate"></p>
                    <span className={`shrink-0 text-xs font-semibold px-2.5 py-1 rounded-full capitalize ${STATUS_STYLES[order.status] || 'bg-gray-100 text-gray-600'}`}>
                      {order.status}
                    </span>
                  </div>
                  <p className="text-gray-400 text-xs mt-0.5">
                    {new Date(order.created_at).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })} • {order.items?.length || 0} item{order.items?.length === 1 ? '' : 's'}
                  </p>
                  <p className="text-primary font-bold text-sm mt-1">₦{Number(order.total).toLocaleString()}</p>
                </div>
                <ChevronRight size={18} className="text-gray-300 shrink-0" />
              </button>
            ))
          )}
        </div>

        {nextUrl && (
          <div className="px-4 mt-4">
            <button onClick={loadMore} disabled={loadingMore} className="w-full border border-gray-200 rounded-xl py-3 text-sm font-medium disabled:opacity-60">
              {loadingMore ? 'Loading...' : 'Load More'}
            </button>
          </div>
        )}
      </div>

      <BottomNav />
    </div>
  );
}
