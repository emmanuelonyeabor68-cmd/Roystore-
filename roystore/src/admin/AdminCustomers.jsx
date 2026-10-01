import { useEffect, useMemo, useState } from 'react';
import { Search } from 'lucide-react';
import { useFetchAll, naira } from './utils';
import { PageHeader, Pager } from './AdminUI';

const PER_PAGE = 10;

export default function AdminCustomers() {
  const users = useFetchAll('/auth/users/');
  const orders = useFetchAll('/api/v1/orders/');
  const [q, setQ] = useState('');
  const [page, setPage] = useState(1);

  useEffect(() => { setPage(1); }, [q]);

  const rows = useMemo(() => {
    const stats = {};
    orders.data.forEach((o) => {
      const s = (stats[o.customer_email] = stats[o.customer_email] || { count: 0, spent: 0 });
      s.count += 1;
      if (o.status !== 'cancelled') s.spent += Number(o.total);
    });
    const term = q.trim().toLowerCase();
    return users.data
      .filter((u) => !u.is_staff)
      .map((u) => ({ ...u, orders: stats[u.email]?.count || 0, spent: stats[u.email]?.spent || 0 }))
      .filter((u) => !term || (u.full_name || '').toLowerCase().includes(term) || u.email.toLowerCase().includes(term))
      .sort((a, b) => new Date(b.date_joined) - new Date(a.date_joined));
  }, [users.data, orders.data, q]);

  const loading = users.loading || orders.loading;
  const error = users.error || orders.error;
  const pages = Math.max(1, Math.ceil(rows.length / PER_PAGE));
  const pageItems = rows.slice((page - 1) * PER_PAGE, page * PER_PAGE);

  return (
    <div>
      <PageHeader title="Customers" subtitle={`${rows.length} registered customer${rows.length === 1 ? '' : 's'}`} />

      <div className="bg-white border border-gray-100 rounded-2xl overflow-hidden">
        <div className="p-4">
          <div className="flex items-center border border-gray-200 rounded-xl px-3 py-2 sm:w-72">
            <Search size={16} className="text-gray-400 mr-2" />
            <input value={q} onChange={(e) => setQ(e.target.value)} placeholder="Search name or email" className="w-full outline-none text-sm" />
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
                    <th className="px-5 py-3 font-medium">Customer</th>
                    <th className="px-5 py-3 font-medium">Joined</th>
                    <th className="px-5 py-3 font-medium">Orders</th>
                    <th className="px-5 py-3 font-medium">Total spent</th>
                  </tr>
                </thead>
                <tbody>
                  {pageItems.length === 0 ? (
                    <tr><td colSpan={4} className="px-5 py-8 text-center text-gray-400">No customers found.</td></tr>
                  ) : pageItems.map((u) => (
                    <tr key={u.id} className="border-t border-gray-100">
                      <td className="px-5 py-3">
                        <div className="flex items-center gap-3">
                          <div className="w-9 h-9 rounded-full bg-primary/10 text-primary font-bold flex items-center justify-center shrink-0">
                            {(u.full_name || u.email)[0].toUpperCase()}
                          </div>
                          <div>
                            <p className="font-medium">{u.full_name || '—'}</p>
                            <p className="text-xs text-gray-400">{u.email}</p>
                          </div>
                        </div>
                      </td>
                      <td className="px-5 py-3 text-gray-500">{new Date(u.date_joined).toLocaleDateString()}</td>
                      <td className="px-5 py-3">{u.orders}</td>
                      <td className="px-5 py-3 font-semibold">{naira(u.spent)}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            <Pager page={page} pages={pages} onChange={setPage} />
          </>
        )}
      </div>
    </div>
  );
}