import { useEffect, useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { Bell } from 'lucide-react';
import api from '../api/axios';
import { useAuth } from '../context/AuthContext';
import BottomNav from '../components/BottomNav';
import ProductCard from '../components/ProductCard';

export default function Home() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const { user } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    api.get('/api/v1/products/').then((res) => setProducts(res.data.results || [])).finally(() => setLoading(false));
  }, []);

  const popular = products.slice(0, 8);
  const bestSeller = products[0];
  const newArrivals = [...products].sort((a, b) => new Date(b.created_at) - new Date(a.created_at)).slice(0, 4);

  return (
    <div className="min-h-screen bg-white pb-24">
      <div className="flex justify-between items-center px-4 pt-4">
        <div className="flex items-center gap-2">
          <img src="/logo.png" alt="Roystore" className="w-8 h-8" />
          <p className="font-bold text-base">Hi, {user?.full_name || 'there'} 👋</p>
        </div>
        <Bell size={22} className="text-gray-700" />
      </div>

      <button onClick={() => navigate('/search')} className="flex items-center border border-gray-200 rounded-xl mx-4 mt-4 px-3 py-2.5 w-[calc(100%-2rem)] text-left">
        <span className="text-gray-400 text-sm">Search for products, categories, brands...</span>
      </button>

      <div className="relative h-64 md:h-80 mt-4 overflow-hidden">
        <img src="/hero-image1.jpg" alt="" className="absolute inset-0 w-full h-full object-cover" />
        <div className="absolute inset-0 bg-gradient-to-r from-primary/85 via-/50 to-transparent" />
        <div className="relative z-10 h-full flex flex-col justify-center px-4 max-w-sm">
          <h1 className="text-2xl md:text-4xl font-extrabold text-white leading-tight mb-2">
            Upgrade your <span className="text-primary">everyday</span>
          </h1>
          <p className="text-gray-200 text-sm mb-4">Top quality products, trusted brands, and the best prices — all in one place.</p>
          <button onClick={() => navigate('/products')} className="bg-primary text-white text-sm font-semibold rounded-xl px-4 py-2.5 w-fit">Shop Now →</button>
        </div>
      </div>

      {bestSeller && (
        <div className="px-4 mt-6">
          <h2 className="font-bold text-lg mb-3">Best Seller</h2>
          <button onClick={() => navigate(`/products/${bestSeller.id}`)} className="w-full flex items-center gap-4 border border-gray-200 rounded-2xl p-3 text-left">
            <img src={bestSeller.image} alt={bestSeller.name} loading="lazy" className="w-24 h-24 rounded-xl object-cover" />
            <div>
              <span className="inline-block bg-primary/10 text-primary text-[10px] font-bold px-2 py-0.5 rounded-full mb-1">BEST SELLER</span>
              <p className="font-semibold text-sm">{bestSeller.name}</p>
              <p className="text-primary font-bold text-sm">₦{Number(bestSeller.price).toLocaleString()}</p>
            </div>
          </button>
        </div>
      )}

      <div className="mt-6">
        <div className="flex justify-between items-center px-4 mb-3">
          <h2 className="font-bold text-lg">Popular Products</h2>
          <Link to="/products" className="text-primary text-sm font-medium">View all</Link>
        </div>
        {loading ? <p className="text-gray-400 text-sm px-4">Loading...</p> : (
          <div className="flex gap-3 overflow-x-auto px-4 pb-2" style={{ scrollbarWidth: 'none' }}>
            {popular.map((p) => <ProductCard key={p.id} product={p} className="min-w-[150px] shrink-0" />)}
          </div>
        )}
      </div>

      <div className="mt-6 px-4">
        <div className="flex justify-between items-center mb-3">
          <h2 className="font-bold text-lg">New Arrivals</h2>
          <Link to="/products" className="text-primary text-sm font-medium">View all</Link>
        </div>
        {loading ? <p className="text-gray-400 text-sm">Loading...</p> : (
          <div className="grid grid-cols-2 gap-3">
            {newArrivals.map((p) => <ProductCard key={p.id} product={p} />)}
          </div>
        )}
      </div>

      <BottomNav />
    </div>
  );
}