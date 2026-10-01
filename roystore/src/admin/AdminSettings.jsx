import { useState } from 'react';
import api from '../api/axios';
import { useAuth } from '../context/AuthContext';
import { formatError } from './utils';
import { PageHeader } from './AdminUI';

const inputCls = 'w-full border border-gray-200 rounded-xl px-4 py-2.5 text-sm outline-none focus:ring-2 focus:ring-primary focus:border-primary transition-all';

export default function AdminSettings() {
  const { user, setUser } = useAuth();

  const [fullName, setFullName] = useState(user?.full_name || '');
  const [profileMsg, setProfileMsg] = useState({ type: '', text: '' });
  const [savingProfile, setSavingProfile] = useState(false);

  const [pw, setPw] = useState({ current: '', next: '', confirm: '' });
  const [pwMsg, setPwMsg] = useState({ type: '', text: '' });
  const [savingPw, setSavingPw] = useState(false);

  const saveProfile = async (e) => {
    e.preventDefault();
    setProfileMsg({ type: '', text: '' });
    setSavingProfile(true);
    try {
      const res = await api.patch('/auth/users/me/', { full_name: fullName });
      setUser(res.data);
      setProfileMsg({ type: 'ok', text: 'Profile updated.' });
    } catch (err) {
      setProfileMsg({ type: 'err', text: formatError(err) });
    } finally {
      setSavingProfile(false);
    }
  };

  const changePassword = async (e) => {
    e.preventDefault();
    setPwMsg({ type: '', text: '' });
    if (pw.next !== pw.confirm) {
      setPwMsg({ type: 'err', text: 'New passwords do not match.' });
      return;
    }
    setSavingPw(true);
    try {
      await api.post('/auth/users/set_password/', { current_password: pw.current, new_password: pw.next });
      setPw({ current: '', next: '', confirm: '' });
      setPwMsg({ type: 'ok', text: 'Password changed.' });
    } catch (err) {
      setPwMsg({ type: 'err', text: formatError(err) });
    } finally {
      setSavingPw(false);
    }
  };

  const Msg = ({ m }) =>
    m.text ? <p className={`text-sm ${m.type === 'ok' ? 'text-green-600' : 'text-red-500'}`}>{m.text}</p> : null;

  return (
    <div className="max-w-xl">
      <PageHeader title="Settings" subtitle="Manage your admin account" />

      <form onSubmit={saveProfile} className="bg-white border border-gray-100 rounded-2xl p-5 mb-6 space-y-4">
        <h2 className="font-bold">Profile</h2>
        <div>
          <label className="text-sm font-medium block mb-1">Full name</label>
          <input required value={fullName} onChange={(e) => setFullName(e.target.value)} className={inputCls} />
        </div>
        <div>
          <label className="text-sm font-medium block mb-1">Email</label>
          <input disabled value={user?.email || ''} className={`${inputCls} bg-gray-50 text-gray-500`} />
        </div>
        <Msg m={profileMsg} />
        <button disabled={savingProfile} className="bg-primary text-white font-semibold rounded-xl px-6 py-2.5 text-sm disabled:opacity-60">
          {savingProfile ? 'Saving...' : 'Save Profile'}
        </button>
      </form>

      <form onSubmit={changePassword} className="bg-white border border-gray-100 rounded-2xl p-5 space-y-4">
        <h2 className="font-bold">Change password</h2>
        <div>
          <label className="text-sm font-medium block mb-1">Current password</label>
          <input required type="password" autoComplete="current-password" value={pw.current} onChange={(e) => setPw({ ...pw, current: e.target.value })} className={inputCls} />
        </div>
        <div>
          <label className="text-sm font-medium block mb-1">New password</label>
          <input required type="password" autoComplete="new-password" value={pw.next} onChange={(e) => setPw({ ...pw, next: e.target.value })} className={inputCls} />
        </div>
        <div>
          <label className="text-sm font-medium block mb-1">Confirm new password</label>
          <input required type="password" autoComplete="new-password" value={pw.confirm} onChange={(e) => setPw({ ...pw, confirm: e.target.value })} className={inputCls} />
        </div>
        <Msg m={pwMsg} />
        <button disabled={savingPw} className="bg-primary text-white font-semibold rounded-xl px-6 py-2.5 text-sm disabled:opacity-60">
          {savingPw ? 'Updating...' : 'Update Password'}
        </button>
      </form>

      <p className="text-xs text-gray-400 mt-6">
        Store-wide settings (delivery fee, store name, and so on) need a settings model on the backend, which doesn't exist yet, so they aren't shown here.
      </p>
    </div>
  );
}