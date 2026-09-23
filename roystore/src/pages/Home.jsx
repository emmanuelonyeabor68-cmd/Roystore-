import { useEffect, useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { Bell } from 'lucide-react';
import api from '../api/axios';
import { useAuth } from '../context/AuthContext';
import BottomNav from '../components/BottomNav';
import ProductCard from '../components/ProductCard';

const categoryRow = [
  { name: 'Electronics', image: '/electronics.jpg' },
  { name: 'Fashion', image: '/fashion.jpg' },
  { name: 'Home', image: '/home.jpg' },
];

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
          <p className="font-bold text-base">Hi, {user?.full_name || 'there'} </p>
        </div>
        <Bell size={22} className="text-gray-700" />
      </div>

      <button onClick={() => navigate('/search')} className="flex items-center border border-gray-200 rounded-xl mx-4 mt-4 px-3 py-2.5 w-[calc(100%-2rem)] text-left">
        <span className="text-gray-400 text-sm">Search for products, categories, brands...</span>
      </button>

      <div className="mx-4 mt-4 rounded-2xl bg-gradient-to-br from-purple-100 to-purple-50 p-5 flex items-center justify-between min-h-[200px]">
        <div className="max-w-[55%]">
          <h1 className="text-2xl font-extrabold text-gray-900 leading-tight mb-2">
            Upgrade your <span className="text-primary">everyday</span>
          </h1>
          <p className="text-gray-600 text-xs mb-4">Quality products, trusted brands, and the best prices — all in one place.</p>
          <button onClick={() => navigate('/search')} className="bg-primary text-white text-sm font-semibold rounded-xl px-4 py-2.5">Shop Now →</button>
        </div>
        <img src="/hero-image3.jpg" alt="" loading="lazy" className=" w-2/5 object-contain" />
      </div>

      {bestSeller && (
        <div className="px-4 mt-6">
          <h2 className="font-bold text-lg mb-3">Best Seller</h2>
          <button onClick={() => navigate(`/products/${bestSeller.id}`)} className="w-full bg-primary/5 rounded-2xl overflow-hidden flex items-center text-left">
            <img src={bestSeller.image} alt={bestSeller.name} loading="lazy" className="w-28 h-28 object-cover" />
            <div className="p-4">
              <span className="inline-block bg-primary/10 text-primary text-[10px] font-bold px-2 py-1 rounded-full mb-2">BEST SELLER</span>
              <p className="font-bold text-sm mb-1">{bestSeller.name}</p>
              <p className="text-primary font-bold">₦{Number(bestSeller.price).toLocaleString()}</p>
            </div>
          </button>
        </div>
      )}

      <div className="mt-6">
        <div className="flex justify-between items-center px-4 mb-3">
          <h2 className="font-bold text-lg">Popular Products</h2>
          <Link to="/search" className="text-primary text-sm font-medium">View all</Link>
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
          <Link to="/search" className="text-primary text-sm font-medium">View all</Link>
        </div>
        {loading ? <p className="text-gray-400 text-sm">Loading...</p> : (
          <div className="grid grid-cols-2 gap-3">
            {newArrivals.map((p) => <ProductCard key={p.id} product={p} />)}
          </div>
        )}
      </div>

      <div className="mt-6 px-4">
        <h2 className="font-bold text-lg mb-3">Shop by Category</h2>
        <div className="grid grid-cols-3 gap-3">
          {categoryRow.map((cat) => (
            <button key={cat.name} onClick={() => navigate(`/search?category=${encodeURIComponent(cat.name)}`)} className="rounded-xl overflow-hidden border border-gray-100 text-left">
              <img src={cat.image} alt={cat.name} loading="lazy" className="w-full h-20 object-cover" />
              <div className="p-2"><p className="font-semibold text-xs">{cat.name}</p></div>
            </button>
          ))}
        </div>
      </div>

      <BottomNav />
    </div>
  );
}