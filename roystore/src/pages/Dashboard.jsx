import { useEffect, useState } from 'react';
import api from '../api/axios';
import { useAuth } from '../context/AuthContext';

export default function Dashboard() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const { user, logout } = useAuth();

  useEffect(() => {
    api.get('/api/v1/products/')
      .then((res) => setProducts(res.data.results))
      .finally(() => setLoading(false));
  }, []);

  return (
    <div className="p-4 max-w-2xl mx-auto">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-xl font-bold">Hi, {user?.full_name || 'User'} </h1>
        <button onClick={logout} className="text-red-500 text-sm font-medium">Logout</button>
      </div>

      {loading ? (
        <p className="text-gray-400 text-sm">Loading products...</p>
      ) : (
        <div className="grid grid-cols-2 gap-3">
          {products.map((p) => (
            <div key={p.id} className="border border-gray-200 rounded-xl p-3">
              <img src={p.image} alt={p.name} className="rounded-lg w-full h-28 object-cover mb-2" />
              <p className="font-semibold text-sm truncate">{p.name}</p>
              <p className="text-primary font-bold">₦{Number(p.price).toLocaleString()}</p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}