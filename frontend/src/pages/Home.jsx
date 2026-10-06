import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { MapPin, Calendar, Users, Search } from 'lucide-react';

function Home() {
  const [from, setFrom] = useState('');
  const [to, setTo] = useState('');
  const [date, setDate] = useState('');
  const [seats, setSeats] = useState(1);
  const navigate = useNavigate();

  const handleSearch = (e) => {
    e.preventDefault();
    const params = new URLSearchParams();
    if (from) params.append('from', from);
    if (to) params.append('to', to);
    if (date) params.append('date', date);
    if (seats) params.append('seats', seats);
    
    navigate(`/search?${params.toString()}`);
  };

  return (
    <div>
      {/* Hero Section */}
      <section 
        className="py-20 flex flex-col items-center justify-center animate-fade-in"
        style={{
          minHeight: '80vh',
          background: 'linear-gradient(135deg, #e0f7fa 0%, #e8eaf6 100%)',
          position: 'relative',
          overflow: 'hidden'
        }}
      >
        {/* Decorative elements */}
        <div style={{ position: 'absolute', top: '-10%', right: '-5%', width: '400px', height: '400px', borderRadius: '50%', background: 'rgba(0,175,245,0.1)', filter: 'blur(60px)' }}></div>
        <div style={{ position: 'absolute', bottom: '-10%', left: '-5%', width: '300px', height: '300px', borderRadius: '50%', background: 'rgba(255,94,91,0.1)', filter: 'blur(50px)' }}></div>
        
        <div className="container text-center" style={{ zIndex: 1 }}>
          <h1 className="title-xl mb-12">Your pick of rides at low prices</h1>
          
          <form onSubmit={handleSearch} className="search-bar-glass mx-auto" style={{ maxWidth: '900px' }}>
            <div className="flex-1 flex items-center gap-2 px-4" style={{ borderRight: '1px solid var(--border)' }}>
              <MapPin size={24} className="text-muted" />
              <input 
                type="text" 
                placeholder="Leaving from" 
                className="input-field" 
                style={{ border: 'none', background: 'transparent', padding: '8px 0' }}
                value={from}
                onChange={(e) => setFrom(e.target.value)}
              />
            </div>
            
            <div className="flex-1 flex items-center gap-2 px-4" style={{ borderRight: '1px solid var(--border)' }}>
              <MapPin size={24} className="text-muted" />
              <input 
                type="text" 
                placeholder="Going to" 
                className="input-field" 
                style={{ border: 'none', background: 'transparent', padding: '8px 0' }}
                value={to}
                onChange={(e) => setTo(e.target.value)}
              />
            </div>
            
            <div className="flex-1 flex items-center gap-2 px-4" style={{ borderRight: '1px solid var(--border)' }}>
              <Calendar size={24} className="text-muted" />
              <input 
                type="date" 
                className="input-field" 
                style={{ border: 'none', background: 'transparent', padding: '8px 0' }}
                value={date}
                onChange={(e) => setDate(e.target.value)}
              />
            </div>
            
            <div className="flex-1 flex items-center gap-2 px-4">
              <Users size={24} className="text-muted" />
              <input 
                type="number" 
                min="1"
                className="input-field" 
                style={{ border: 'none', background: 'transparent', padding: '8px 0', width: '60px' }}
                value={seats}
                onChange={(e) => setSeats(e.target.value)}
              />
            </div>
            
            <button type="submit" className="btn btn-primary" style={{ padding: '16px 32px', fontSize: '1.125rem' }}>
              <Search size={24} />
              Search
            </button>
          </form>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 container animate-fade-in" style={{ animationDelay: '0.2s' }}>
        <div className="grid" style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '32px' }}>
          <div className="card text-center">
            <div className="mb-6 mx-auto flex items-center justify-center" style={{ width: '80px', height: '80px', borderRadius: '50%', backgroundColor: 'rgba(0,175,245,0.1)' }}>
              <Search size={40} className="text-primary" />
            </div>
            <h3 className="title-md mb-4">Your choice of rides</h3>
            <p className="text-body">Tell us where you want to go and we'll find you the perfect ride.</p>
          </div>
          <div className="card text-center">
            <div className="mb-6 mx-auto flex items-center justify-center" style={{ width: '80px', height: '80px', borderRadius: '50%', backgroundColor: 'rgba(0,175,245,0.1)' }}>
              <Users size={40} className="text-primary" />
            </div>
            <h3 className="title-md mb-4">Trust who you travel with</h3>
            <p className="text-body">We take the time to get to know each of our members and bus partners. We check reviews, profiles and IDs.</p>
          </div>
          <div className="card text-center">
            <div className="mb-6 mx-auto flex items-center justify-center" style={{ width: '80px', height: '80px', borderRadius: '50%', backgroundColor: 'rgba(0,175,245,0.1)' }}>
              <MapPin size={40} className="text-primary" />
            </div>
            <h3 className="title-md mb-4">Scroll, click, tap and go!</h3>
            <p className="text-body">Booking a ride has never been easier! Thanks to our simple app powered by great technology, you can book a ride in minutes.</p>
          </div>
        </div>
      </section>
    </div>
  );
}

export default Home;
