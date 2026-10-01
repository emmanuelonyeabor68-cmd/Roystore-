import { useMemo, useState } from 'react';
import { Download } from 'lucide-react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { useFetchAll, naira, dailySales, STATUSES, STATUS_COLORS } from './utils';
import { PageHeader } from './AdminUI';

const DAY = 24 * 60 * 60 * 1000;

export default function AdminReports() {
  const orders = useFetchAll('/api/v1/orders/');
  const products = useFetchAll('/api/v1/products/');
  const [range, setRange] = useState(30);

  const inRange = useMemo(
    () => orders.data.filter((o) => Date.now() - new Date(o.created_at).getTime() <= range * DAY),
    [orders.data, range]
  );
  const valid = inRange.filter((o) => o.status !== 'cancelled');
  const sales = valid.reduce((s, o) => s + Number(o.total), 0);
  const avg = valid.length ? sales / valid.length : 0;
  const cancelled = inRange.filter((o) => o.status === 'cancelled').length;
  const cancelRate = inRange.length ? ((cancelled / inRange.length) * 100).toFixed(1) : '0.0';

  const topProducts = useMemo(() => {
    const map = {};
    valid.forEach((o) =>
      (o.items || []).forEach((i) => {
        const p = (map[i.product_name] = map[i.product_name] || { name: i.product_name, units: 0, sales: 0 });
        p.units += i.quantity;
        p.sales += Number(i.price) * i.quantity;
      })
    );
    return Object.values(map).sort((a, b) => b.units - a.units).slice(0, 5);
  }, [valid]);

  const lowStock = products.data.filter((p) => p.stock <= 5).sort((a, b) => a.stock - b.stock);

  const exportCsv = () => {
    const rows = [['Order ID', 'Date', 'Customer', 'Email', 'Phone', 'Address', 'Status', 'Total']];
    inRange.forEach((o) =>
      rows.push([o.id, new Date(o.created_at).toLocaleDateString(), o.customer_name, o.customer_email, o.phone_number, o.shipping_address, o.status, o.total])
    );
    const csv = rows.map((r) => r.map((c) => `"${String(c ?? '').replace(/"/g, '""')}"`).join(',')).join('\n');
    const url = URL.createObjectURL(new Blob([csv], { type: 'text/csv;charset=utf-8;' }));
    const a = document.createElement('a');
    a.href = url;
    a.download = `roystore-orders-${range}d.csv`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const loading = orders.loading || products.loading;
  const error = orders.error || products.error;

  const kpis = [
    { label: 'Orders', value: inRange.length },
    { label: 'Sales', value: naira(sales) },
    { label: 'Average order', value: naira(Math.round(avg)) },
    { label: 'Cancelled', value: `${cancelRate}%` },
  ];

  return (
    <div>
      <PageHeader
        title="Reports"
        subtitle="Sales and inventory insights"
        action={
          <div className="flex items-center gap-3">
            <select value={range} onChange={(e) => setRange(Number(e.target.value))} className="border border-gray-200 rounded-xl px-3 py-2.5 text-sm bg-white">
              <option value={7}>Last 7 days</option>
              <option value={30}>Last 30 days</option>
              <option value={90}>Last 90 days</option>
            </select>
            <button onClick={exportCsv} disabled={loading || inRange.length === 0} className="flex items-center gap-2 bg-primary text-white text-sm font-semibold rounded-xl px-4 py-2.5 disabled:opacity-50">
              <Download size={16} /> Export CSV
            </button>
          </div>
        }
      />

      {loading ? (
        <p className="text-gray-400 text-sm">Loading...</p>
      ) : error ? (
        <p className="text-red-500 text-sm">{error}</p>
      ) : (
        <>
          <div className="grid grid-cols-2 xl:grid-cols-4 gap-4 mb-6">
            {kpis.map((k) => (
              <div key={k.label} className="bg-white border border-gray-100 rounded-2xl p-5">
                <p className="text-sm text-gray-500">{k.label}</p>
                <p className="text-2xl font-bold mt-1 truncate">{k.value}</p>
              </div>
            ))}
          </div>

          <div className="bg-white border border-gray-100 rounded-2xl p-5 mb-6">
            <h2 className="font-bold mb-4">Sales per day</h2>
            <div className="h-64">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={dailySales(orders.data, range)}>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} />
                  <XAxis dataKey="date" tick={{ fontSize: 12 }} interval="preserveStartEnd" />
                  <YAxis tick={{ fontSize: 12 }} width={48} tickFormatter={(v) => (v >= 1000 ? `${v / 1000}k` : v)} />
                  <Tooltip formatter={(v) => naira(v)} />
                  <Bar dataKey="sales" fill="#5B2EE0" radius={[4, 4, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>

          <div className="grid grid-cols-1 xl:grid-cols-3 gap-4">
            <div className="bg-white border border-gray-100 rounded-2xl p-5">
              <h2 className="font-bold mb-4">Top products</h2>
              {topProducts.length === 0 ? (
                <p className="text-gray-400 text-sm">No sales in this period.</p>
              ) : topProducts.map((p) => (
                <div key={p.name} className="flex justify-between text-sm py-2 border-b border-gray-50 last:border-0">
                  <div>
                    <p className="font-medium">{p.name}</p>
                    <p className="text-xs text-gray-400">{p.units} sold</p>
                  </div>
                  <p className="font-semibold">{naira(p.sales)}</p>
                </div>
              ))}
            </div>

            <div className="bg-white border border-gray-100 rounded-2xl p-5">
              <h2 className="font-bold mb-4">Orders by status</h2>
              {STATUSES.map((s) => {
                const n = inRange.filter((o) => o.status === s).length;
                const pct = inRange.length ? (n / inRange.length) * 100 : 0;
                return (
                  <div key={s} className="mb-3">
                    <div className="flex justify-between text-sm mb-1">
                      <span className="capitalize">{s}</span>
                      <span className="font-semibold">{n}</span>
                    </div>
                    <div className="h-2 bg-gray-100 rounded-full overflow-hidden">
                      <div className="h-full rounded-full" style={{ width: `${pct}%`, backgroundColor: STATUS_COLORS[s] }} />
                    </div>
                  </div>
                );
              })}
            </div>

            <div className="bg-white border border-gray-100 rounded-2xl p-5">
              <h2 className="font-bold mb-4">Low stock (5 or fewer)</h2>
              {lowStock.length === 0 ? (
                <p className="text-gray-400 text-sm">Everything is well stocked.</p>
              ) : lowStock.map((p) => (
                <div key={p.id} className="flex justify-between text-sm py-2 border-b border-gray-50 last:border-0">
                  <span className="font-medium truncate mr-3">{p.name}</span>
                  <span className={`font-semibold ${p.stock === 0 ? 'text-red-500' : 'text-orange-500'}`}>
                    {p.stock === 0 ? 'Out' : p.stock}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </>
      )}
    </div>
  );
}