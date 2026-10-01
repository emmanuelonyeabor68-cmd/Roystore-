import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { ShoppingBag, Wallet, Users, Package, Eye } from 'lucide-react';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts';
import api from '../api/axios';
import { fetchAll, naira, dailySales, STATUSES, STATUS_COLORS } from './utils';
import { StatusBadge, PageHeader } from './AdminUI';

const DAY = 24 * 60 * 60 * 1000;

export default function AdminDashboard() {
  const [orders, setOrders] = useState([]);
  const [customers, setCustomers] = useState([]);
  const [productCount, setProductCount] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    Promise.all([
      fetchAll('/api/v1/orders/'),
      fetchAll('/auth/users/'),
      api.get('/api/v1/products/'),
    ])
      .then(([o, u, p]) => {
        setOrders(o);
        setCustomers(u.filter((x) => !x.is_staff));
        setProductCount(p.data.count ?? (p.data.results || []).length);
      })
      .catch(() => setError('Could not load dashboard data.'))
      .finally(() => setLoading(false));
  }, []);

  const now = Date.now();
  const valid = orders.filter((o) => o.status !== 'cancelled');
  const totalSales = valid.reduce((s, o) => s + Number(o.total), 0);
  const last30 = orders.filter((o) => now - new Date(o.created_at).getTime() <= 30 * DAY);
  const last30Sales = last30.filter((o) => o.status !== 'cancelled').reduce((s, o) => s + Number(o.total), 0);
  const newCustomers = customers.filter((c) => now - new Date(c.date_joined).getTime() <= 30 * DAY).length;

  const cards = [
    { label: 'Total Orders', value: orders.length, sub: `${last30.length} in the last 30 days`, icon: ShoppingBag, tint: 'bg-primary/10 text-primary' },
    { label: 'Total Sales', value: naira(totalSales), sub: `${naira(last30Sales)} in the last 30 days`, icon: Wallet, tint: 'bg-green-100 text-green-600' },
    { label: 'Customers', value: customers.length, sub: `${newCustomers} joined in the last 30 days`, icon: Users, tint: 'bg-orange-100 text-orange-500' },
    { label: 'Products', value: productCount, sub: 'In your catalog', icon: Package, tint: 'bg-blue-100 text-blue-600' },
  ];

  const statusData = STATUSES.map((s) => ({ name: s, value: orders.filter((o) => o.status === s).length, color: STATUS_COLORS[s] }));
  const pieData = orders.length ? statusData.filter((d) => d.value > 0) : [{ name: 'none', value: 1, color: '#E5E7EB' }];
  const recent = [...orders].sort((a, b) => new Date(b.created_at) - new Date(a.created_at)).slice(0, 5);

  return (
    <div>
      <PageHeader title="Admin Dashboard" subtitle="Overview of your store" />

      {loading ? (
        <p className="text-gray-400 text-sm">Loading...</p>
      ) : error ? (
        <p className="text-red-500 text-sm">{error}</p>
      ) : (
        <>
          <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4 mb-6">
            {cards.map(({ label, value, sub, icon: Icon, tint }) => (
              <div key={label} className="bg-white border border-gray-100 rounded-2xl p-5 flex items-start gap-4">
                <div className={`w-11 h-11 rounded-xl flex items-center justify-center shrink-0 ${tint}`}><Icon size={20} /></div>
                <div className="min-w-0">
                  <p className="text-sm text-gray-500">{label}</p>
                  <p className="text-2xl font-bold truncate">{value}</p>
                  <p className="text-xs text-gray-400 mt-1">{sub}</p>
                </div>
              </div>
            ))}
          </div>

          <div className="grid grid-cols-1 xl:grid-cols-3 gap-4 mb-6">
            <div className="xl:col-span-2 bg-white border border-gray-100 rounded-2xl p-5">
              <h2 className="font-bold mb-4">Sales — last 30 days</h2>
              <div className="h-64">
                <ResponsiveContainer width="100%" height="100%">
                  <AreaChart data={dailySales(orders, 30)}>
                    <defs>
                      <linearGradient id="salesFill" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="0%" stopColor="#5B2EE0" stopOpacity={0.25} />
                        <stop offset="100%" stopColor="#5B2EE0" stopOpacity={0} />
                      </linearGradient>
                    </defs>
                    <CartesianGrid strokeDasharray="3 3" vertical={false} />
                    <XAxis dataKey="date" tick={{ fontSize: 12 }} interval="preserveStartEnd" />
                    <YAxis tick={{ fontSize: 12 }} width={48} tickFormatter={(v) => (v >= 1000 ? `${v / 1000}k` : v)} />
                    <Tooltip formatter={(v) => naira(v)} />
                    <Area type="monotone" dataKey="sales" stroke="#5B2EE0" strokeWidth={2} fill="url(#salesFill)" />
                  </AreaChart>
                </ResponsiveContainer>
              </div>
            </div>

            <div className="bg-white border border-gray-100 rounded-2xl p-5">
              <h2 className="font-bold mb-4">Order Status</h2>
              <div className="flex items-center gap-5">
                <div className="relative w-40 h-40 shrink-0">
                  <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                      <Pie data={pieData} dataKey="value" innerRadius={50} outerRadius={72} paddingAngle={2}>
                        {pieData.map((d) => <Cell key={d.name} fill={d.color} />)}
                      </Pie>
                    </PieChart>
                  </ResponsiveContainer>
                  <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
                    <p className="text-xl font-bold">{orders.length}</p>
                    <p className="text-xs text-gray-400">Total</p>
                  </div>
                </div>
                <div className="space-y-2 flex-1">
                  {statusData.map((d) => (
                    <div key={d.name} className="flex items-center justify-between text-sm">
                      <span className="flex items-center gap-2 capitalize">
                        <span className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: d.color }} />
                        {d.name}
                      </span>
                      <span className="font-semibold">{d.value}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>

          <div className="bg-white border border-gray-100 rounded-2xl overflow-hidden">
            <div className="flex items-center justify-between p-5">
              <h2 className="font-bold">Recent Orders</h2>
              <Link to="/admin/orders" className="text-primary text-sm font-semibold">View all</Link>
            </div>
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
                  {recent.length === 0 ? (
                    <tr><td colSpan={6} className="px-5 py-8 text-center text-gray-400">No orders yet.</td></tr>
                  ) : recent.map((o) => (
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
                        <Link to={`/admin/orders?view=${o.id}`} className="text-gray-400 hover:text-primary"><Eye size={18} /></Link>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </>
      )}
    </div>
  );
}