import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { Menu, X, Search, ShoppingCart } from 'lucide-react';
import Navbar from '../components/Navbar';

const popular = [
  { id: 1, name: 'AirPods Pro 2', price: 15000, image: '/airpods.jpg' },
  { id: 2, name: 'Nike Shoe', price: 45000, image: '/nike.jpg' },
  { id: 3, name: 'Wrist Watch', price: 25000, image: '/watch.jpg' },
];

const newArrivals = [
  { id: 4, name: 'Sony WH-1000XM5', price: 60000, image: '/sony.jpg' },
  { id: 5, name: 'Canon EOS 2000D', price: 470000, image: '/canon.jpg' },
];

export default function LandingHome() {
  const [menuOpen, setMenuOpen] = useState(false);
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-white">
      <Navbar />
    {/* Hero */}
<div className="relative h-[500px] md:h-[600px] overflow-hidden">
  <img
    src="/hero-image.jpg"
    alt="People shopping"
    className="absolute inset-0 w-full h-full object-cover"
  />
  <div className="absolute inset-0 bg-gradient-to-r from-black/100 via-black/50 to-transparent" />
  <div className="relative z-10 h-full flex flex-col justify-center px-4 md:px-12 max-w-xl md: mt-">
    <h1 className="text-4xl md:text-6xl font-extrabold leading-[1.05] mb-6 sm:mb-2  text-white">
    Shop smarter.<h2 className="text-primary text-4xl md:text-6xl">Live brighter.</h2>
    </h1>
    <p className="text-gray-200 text-base mb-4">
      Discover quality products, trusted brands, and the best prices — all in one place.
    </p>
    <div className="flex items-center gap-4">
      <button onClick={() => navigate('/signup')} className="bg-primary text-white font-semibold rounded-xl px-6 py-3 text-base">
        Shop Now
      </button>
     
    </div>
  </div>
</div>

    {/* Featured Products */}
<div className="px-4 md:px-12 py-12 pt-4 md:pt-4 md:py-16 items-center">
  <div className="flex flex:col text-center text-4xl md:justify-between md:flex-row md:items-center mb-2 md:mb-4">
    <div className='w-full mb-2'>
      <h2 className="text-2xl md:text-3xl font-extrabold">Featured Products</h2>
    </div>
  </div>
  <div className="flex flex-col-2  md:grid md:grid-cols-3 gap-4 overflow-x-auto pb-2" style={{ scrollbarWidth: 'none' }}>
    {popular.map((p) => (
      <button
        key={p.id}
        onClick={() => navigate('/shop')}
        className="min-w-[160px] md:min-w-0 shrink-0 border border-gray-200 rounded-xl overflow-hidden text-left group"
      >
        <div className="overflow-hidden">
          <img
            src={p.image}
            alt={p.name}
            className="w-full h-40 object-cover group-hover:scale-105 transition-transform duration-300"
          />
        </div>
        <div className="p-3">
          <p className="font-semibold text-sm truncate">{p.name}</p>
          <p className="text-primary font-bold text-sm">₦{p.price.toLocaleString()}</p>
        </div>
      </button>
    ))}
  </div>
  <Link to="/shop" className="text-center text-primary font-semibold text-sm mt-4 block md:hidden">View all →</Link>
</div>

{/* Best Seller spotlight — single product, full width */}
<div className="px-4 mt-2 md:px-12 py-8 pt-1">
  <div className="bg-gray-50 rounded-2xl overflow-hidden flex flex-col md:flex-row items-center">
    <div className="w-full md:w-1/2">
      <img
        src="/sony.jpg"
        alt="Sony WH-1000XM5"
        className="w-full h-64 md:h-96 object-cover"
      />
    </div>
    <div className="w-full md:w-1/2 p-6 md:p-12">
      <span className="inline-block bg-primary/10 text-primary text-xs font-bold px-3 py-1 rounded-full mb-3">
        BEST SELLER
      </span>
      <h3 className="text-2xl md:text-3xl font-extrabold mb-2">Sony WH-1000XM5</h3>
      <p className="text-gray-500 mb-4">
        Our most-loved headphones — premium noise cancellation, all-day comfort, and sound worth talking about.
      </p>
      <p className="text-primary font-bold text-xl mb-5">₦60,000</p>
      <button
        onClick={() => navigate('/shop')}
        className="bg-primary text-white font-semibold rounded-xl px-6 py-3"
      >
        Shop Now
      </button>
    </div>
  </div>
</div>

{/* New Arrival spotlight — mirrored layout */}
<div className="px-4 md:px-12 py-8">
  <div className="bg-gray-50 rounded-2xl overflow-hidden flex flex-col md:flex-row-reverse items-center">
    <div className="w-full md:w-1/2">
      <img
        src="/canon.jpg"
        alt="Canon EOS 2000D"
        className="w-full h-64 md:h-96 object-cover"
      />
    </div>
    <div className="w-full md:w-1/2 p-6 md:p-12">
      <span className="inline-block bg-green-100 text-green-700 text-xs font-bold px-3 py-1 rounded-full mb-3">
        NEW ARRIVAL
      </span>
      <h3 className="text-2xl md:text-3xl font-extrabold mb-2">Canon EOS 2000D</h3>
      <p className="text-gray-500 mb-4">
        Just landed — capture every moment in stunning detail with our newest DSLR pick.
      </p>
      <p className="text-primary font-bold text-xl mb-5">₦470,000</p>
      <button
        onClick={() => navigate('/shop')}
        className="bg-primary text-white font-semibold rounded-xl px-6 py-3"
      >
        Shop Now
      </button>
    </div>
  </div>
</div>

{/* Why Shop with Roystore */}
<div className="px-4 md:px-12 py-12 md:py-16 bg-gray-50">
  <h2 className="text-2xl md:text-3xl font-extrabold text-center mb-2">Why Shop with Roystore</h2>
  <p className="text-gray-500 text-center mb-10 max-w-lg mx-auto">
    We're building a shopping experience you can actually trust.
  </p>
  <div className="grid grid-cols-1 md:grid-cols-4 gap-6 max-w-5xl mx-auto">
    {[
      { title: 'Verified Sellers', text: 'Every seller on Roystore is checked, so you can shop with confidence.' },
      { title: 'Fast Delivery', text: 'Quick, reliable delivery, right to your doorstep.' },
      { title: 'Fair Prices', text: 'Quality products without the markup.' },
      { title: 'Easy Returns', text: 'Not satisfied? Return it, hassle-free.' },
    ].map((item) => (
      <div key={item.title} className="bg-white rounded-2xl p-6 text-center border border-gray-100">
        <h3 className="font-bold mb-2">{item.title}</h3>
        <p className="text-gray-500 text-sm">{item.text}</p>
      </div>
    ))}
  </div>
</div>

      
      {/* About + Contact teasers */}
      <div className="px-4 md:px-12 py-8 grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="bg-gray-50 rounded-2xl p-6">
          <h3 className="font-bold text-lg mb-2">About Roystore</h3>
          <p className="text-gray-500 text-sm mb-4">
            A practice project built to learn real-world full-stack e-commerce development.
          </p>
          <Link to="/about" className="text-primary font-semibold text-sm">Learn more →</Link>
        </div>
        <div className="bg-gray-50 rounded-2xl p-6">
          <h3 className="font-bold text-lg mb-2">Get in touch</h3>
          <p className="text-gray-500 text-sm mb-4">
            Questions? Reach out and we'll get back to you.
          </p>
          <Link to="/contact" className="text-primary font-semibold text-sm">Contact us →</Link>
        </div>
      </div>
      <div className="relative h-72 md:h-96 mx-4 md:mx-12 my-8 rounded-2xl overflow-hidden">
        <img src="/section-image.jpg" alt="" className="absolute inset-0 w-full h-full object-cover" />
        <div className="absolute inset-0 bg-gradient-to-r from-black/70 via-black/30 to-transparent" />
        <div className="relative z-10 h-full flex flex-col justify-center px-6 md:px-10 max-w-md">
          <h2 className="text-white text-2xl font-bold mb-2">Quality you can feel</h2>
          <p className="text-gray-200 text-sm">Every product, checked and trusted before it reaches you.</p>
        </div>
      </div>
      {/* Footer */}
      <div className="bg-gray-50 px-4 md:px-12 py-10">
        <div className="grid  md:grid-cols-4 gap-6 mb-8">
          <div>
            <div className="flex items-center gap-2 mb-2">
              <img src="/logo.png" alt="Roystore" className="w-7 h-7" />
              <span className="font-extrabold text-primary">Roystore</span>
            </div>
            <p className="text-gray-400 text-xs">Your one-stop shop for quality products at the best prices.</p>
          </div>
          <div>
            <p className="font-semibold text-sm mb-2">Shop</p>
            <Link to="/shop" className="block text-gray-500 text-sm mb-1">All Products</Link>
          </div>
          <div>
            <p className="font-semibold text-sm mb-2">Company</p>
            <Link to="/about" className="block text-gray-500 text-sm mb-1">About</Link>
            <Link to="/contact" className="block text-gray-500 text-sm">Contact</Link>
          </div>
          <div>
            <p className="font-semibold text-sm mb-2">Support</p>
            <p className="text-gray-400 text-sm mb-1">FAQs (coming soon)</p>
            <p className="text-gray-400 text-sm">Shipping (coming soon)</p>
          </div>
        </div>
        <div className="border-t border-gray-200 pt-4 text-center">
          <p className="text-gray-400 text-xs">© 2026 Roystore. All rights reserved.</p>
          <p className="text-gray-400 text-xs mt-1">Built by Emmanuel</p>
        </div>
      </div>
    </div>
  );
}