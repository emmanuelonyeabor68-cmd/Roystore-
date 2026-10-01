import { useCallback, useEffect, useState } from 'react';
import { Plus, Pencil, Trash2 } from 'lucide-react';
import api from '../api/axios';
import { naira, formatError } from './utils';
import { Modal, PageHeader, Pager } from './AdminUI';

const PAGE_SIZE = 10; // must match PAGE_SIZE in your Django REST_FRAMEWORK settings
const CATEGORIES = ['Electronics', 'Fashion', 'Accessories', 'Home'];
const inputCls = 'w-full border border-gray-200 rounded-xl px-4 py-2.5 text-sm outline-none focus:ring-2 focus:ring-primary focus:border-primary transition-all';

function ProductForm({ product, onSaved }) {
  const [form, setForm] = useState({
    name: product?.name || '',
    description: product?.description || '',
    price: product?.price || '',
    stock: product?.stock ?? '',
    category: product?.category || '',
  });
  const [image, setImage] = useState(null);
  const [preview, setPreview] = useState(product?.image || '');
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');

  const set = (k) => (e) => setForm({ ...form, [k]: e.target.value });

  const pickImage = (e) => {
    const file = e.target.files[0];
    if (!file) return;
    setImage(file);
    setPreview(URL.createObjectURL(file));
  };

  const submit = async (e) => {
    e.preventDefault();
    setError('');
    setSaving(true);
    const fd = new FormData();
    Object.entries(form).forEach(([k, v]) => fd.append(k, v));
    if (image) fd.append('image', image); // only send an image when a new one was chosen
    try {
      if (product) await api.patch(`/api/v1/products/${product.id}/`, fd);
      else await api.post('/api/v1/products/', fd);
      onSaved();
    } catch (err) {
      setError(formatError(err));
    } finally {
      setSaving(false);
    }
  };

  return (
    <form onSubmit={submit} className="space-y-4">
      {error && <p className="text-red-500 text-sm">{error}</p>}

      <div>
        <label className="text-sm font-medium block mb-1">Name</label>
        <input required value={form.name} onChange={set('name')} className={inputCls} />
      </div>

      <div>
        <label className="text-sm font-medium block mb-1">Description</label>
        <textarea rows={3} value={form.description} onChange={set('description')} className={`${inputCls} resize-none`} />
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="text-sm font-medium block mb-1">Price (₦)</label>
          <input required type="number" min="0" step="0.01" value={form.price} onChange={set('price')} className={inputCls} />
        </div>
        <div>
          <label className="text-sm font-medium block mb-1">Stock</label>
          <input required type="number" min="0" value={form.stock} onChange={set('stock')} className={inputCls} />
        </div>
      </div>

      <div>
        <label className="text-sm font-medium block mb-1">Category</label>
        <input list="category-options" value={form.category} onChange={set('category')} className={inputCls} placeholder="e.g. Electronics" />
        <datalist id="category-options">
          {CATEGORIES.map((c) => <option key={c} value={c} />)}
        </datalist>
        <p className="text-xs text-gray-400 mt-1">Spelling must match the storefront filters exactly.</p>
      </div>

      <div>
        <label className="text-sm font-medium block mb-1">Image</label>
        {preview && <img src={preview} alt="" className="w-24 h-24 rounded-xl object-cover mb-2" />}
        <input type="file" accept="image/*" onChange={pickImage} className="text-sm" />
      </div>

      <button type="submit" disabled={saving} className="w-full bg-primary text-white font-semibold rounded-xl py-3 disabled:opacity-60">
        {saving ? 'Saving...' : product ? 'Save Changes' : 'Add Product'}
      </button>
    </form>
  );
}

export default function AdminProducts() {
  const [products, setProducts] = useState([]);
  const [count, setCount] = useState(0);
  const [page, setPage] = useState(1);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [editing, setEditing] = useState(null); // null | 'new' | product
  const [deleting, setDeleting] = useState(null);
  const [deleteError, setDeleteError] = useState('');
  const [busy, setBusy] = useState(false);

  const load = useCallback(async () => {
    setLoading(true);
    setError('');
    try {
      const res = await api.get(`/api/v1/products/?page=${page}`);
      setProducts(res.data.results || []);
      setCount(res.data.count ?? 0);
    } catch (e) {
      if (e.response?.status === 404 && page > 1) setPage((p) => p - 1); // page vanished after a delete
      else setError('Could not load products.');
    } finally {
      setLoading(false);
    }
  }, [page]);

  useEffect(() => { load(); }, [load]);

  const confirmDelete = async () => {
    setBusy(true);
    setDeleteError('');
    try {
      await api.delete(`/api/v1/products/${deleting.id}/`);
      setDeleting(null);
      load();
    } catch (e) {
      setDeleteError(formatError(e));
    } finally {
      setBusy(false);
    }
  };

  const pages = Math.max(1, Math.ceil(count / PAGE_SIZE));

  return (
    <div>
      <PageHeader
        title="Products"
        subtitle={`${count} product${count === 1 ? '' : 's'} in your catalog`}
        action={
          <button onClick={() => setEditing('new')} className="flex items-center gap-2 bg-primary text-white text-sm font-semibold rounded-xl px-4 py-2.5 w-fit">
            <Plus size={16} /> Add Product
          </button>
        }
      />

      <div className="bg-white border border-gray-100 rounded-2xl overflow-hidden">
        {loading ? (
          <p className="text-gray-400 text-sm p-5">Loading...</p>
        ) : error ? (
          <p className="text-red-500 text-sm p-5">{error}</p>
        ) : (
          <>
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead className="bg-gray-50 text-left text-xs uppercase text-gray-400">
                  <tr>
                    <th className="px-5 py-3 font-medium">Product</th>
                    <th className="px-5 py-3 font-medium">Category</th>
                    <th className="px-5 py-3 font-medium">Price</th>
                    <th className="px-5 py-3 font-medium">Stock</th>
                    <th className="px-5 py-3 font-medium">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {products.length === 0 ? (
                    <tr><td colSpan={5} className="px-5 py-8 text-center text-gray-400">No products yet. Add your first one.</td></tr>
                  ) : products.map((p) => (
                    <tr key={p.id} className="border-t border-gray-100">
                      <td className="px-5 py-3">
                        <div className="flex items-center gap-3">
                          {p.image
                            ? <img src={p.image} alt="" loading="lazy" className="w-10 h-10 rounded-lg object-cover" />
                            : <div className="w-10 h-10 rounded-lg bg-gray-100" />}
                          <span className="font-medium">{p.name}</span>
                        </div>
                      </td>
                      <td className="px-5 py-3 text-gray-500">{p.category || '—'}</td>
                      <td className="px-5 py-3 font-semibold">{naira(p.price)}</td>
                      <td className="px-5 py-3">
                        {p.stock === 0 ? (
                          <span className="text-xs font-semibold px-2.5 py-1 rounded-full bg-red-100 text-red-600">Out of stock</span>
                        ) : p.stock <= 5 ? (
                          <span className="text-xs font-semibold px-2.5 py-1 rounded-full bg-orange-100 text-orange-600">Low: {p.stock}</span>
                        ) : (
                          <span>{p.stock}</span>
                        )}
                      </td>
                      <td className="px-5 py-3">
                        <div className="flex items-center gap-3">
                          <button onClick={() => setEditing(p)} className="text-gray-400 hover:text-primary"><Pencil size={17} /></button>
                          <button onClick={() => setDeleting(p)} className="text-gray-400 hover:text-red-500"><Trash2 size={17} /></button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            <Pager page={page} pages={pages} onChange={setPage} />
          </>
        )}
      </div>

      {editing && (
        <Modal title={editing === 'new' ? 'Add Product' : 'Edit Product'} onClose={() => setEditing(null)}>
          <ProductForm
            product={editing === 'new' ? null : editing}
            onSaved={() => { setEditing(null); load(); }}
          />
        </Modal>
      )}

      {deleting && (
        <Modal title="Delete product?" onClose={() => setDeleting(null)}>
          <p className="text-sm text-gray-600 mb-2">
            <span className="font-semibold">{deleting.name}</span> will be removed from the catalog and from any customer's cart. Past orders keep their record of it.
          </p>
          {deleteError && <p className="text-red-500 text-sm mb-2">{deleteError}</p>}
          <div className="flex gap-3 mt-4">
            <button onClick={() => setDeleting(null)} className="flex-1 border border-gray-200 rounded-xl py-2.5 text-sm font-medium">Cancel</button>
            <button onClick={confirmDelete} disabled={busy} className="flex-1 bg-red-500 text-white rounded-xl py-2.5 text-sm font-semibold disabled:opacity-60">
              {busy ? 'Deleting...' : 'Delete'}
            </button>
          </div>
        </Modal>
      )}
    </div>
  );
}