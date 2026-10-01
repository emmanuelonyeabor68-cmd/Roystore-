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
  { name: 'Home', image: '/home.jpg' },
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
  const bestSeller = products[1];
  const newArrivals = [...products].sort((a, b) => new Date(b.created_at) - new Date(a.created_at)).slice(0, 4);

  return (
    <div className="min-h-screen bg-white pb-24">
      <div className=" flex justify-between items-center px-4 pt-4">
        <div className="flex items-center gap-2">
          <img src="/logo.png" alt="Roystore" className="w-8 h-8" />
          <p className="font-bold text-base">Hi, {user?.full_name || 'there'} </p>
        </div>
        <Bell size={22} className="text-gray-700 cursor-pointer" onClick={() => navigate('/notifications')} />
      </div>

      <button onClick={() => navigate('/search')} className=" flex items-center border border-gray-200 rounded-xl mx-4 mt-4 px-3 py-2.5 w-[calc(100%-2rem)] text-left">
        <span className="text-gray-400 text-sm">Search for products, categories, brands...</span>
      </button>

{/* Hero — matches Landing page style */}
<div className="relative h-48 md:h-72 mt-4 mx-4 rounded-2xl overflow-hidden">
  <img src="/hero-image6.jpg" alt="" loading="lazy" className="absolute inset-0 w-full h-full object-cover" />
  <div className="absolute inset-0 bg-gradient-to-r from-primary/0 " />
  <div className="relative z-10 h-full flex flex-col justify-center px-5 max-w-xs">
   <h1 className="text-3xl md:text-5xl font-extrabold leading-tight[1.0] mb-1 text-white">
            Upgrade Your <h1 className="text-black">Everyday.</h1>
          </h1>
   
    <button onClick={() => navigate('/search')} className="bg-primary text-white text-sm font-semibold rounded-xl px-4 py-2 w-fit mt-2">
      Shop Now →
    </button>
  </div>
</div>

      {/* Featured Drop */}
{bestSeller && (
  <div className="px-4 mt-6">
    <div className="flex justify-between items-center mb-3">
      <h2 className="font-bold text-lg">Featured Drop</h2>
    </div>
    <button
      onClick={() => navigate(`/products/${bestSeller.id}`)}
      className="w-full bg-primary/5 rounded-2xl overflow-hidden flex items-center text-left"
    >
      <img src={bestSeller.image} alt={bestSeller.name} loading="lazy" className="w-40 h-32 object-cover shrink-0" />
      <div className="p-4 pr-6 flex-1">
        <p className="text-primary text-[10px] font-bold uppercase tracking-wide mb-1">New this week</p>
        <p className="font-bold text-base mb-1">{bestSeller.name}</p>
        <p className="text-primary font-extrabold text-lg mb-3">₦{Number(bestSeller.price).toLocaleString()}</p>
        <span
          onClick={async (e) => {
            e.stopPropagation();
            try {
              await api.post('/api/v1/cart-items/', { product_id: bestSeller.id, quantity: 1 });
              refreshCart();
            } catch (err) {}
          }}
          className="inline-block bg-primary/10 text-primary text-sm font-semibold rounded-xl px-4 py-2"
        >
          Add to cart
        </span>
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
      {/* Free Delivery banner */}
<div className="mx-4 mt-6 bg-gradient-to-r from-primary to-purple-700 rounded-2xl p-5 flex items-center justify-between">
  <div>
    <p className="text-yellow-300 text-xs font-bold mb-1">FREE DELIVERY</p>
    <p className="text-white font-bold">On all orders over ₦50,000</p>
    <p className="text-purple-100 text-xs mt-1">Shop more, pay less. We deliver to you!</p>
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