import { useCallback, useEffect, useRef, useState } from 'react';
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
  const [nextUrl, setNextUrl] = useState(null);
  const [loadingMore, setLoadingMore] = useState(false);
  const [error, setError] = useState('');
  const sentinelRef = useRef(null);
  const requestInProgress = useRef(false);
  const navigate = useNavigate();

  const fetchProducts = useCallback(async (url) => {
    const res = await api.get(url);
    return {
      products: Array.isArray(res.data) ? res.data : (res.data.results || []),
      nextUrl: res.data.next || null,
    };
  }, []);

  useEffect(() => {
    let active = true;
    fetchProducts('/api/v1/products/')
      .then(({ products, nextUrl: pageNextUrl }) => {
        if (!active) return;
        setAllProducts(products);
        setNextUrl(pageNextUrl);
      })
      .catch(() => {
        if (active) setError('Could not load products. Please try again.');
      })
      .finally(() => {
        if (active) setLoading(false);
      });

    return () => {
      active = false;
    };
  }, [fetchProducts]);

  const loadNextPage = useCallback(async () => {
    if (!nextUrl || requestInProgress.current) return;
    requestInProgress.current = true;
    setLoadingMore(true);
    setError('');
    try {
      const { products, nextUrl: pageNextUrl } = await fetchProducts(nextUrl);
      setAllProducts((current) => [...current, ...products]);
      setNextUrl(pageNextUrl);
    } catch {
      setError('Could not load more products. Please try again.');
    } finally {
      requestInProgress.current = false;
      setLoadingMore(false);
    }
  }, [fetchProducts, nextUrl]);

  useEffect(() => {
    const sentinel = sentinelRef.current;
    if (!sentinel || !nextUrl || loadingMore || error || !('IntersectionObserver' in window)) return;

    const observer = new IntersectionObserver(([entry]) => {
      if (entry.isIntersecting) loadNextPage();
    }, { rootMargin: '300px' });

    observer.observe(sentinel);
    return () => observer.disconnect();
  }, [error, loadNextPage, loadingMore, nextUrl]);

  const filtered = allProducts.filter((p) => {
    const matchesQuery = query.trim() === '' || p.name.toLowerCase().includes(query.toLowerCase());
    const matchesCategory = activeCategory === 'All' || p.category === activeCategory;
    return matchesQuery && matchesCategory;
  });

  return (
    <div className="min-h-screen bg-white pb-24 lg:pb-12">
      <div className="mx-auto max-w-5xl lg:pl-64">
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
          ) : error && allProducts.length === 0 ? (
            <div>
              <p className="text-red-500 text-sm">{error}</p>
              <button
                onClick={() => {
                  setLoading(true);
                  setError('');
                  fetchProducts('/api/v1/products/')
                    .then(({ products, nextUrl: pageNextUrl }) => {
                      setAllProducts(products);
                      setNextUrl(pageNextUrl);
                    })
                    .catch(() => setError('Could not load products. Please try again.'))
                    .finally(() => setLoading(false));
                }}
                className="mt-3 text-primary text-sm font-medium"
              >
                Try again
              </button>
            </div>
          ) : filtered.length === 0 ? (
            <p className="text-gray-500 text-sm">
              {nextUrl
                ? loadingMore
                  ? 'Loading more products...'
                  : error
                    ? 'More products could not be loaded.'
                    : 'Scroll to load more products...'
                : <>No products found{query && ` for "${query}"`}.</>}
            </p>
          ) : (
            <div className="grid grid-cols-2 gap-3 lg:grid-cols-4">
              {filtered.map((p) => <ProductCard key={p.id} product={p} />)}
            </div>
          )}
          {nextUrl && (
            <div ref={sentinelRef} className="py-4 text-center">
              {loadingMore && <p className="text-gray-400 text-sm">Loading more products...</p>}
              {error && (
                <div>
                  <p className="text-red-500 text-sm">{error}</p>
                  <button onClick={loadNextPage} className="mt-2 text-primary text-sm font-medium">Try again</button>
                </div>
              )}
              {!('IntersectionObserver' in window) && !loadingMore && !error && (
                <button onClick={loadNextPage} className="text-primary text-sm font-medium">Load more products</button>
              )}
            </div>
          )}
        </div>
      </div>

      <BottomNav />
    </div>
  );
}