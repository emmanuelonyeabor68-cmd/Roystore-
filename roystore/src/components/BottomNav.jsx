import { NavLink } from 'react-router-dom';
import { Home, ShoppingCart, Package, User } from 'lucide-react';

const tabs = [
  { to: '/dashboard', label: 'Home', icon: Home },
  { to: '/cart', label: 'Cart', icon: ShoppingCart },
  { to: '/orders', label: 'Orders', icon: Package },
  { to: '/profile', label: 'Profile', icon: User },
];

export default function BottomNav({ cartCount = 0 }) {
  return (
    <div className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-100 flex justify-around items-center py-2 px-2 z-50">
      {tabs.map(({ to, label, icon: Icon }) => (
        <NavLink
          key={to}
          to={to}
          end
          className={({ isActive }) =>
            `flex flex-col items-center gap-1 px-3 py-1 rounded-full transition-colors ${
              isActive ? 'text-primary' : 'text-gray-400'
            }`
          }
        >
          {({ isActive }) => (
            <>
              <div className={`relative p-2 rounded-full ${isActive ? 'bg-primary/10' : ''}`}>
                <Icon size={20} />
                {label === 'Cart' && cartCount > 0 && (
                  <span className="absolute -top-1 -right-1 bg-primary text-white text-[10px] w-4 h-4 rounded-full flex items-center justify-center">
                    {cartCount}
                  </span>
                )}
              </div>
              <span className="text-[11px] font-medium">{label}</span>
            </>
          )}
        </NavLink>
      ))}
    </div>
  );
}