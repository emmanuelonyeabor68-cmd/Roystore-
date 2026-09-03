import { useEffect, useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { Bell, ShoppingCart, Search } from 'lucide-react';
import api from '../api/axios';
import { useAuth } from '../context/AuthContext';
import BottomNav from '../components/BottomNav';

export default function Home() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const { user } = useAuth();
  const navigate = useNavigate();
  const cartCount = 0; // wired to real cart count once Cart page exists

  useEffect(() => {
    api.get('/api/v1/products/')
      .then((res) => setProducts(res.data.results || []))
      .finally(() => setLoading(false));
  }, []);

  const popular = products.slice(0, 8);
  const newArrivals = [...products]
    .sort((a, b) => new Date(b.created_at) - new Date(a.created_at))
    .slice(0, 4);

  return (
    <div className="min-h-screen bg-white pb-24">
      {/* Header */}
      <div className="flex justify-between items-center px-4 pt-4">
        <div className="flex items-center gap-2">
          <img src="/logo.png" alt="Roystore" className="w-8 h-8" />
          <p className="font-bold text-base">Hi, {user?.full_name || 'there'} </p>
        </div>
        <div className="flex items-center gap-4">
          <Bell size={22} className="text-gray-700" />
          <button onClick={() => navigate('/cart')} className="relative">
            <ShoppingCart size={22} className="text-gray-700" />
            {cartCount > 0 && (
              <span className="absolute -top-2 -right-2 bg-primary text-white text-[10px] w-4 h-4 rounded-full flex items-center justify-center">
                {cartCount}
              </span>
            )}
          </button>
        </div>
      </div>

      {/* Search */}
      <button
        onClick={() => navigate('/products')}
        className="flex items-center border border-gray-200 rounded-xl mx-4 mt-4 px-3 py-2.5 w-[calc(100%-2rem)] text-left"
      >
        <Search size={18} className="text-gray-400 mr-2" />
        <span className="text-gray-400 text-sm">Search for products, categories, brands...</span>
      </button>

      {/* Hero banner */}
      <div className="mx-4 mt-4 bg-purple-50 rounded-2xl p-5">
        <h1 className="text-2xl font-extrabold leading-tight">
          Upgrade your <span className="text-primary">everyday</span>
        </h1>
        <p className="text-gray-500 text-sm mt-2 mb-4">
          Top quality products, trusted brands, and the best prices - all in one place.
        </p>
        <button
          onClick={() => navigate('/products')}
          className="bg-primary text-white text-sm font-semibold rounded-xl px-4 py-2.5"
        >
          Shop Now →
        </button>
      </div>

      {/* Popular Products — slider */}
      <div className="mt-6">
        <div className="flex justify-between items-center px-4 mb-3">
          <h2 className="font-bold text-lg">Popular Products</h2>
          <Link to="/products" className="text-primary text-sm font-medium">View all</Link>
        </div>
        {loading ? (
          <p className="text-gray-400 text-sm px-4">Loading...</p>
        ) : (
          <div className="flex gap-3 overflow-x-auto px-4 pb-2" style={{ scrollbarWidth: 'none' }}>
            {popular.map((p) => (
              <ProductCard key={p.id} product={p} className="min-w-[150px] shrink-0" />
            ))}
          </div>
        )}
      </div>

      {/* Advert banner */}
      <div className="mx-4 mt-6 bg-gradient-to-r from-primary to-purple-700 rounded-2xl p-5 flex items-center justify-between">
        <div>
          <p className="text-yellow-300 text-xs font-bold mb-1">FREE DELIVERY</p>
          <p className="text-white font-bold">On all orders over ₦50,000</p>
          <p className="text-purple-100 text-xs mt-1">Shop more, pay less. We deliver to you!</p>
        </div>
        <button
          onClick={() => navigate('/products')}
          className="bg-white text-primary text-sm font-semibold rounded-xl px-3 py-2 shrink-0 ml-3"
        >
          Shop Now →
        </button>
      </div>

      {/* New Arrivals — 2x2 grid */}
      <div className="mt-6 px-4">
        <div className="flex justify-between items-center mb-3">
          <h2 className="font-bold text-lg">New Arrivals</h2>
          <Link to="/products" className="text-primary text-sm font-medium">View all</Link>
        </div>
        {loading ? (
          <p className="text-gray-400 text-sm">Loading...</p>
        ) : (
          <div className="grid grid-cols-2 gap-3">
            {newArrivals.map((p) => (
              <ProductCard key={p.id} product={p} />
            ))}
          </div>
        )}
      </div>

      {/* Shop by Category — visual cards */}
      <div className="mt-6 px-4">
        <h2 className="font-bold text-lg mb-3">Shop by Category</h2>
        <div className="grid grid-cols-3 gap-3">
          {[
            { name: 'Electronics', image: '/categories/electronics.jpg' },
            { name: 'Fashion', image: '/categories/fashion.jpg' },
            { name: 'Home & Living', image: '/categories/home.jpg' },
          ].map((cat) => (
            <button
              key={cat.name}
              onClick={() => navigate(`/products?category=${encodeURIComponent(cat.name)}`)}
              className="rounded-xl overflow-hidden border border-gray-100 text-left"
            >
              <img src={cat.image} alt={cat.name} loading="lazy" className="w-full h-20 object-cover" />
              <div className="p-2">
                <p className="font-semibold text-sm">{cat.name}</p>
              </div>
            </button>
          ))}
        </div>
      </div>

      <BottomNav cartCount={cartCount} />
    </div>
  );
}

function ProductCard({ product, className = '' }) {
  const inStock = product.stock > 0;
  return (
    <div className={`border border-gray-200 rounded-xl overflow-hidden ${className}`}>
      <div className="relative w-full h-32 bg-gray-50">
        <img
          src={product.image}
          alt={product.name}
          loading="lazy"
          className={`w-full h-full object-cover ${inStock ? '' : 'opacity-40'}`}
        />
        <span className="absolute bottom-2 left-2 bg-primary text-white text-xs font-bold px-2 py-1 rounded-lg">
          ₦{Number(product.price).toLocaleString()}
        </span>
      </div>
      <div className="p-3">
        <p className="font-semibold text-sm truncate mb-1">{product.name}</p>
        {inStock ? (
          <p className="text-orange-500 text-xs font-medium">{product.stock} in stock</p>
        ) : (
          <p className="text-red-500 text-xs font-semibold">Out of stock</p>
        )}
      </div>
    </div>
  );
}