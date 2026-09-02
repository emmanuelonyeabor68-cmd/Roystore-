import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Mail, Lock, Eye, EyeOff } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

export default function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const { login, loginWithGoogle } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      await login(email, password);
      navigate('/dashboard');
    } catch (err) {
      setError('Invalid email or password');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-purple-150 px-6 pt-24 pb-6 flex flex-col items-center">
      <div className="flex flex-col items-center mb-5">
        <img src="/logo.png" alt="Roystore" className="w-14 h-15 pt-2 mb-0" />
        <h1 className="text-primary text-5xl font-extrabold mb-2">Roystore</h1>
      </div>

      <h2 className="text-3xl font-bold mb-1">Welcome back!</h2>
      <p className="text-gray-500 text-1xl mb-8">Login to continue shopping</p>

      <form onSubmit={handleSubmit} className="w-full max-w-sm">
        {error && <p className="text-red-500 text-sm mb-4 flex flex-col items-center">{error}</p>}

        <label className="text-sm font-medium block mb-1">Email Address</label>
        <div className="flex items-center border border-gray-200 rounded-xl px-4 py-3 mb-4 focus-within:ring-2 focus-within:ring-primary focus-within:border-primary transition-all">
          <Mail size={18} className="text-primary mr-2 shrink-0" />
          <input type="email" value={email} onChange={(e) => setEmail(e.target.value)}
            placeholder="Enter your email" className="w-full outline-none text-sm " />
        </div>

        <label className="text-sm font-medium block mb-1">Password</label>
        <div className="flex items-center border border-gray-200 rounded-xl px-4 py-3 mb-6 focus-within:ring-2 focus-within:ring-primary focus-within:border-primary transition-all">
          <Lock size={18} className="text-primary mr-2 shrink-0" />
          <input type={showPassword ? 'text' : 'password'} value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="Enter your password" className="w-full outline-none text-sm" />
          <button type="button" onClick={() => setShowPassword(!showPassword)}>
            {showPassword ? <EyeOff size={18} className="text-gray-400" /> : <Eye size={18} className="text-gray-400" />}
          </button>
        </div>

        <button type="submit" disabled={loading}
          className="w-full bg-primary text-white rounded-xl py-3 font-semibold text-sm mb-6 flex items-center justify-center gap-2 disabled:opacity-60 hover:bg-purple-700 transition">
          {loading && <span className="w-4 h-4 border-2 border-white/40 border-t-white rounded-full animate-spin" />}
          Log In
        </button>

        <div className="flex items-center gap-3 mb-6">
          <div className="flex-1 h-px bg-gray-200" />
          <span className="text-gray-400 text-sm">or</span>
          <div className="flex-1 h-px bg-gray-200" />
        </div>

        <button type="button" onClick={loginWithGoogle}
          className="w-full border border-gray-200 rounded-xl py-3 flex items-center justify-center gap-2 font-medium text-sm mb-6 hover:bg-gray-50 transition">
          <svg width="18" height="18" viewBox="0 0 18 18">
            <path fill="#4285F4" d="M17.64 9.2c0-.64-.06-1.25-.16-1.84H9v3.48h4.84a4.14 4.14 0 01-1.8 2.72v2.26h2.9c1.7-1.56 2.7-3.86 2.7-6.62z"/>
            <path fill="#34A853" d="M9 18c2.43 0 4.47-.8 5.96-2.18l-2.9-2.26c-.8.54-1.84.86-3.06.86-2.35 0-4.34-1.59-5.05-3.72H.96v2.33A9 9 0 009 18z"/>
            <path fill="#FBBC05" d="M3.95 10.7A5.4 5.4 0 013.68 9c0-.59.1-1.17.27-1.7V4.97H.96A9 9 0 000 9c0 1.45.35 2.83.96 4.03l2.99-2.33z"/>
            <path fill="#EA4335" d="M9 3.58c1.32 0 2.5.45 3.44 1.35l2.58-2.58C13.46.89 11.43 0 9 0A9 9 0 00.96 4.97l2.99 2.33C4.66 5.17 6.65 3.58 9 3.58z"/>
          </svg>
          Continue with Google
        </button>

        <p className="text-center text-gray-500 text-sm">
          Don't have an account? <Link to="/signup" className="text-primary font-semibold">Sign up</Link>
        </p>
      </form>
    </div>
  );
}