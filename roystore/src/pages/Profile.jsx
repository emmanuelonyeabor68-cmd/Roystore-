import { useNavigate } from 'react-router-dom';
import { User, Package, Lock, LogOut, ChevronRight } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import BottomNav from '../components/BottomNav';

export default function Profile() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = async () => {
    await logout();
    navigate('/login');
  };

  return (
    <div className="min-h-screen bg-white pb-24">
      <h1 className="text-xl font-bold px-4 pt-4 mb-4">Profile</h1>
      <div className="px-4">
        <div className="flex items-center gap-3 border border-gray-100 rounded-2xl p-4 mb-6 bg-gray-50">
          <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center">
            <User size={22} className="text-primary" />
          </div>
          <div>
            <p className="font-semibold">{user?.full_name || 'User'}</p>
            <p className="text-gray-500 text-sm">{user?.email}</p>
          </div>
        </div>

        <p className="text-gray-400 text-xs font-semibold uppercase mb-2">Account</p>
        <div className="border border-gray-100 rounded-2xl overflow-hidden mb-6">
          <button onClick={() => navigate('/orders')} className="w-full flex items-center justify-between p-4 border-b border-gray-100">
            <div className="flex items-center gap-3"><Package size={18} className="text-primary" /><span className="text-sm">My Orders</span></div>
            <ChevronRight size={16} className="text-gray-400" />
          </button>
          <button onClick={() => navigate('/change-password')} className="w-full flex items-center justify-between p-4">
            <div className="flex items-center gap-3"><Lock size={18} className="text-primary" /><span className="text-sm">Change Password</span></div>
            <ChevronRight size={16} className="text-gray-400" />
          </button>
        </div>

        <button onClick={handleLogout} className="w-full flex items-center gap-3 border border-red-100 text-red-500 rounded-2xl p-4">
          <LogOut size={18} /><span className="text-sm font-medium">Logout</span>
        </button>
      </div>
      <BottomNav />
    </div>
  );
}