import { Link } from 'react-router-dom';
import Navbar from '../components/Navbar';

export default function About() {
  return (
    <div className="min-h-screen bg-white">
      <Navbar />

      {/* Hero banner, same treatment as Home */}
      <div className="relative h-72 md:h-96 overflow-hidden">
        <img src="/about-image.jpg" alt="" className="absolute inset-0 w-full h-full object-cover" />

      </div>

      <div className="px-4 md:px-12 py-10 max-w-2xl">
  <div className="bg-yellow-50 border border-yellow-200 text-yellow-800 text-sm rounded-xl p-4 mb-6">
    ⚠️ Heads up: Roystore is a practice project built to learn full-stack development. It's not a real store — no real products are sold and no real payments are processed here.
  </div>

  <p className="text-gray-600 mb-4 leading-relaxed">
    Roystore is your go-to destination for quality products from trusted sellers. We're built around one simple idea — online shopping should feel easy, honest, and worth coming back to.
  </p>
  <p className="text-gray-600 mb-4 leading-relaxed">
    From electronics to fashion to everyday essentials, we bring together verified brands and fair prices in one place, so you spend less time searching and more time finding what you actually need.
  </p>
  <p className="text-gray-600 leading-relaxed">
    We're growing every day, and we're building Roystore around the people who shop with us.
  </p>

  <Link
    to="/signup"
    className="inline-block bg-primary text-white font-semibold rounded-xl px-6 py-3 mt-8"
  >
    Join Roystore
  </Link>
</div>

      <div className="bg-gray-50 px-4 md:px-12 py-8 mt-10 text-center">
        <p className="text-gray-400 text-xs">© 2026 Roystore. All rights reserved.</p>
        <p className="text-gray-400 text-xs mt-1">Built by Emmanuel</p>
      </div>
    </div>
  );
}