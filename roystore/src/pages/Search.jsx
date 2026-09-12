import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, Search as SearchIcon } from 'lucide-react';
import api from '../api/axios';
import ProductCard from '../components/ProductCard';
import BottomNav from '../components/BottomNav';

export default function Search() {
  const [query, setQuery] = useState('');
  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(false);
  const [searched, setSearched] = useState(false);
  const navigate = useNavigate();

  const handleSearch = async (e) => {
    e.preventDefault();
    if (!query.trim()) return;
    setLoading(true);
    setSearched(true);
    try {
      const res = await api.get(`/api/v1/products/?search=${encodeURIComponent(query)}`);
      setResults(res.data.results || []);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-white pb-24">
      <div className="flex items-center gap-3 px-4 pt-4">
        <button onClick={() => navigate(-1)}><ArrowLeft size={22} /></button>
        <form onSubmit={handleSearch} className="flex-1 flex items-center border border-gray-200 rounded-xl px-3 py-2.5">
          <SearchIcon size={18} className="text-gray-400 mr-2" />
          <input
            autoFocus
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search for products..."
            className="w-full outline-none text-sm"
          />
        </form>
      </div>

      <div className="px-4 mt-6">
        {loading ? (
          <p className="text-gray-400 text-sm">Searching...</p>
        ) : searched && results.length === 0 ? (
          <p className="text-gray-500 text-sm">No products found for "{query}"</p>
        ) : (
          <div className="grid grid-cols-2 gap-3">
            {results.map((p) => <ProductCard key={p.id} product={p} />)}
          </div>
        )}
      </div>

      <BottomNav />
    </div>
  );
}