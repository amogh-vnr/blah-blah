import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { 
  MapPin, Calendar, Users, Search, ShieldCheck, DollarSign, 
  Zap, ChevronRight, ChevronDown, Car, ArrowRight, Star
} from 'lucide-react';
import Footer from '../components/Footer';

function Home() {
  const [from, setFrom] = useState('');
  const [to, setTo] = useState('');
  const [date, setDate] = useState(() => {
    const today = new Date();
    return today.toISOString().split('T')[0];
  });
  const [seats, setSeats] = useState(1);
  const [openFaq, setOpenFaq] = useState(null);

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

  const handleQuickRoute = (routeFrom, routeTo) => {
    const params = new URLSearchParams();
    params.append('from', routeFrom);
    params.append('to', routeTo);
    params.append('date', date);
    params.append('seats', '1');
    navigate(`/search?${params.toString()}`);
  };

  const popularRoutes = [
    { from: 'Mumbai', to: 'Pune', price: '350', time: '3h 00m', tag: 'High demand' },
    { from: 'New Delhi', to: 'Chandigarh', price: '480', time: '4h 15m', tag: 'Fast expressway' },
    { from: 'Bengaluru', to: 'Mysuru', price: '300', time: '2h 45m', tag: 'Daily commuters' },
    { from: 'Chennai', to: 'Pondicherry', price: '320', time: '3h 30m', tag: 'Scenic coast' },
    { from: 'Hyderabad', to: 'Vijayawada', price: '550', time: '4h 30m', tag: 'Weekend rush' },
    { from: 'Pune', to: 'Goa', price: '850', time: '8h 00m', tag: 'Holiday getaway' },
  ];

  const faqs = [
    {
      q: 'How do I book a carpool ride on BlahBlahCar?',
      a: 'Search for your departure and arrival cities along with your date of travel. Choose the ride that suits your schedule and budget. Click "Book Seat" to reserve your spot instantly. You will receive booking confirmation and the driver contact details immediately.'
    },
    {
      q: 'How do I pay for my carpool ride?',
      a: 'Carpooling on BlahBlahCar is transparent and simple. In India, most drivers accept direct UPI or cash at the start or completion of the journey. BlahBlahCar does not charge hidden platform surcharges.'
    },
    {
      q: 'How do I publish a ride as a car owner?',
      a: 'Click "Offer a ride" in the top menu, enter your departure city, destination, travel time, available seats, and suggested price per seat. Once published, interested passengers can book seats and share your petrol costs.'
    },
    {
      q: 'What safety measures and verifications are in place?',
      a: 'Every member on BlahBlahCar has a profile with verified phone number, email address, and optional government ID verification. Passengers and drivers review each other after every trip, ensuring high trust and accountability.'
    }
  ];

  return (
    <div>
      {/* Hero Section */}
      <section 
        style={{
          position: 'relative',
          minHeight: '540px',
          backgroundColor: '#054752',
          backgroundImage: 'linear-gradient(rgba(5, 71, 82, 0.75), rgba(5, 71, 82, 0.85)), url("/hero-travelers.jpg")',
          backgroundSize: 'cover',
          backgroundPosition: 'center 40%',
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'center',
          alignItems: 'center',
          padding: '60px 24px',
          color: 'white'
        }}
      >
        <div className="container" style={{ textAlign: 'center', maxWidth: '1000px', zIndex: 2 }}>
          <h1 className="heading-xl" style={{ color: 'white', marginBottom: '24px', textShadow: '0 2px 10px rgba(0,0,0,0.3)' }}>
            Your pick of rides at low prices
          </h1>
          <p style={{ fontSize: '1.2rem', color: 'rgba(255,255,255,0.9)', marginBottom: '36px', maxWidth: '650px', margin: '0 auto 36px' }}>
            Carpool with verified drivers, travel conveniently between cities, and cut down your travel expenses.
          </p>

          {/* BlaBlaCar Pill Search Bar */}
          <form onSubmit={handleSearch} className="search-bar mx-auto" style={{ maxWidth: '960px' }}>
            
            {/* Leaving from */}
            <div className="search-bar-field">
              <label>Leaving from</label>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <div style={{ width: '10px', height: '10px', borderRadius: '50%', border: '2px solid var(--primary)', flexShrink: 0 }}></div>
                <input 
                  type="text" 
                  placeholder="e.g. Mumbai" 
                  value={from}
                  onChange={(e) => setFrom(e.target.value)}
                  required
                />
              </div>
            </div>

            {/* Going to */}
            <div className="search-bar-field">
              <label>Going to</label>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <MapPin size={16} color="var(--primary)" style={{ flexShrink: 0 }} />
                <input 
                  type="text" 
                  placeholder="e.g. Pune" 
                  value={to}
                  onChange={(e) => setTo(e.target.value)}
                  required
                />
              </div>
            </div>

            {/* Date */}
            <div className="search-bar-field" style={{ flex: '0 1 180px' }}>
              <label>Date</label>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <Calendar size={16} color="var(--text-muted)" style={{ flexShrink: 0 }} />
                <input 
                  type="date" 
                  value={date}
                  onChange={(e) => setDate(e.target.value)}
                />
              </div>
            </div>

            {/* Passengers */}
            <div className="search-bar-field" style={{ flex: '0 1 140px' }}>
              <label>Passengers</label>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <Users size={16} color="var(--text-muted)" style={{ flexShrink: 0 }} />
                <input 
                  type="number" 
                  min="1" 
                  max="8" 
                  value={seats}
                  onChange={(e) => setSeats(e.target.value)}
                />
              </div>
            </div>

            {/* Search Submit */}
            <button type="submit" className="btn btn-primary" style={{ gap: '8px' }}>
              <Search size={20} />
              <span>Search</span>
            </button>
          </form>

          {/* Quick Route Shortcuts */}
          <div style={{ display: 'flex', justifyContent: 'center', gap: '10px', marginTop: '20px', flexWrap: 'wrap' }}>
            <span style={{ fontSize: '0.85rem', color: 'rgba(255,255,255,0.8)', alignSelf: 'center' }}>Popular routes:</span>
            {popularRoutes.slice(0, 3).map((r, i) => (
              <button
                key={i}
                type="button"
                onClick={() => handleQuickRoute(r.from, r.to)}
                style={{
                  background: 'rgba(255,255,255,0.18)',
                  backdropFilter: 'blur(10px)',
                  border: '1px solid rgba(255,255,255,0.3)',
                  color: 'white',
                  borderRadius: '20px',
                  padding: '6px 14px',
                  fontSize: '0.825rem',
                  fontWeight: 600,
                  cursor: 'pointer',
                  transition: 'all 0.2s'
                }}
              >
                {r.from} &rarr; {r.to} &bull; ₹{r.price}
              </button>
            ))}
          </div>

        </div>
      </section>

      {/* 3 Core Value Propositions */}
      <section className="py-16 container">
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '32px' }}>
          
          <div className="card" style={{ padding: '36px 28px', border: '1px solid var(--border-light)' }}>
            <div style={{ width: '56px', height: '56px', borderRadius: '50%', backgroundColor: 'var(--primary-light)', display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: '20px' }}>
              <DollarSign size={28} color="var(--primary)" />
            </div>
            <h3 className="heading-sm mb-2">Low-cost carpooling</h3>
            <p className="text-body">
              Travel comfortably without breaking the bank. Share petrol costs with car owners driving your way and save up to 70% compared to taxis.
            </p>
          </div>

          <div className="card" style={{ padding: '36px 28px', border: '1px solid var(--border-light)' }}>
            <div style={{ width: '56px', height: '56px', borderRadius: '50%', backgroundColor: '#E8F5E9', display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: '20px' }}>
              <ShieldCheck size={28} color="#2E7D32" />
            </div>
            <h3 className="heading-sm mb-2">Trust who you travel with</h3>
            <p className="text-body">
              Every driver and passenger is verified. Check community ratings, government ID badges, vehicle photos, and read member reviews before booking.
            </p>
          </div>

          <div className="card" style={{ padding: '36px 28px', border: '1px solid var(--border-light)' }}>
            <div style={{ width: '56px', height: '56px', borderRadius: '50%', backgroundColor: '#FFF3E0', display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: '20px' }}>
              <Zap size={28} color="#EF6C00" />
            </div>
            <h3 className="heading-sm mb-2">Scroll, click, tap and go!</h3>
            <p className="text-body">
              Booking your seat takes under 2 minutes. Instant seat confirmation, clean route timelines, and direct messaging with the car owner.
            </p>
          </div>

        </div>
      </section>

      {/* Popular Routes Section */}
      <section className="py-16" style={{ backgroundColor: 'white' }}>
        <div className="container">
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', marginBottom: '32px' }}>
            <div>
              <h2 className="heading-lg" style={{ color: 'var(--text-main)', marginBottom: '8px' }}>
                Where do you want to go?
              </h2>
              <p className="text-body">
                Explore our most popular intercity routes across India with daily verified departures.
              </p>
            </div>
            <Link to="/search" style={{ color: 'var(--primary)', fontWeight: 700, display: 'flex', alignItems: 'center', gap: '4px' }}>
              See all routes <ChevronRight size={18} />
            </Link>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '20px' }}>
            {popularRoutes.map((route, i) => (
              <div 
                key={i}
                onClick={() => handleQuickRoute(route.from, route.to)}
                className="card card-hover"
                style={{ 
                  cursor: 'pointer', 
                  padding: '24px', 
                  border: '1px solid var(--border-light)',
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center'
                }}
              >
                <div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '6px' }}>
                    <span style={{ fontWeight: 700, fontSize: '1.1rem', color: 'var(--text-main)' }}>
                      {route.from} &rarr; {route.to}
                    </span>
                  </div>
                  <div style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>
                    {route.time} &bull; <span style={{ color: '#059669', fontWeight: 600 }}>{route.tag}</span>
                  </div>
                </div>

                <div style={{ textAlign: 'right' }}>
                  <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>from</div>
                  <div style={{ fontSize: '1.35rem', fontWeight: 800, color: 'var(--primary)' }}>
                    ₹{route.price}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Driver CTA Section */}
      <section className="py-20 container">
        <div 
          className="section-dark"
          style={{
            padding: '50px',
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))',
            gap: '40px',
            alignItems: 'center'
          }}
        >
          <div>
            <span className="badge badge-info" style={{ marginBottom: '16px', background: 'rgba(255,255,255,0.2)', color: 'white' }}>
              For Car Owners
            </span>
            <h2 className="heading-lg" style={{ color: 'white', marginBottom: '16px' }}>
              Drive and save on travel costs
            </h2>
            <p className="text-body" style={{ color: 'rgba(255,255,255,0.85)', marginBottom: '28px', fontSize: '1.05rem', lineHeight: 1.6 }}>
              Driving somewhere soon? Don't travel with empty seats. Share your journey with great passengers and cut your fuel and toll expenses in half.
            </p>
            <Link to="/offer" className="btn btn-primary" style={{ padding: '16px 36px', fontSize: '1.1rem', gap: '8px' }}>
              <Car size={20} /> Offer a ride
            </Link>
          </div>

          <div style={{ display: 'flex', justifyContent: 'center' }}>
            <img 
              src="/stats-driver.jpg" 
              alt="Happy carpool driver" 
              style={{ borderRadius: '20px', maxHeight: '340px', width: '100%', objectFit: 'cover', boxShadow: '0 12px 30px rgba(0,0,0,0.3)' }}
            />
          </div>
        </div>
      </section>

      {/* Help Centre FAQs Accordion */}
      <section id="faq" className="py-16 container">
        <div style={{ maxWidth: '850px', margin: '0 auto' }}>
          <div style={{ textAlign: 'center', marginBottom: '40px' }}>
            <h2 className="heading-lg" style={{ marginBottom: '8px' }}>BlahBlahCar Help Centre FAQ</h2>
            <p className="text-body">Frequently asked questions about carpooling, payments, and driver verifications.</p>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
            {faqs.map((faq, index) => {
              const isOpen = openFaq === index;
              return (
                <div 
                  key={index} 
                  className="card"
                  style={{ padding: '20px 24px', cursor: 'pointer', border: '1px solid var(--border-light)' }}
                  onClick={() => setOpenFaq(isOpen ? null : index)}
                >
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <h4 style={{ fontSize: '1.05rem', fontWeight: 700, color: 'var(--text-main)', margin: 0 }}>
                      {faq.q}
                    </h4>
                    <ChevronDown 
                      size={20} 
                      color="var(--primary)" 
                      style={{ transform: isOpen ? 'rotate(180deg)' : 'rotate(0deg)', transition: 'transform 0.2s' }} 
                    />
                  </div>

                  {isOpen && (
                    <div style={{ marginTop: '14px', paddingTop: '14px', borderTop: '1px solid var(--border-light)', color: 'var(--text-secondary)', fontSize: '0.95rem', lineHeight: 1.6 }}>
                      {faq.a}
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Real BlaBlaCar Footer */}
      <Footer />
    </div>
  );
}

export default Home;
