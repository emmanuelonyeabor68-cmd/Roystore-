import { useEffect, useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { ArrowLeft, Search as SearchIcon } from 'lucide-react';
import api from '../api/axios';
import ProductCard from '../components/ProductCard';
import BottomNav from '../components/BottomNav';

const chips = ['All', 'Electronics', 'Fashion', 'Accessories'];

export default function Search() {
  const [searchParams] = useSearchParams();
  const [allProducts, setAllProducts] = useState([]);
  const [query, setQuery] = useState('');
  const [activeCategory, setActiveCategory] = useState(searchParams.get('category') || 'All');
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    api.get('/api/v1/products/').then((res) => setAllProducts(res.data.results || [])).finally(() => setLoading(false));
  }, []);

  const filtered = allProducts.filter((p) => {
    const matchesQuery = query.trim() === '' || p.name.toLowerCase().includes(query.toLowerCase());
    const matchesCategory = activeCategory === 'All' || p.category === activeCategory;
    return matchesQuery && matchesCategory;
  });

  return (
    <div className="min-h-screen bg-white pb-24">
      <div className="flex items-center gap-3 px-4 pt-4">
        <button onClick={() => navigate(-1)}><ArrowLeft size={22} /></button>
        <div className="flex-1 flex items-center border border-gray-200 rounded-xl px-3 py-2.5">
          <SearchIcon size={18} className="text-gray-400 mr-2" />
          <input autoFocus value={query} onChange={(e) => setQuery(e.target.value)} placeholder="Search for products..." className="w-full outline-none text-sm" />
        </div>
      </div>

      <div className="flex gap-2 overflow-x-auto px-4 mt-4 pb-1" style={{ scrollbarWidth: 'none' }}>
        {chips.map((c) => (
          <button key={c} onClick={() => setActiveCategory(c)} className={`shrink-0 px-4 py-2 rounded-full text-sm font-medium border ${activeCategory === c ? 'border-primary text-primary bg-primary/5' : 'border-gray-200 text-gray-600'}`}>
            {c}
          </button>
        ))}
      </div>

      <div className="px-4 mt-6">
        {loading ? (
          <p className="text-gray-400 text-sm">Loading products...</p>
        ) : filtered.length === 0 ? (
          <p className="text-gray-500 text-sm">No products found{query && ` for "${query}"`}.</p>
        ) : (
          <div className="grid grid-cols-2 gap-3">
            {filtered.map((p) => <ProductCard key={p.id} product={p} />)}
          </div>
        )}
      </div>

      <BottomNav />
    </div>
  );
}