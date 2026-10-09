import { NavLink } from 'react-router-dom';
import { Home, ShoppingCart, Package, User } from 'lucide-react';
import { useCart } from '../context/CartContext';

const tabs = [
  { to: '/dashboard', label: 'Home', icon: Home },
  { to: '/cart', label: 'Cart', icon: ShoppingCart },
  { to: '/orders', label: 'Orders', icon: Package },
  { to: '/profile', label: 'Profile', icon: User },
];

export default function BottomNav() {
  const { cartCount } = useCart();

  const linkClass = ({ isActive }) =>
    `flex items-center gap-3 rounded-xl px-3 py-3 transition-colors ${isActive ? 'bg-primary/10 text-primary' : 'text-gray-500 hover:bg-gray-50'}`;

  return (
    <>
      <div
        className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-100 flex justify-around items-center px-2 z-50 lg:hidden"
        style={{ paddingTop: '0.5rem', paddingBottom: 'max(0.5rem, env(safe-area-inset-bottom))' }}
      >
        {tabs.map(({ to, label, icon: Icon }) => (
          <NavLink key={to} to={to} end className={({ isActive }) => `flex flex-col items-center gap-1 px-3 py-1 rounded-full transition-colors ${isActive ? 'text-primary' : 'text-gray-400'}`}>
            {({ isActive }) => (
              <>
                <div className={`relative p-2 rounded-full ${isActive ? 'bg-primary/10' : ''}`}>
                  <Icon size={20} />
                  {label === 'Cart' && cartCount > 0 && (
                    <span className="absolute -top-1 -right-1 bg-primary text-white text-[10px] w-4 h-4 rounded-full flex items-center justify-center">{cartCount}</span>
                  )}
                </div>
                <span className="text-[11px] font-medium">{label}</span>
              </>
            )}
          </NavLink>
        ))}
      </div>

      <aside className="hidden lg:flex fixed left-0 top-0 bottom-0 w-64 flex-col border-r border-gray-100 bg-white z-40 px-4 pt-8">
        <div className="flex items-center gap-2 px-2 pb-8">
          <img src="/logo.png" alt="Roystore" className="w-8 h-8" />
          <span className="text-lg font-extrabold text-primary">Roystore</span>
        </div>

        <nav className="space-y-2">
          {tabs.map(({ to, label, icon: Icon }) => (
            <NavLink key={to} to={to} end className={linkClass}>
              {({ isActive }) => (
                <>
                  <div className={`p-2 rounded-lg ${isActive ? 'bg-primary/10' : 'bg-gray-50'}`}>
                    <Icon size={18} />
                  </div>
                  <span className="font-medium">{label}</span>
                  {label === 'Cart' && cartCount > 0 && (
                    <span className="ml-auto bg-primary text-white text-[10px] w-5 h-5 rounded-full flex items-center justify-center">{cartCount}</span>
                  )}
                </>
              )}
            </NavLink>
          ))}
        </nav>
      </aside>
    </>
  );
}