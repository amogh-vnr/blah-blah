import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { GoogleLogin } from '@react-oauth/google';
import { Car, Mail, Lock, User } from 'lucide-react';

function Register() {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  
  const { registerWithEmail, loginWithGoogle } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');
    
    const result = await registerWithEmail(name, email, password);
    if (result.success) {
      navigate('/dashboard');
    } else {
      setError(result.message);
      setIsLoading(false);
    }
  };

  const handleGoogleSuccess = async (credentialResponse) => {
    const result = await loginWithGoogle(credentialResponse);
    if (result.success) {
      navigate('/dashboard');
    } else {
      setError(result.message);
    }
  };

  return (
    <div className="flex flex-col md:flex-row" style={{ minHeight: 'calc(100vh - 73px)', display: 'flex', flexDirection: 'row' }}>
      
      {/* Left side - Image */}
      <div 
        style={{ 
          flex: 1, 
          backgroundColor: 'var(--secondary)', 
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
        <h1 className="title-xl" style={{ marginBottom: '16px' }}>Join the community</h1>
        <p className="text-body" style={{ color: 'white', fontSize: '1.25rem', opacity: 0.9, maxWidth: '400px' }}>
          Create an account to start sharing rides, meeting people, and saving money.
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
            <h2 className="title-lg">Create an account</h2>
          </div>

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
              <label htmlFor="name">Full Name</label>
              <div style={{ position: 'relative', display: 'flex', alignItems: 'center' }}>
                <User size={20} style={{ position: 'absolute', left: '16px', color: 'var(--text-muted)' }} />
                <input 
                  type="text" 
                  id="name" 
                  required 
                  className="input-field" 
                  style={{ paddingLeft: '48px' }}
                  placeholder="John Doe"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                />
              </div>
            </div>

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
                  minLength="6"
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
              className="btn"
              style={{ backgroundColor: 'var(--secondary)', color: 'white', padding: '16px', marginTop: '16px', width: '100%' }}
              disabled={isLoading}
            >
              {isLoading ? 'Creating account...' : 'Create account'}
            </button>
          </form>

          <p style={{ textAlign: 'center', marginTop: '32px', color: 'var(--text-muted)' }}>
            Already have an account? <Link to="/login" style={{ color: 'var(--primary)', fontWeight: 600 }}>Sign in</Link>
          </p>
        </div>
      </div>
    </div>
  );
}

export default Register;
