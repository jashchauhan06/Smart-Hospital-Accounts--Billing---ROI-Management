import { createContext, useContext, useState, useEffect } from 'react';
import { authAPI } from '../services/api';

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(() => {
    const saved = localStorage.getItem('hospintel_user');
    return saved ? JSON.parse(saved) : null;
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const token = localStorage.getItem('hospintel_token');
    if (token) {
      authAPI.me()
        .then(res => {
          if (res?.data) {
            setUser(res.data);
            localStorage.setItem('hospintel_user', JSON.stringify(res.data));
          }
        })
        .catch((err) => {
          if (err.response?.status === 401) {
            localStorage.removeItem('hospintel_token');
            localStorage.removeItem('hospintel_user');
            setUser(null);
          }
        })
        .finally(() => setLoading(false));
    } else {
      setLoading(false);
    }
  }, []);

  const login = async (email, password) => {
    const res = await authAPI.login({ email, password });
    const { access_token, user: userData } = res.data;
    localStorage.setItem('hospintel_token', access_token);
    localStorage.setItem('hospintel_user', JSON.stringify(userData));
    setUser(userData);
    return userData;
  };

  const register = async (name, email, password, role) => {
    const res = await authAPI.register({ name, email, password, role });
    const { access_token, user: userData } = res.data;
    localStorage.setItem('hospintel_token', access_token);
    localStorage.setItem('hospintel_user', JSON.stringify(userData));
    setUser(userData);
    return userData;
  };

  const logout = () => {
    localStorage.removeItem('hospintel_token');
    localStorage.removeItem('hospintel_user');
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, login, register, logout, loading }}>
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => useContext(AuthContext);
