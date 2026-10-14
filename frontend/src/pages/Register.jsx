import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { Car, Mail, Lock, User, AlertCircle, ShieldCheck, CheckCircle2, Loader2 } from 'lucide-react';

function Register() {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  
  const { registerWithEmail } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');
    
    if (password.length < 6) {
      setError('Password must be at least 6 characters long.');
      setIsLoading(false);
      return;
    }

    const result = await registerWithEmail(name, email, password);
    if (result.success) {
      navigate('/dashboard');
    } else {
      setError(result.message || 'Registration failed. An account with this email might already exist.');
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
        <h1 className="heading-xl" style={{ color: 'white', marginBottom: '16px' }}>Join BlahBlahCar</h1>
        <p style={{ color: 'rgba(255,255,255,0.85)', fontSize: '1.15rem', maxWidth: '420px', lineHeight: 1.6, marginBottom: '32px' }}>
          Connect with millions of passengers and drivers sharing carpool rides across India at affordable prices.
        </p>

        <div style={{ display: 'flex', flexDirection: 'column', gap: '14px', textAlign: 'left', background: 'rgba(255,255,255,0.1)', padding: '24px', borderRadius: '16px', maxWidth: '380px', width: '100%' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px', fontSize: '0.9rem' }}>
            <CheckCircle2 size={18} color="#34D399" /> Free to sign up and publish rides
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px', fontSize: '0.9rem' }}>
            <ShieldCheck size={18} color="#34D399" /> ID and phone number verification
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px', fontSize: '0.9rem' }}>
            <CheckCircle2 size={18} color="#34D399" /> Save up to 70% on highway travels
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
            <h2 className="heading-md" style={{ marginBottom: '8px' }}>Create an account</h2>
            <p className="text-body" style={{ fontSize: '0.95rem' }}>It takes less than a minute to get started</p>
          </div>

          {error && (
            <div style={{ marginBottom: '20px', padding: '14px 18px', backgroundColor: 'var(--error-light)', color: 'var(--error)', borderRadius: '12px', border: '1px solid #FCA5A5', display: 'flex', alignItems: 'center', gap: '10px', fontSize: '0.875rem', fontWeight: 500 }}>
              <AlertCircle size={18} />
              <span>{error}</span>
            </div>
          )}

          <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '18px' }}>
            <div className="input-group">
              <label htmlFor="name">Full Name</label>
              <div style={{ position: 'relative', display: 'flex', alignItems: 'center' }}>
                <User size={18} style={{ position: 'absolute', left: '16px', color: 'var(--text-muted)' }} />
                <input 
                  type="text" 
                  id="name" 
                  required 
                  className="input-field" 
                  style={{ paddingLeft: '44px' }}
                  placeholder="e.g. Rahul Sharma"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                />
              </div>
            </div>

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
              <label htmlFor="password">Create Password</label>
              <div style={{ position: 'relative', display: 'flex', alignItems: 'center' }}>
                <Lock size={18} style={{ position: 'absolute', left: '16px', color: 'var(--text-muted)' }} />
                <input 
                  type="password" 
                  id="password" 
                  required 
                  minLength="6"
                  className="input-field" 
                  style={{ paddingLeft: '44px' }}
                  placeholder="At least 6 characters"
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
              {isLoading ? <Loader2 size={20} className="spinner" /> : 'Create Account'}
            </button>
          </form>

          <p style={{ textAlign: 'center', marginTop: '28px', color: 'var(--text-muted)', fontSize: '0.9rem' }}>
            Already have an account?{' '}
            <Link to="/login" style={{ color: 'var(--primary)', fontWeight: 700 }}>
              Sign in
            </Link>
          </p>
        </div>
      </div>

    </div>
  );
}

export default Register;
