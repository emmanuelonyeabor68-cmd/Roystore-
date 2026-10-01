import { useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { Menu, X, ShoppingCart, Search } from 'lucide-react';

export default function Navbar() {
  const [menuOpen, setMenuOpen] = useState(false);
  const { pathname } = useLocation();
  const navigate = useNavigate();

  const links = [
    { to: '/', label: 'Home' },
    { to: '/shop', label: 'Shop' },
    { to: '/about', label: 'About' },
    { to: '/contact', label: 'Contact' },
  ];

  return (
    <>
      <div className="sticky top-0 z-40 flex items-center justify-between px-4 md:px-12 py-4 bg-white">
        <button onClick={() => setMenuOpen(true)} className="absolute right-0 md:hidden">
          <Menu size={26} className="text-gray-800" />
        </button>
        <Link to="/" className="flex items-center gap-2">
          <img src="/logo.png" alt="Roystore" className="w-8 h-8 hidden" />
          <span className="font-extrabold text-primary text-2xl">Roystore</span>
        </Link>
        <nav className="hidden md:flex items-center gap-10 text-gray-700 font-medium text-sm">
          {links.map((l) => (
            <Link key={l.to} to={l.to} className={pathname === l.to ? 'text-primary' : ''}>
              {l.label}
            </Link>
          ))}
        </nav>
        <div className="hidden md:flex items-center gap-4">
          <button onClick={() => navigate('/login')}><Search size={20} /></button>
          <button onClick={() => navigate('/login')}><ShoppingCart size={20} /></button>
          <button
            onClick={() => navigate('/login')}
            className="bg-primary text-white text-sm font-semibold rounded-xl px-4 py-2"
          >
            Login
          </button>
        </div>
       
      </div>

      {menuOpen && (
        <div className="fixed inset-0 bg-black/40 z-50" onClick={() => setMenuOpen(false)}>
          <div
            className="absolute right-0 top-0 h-50 w-full bg-white p-6 flex flex-col shadow-xl"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex justify-between items-left mb-2">
              <div className="flex items-left text-center gap-">
                <span className="font-extrabold text-primary text-2xl text ">Roystore</span>
              </div>
              <button onClick={() => setMenuOpen(false)}>
                <X size={22} className="text-gray-500" />
              </button>
            </div>
            <nav className="flex flex-col gap-5 text-gray-700 font-medium items-left">
              {links.map((l) => (
                <Link key={l.to} to={l.to} onClick={() => setMenuOpen(false)}>
                  {l.label}
                </Link>
              ))}
            </nav>
            <div className="flex flex-col gap-3 mt-4">
              <button onClick={() => navigate('/login')} className="border border-primary text-primary rounded-xl py-2.5 font-semibold text-sm">Log In</button>
              <button onClick={() => navigate('/signup')} className="bg-primary text-white rounded-xl py-2.5 font-semibold text-sm">Sign Up</button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}