import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Car, Search, PlusCircle, LogOut } from 'lucide-react';
import { GoogleLogin, googleLogout } from '@react-oauth/google';
import { jwtDecode } from 'jwt-decode';
import axios from 'axios';

function Navbar() {
  const [user, setUser] = useState(null);

  useEffect(() => {
    const token = localStorage.getItem('token');
    const storedUser = localStorage.getItem('user');
    if (token && storedUser) {
      setUser(JSON.parse(storedUser));
    }
  }, []);

  const handleLoginSuccess = async (credentialResponse) => {
    try {
      const { credential } = credentialResponse;
      // Send token to backend
      const res = await axios.post('http://localhost:5000/api/auth/google', { credential });
      
      const loggedInUser = res.data.user;
      setUser(loggedInUser);
      localStorage.setItem('token', credential);
      localStorage.setItem('user', JSON.stringify(loggedInUser));
    } catch (error) {
      console.error('Login failed', error);
      // Fallback for prototype if backend fails but we have the JWT
      const decoded = jwtDecode(credentialResponse.credential);
      const fallbackUser = {
        name: decoded.name,
        email: decoded.email,
        picture: decoded.picture
      };
      setUser(fallbackUser);
      localStorage.setItem('token', credentialResponse.credential);
      localStorage.setItem('user', JSON.stringify(fallbackUser));
    }
  };

  const handleLogout = () => {
    googleLogout();
    setUser(null);
    localStorage.removeItem('token');
    localStorage.removeItem('user');
  };

  return (
    <nav className="navbar">
      <div className="container flex justify-between items-center">
        <Link to="/" className="logo">
          <Car size={32} />
          <span>BlahBlahCar</span>
        </Link>
        <div className="flex gap-4 items-center">
          <Link to="/search" className="btn btn-outline">
            <Search size={20} />
            Find a ride
          </Link>
          <Link to="/offer" className="btn btn-primary">
            <PlusCircle size={20} />
            Publish a ride
          </Link>

          <div className="ml-4 flex items-center gap-4">
            {user ? (
              <div className="flex items-center gap-3">
                <img src={user.picture || `https://ui-avatars.com/api/?name=${user.name}`} alt={user.name} style={{ width: '40px', height: '40px', borderRadius: '50%' }} />
                <button onClick={handleLogout} className="btn btn-outline" style={{ padding: '8px 12px' }}>
                  <LogOut size={16} />
                </button>
              </div>
            ) : (
              <GoogleLogin
                onSuccess={handleLoginSuccess}
                onError={() => console.log('Login Failed')}
                useOneTap
              />
            )}
          </div>
        </div>
      </div>
    </nav>
  );
}

export default Navbar;
