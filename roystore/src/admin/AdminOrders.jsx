import { useEffect, useMemo, useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import { Eye, Search } from 'lucide-react';
import api from '../api/axios';
import { useFetchAll, naira, STATUSES, formatError } from './utils';
import { StatusBadge, Modal, PageHeader, Pager } from './AdminUI';

const PER_PAGE = 10;

function OrderModal({ order, onClose, onUpdated }) {
  const [status, setStatus] = useState(order.status);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');
  const [saved, setSaved] = useState(false);

  const save = async () => {
    setSaving(true);
    setError('');
    setSaved(false);
    try {
      const res = await api.patch(`/api/v1/orders/${order.id}/`, { status });
      onUpdated(res.data);
      setSaved(true);
    } catch (e) {
      setError(formatError(e));
    } finally {
      setSaving(false);
    }
  };

  return (
    <Modal title={`Order #${order.id}`} onClose={onClose} wide>
      <div className="flex items-center justify-between mb-5">
        <StatusBadge status={order.status} />
        <span className="text-xs text-gray-400">{new Date(order.created_at).toLocaleString()}</span>
      </div>

      <div className="grid md:grid-cols-2 gap-4 mb-5">
        <div className="border border-gray-100 rounded-xl p-3">
          <p className="text-xs uppercase text-gray-400 font-semibold mb-1">Customer</p>
          <p className="text-sm font-medium">{order.customer_name}</p>
          <p className="text-sm text-gray-500">{order.customer_email}</p>
        </div>
        <div className="border border-gray-100 rounded-xl p-3">
          <p className="text-xs uppercase text-gray-400 font-semibold mb-1">Delivery</p>
          <p className="text-sm">{order.shipping_address}</p>
          <p className="text-sm text-gray-500">{order.phone_number}</p>
        </div>
      </div>

      <p className="text-xs uppercase text-gray-400 font-semibold mb-2">Items</p>
      <div className="space-y-2 mb-4">
        {(order.items || []).map((i) => (
          <div key={i.id} className="flex justify-between border border-gray-100 rounded-xl p-3 text-sm">
            <div>
              <p className="font-medium">{i.product_name}</p>
              <p className="text-xs text-gray-400">{naira(i.price)} × {i.quantity}</p>
            </div>
            <p className="font-semibold">{naira(Number(i.price) * i.quantity)}</p>
          </div>
        ))}
      </div>

      <div className="flex justify-between border-t border-gray-100 pt-3 mb-5">
        <span className="font-semibold">Total</span>
        <span className="font-bold text-primary">{naira(order.total)}</span>
      </div>

      <p className="text-xs uppercase text-gray-400 font-semibold mb-2">Update status</p>
      <div className="flex gap-3">
        <select value={status} onChange={(e) => setStatus(e.target.value)} className="flex-1 border border-gray-200 rounded-xl px-3 py-2.5 text-sm capitalize">
          {STATUSES.map((s) => <option key={s} value={s}>{s}</option>)}
        </select>
        <button onClick={save} disabled={saving || status === order.status} className="bg-primary text-white text-sm font-semibold rounded-xl px-5 disabled:opacity-50">
          {saving ? 'Saving...' : 'Update'}
        </button>
      </div>
      {error && <p className="text-red-500 text-sm mt-2">{error}</p>}
      {saved && <p className="text-green-600 text-sm mt-2">Status updated.</p>}
      <p className="text-xs text-gray-400 mt-3">Note: cancelling an order does not return its items to stock yet.</p>
    </Modal>
  );
}

export default function AdminOrders() {
  const { data, setData, loading, error } = useFetchAll('/api/v1/orders/');
  const [params, setParams] = useSearchParams();
  const [tab, setTab] = useState('all');
  const [q, setQ] = useState('');
  const [page, setPage] = useState(1);

  useEffect(() => { setPage(1); }, [tab, q]);

  const sorted = useMemo(
    () => [...data].sort((a, b) => new Date(b.created_at) - new Date(a.created_at)),
    [data]
  );

  const filtered = useMemo(() => {
    const term = q.trim().toLowerCase().replace('#', '');
    return sorted.filter((o) => {
      const matchesTab = tab === 'all' || o.status === tab;
      const matchesQ =
        !term ||
        String(o.id).includes(term) ||
        (o.customer_name || '').toLowerCase().includes(term) ||
        (o.customer_email || '').toLowerCase().includes(term);
      return matchesTab && matchesQ;
    });
  }, [sorted, tab, q]);

  const pages = Math.max(1, Math.ceil(filtered.length / PER_PAGE));
  const pageItems = filtered.slice((page - 1) * PER_PAGE, page * PER_PAGE);
  const viewing = data.find((o) => String(o.id) === params.get('view'));

  const tabs = ['all', ...STATUSES];
  const countFor = (t) => (t === 'all' ? data.length : data.filter((o) => o.status === t).length);

  return (
    <div>
      <PageHeader title="Orders" subtitle="Review and update customer orders" />

      <div className="bg-white border border-gray-100 rounded-2xl overflow-hidden">
        <div className="p-4 flex flex-col lg:flex-row lg:items-center lg:justify-between gap-3">
          <div className="flex gap-2 overflow-x-auto" style={{ scrollbarWidth: 'none' }}>
            {tabs.map((t) => (
              <button
                key={t}
                onClick={() => setTab(t)}
                className={`shrink-0 px-4 py-2 rounded-full text-sm font-medium border capitalize ${
                  tab === t ? 'border-primary text-primary bg-primary/5' : 'border-gray-200 text-gray-600'
                }`}
              >
                {t} ({countFor(t)})
              </button>
            ))}
          </div>
          <div className="flex items-center border border-gray-200 rounded-xl px-3 py-2 lg:w-72">
            <Search size={16} className="text-gray-400 mr-2" />
            <input value={q} onChange={(e) => setQ(e.target.value)} placeholder="Order ID, name or email" className="w-full outline-none text-sm" />
          </div>
        </div>

        {loading ? (
          <p className="text-gray-400 text-sm p-5">Loading...</p>
        ) : error ? (
          <p className="text-red-500 text-sm p-5">{error}</p>
        ) : (
          <>
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead className="bg-gray-50 text-left text-xs uppercase text-gray-400">
                  <tr>
                    <th className="px-5 py-3 font-medium">Order</th>
                    <th className="px-5 py-3 font-medium">Customer</th>
                    <th className="px-5 py-3 font-medium">Date</th>
                    <th className="px-5 py-3 font-medium">Status</th>
                    <th className="px-5 py-3 font-medium">Total</th>
                    <th className="px-5 py-3 font-medium">View</th>
                  </tr>
                </thead>
                <tbody>
                  {pageItems.length === 0 ? (
                    <tr><td colSpan={6} className="px-5 py-8 text-center text-gray-400">No orders match.</td></tr>
                  ) : pageItems.map((o) => (
                    <tr key={o.id} className="border-t border-gray-100">
                      <td className="px-5 py-3 font-semibold">#{o.id}</td>
                      <td className="px-5 py-3">
                        <p className="font-medium">{o.customer_name}</p>
                        <p className="text-xs text-gray-400">{o.customer_email}</p>
                      </td>
                      <td className="px-5 py-3 text-gray-500">{new Date(o.created_at).toLocaleDateString()}</td>
                      <td className="px-5 py-3"><StatusBadge status={o.status} /></td>
                      <td className="px-5 py-3 font-semibold">{naira(o.total)}</td>
                      <td className="px-5 py-3">
                        <button onClick={() => setParams({ view: o.id })} className="text-gray-400 hover:text-primary"><Eye size={18} /></button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            <Pager page={page} pages={pages} onChange={setPage} />
          </>
        )}
      </div>

      {viewing && (
        <OrderModal
          key={viewing.id}
          order={viewing}
          onClose={() => setParams({})}
          onUpdated={(updated) => setData((prev) => prev.map((o) => (o.id === updated.id ? updated : o)))}
        />
      )}
    </div>
  );
}