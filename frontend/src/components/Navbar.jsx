import { Link, useLocation } from 'react-router-dom';
import { Car, Search, PlusCircle, LogOut } from 'lucide-react';
import { GoogleLogin } from '@react-oauth/google';
import { useAuth } from '../context/AuthContext';
import { useState, useEffect } from 'react';

function Navbar() {
  const { user, login, logout } = useAuth();
  const location = useLocation();
  const [authMessage, setAuthMessage] = useState('');

  useEffect(() => {
    if (location.state?.message) {
      setAuthMessage(location.state.message);
      const timer = setTimeout(() => setAuthMessage(''), 5000);
      return () => clearTimeout(timer);
    }
  }, [location]);

  return (
    <>
      {authMessage && (
        <div style={{ backgroundColor: '#FF5E5B', color: 'white', textAlign: 'center', padding: '8px', fontWeight: '500' }}>
          {authMessage}
        </div>
      )}
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
                  <button onClick={logout} className="btn btn-outline" style={{ padding: '8px 12px' }}>
                    <LogOut size={16} />
                  </button>
                </div>
              ) : (
                <GoogleLogin
                  onSuccess={login}
                  onError={() => console.log('Login Failed')}
                  useOneTap
                />
              )}
            </div>
          </div>
        </div>
      </nav>
    </>
  );
}

export default Navbar;
