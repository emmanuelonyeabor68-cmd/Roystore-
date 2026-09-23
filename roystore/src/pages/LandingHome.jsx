import { useNavigate, Link } from 'react-router-dom';
import Navbar from '../components/Navbar';

const categories = [
  { name: 'Electronics', image: '/electronics.jpg' },
  { name: 'Fashion', image: '/fashion.jpg' },
  { name: 'Home', image: '/home.jpg' },
  { name: 'Accessories', image: '/accessories.jpg' },
];

const trending = [
  { id: 1, name: 'Sony WH-1000XM5', price: 60000, image: '/sony.jpg' },
  { id: 2, name: 'Canon EOS R6', price: 470000, image: '/canon.jpg' },
  { id: 3, name: "Nike Air Force 1 '07", price: 45000, image: '/nike.jpg' },
  { id: 4, name: 'Apple AirPods (3rd Gen)', price: 15000, image: '/airpods.jpg' },
];

const whyRoystore = [
  { title: 'Quality checked', text: 'Every product is carefully inspected for quality and authenticity.' },
  { title: 'Reliable delivery', text: 'Fast, secure and trackable shipping to your door.' },
  { title: 'Real support', text: 'Friendly, human support whenever you need it.' },
];

export default function LandingHome() {
  const navigate = useNavigate();
  return (
    <div className="min-h-screen bg-white">
      <Navbar />

      <div className="relative h-[55vh] md:h-[500px] overflow-hidden">
        <img src="/hero-image.jpg" alt="People shopping" className="absolute inset-0 sm:w-full md:w-full h-full object-cover" />
        <div className="absolute inset-0 bg-gradient-to-r from-black/85 via-black/50 to-transparent" />
        <div className="relative z-10 h-full flex flex-col justify-center px-4 md:px-12 max-w-xl">
          <h1 className="text-3xl md:text-5xl font-extrabold leading-tight[1.0] mb-1 text-white">
            Shop smarter. <h1 className="text-primary">Live brighter.</h1>
          </h1>
          <p className="text-gray-200 text-base mb-3">
            Discover quality products, trusted brands, and the best prices — all in one place.
          </p>
          <div className="flex items-center gap-3">
            <button onClick={() => navigate('/signup')} className="bg-primary text-white font-semibold rounded-xl px-4 py-2">
              Shop Now
            </button>
          </div>
        </div>
      </div>

      <div className="px-4 md:px-12 py-6 md:py-14">
        <h2 className="text-xl md:text-2xl font-bold mb-5">Shop by category</h2>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {categories.map((cat) => (
            <button key={cat.name} onClick={() => navigate('/login')} className="bg-primary/5 rounded-2xl p-5 flex flex-col items-center text-center">
              <div className="w-full aspect-square rounded-xl overflow-hidden mb-3 bg-white">
                <img src={cat.image} alt={cat.name} loading="lazy" className="w-full h-full object-cover" />
              </div>
              <p className="font-semibold text-sm">{cat.name}</p>
            </button>
          ))}
        </div>
      </div>

      <div className="px-4 md:px-12 py-6">
        <div className="flex justify-between items-center mb-5">
          <h2 className="text-xl md:text-2xl font-bold">Trending now</h2>
          <Link to="/login" className="font-semibold text-sm text-primary">View all →</Link>
        </div>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {trending.map((p) => (
            <button key={p.id} onClick={() => navigate('/login')} className="bg-white border border-gray-200 rounded-2xl overflow-hidden text-left">
              <div className="w-full aspect-square bg-gray-50">
                <img src={p.image} alt={p.name} loading="lazy" className="w-full h-full object-cover" />
              </div>
              <div className="p-3">
                <p className="font-semibold text-sm truncate">{p.name}</p>
                <p className="text-primary font-bold text-sm mt-0.5">₦{p.price.toLocaleString()}</p>
              </div>
            </button>
          ))}
        </div>
      </div>

      <div className="px-4 md:px-12 py-5">
        <div className="bg-primary/5 rounded-3xl overflow-hidden flex flex-col md:flex-row items-center">
          <div className="w-full md:w-1/2 aspect-square md:aspect-auto md:h-80 bg-white">
            <img src="/sony.jpg" alt="Sony WH-1000XM5" loading="lazy" className="w-full h-full object-contain p-6" />
          </div>
          <div className="w-full md:w-1/2 p-6 md:p-10">
            <span className="inline-block bg-primary/10 text-primary text-xs font-bold px-3 py-1 rounded-full mb-3">Best seller</span>
            <h3 className="text-2xl font-bold mb-2">Sony WH-1000XM5</h3>
            <p className="text-gray-500 text-sm mb-5">Immersive sound, powerful noise cancellation.</p>
            <button onClick={() => navigate('/login')} className="bg-primary text-white font-semibold rounded-xl px-6 py-3 text-sm">View product</button>
          </div>
        </div>
      </div>

      <div className="px-4 md:px-12 py-6 md:py-14 md:grid md:grid-col-3 ">
        <h2 className="text-xl md:text-2xl font-bold mb-6">Why Roystore</h2>
        <div className="max-w-2xl space-y-5 md:grid md:grid-cols-3">
          {whyRoystore.map((item, i) => (
            <div key={item.title} className={`flex items-start gap-4 pb-5 ${i < whyRoystore.length - 1 ? 'border-b border-gray-200' : ''}`}>
              <div className="w-11 h-11 rounded-full bg-primary/10 flex items-center justify-center shrink-0">
                <div className="w-4 h-4 rounded-full bg-primary" />
              </div>
              <div>
                <p className="font-bold text-sm mb-1">{item.title}</p>
                <p className="text-gray-500 text-sm">{item.text}</p>
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className="px-4 md:px-12 pb-10">
        <div className="bg-primary rounded-3xl flex items-center min-h-[200px] p-8 md:p-14">
          <div className="max-w-xs">
            <h2 className="text-white text-2xl font-bold mb-5 leading-snug">Find something made for your everyday.</h2>
            <button onClick={() => navigate('/login')} className="bg-white text-primary font-semibold rounded-full px-6 py-3 text-sm">
              Explore the collection
            </button>
          </div>
        </div>
      </div>

      <div className="bg-gray-50 px-4 md:px-12 py-10">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <div>
            <div className="flex items-center gap-2 mb-2">
              <img src="/logo.png" alt="Roystore" className="w-7 h-7" />
              <span className="font-extrabold text-primary">Roystore</span>
            </div>
            <p className="text-gray-400 text-xs">Your one-stop shop for quality products at the best prices.</p>
          </div>
          <div>
            <p className="font-semibold text-sm mb-2">Shop</p>
            <Link to="/login" className="block text-gray-500 text-sm mb-1">All Products</Link>
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