import { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { Car, Mail, Lock, AlertCircle, ShieldCheck, Sparkles, Loader2 } from 'lucide-react';

function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  
  const { loginWithEmail } = useAuth();
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
      setError(result.message || 'Invalid email or password');
      setIsLoading(false);
    }
  };

  const handleQuickDemoLogin = async (demoEmail) => {
    setEmail(demoEmail);
    setPassword('password123');
    setIsLoading(true);
    setError('');
    const result = await loginWithEmail(demoEmail, 'password123');
    if (result.success) {
      navigate(from, { replace: true });
    } else {
      setError(result.message || 'Demo login failed');
      setIsLoading(false);
    }
  };

  return (
    <div style={{ minHeight: 'calc(100vh - 70px)', display: 'flex', flexDirection: 'row', flexWrap: 'wrap' }}>
      
      {/* Left Brand Panel */}
      <div 
        style={{ 
          flex: '1 1 450px', 
          background: 'linear-gradient(135deg, #054752 0%, #0056D2 100%)', 
          color: 'white', 
          display: 'flex', 
          flexDirection: 'column', 
          justifyContent: 'center', 
          alignItems: 'center',
          padding: '60px 40px',
          textAlign: 'center'
        }}
      >
        <div style={{ width: '80px', height: '80px', borderRadius: '50%', background: 'rgba(255,255,255,0.15)', display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: '24px' }}>
          <Car size={44} color="white" />
        </div>
        <h1 className="heading-xl" style={{ color: 'white', marginBottom: '16px' }}>Welcome back</h1>
        <p style={{ color: 'rgba(255,255,255,0.85)', fontSize: '1.15rem', maxWidth: '420px', lineHeight: 1.6, marginBottom: '32px' }}>
          Log in to manage your rides, check bookings, and stay connected with fellow commuters.
        </p>

        <div style={{ display: 'flex', flexDirection: 'column', gap: '12px', textAlign: 'left', background: 'rgba(255,255,255,0.1)', padding: '20px 24px', borderRadius: '16px', maxWidth: '380px', width: '100%' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px', fontSize: '0.9rem' }}>
            <ShieldCheck size={18} color="#34D399" /> 100% ID-verified community
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px', fontSize: '0.9rem' }}>
            <Sparkles size={18} color="#FBBF24" /> Instant booking on all major routes
          </div>
        </div>
      </div>

      {/* Right Form Panel */}
      <div 
        style={{ 
          flex: '1 1 450px', 
          display: 'flex', 
          alignItems: 'center', 
          justifyContent: 'center', 
          padding: '60px 40px',
          backgroundColor: 'white'
        }}
      >
        <div style={{ width: '100%', maxWidth: '420px' }}>
          <div style={{ marginBottom: '32px' }}>
            <h2 className="heading-md" style={{ marginBottom: '8px' }}>Log in to your account</h2>
            <p className="text-body" style={{ fontSize: '0.95rem' }}>Enter your details below to continue</p>
          </div>

          {location.state?.message && (
            <div style={{ marginBottom: '20px', padding: '14px 18px', backgroundColor: '#EFF6FF', color: '#1D4ED8', borderRadius: '12px', border: '1px solid #BFDBFE', fontSize: '0.875rem', fontWeight: 500 }}>
              {location.state.message}
            </div>
          )}

          {error && (
            <div style={{ marginBottom: '20px', padding: '14px 18px', backgroundColor: 'var(--error-light)', color: 'var(--error)', borderRadius: '12px', border: '1px solid #FCA5A5', display: 'flex', alignItems: 'center', gap: '10px', fontSize: '0.875rem', fontWeight: 500 }}>
              <AlertCircle size={18} />
              <span>{error}</span>
            </div>
          )}

          {/* Quick Demo Login Buttons */}
          <div style={{ marginBottom: '24px', background: 'var(--bg-page)', padding: '16px', borderRadius: '12px', border: '1px solid var(--border-light)' }}>
            <div style={{ fontSize: '0.75rem', fontWeight: 700, color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: '10px' }}>
              Quick Demo Accounts (1-Click Login)
            </div>
            <div style={{ display: 'flex', gap: '8px' }}>
              <button 
                type="button" 
                onClick={() => handleQuickDemoLogin('rahul@example.com')}
                className="btn btn-sm"
                style={{ flex: 1, background: 'white', border: '1px solid var(--border)', fontSize: '0.8rem', color: 'var(--text-main)', padding: '8px' }}
                disabled={isLoading}
              >
                Rahul (Driver)
              </button>
              <button 
                type="button" 
                onClick={() => handleQuickDemoLogin('pooja@example.com')}
                className="btn btn-sm"
                style={{ flex: 1, background: 'white', border: '1px solid var(--border)', fontSize: '0.8rem', color: 'var(--text-main)', padding: '8px' }}
                disabled={isLoading}
              >
                Pooja (Passenger)
              </button>
            </div>
          </div>

          <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '18px' }}>
            <div className="input-group">
              <label htmlFor="email">Email address</label>
              <div style={{ position: 'relative', display: 'flex', alignItems: 'center' }}>
                <Mail size={18} style={{ position: 'absolute', left: '16px', color: 'var(--text-muted)' }} />
                <input 
                  type="email" 
                  id="email" 
                  required 
                  className="input-field" 
                  style={{ paddingLeft: '44px' }}
                  placeholder="name@example.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                />
              </div>
            </div>

            <div className="input-group">
              <label htmlFor="password">Password</label>
              <div style={{ position: 'relative', display: 'flex', alignItems: 'center' }}>
                <Lock size={18} style={{ position: 'absolute', left: '16px', color: 'var(--text-muted)' }} />
                <input 
                  type="password" 
                  id="password" 
                  required 
                  className="input-field" 
                  style={{ paddingLeft: '44px' }}
                  placeholder="••••••••"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                />
              </div>
            </div>

            <button 
              type="submit" 
              className="btn btn-primary btn-full btn-lg"
              style={{ marginTop: '8px' }}
              disabled={isLoading}
            >
              {isLoading ? <Loader2 size={20} className="spinner" /> : 'Log In'}
            </button>
          </form>

          <p style={{ textAlign: 'center', marginTop: '28px', color: 'var(--text-muted)', fontSize: '0.9rem' }}>
            Don't have an account?{' '}
            <Link to="/register" style={{ color: 'var(--primary)', fontWeight: 700 }}>
              Sign up for free
            </Link>
          </p>
        </div>
      </div>

    </div>
  );
}

export default Login;
