import { useNavigate } from 'react-router-dom';
import Navbar from '../components/Navbar';

const categories = ['All', 'Electronics', 'Fashion', 'Home & Living', 'Bags'];
const allProducts = [
  { id: 1, name: 'AirPods Pro 2', price: 15000, image: '/airpods.jpg' },
  { id: 2, name: 'Nike Shoe', price: 45000, image: '/nike.jpg' },
  { id: 3, name: 'Wrist Watch', price: 25000, image: '/watch.jpg' },
  { id: 4, name: 'Sony WH-1000XM5', price: 60000, image: '/sony.jpg' },
  { id: 5, name: 'Canon EOS 2000D', price: 470000, image: '/canon.jpg' },
  { id: 6, name: 'Classic Fit Shirt', price: 18500, image: '/products/shirt.jpg' },
];

export default function Shop() {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-white">
      <Navbar />

      {/* Small hero banner instead of a bare title */}
      <div className="relative h-48 md:h-64 mx-4 md:mx-12 mt-4 rounded-2xl overflow-hidden">
        <img src="/shop-banner.jpg" alt="" className="absolute inset-0 w-full h-full object-cover" />
        <div className="absolute inset-0 bg-gradient-to-r from-black/70 to-black/20" />
        <div className="relative z-10 h-full flex flex-col justify-center px-6">
          <h1 className="text-white text-2xl md:text-3xl font-extrabold">Explore the Shop</h1>
          <p className="text-gray-200 text-sm mt-1">Quality picks across every category</p>
        </div>
      </div>

      {/* Category chips */}
      <div className="px-4 md:px-12 mt-6 flex gap-2 overflow-x-auto pb-1" style={{ scrollbarWidth: 'none' }}>
        {categories.map((cat, i) => (
          <button
            key={cat}
            className={`shrink-0 px-4 py-2 rounded-full text-sm font-medium border ${
              i === 0 ? 'border-primary text-primary bg-primary/5' : 'border-gray-200 text-gray-600'
            }`}
          >
            {cat}
          </button>
        ))}
      </div>

      {/* Grid */}
      <div className="px-4 md:px-12 py-8">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {allProducts.map((p) => (
            <button
              key={p.id}
              onClick={() => navigate('/login')}
              className="border border-gray-200 rounded-xl overflow-hidden text-left group"
            >
              <div className="overflow-hidden">
                <img
                  src={p.image}
                  alt={p.name}
                  className="w-full h-36 object-cover group-hover:scale-105 transition-transform duration-300"
                />
              </div>
              <div className="p-3">
                <p className="font-semibold text-sm truncate">{p.name}</p>
                <p className="text-primary font-bold text-sm">₦{p.price.toLocaleString()}</p>
              </div>
            </button>
          ))}
        </div>
        <div className="text-center mt-8 border-t border-gray-100 pt-8">
          <p className="text-gray-500 text-sm mb-3">Sign up to unlock the full catalog, filters, and checkout.</p>
          <button onClick={() => navigate('/signup')} className="bg-primary text-white font-semibold rounded-xl px-6 py-3">
            Create Free Account
          </button>
        </div>
      </div>
    </div>
  );
}