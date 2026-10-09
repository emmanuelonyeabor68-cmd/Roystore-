import { useEffect, useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { Bell } from 'lucide-react';
import api from '../api/axios';
import { useAuth } from '../context/AuthContext';
import BottomNav from '../components/BottomNav';
import ProductCard from '../components/ProductCard';
import { useCart } from '../context/CartContext';

const categoryRow = [
  { name: 'Electronics', image: '/electronics.jpg' },
  { name: 'Fashion', image: '/fashion.jpg' },
  { name: 'Home & Living', image: '/home.jpg' },
];

export default function Home() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const { user } = useAuth();
  const navigate = useNavigate();
  const { refreshCart } = useCart();

  useEffect(() => {
    api.get('/api/v1/products/').then((res) => setProducts(res.data.results || [])).finally(() => setLoading(false));
  }, []);

  const popular = products.slice(0, 8);
  // const bestSeller = products[1];
  const newArrivals = [...products].sort((a, b) => new Date(b.created_at) - new Date(a.created_at)).slice(0, 4);

  return (
    <div className='min-h-screen bg-white pb-24 lg:pb-12'>
      <div className="mx-auto max-w-5xl lg:pl-64">
        <div className="sticky top-0 z-40 bg-white pb-3 border-b border-gray-50">
          <div className="flex justify-between items-center px-4 pt-4">
            <div className="flex items-center gap-2">
              <img src="/logo.png" alt="Roystore" className="w-8 h-8 lg:hidden" />
              <p className="font-bold text-base">Hi, {user?.full_name?.split(' ')[0] || 'there'} </p>
            </div>
            <Bell size={22} className="text-gray-700 cursor-pointer" onClick={() => navigate('/notifications')} />
          </div>

          <button onClick={() => navigate('/search')} className="flex items-center border border-gray-200 rounded-xl mx-4 mt-4 px-3 py-2.5 w-[calc(100%-2rem)] text-left">
            <span className="text-gray-400 text-sm">Search for products, categories, brands...</span>
          </button>
        </div>

        <div className="relative h-48 md:h-72 lg:h-96 mt-4 mx-4 rounded-2xl overflow-hidden">
          <img src="/hero-image6.jpg" alt="" loading="lazy" className="absolute inset-0 w-full h-full object-cover" />
          <div className="absolute inset-0 bg-gradient-to-r from-primary/0" />
          <div className="relative z-10 h-full flex flex-col justify-center px-5 max-w-xs lg:max-w-2xl lg:px-10">
            <h1 className="text-3xl md:text-5xl lg:text-6xl xl:text-7xl font-extrabold leading-tight mb-1 text-white">
              Upgrade Your <span className="text-black lg:text-black">Everyday.</span>
            </h1>

            <button onClick={() => navigate('/search')} className="bg-primary text-white text-sm font-semibold rounded-xl px-4 py-2 w-fit mt-2 lg:text-base lg:px-6 lg:py-3">
              Shop Now →
            </button>
          </div>
        </div>

        <div className="mt-6">
          <div className="flex justify-between items-center px-4 mb-3 md:flex md:flex-col-3">
            <h2 className="font-bold text-lg">Popular Products</h2>
            <Link to="/search" className="text-primary text-sm font-medium">View all</Link>
          </div>
          {loading ? <p className="text-gray-400 text-sm px-4">Loading...</p> : (
            <div className="flex gap-3 overflow-x-auto px-4 pb-2 lg:overflow-visible lg:grid lg:grid-cols-4 lg:gap-4" style={{ scrollbarWidth: 'none' }}>
              {popular.map((p) => <ProductCard key={p.id} product={p} className="min-w-[150px] shrink-0 lg:min-w-0" />)}
            </div>
          )}
        </div>

        <div className="mx-4 mt-6 bg-gradient-to-r from-primary to-purple-700 rounded-2xl p-5 flex items-center justify-between">
          <div>
            <p className="text-yellow-300 text-xs font-bold mb-1">FREE DELIVERY</p>
            <p className="text-white font-bold">On all orders over ₦50,000</p>
          </div>
          <button
            onClick={() => navigate('/search')}
            className="bg-white text-primary text-sm font-semibold rounded-xl px-3 py-2 shrink-0 ml-3"
          >
            Shop Now →
          </button>
        </div>

        <div className="mt-6 px-4">
          <div className="flex justify-between items-center mb-3">
            <h2 className="font-bold text-lg">New Arrivals</h2>
            <Link to="/search" className="text-primary text-sm font-medium">View all</Link>
          </div>
          {loading ? <p className="text-gray-400 text-sm">Loading...</p> : (
            <div className="grid grid-cols-2 gap-3 lg:grid-cols-4">
              {newArrivals.map((p) => <ProductCard key={p.id} product={p} />)}
            </div>
          )}
        </div>

        <div className="mt-6 px-4">
          <h2 className="font-bold text-lg mb-3">Shop by Category</h2>
          <div className="grid grid-cols-3 gap-3">
            {categoryRow.map((cat) => (
              <button key={cat.name} onClick={() => navigate(`/search?category=${encodeURIComponent(cat.name)}`)} className="rounded-xl overflow-hidden border border-gray-100 text-left">
                <img src={cat.image} alt={cat.name} loading="lazy" className="w-full h-20 object-cover lg:h-32" />
                <div className="p-2"><p className="font-semibold text-xs text-center">{cat.name}</p></div>
              </button>
            ))}
          </div>
        </div>
      </div>
      <BottomNav />
    </div>
  );
}