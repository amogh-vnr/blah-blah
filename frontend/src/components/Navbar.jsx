import { Link, useLocation } from 'react-router-dom';
import { Car, Search, PlusCircle, LogOut, User as UserIcon } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

function Navbar() {
  const { user, logout } = useAuth();

  return (
    <nav className="navbar">
      <div className="container flex justify-between items-center">
        <Link to="/" className="logo">
          <Car size={32} />
          <span>BlahBlahCar</span>
        </Link>
        <div className="flex gap-4 items-center">
          <Link to="/search" className="btn btn-outline nav-button">
            <Search size={20} />
            Find a ride
          </Link>
          <Link to="/offer" className="btn btn-primary nav-button">
            <PlusCircle size={20} />
            Publish a ride
          </Link>

          <div className="ml-4 flex items-center gap-4">
            {user ? (
              <div className="flex items-center gap-3">
                <Link to="/dashboard" className="hidden md:flex items-center gap-2 font-medium hover:text-primary transition-colors">
                  <UserIcon size={20} />
                  Dashboard
                </Link>
                <div className="h-6 w-px bg-gray-300 mx-2 hidden md:block"></div>
                <img src={user.picture || `https://ui-avatars.com/api/?name=${user.name}`} alt={user.name} style={{ width: '40px', height: '40px', borderRadius: '50%' }} />
                <button onClick={logout} className="btn btn-outline" style={{ padding: '8px 12px' }}>
                  <LogOut size={16} />
                </button>
              </div>
            ) : (
              <div className="flex items-center gap-2">
                <Link to="/login" className="btn hover:text-primary font-medium" style={{ padding: '8px 16px' }}>
                  Log in
                </Link>
                <Link to="/register" className="btn btn-primary" style={{ padding: '10px 20px' }}>
                  Sign up
                </Link>
              </div>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
}

export default Navbar;
