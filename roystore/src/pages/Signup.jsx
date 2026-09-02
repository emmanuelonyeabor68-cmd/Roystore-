import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Mail, Lock, User, Eye, EyeOff } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

export default function Signup() {
  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [fieldErrors, setFieldErrors] = useState({});
  const [formError, setFormError] = useState('');
  const [success, setSuccess] = useState(false);
  const [loading, setLoading] = useState(false);
  const { signup, loginWithGoogle} = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setFormError('');
    setFieldErrors({});

    if (password.length < 8) {
      setFieldErrors({ password: 'Password must be at least 8 characters long' });
      return;
    }

    setLoading(true);
    try {
      await signup(fullName, email, password);
      setSuccess(true);
      setTimeout(() => navigate('/login'), 1500);
    } catch (err) {
      const data = err.response?.data;
      if (data && typeof data === 'object') {
        setFieldErrors({
          fullName: data.full_name?.[0],
          email: data.email?.[0],
          password: data.password?.[0],
        });
        if (!data.full_name && !data.email && !data.password) {
          setFormError('Something went wrong. Please try again.');
        }
      } else {
        setFormError('Could not connect. Please try again.');
      }
    } finally {
      setLoading(false);
    }
  };

  if (success) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-white px-6 text-center">
        <div className="w-14 h-14 bg-green-100 text-green-600 rounded-full flex items-center justify-center mb-4 text-2xl">✓</div>
        <h2 className="text-xl font-bold mb-1">Account created Successfully!</h2>
        <p className="text-gray-500">Taking you to login...</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-purple-150 px-6 pt-24 pb-6 flex flex-col items-center">
      <div className="flex flex-col items-center mb-5">
        <img src="/logo.png" alt="Roystore" className="w-14 h-18 pt-2 mb-0" />
        <h1 className="text-primary text-5xl font-extrabold mb-2">Roystore</h1>
      </div>

      <h2 className="text-2xl font-bold mb-1">Create your account</h2>
      <p className="text-gray-500 mb-8 text-center">Join Roystore and start shopping smarter</p>

      <form onSubmit={handleSubmit} className="w-full max-w-sm">
        {formError && <p className="text-red-500 text-sm mb-4">{formError}</p>}

        {/* Full Name */}
        <label className="text-sm font-medium block mb-1">Full Name</label>
        <div className={`flex items-center border rounded-xl px-4 py-3 mb-1 ${fieldErrors.fullName ? 'border-red-400' : 'border-gray-200'} focus-within:ring-2 focus-within:ring-primary focus-within:border-primary `}>
          <User size={18} className="text-primary mr-2 shrink-0" />
          <input value={fullName} onChange={(e) => setFullName(e.target.value)}
            placeholder="Enter your full name" className="w-full outline-none text-sm" />
        </div>
        {fieldErrors.fullName && <p className="text-red-500 text-xs mb-3">{fieldErrors.fullName}</p>}
        <div className="mb-4" />

        {/* Email */}
        <label className="text-sm font-medium block mb-1">Email Address</label>
        <div className={`flex items-center border rounded-xl px-4 py-3 mb-1 ${fieldErrors.email ? 'border-red-400' : 'border-gray-200'} focus-within:ring-2 focus-within:ring-primary focus-within:border-primary `}>
          <Mail size={18} className="text-primary mr-2 shrink-0" />
          <input type="email" value={email} onChange={(e) => setEmail(e.target.value)}
            placeholder="Enter your email address" className="w-full outline-none text-sm" />
        </div>
        {fieldErrors.email && <p className="text-red-500 text-xs mb-3">{fieldErrors.email}</p>}
        <div className="mb-4" />

        {/* Password */}
        <label className="text-sm font-medium block mb-1">Password</label>
        <div className={`flex items-center border rounded-xl px-4 py-3 mb-1 ${fieldErrors.password ? 'border-red-400' : 'border-gray-200'} focus-within:ring-2 focus-within:ring-primary focus-within:border-primary `}>
          <Lock size={18} className="text-primary mr-2 shrink-0" />
          <input type={showPassword ? 'text' : 'password'} value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="Create a password" className="w-full outline-none text-sm " />
          <button type="button" onClick={() => setShowPassword(!showPassword)}>
            {showPassword ? <EyeOff size={18} className="text-gray-400" /> : <Eye size={18} className="text-gray-400" />}
          </button>
        </div>
        {fieldErrors.password ? (
          <p className="text-red-500 text-xs mb-6">{fieldErrors.password}</p>
        ) : (
          <p className="text-gray-400 text-xs mb-6">Password must be at least 8 characters long</p>
        )}

        <button type="submit" disabled={loading}
          className="w-full bg-primary text-white rounded-xl py-3 font-semibold text-sm mb-6 flex items-center justify-center gap-2 disabled:opacity-60 hover:bg-purple-700 transition">
          {loading && <span className="w-4 h-4 border-2 border-white/40 border-t-white rounded-full animate-spin" />}
          Sign Up
        </button>

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
          Already have an account? <Link to="/login" className="text-primary font-semibold">Log in</Link>
        </p>
      </form>
    </div>
  );
}