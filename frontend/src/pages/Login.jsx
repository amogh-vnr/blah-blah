import { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { GoogleLogin } from '@react-oauth/google';
import { Car, Mail, Lock } from 'lucide-react';

function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  
  const { loginWithEmail, loginWithGoogle } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  
  const from = location.state?.from?.pathname || '/dashboard';

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');
    
    const result = await loginWithEmail(email, password);
    if (result.success) {
      navigate(from, { replace: true });
    } else {
      setError(result.message);
      setIsLoading(false);
    }
  };

  const handleGoogleSuccess = async (credentialResponse) => {
    const result = await loginWithGoogle(credentialResponse);
    if (result.success) {
      navigate(from, { replace: true });
    } else {
      setError(result.message);
    }
  };

  return (
    <div style={{ minHeight: 'calc(100vh - 73px)', display: 'flex', flexDirection: 'row' }}>
      
      {/* Left side - Image */}
      <div 
        style={{ 
          flex: 1, 
          backgroundColor: 'var(--primary)', 
          color: 'white', 
          display: 'flex', 
          flexDirection: 'column', 
          justifyContent: 'center', 
          alignItems: 'center',
          padding: '40px',
          textAlign: 'center'
        }}
        className="auth-hero"
      >
        <Car size={80} style={{ marginBottom: '24px' }} />
        <h1 className="title-xl" style={{ marginBottom: '16px' }}>Welcome back</h1>
        <p className="text-body" style={{ color: 'white', fontSize: '1.25rem', opacity: 0.9, maxWidth: '400px' }}>
          Log in to book your next ride or manage your published journeys.
        </p>
      </div>

      {/* Right side - Form */}
      <div 
        style={{ 
          flex: 1, 
          display: 'flex', 
          alignItems: 'center', 
          justifyContent: 'center', 
          padding: '40px',
          backgroundColor: 'white'
        }}
      >
        <div style={{ width: '100%', maxWidth: '400px' }}>
          <div style={{ textAlign: 'center', marginBottom: '32px' }}>
            <h2 className="title-lg">Sign in to your account</h2>
          </div>

          {location.state?.message && (
            <div style={{ marginBottom: '24px', padding: '16px', backgroundColor: '#FEF2F2', color: '#DC2626', borderRadius: '8px', border: '1px solid #FCA5A5', fontWeight: 500, fontSize: '0.875rem' }}>
              {location.state.message}
            </div>
          )}

          {error && (
            <div style={{ marginBottom: '24px', padding: '16px', backgroundColor: '#FEF2F2', color: '#DC2626', borderRadius: '8px', border: '1px solid #FCA5A5', fontWeight: 500, fontSize: '0.875rem' }}>
              {error}
            </div>
          )}

          <div style={{ display: 'none', justifyContent: 'center', marginBottom: '32px' }}>
            {/* GoogleLogin component removed because it requires a real Client ID */}
          </div>

          <div style={{ display: 'none', alignItems: 'center', gap: '16px', marginBottom: '32px' }}>
            <div style={{ flex: 1, borderTop: '1px solid var(--border)' }}></div>
            <span style={{ color: 'var(--text-muted)', fontSize: '0.875rem', fontWeight: 500 }}>OR</span>
            <div style={{ flex: 1, borderTop: '1px solid var(--border)' }}></div>
          </div>

          <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
            <div className="input-group">
              <label htmlFor="email">Email Address</label>
              <div style={{ position: 'relative', display: 'flex', alignItems: 'center' }}>
                <Mail size={20} style={{ position: 'absolute', left: '16px', color: 'var(--text-muted)' }} />
                <input 
                  type="email" 
                  id="email" 
                  required 
                  className="input-field" 
                  style={{ paddingLeft: '48px' }}
                  placeholder="you@example.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                />
              </div>
            </div>

            <div className="input-group">
              <label htmlFor="password">Password</label>
              <div style={{ position: 'relative', display: 'flex', alignItems: 'center' }}>
                <Lock size={20} style={{ position: 'absolute', left: '16px', color: 'var(--text-muted)' }} />
                <input 
                  type="password" 
                  id="password" 
                  required 
                  className="input-field" 
                  style={{ paddingLeft: '48px' }}
                  placeholder="••••••••"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                />
              </div>
            </div>

            <button 
              type="submit" 
              className="btn btn-primary"
              style={{ padding: '16px', marginTop: '16px', width: '100%' }}
              disabled={isLoading}
            >
              {isLoading ? 'Signing in...' : 'Sign in'}
            </button>
          </form>

          <p style={{ textAlign: 'center', marginTop: '32px', color: 'var(--text-muted)' }}>
            Don't have an account? <Link to="/register" style={{ color: 'var(--primary)', fontWeight: 600 }}>Sign up</Link>
          </p>
        </div>
      </div>
    </div>
  );
}

export default Login;
