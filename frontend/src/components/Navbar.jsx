import { Link, useNavigate } from 'react-router-dom';
import { Search, PlusCircle, LogOut, User as UserIcon, Menu, X, Car } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useState } from 'react';

function Navbar() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [mobileOpen, setMobileOpen] = useState(false);

  const handleLogout = () => {
    logout();
    navigate('/');
    setMobileOpen(false);
  };

  return (
    <nav className="navbar">
      <div className="container" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        
        {/* Logo */}
        <Link to="/" className="navbar-logo" onClick={() => setMobileOpen(false)}>
          <svg width="34" height="34" viewBox="0 0 40 40" fill="none">
            <circle cx="14" cy="20" r="10" fill="#0056D2" fillOpacity="0.2"/>
            <circle cx="26" cy="20" r="10" fill="#0056D2"/>
            <circle cx="14" cy="20" r="6" fill="#0056D2"/>
            <circle cx="26" cy="20" r="6" fill="white"/>
          </svg>
          <span style={{ fontWeight: 800, fontSize: '1.4rem', letterSpacing: '-0.03em', color: 'var(--primary)' }}>
            BlahBlahCar
          </span>
        </Link>

        {/* Desktop Actions */}
        <div className="navbar-actions">
          <Link to="/search" className="btn btn-ghost hide-mobile" style={{ gap: '6px', fontSize: '0.95rem' }}>
            <Search size={18} />
            Search
          </Link>

          <Link to="/offer" className="btn btn-outline btn-sm hide-mobile" style={{ gap: '6px' }}>
            <PlusCircle size={18} />
            Offer a ride
          </Link>

          {user ? (
            <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
              <div className="navbar-divider hide-mobile"></div>
              <Link 
                to="/dashboard" 
                style={{ display: 'flex', alignItems: 'center', gap: '6px', fontWeight: 600, fontSize: '0.9rem', color: 'var(--text-main)' }} 
                className="hide-mobile"
              >
                <UserIcon size={18} color="var(--primary)" />
                Dashboard
              </Link>
              <Link to="/dashboard">
                <img
                  src={user.picture || `https://ui-avatars.com/api/?name=${encodeURIComponent(user.name)}&background=0056D2&color=fff&bold=true`}
                  alt={user.name}
                  className="navbar-avatar"
                  title={user.name}
                />
              </Link>
              <button
                onClick={handleLogout}
                className="btn btn-ghost btn-sm"
                style={{ padding: '8px', color: 'var(--text-muted)' }}
                title="Log out"
              >
                <LogOut size={18} />
              </button>
            </div>
          ) : (
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <Link to="/login" className="btn btn-ghost btn-sm">
                Log in
              </Link>
              <Link to="/register" className="btn btn-primary btn-sm">
                Sign up
              </Link>
            </div>
          )}

          {/* Mobile hamburger button */}
          <button 
            onClick={() => setMobileOpen(!mobileOpen)} 
            className="btn-icon" 
            style={{ display: 'none' }}
          >
            {mobileOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>

      </div>

      {/* Mobile Drawer */}
      {mobileOpen && (
        <div style={{ background: 'white', borderTop: '1px solid var(--border-light)', padding: '16px 24px', display: 'flex', flexDirection: 'column', gap: '12px' }}>
          <Link to="/search" onClick={() => setMobileOpen(false)} style={{ padding: '10px 0', fontWeight: 600, display: 'flex', alignItems: 'center', gap: '8px' }}>
            <Search size={18} /> Search rides
          </Link>
          <Link to="/offer" onClick={() => setMobileOpen(false)} style={{ padding: '10px 0', fontWeight: 600, display: 'flex', alignItems: 'center', gap: '8px' }}>
            <PlusCircle size={18} /> Offer a ride
          </Link>
          {user ? (
            <>
              <Link to="/dashboard" onClick={() => setMobileOpen(false)} style={{ padding: '10px 0', fontWeight: 600, display: 'flex', alignItems: 'center', gap: '8px' }}>
                <UserIcon size={18} /> Dashboard
              </Link>
              <button onClick={handleLogout} style={{ padding: '10px 0', textAlign: 'left', fontWeight: 600, color: 'var(--error)', display: 'flex', alignItems: 'center', gap: '8px' }}>
                <LogOut size={18} /> Log out
              </button>
            </>
          ) : (
            <div style={{ display: 'flex', gap: '10px', marginTop: '8px' }}>
              <Link to="/login" onClick={() => setMobileOpen(false)} className="btn btn-outline" style={{ flex: 1, textAlign: 'center' }}>
                Log in
              </Link>
              <Link to="/register" onClick={() => setMobileOpen(false)} className="btn btn-primary" style={{ flex: 1, textAlign: 'center' }}>
                Sign up
              </Link>
            </div>
          )}
        </div>
      )}
    </nav>
  );
}

export default Navbar;
