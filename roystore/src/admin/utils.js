import { useCallback, useEffect, useState } from 'react';
import api from '../api/axios';

export const naira = (n) => `₦${Number(n || 0).toLocaleString()}`;

export const STATUSES = ['pending', 'shipped', 'delivered', 'cancelled'];

export const STATUS_STYLES = {
  pending: 'bg-yellow-100 text-yellow-700',
  shipped: 'bg-blue-100 text-blue-700',
  delivered: 'bg-green-100 text-green-700',
  cancelled: 'bg-red-100 text-red-700',
};

export const STATUS_COLORS = {
  pending: '#F59E0B',
  shipped: '#3B82F6',
  delivered: '#22C55E',
  cancelled: '#EF4444',
};

// Follows DRF pagination ("next") until every page is loaded
export async function fetchAll(url) {
  let results = [];
  let next = url;
  while (next) {
    const res = await api.get(next);
    if (Array.isArray(res.data)) return res.data;
    results = results.concat(res.data.results || []);
    next = res.data.next;
  }
  return results;
}

export function useFetchAll(url) {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const load = useCallback(async () => {
    setLoading(true);
    setError('');
    try {
      setData(await fetchAll(url));
    } catch (e) {
      setError('Could not load data. Please try again.');
    } finally {
      setLoading(false);
    }
  }, [url]);

  useEffect(() => { load(); }, [load]);

  return { data, setData, loading, error, reload: load };
}

// Turns a DRF error response into one readable line
export function formatError(err) {
  const data = err.response?.data;
  if (!data || typeof data === 'string') return 'Something went wrong. Please try again.';
  if (data.detail) return data.detail;
  return Object.entries(data)
    .map(([k, v]) => `${k}: ${Array.isArray(v) ? v.join(' ') : v}`)
    .join(' • ');
}

// Sales per day for the last N days (cancelled orders excluded)
export function dailySales(orders, days) {
  const keys = [];
  const totals = {};
  for (let i = days - 1; i >= 0; i--) {
    const d = new Date();
    d.setDate(d.getDate() - i);
    const key = d.toISOString().slice(0, 10);
    keys.push(key);
    totals[key] = 0;
  }
  orders.forEach((o) => {
    if (o.status === 'cancelled') return;
    const key = o.created_at.slice(0, 10);
    if (key in totals) totals[key] += Number(o.total);
  });
  return keys.map((key) => ({ date: key.slice(5), sales: totals[key] }));
}