import { createContext, useState, useEffect } from 'react';
import { authService } from '../services/api';

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(JSON.parse(localStorage.getItem('userInfo')));
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (user) {
      localStorage.setItem('userInfo', JSON.stringify(user));
    } else {
      localStorage.removeItem('userInfo');
    }
    setLoading(false);
  }, [user]);

  const login = async (email, password) => {
    const { data } = await authService.login(email, password);
    setUser(data);
    return data;
  };

  const register = async (userData) => {
    const { data } = await authService.register(userData);
    setUser(data);
    return data;
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem('userInfo');
  };

  return (
    <AuthContext.Provider value={{ user, login, register, logout, loading }}>
      {children}
    </AuthContext.Provider>
  );
};
