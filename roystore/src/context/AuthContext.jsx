import { createContext, useContext, useState, useEffect } from 'react';
import api, { setAccessToken } from '../api/axios';

const AuthContext = createContext();

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  // On page load, try to use the httpOnly refresh cookie to restore the session
  useEffect(() => {
    api.post('/auth/v1/refresh/')
      .then((res) => {
        setAccessToken(res.data.access);
        return api.get('/auth/users/me/');
      })
      .then((res) => setUser(res.data))
      .catch(() => setAccessToken(null))
      .finally(() => setLoading(false));
  }, []);

  const login = async (email, password) => {
    const res = await api.post('/auth/v1/login/', { email, password });
    setAccessToken(res.data.access);
    const userRes = await api.get('/auth/users/me/');
    setUser(userRes.data);
  };

  const signup = async (fullName, email, password) => {
    await api.post('/auth/users/', { full_name: fullName, email, password });
  };

  const loginWithGoogle = () => {
    window.location.href = `${api.defaults.baseURL}/auth/google/login/`;
  };

  const logout = async () => {
    await api.post('/auth/v1/logout/');
    setAccessToken(null);
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, loading, login, signup, loginWithGoogle, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => useContext(AuthContext);