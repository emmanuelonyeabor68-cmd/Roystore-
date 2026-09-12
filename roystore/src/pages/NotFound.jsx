import { Link } from 'react-router-dom';

export default function NotFound() {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center px-6 text-center">
      <h1 className="text-6xl font-extrabold text-primary mb-2">404</h1>
      <p className="text-gray-700 font-semibold mb-1">Page not found</p>
      <p className="text-gray-400 text-sm mb-6">The page you're looking for doesn't exist.</p>
      <Link to="/" className="bg-primary text-white font-semibold rounded-xl px-6 py-3">
        Back to Home
      </Link>
    </div>
  );
}