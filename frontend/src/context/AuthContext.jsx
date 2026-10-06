import { createContext, useContext, useState, useEffect } from 'react';
import axios from 'axios';
import { googleLogout } from '@react-oauth/google';
import { jwtDecode } from 'jwt-decode';

const AuthContext = createContext();

export const useAuth = () => useContext(AuthContext);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const storedToken = localStorage.getItem('token');
    const storedUser = localStorage.getItem('user');

    if (storedToken && storedUser) {
      setToken(storedToken);
      setUser(JSON.parse(storedUser));
    }
    setLoading(false);
  }, []);

  const login = async (credentialResponse) => {
    try {
      const { credential } = credentialResponse;
      const res = await axios.post('http://localhost:5000/api/auth/google', { credential });
      
      const loggedInUser = res.data.user;
      setUser(loggedInUser);
      setToken(res.data.token);
      localStorage.setItem('token', res.data.token);
      localStorage.setItem('user', JSON.stringify(loggedInUser));
      return true;
    } catch (error) {
      console.error('Login failed, using fallback for prototype');
      // Fallback for prototype without ClientID validation on backend
      const decoded = jwtDecode(credentialResponse.credential);
      const fallbackUser = { name: decoded.name, email: decoded.email, picture: decoded.picture };
      setUser(fallbackUser);
      setToken(credentialResponse.credential);
      localStorage.setItem('token', credentialResponse.credential);
      localStorage.setItem('user', JSON.stringify(fallbackUser));
      return true;
    }
  };

  const logout = () => {
    googleLogout();
    setUser(null);
    setToken(null);
    localStorage.removeItem('token');
    localStorage.removeItem('user');
  };

  return (
    <AuthContext.Provider value={{ user, token, loading, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};
