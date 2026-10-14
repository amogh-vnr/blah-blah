import { useState, useEffect } from 'react';
import { useParams, useNavigate, Link, useLocation } from 'react-router-dom';
import axios from 'axios';
import { 
  MapPin, Calendar, Users, ShieldCheck, Star, Clock, Car, 
  Leaf, ChevronLeft, CheckCircle2, AlertCircle, Phone, Sparkles, X, Loader2
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';

function RideDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const location = useLocation();
  const { user, token } = useAuth();

  const [ride, setRide] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [seatsToBook, setSeatsToBook] = useState(1);
  const [isBooking, setIsBooking] = useState(false);
  const [showConfirmModal, setShowConfirmModal] = useState(false);
  const [bookingSuccess, setBookingSuccess] = useState(false);
  const [showPhone, setShowPhone] = useState(false);

  useEffect(() => {
    const fetchRide = async () => {
      try {
        setLoading(true);
        const res = await axios.get(`http://localhost:5000/api/rides/${id}`);
        setRide(res.data.data);
      } catch (err) {
        console.error('Failed to fetch ride:', err);
        setError('Ride not found or has been removed.');
      } finally {
        setLoading(false);
      }
    };
    fetchRide();
  }, [id]);

  if (loading) {
    return (
      <div className="container py-20 flex flex-col items-center justify-center min-h-[60vh]">
        <Loader2 size={48} className="text-primary spinner mb-4" />
        <p className="text-body font-medium">Loading ride details...</p>
      </div>
    );
  }

  if (error || !ride) {
    return (
      <div className="container py-20 max-w-xl mx-auto text-center">
        <div className="card p-8">
          <AlertCircle size={48} className="text-error mx-auto mb-4" />
          <h2 className="heading-md mb-2">Ride Not Found</h2>
          <p className="text-body mb-6">{error || 'This ride might have already departed or does not exist.'}</p>
          <Link to="/search" className="btn btn-primary">Browse Available Rides</Link>
        </div>
      </div>
    );
  }

  const rideDate = new Date(ride.date);
  const arrivalDate = new Date(rideDate.getTime() + 3 * 60 * 60 * 1000); // approx 3h journey
  const isDriver = user && ride.driver && (user._id === ride.driver._id || user.id === ride.driver._id);
  const isPast = rideDate < new Date();
  const isFull = ride.seats < 1;

  const handleBookClick = () => {
    if (!user) {
      navigate('/login', { state: { from: location, message: 'Please log in to confirm your carpool booking.' } });
      return;
    }
    if (isDriver) {
      alert('You cannot book your own published ride.');
      return;
    }
    setShowConfirmModal(true);
  };

  const confirmBooking = async () => {
    try {
      setIsBooking(true);
      await axios.post(
        `http://localhost:5000/api/bookings/${ride._id}`,
        { seats: seatsToBook },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setBookingSuccess(true);
      setShowConfirmModal(false);
      setTimeout(() => {
        navigate('/dashboard');
      }, 1500);
    } catch (err) {
      alert(err.response?.data?.message || 'Failed to complete booking. Please try again.');
    } finally {
      setIsBooking(false);
    }
  };

  return (
    <div style={{ backgroundColor: 'var(--bg-page)', minHeight: 'calc(100vh - 70px)', paddingBottom: '60px' }}>
      {/* Top Breadcrumb Header */}
      <div style={{ background: 'white', borderBottom: '1px solid var(--border-light)', padding: '14px 0' }}>
        <div className="container" style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <button 
            onClick={() => navigate(-1)} 
            className="btn btn-ghost" 
            style={{ padding: '6px 12px', fontSize: '0.9rem', gap: '4px' }}
          >
            <ChevronLeft size={20} /> Back to rides
          </button>
          <div style={{ fontSize: '0.875rem', color: 'var(--text-muted)' }}>
            Trip ID: <span style={{ fontFamily: 'monospace' }}>{ride._id.slice(-6)}</span>
          </div>
        </div>
      </div>

      {bookingSuccess && (
        <div className="container mt-4">
          <div style={{ backgroundColor: 'var(--success-light)', border: '1px solid var(--success)', borderRadius: '12px', padding: '16px 24px', display: 'flex', alignItems: 'center', gap: '12px', color: '#065F46' }}>
            <CheckCircle2 size={24} color="var(--success)" />
            <div>
              <div style={{ fontWeight: 700, fontSize: '1rem' }}>Booking Confirmed!</div>
              <div style={{ fontSize: '0.875rem' }}>Your seat has been reserved. Redirecting you to your dashboard...</div>
            </div>
          </div>
        </div>
      )}

      <div className="container mt-6">
        <div style={{ display: 'grid', gridTemplateColumns: 'minmax(0, 1.8fr) minmax(320px, 1.2fr)', gap: '32px', alignItems: 'start' }}>
          
          {/* Left Column: Route & Driver Information */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
            
            {/* Trip Date Title */}
            <div>
              <h1 className="heading-lg" style={{ color: 'var(--text-main)', marginBottom: '4px' }}>
                {rideDate.toLocaleDateString('en-IN', { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' })}
              </h1>
              <p style={{ color: 'var(--text-muted)', fontSize: '0.95rem' }}>
                Shared carpool journey from <strong style={{ color: 'var(--text-main)' }}>{ride.from}</strong> to <strong style={{ color: 'var(--text-main)' }}>{ride.to}</strong>
              </p>
            </div>

            {/* Detailed Route Card */}
            <div className="card" style={{ padding: '32px' }}>
              <h3 className="heading-sm mb-6" style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <Clock size={20} color="var(--primary)" /> Route & Timing
              </h3>

              <div style={{ display: 'flex', flexDirection: 'column', gap: '28px', position: 'relative' }}>
                {/* Connecting timeline bar */}
                <div style={{ position: 'absolute', left: '7px', top: '16px', bottom: '16px', width: '3px', background: 'var(--primary-light)' }}></div>

                {/* Departure point */}
                <div style={{ display: 'flex', alignItems: 'flex-start', gap: '20px', position: 'relative', zIndex: 1 }}>
                  <div style={{ width: '18px', height: '18px', borderRadius: '50%', background: 'white', border: '4px solid var(--primary)', flexShrink: 0, marginTop: '3px' }}></div>
                  <div style={{ flex: 1 }}>
                    <div style={{ display: 'flex', alignItems: 'baseline', gap: '12px' }}>
                      <span style={{ fontSize: '1.25rem', fontWeight: 800, color: 'var(--text-main)' }}>
                        {rideDate.toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit', hour12: false })}
                      </span>
                      <span style={{ fontSize: '1.15rem', fontWeight: 700, color: 'var(--text-main)' }}>
                        {ride.from}
                      </span>
                    </div>
                    <div style={{ fontSize: '0.85rem', color: 'var(--text-muted)', marginTop: '2px' }}>
                      Main boarding landmark / Highway junction
                    </div>
                  </div>
                </div>

                {/* Mid-journey duration badge */}
                <div style={{ paddingLeft: '38px', color: 'var(--text-muted)', fontSize: '0.85rem', display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <span style={{ background: 'var(--bg-page)', padding: '4px 10px', borderRadius: '12px', fontWeight: 600 }}>
                    ~3h 00m journey duration
                  </span>
                  <span>&bull; Express highway route</span>
                </div>

                {/* Arrival point */}
                <div style={{ display: 'flex', alignItems: 'flex-start', gap: '20px', position: 'relative', zIndex: 1 }}>
                  <div style={{ width: '18px', height: '18px', borderRadius: '50%', background: 'white', border: '4px solid var(--dark-navy)', flexShrink: 0, marginTop: '3px' }}></div>
                  <div style={{ flex: 1 }}>
                    <div style={{ display: 'flex', alignItems: 'baseline', gap: '12px' }}>
                      <span style={{ fontSize: '1.25rem', fontWeight: 800, color: 'var(--text-main)' }}>
                        {arrivalDate.toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit', hour12: false })}
                      </span>
                      <span style={{ fontSize: '1.15rem', fontWeight: 700, color: 'var(--text-main)' }}>
                        {ride.to}
                      </span>
                    </div>
                    <div style={{ fontSize: '0.85rem', color: 'var(--text-muted)', marginTop: '2px' }}>
                      Central drop-off point / Bypass interchange
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Driver Profile Card */}
            <div className="card" style={{ padding: '32px' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '20px' }}>
                <div style={{ display: 'flex', gap: '16px', alignItems: 'center' }}>
                  <img 
                    src={ride.driver?.picture || `https://ui-avatars.com/api/?name=${encodeURIComponent(ride.driver?.name || 'Driver')}&background=0056D2&color=fff&bold=true`}
                    alt={ride.driver?.name}
                    style={{ width: '64px', height: '64px', borderRadius: '50%', objectFit: 'cover', border: '2px solid var(--primary-light)' }}
                  />
                  <div>
                    <h3 className="heading-sm" style={{ marginBottom: '2px' }}>{ride.driver?.name || 'Verified Driver'}</h3>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                      <div style={{ display: 'flex', alignItems: 'center', color: '#F59E0B', fontWeight: 700, fontSize: '0.9rem' }}>
                        <Star size={16} fill="#F59E0B" />
                        <span style={{ marginLeft: '4px' }}>4.9</span>
                      </div>
                      <span style={{ color: 'var(--text-muted)', fontSize: '0.85rem' }}>&bull; 38 rides completed</span>
                    </div>
                  </div>
                </div>

                <span className="badge badge-success" style={{ gap: '6px', padding: '6px 12px' }}>
                  <ShieldCheck size={16} /> ID Verified
                </span>
              </div>

              {ride.driver?.bio && (
                <div style={{ background: 'var(--bg-page)', padding: '16px', borderRadius: '12px', fontSize: '0.9rem', color: 'var(--text-secondary)', marginBottom: '20px', lineHeight: 1.5 }}>
                  "{ride.driver.bio}"
                </div>
              )}

              {/* Vehicle info */}
              <div style={{ borderTop: '1px solid var(--border-light)', paddingTop: '16px', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                  <Car size={22} color="var(--primary)" />
                  <div>
                    <div style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>Vehicle Model</div>
                    <div style={{ fontWeight: 600, color: 'var(--text-main)', fontSize: '0.95rem' }}>
                      {ride.vehicle || 'Maruti Suzuki Ertiga'} {ride.vehicleColor ? `(${ride.vehicleColor})` : '(White)'}
                    </div>
                  </div>
                </div>

                <button 
                  onClick={() => setShowPhone(!showPhone)}
                  className="btn btn-outline btn-sm"
                  style={{ gap: '6px' }}
                >
                  <Phone size={16} />
                  {showPhone ? (ride.driver?.phone || '+91 98765 43210') : 'Contact Driver'}
                </button>
              </div>
            </div>

            {/* Ride Features & Amenities */}
            <div className="card" style={{ padding: '24px 32px' }}>
              <h4 className="heading-sm mb-4">Carpool Features & Amenities</h4>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '16px' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                  <Users size={18} color="var(--primary)" />
                  <span style={{ fontSize: '0.9rem', color: 'var(--text-main)', fontWeight: 500 }}>Max 2 passengers in back</span>
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                  <Sparkles size={18} color="var(--primary)" />
                  <span style={{ fontSize: '0.9rem', color: 'var(--text-main)', fontWeight: 500 }}>Instant Booking</span>
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                  <ShieldCheck size={18} color="var(--success)" />
                  <span style={{ fontSize: '0.9rem', color: 'var(--text-main)', fontWeight: 500 }}>Government ID Verified</span>
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                  <Car size={18} color="var(--primary)" />
                  <span style={{ fontSize: '0.9rem', color: 'var(--text-main)', fontWeight: 500 }}>Air conditioning enabled</span>
                </div>
              </div>
            </div>

            {/* Eco Impact Banner */}
            <div style={{ background: 'linear-gradient(135deg, #E6F4EA 0%, #D1E7DD 100%)', borderRadius: '16px', padding: '20px 24px', display: 'flex', alignItems: 'center', gap: '16px', border: '1px solid #BADBCC' }}>
              <div style={{ width: '48px', height: '48px', borderRadius: '50%', background: 'white', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                <Leaf size={24} color="#0F5132" />
              </div>
              <div>
                <div style={{ fontWeight: 700, color: '#0F5132', fontSize: '1rem' }}>~21.8 kg CO₂ avoided on this journey</div>
                <p style={{ fontSize: '0.85rem', color: '#146C43', margin: 0 }}>
                  By sharing this car with others, you are directly reducing highway congestion and carbon footprint.
                </p>
              </div>
            </div>

          </div>

          {/* Right Column: Sticky Booking Card */}
          <div style={{ position: 'sticky', top: '90px' }}>
            <div className="card" style={{ padding: '32px', boxShadow: 'var(--shadow-md)' }}>
              
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline', marginBottom: '16px', borderBottom: '1px solid var(--border-light)', paddingBottom: '16px' }}>
                <div>
                  <div style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>Price per seat</div>
                  <div className="heading-lg" style={{ color: 'var(--primary)', lineHeight: 1 }}>₹{ride.price}</div>
                </div>
                <div>
                  <span className={`badge ${ride.seats > 0 ? 'badge-info' : 'badge-cancelled'}`}>
                    {ride.seats > 0 ? `${ride.seats} seat${ride.seats > 1 ? 's' : ''} left` : 'Fully Booked'}
                  </span>
                </div>
              </div>

              {/* Seat Selector */}
              {ride.seats > 0 && !isDriver && !isPast && (
                <div className="mb-6">
                  <label style={{ display: 'block', fontSize: '0.875rem', fontWeight: 600, color: 'var(--text-main)', marginBottom: '8px' }}>
                    Number of passengers
                  </label>
                  <div style={{ display: 'flex', gap: '8px' }}>
                    {[...Array(Math.min(ride.seats, 5))].map((_, index) => {
                      const count = index + 1;
                      return (
                        <button
                          key={count}
                          type="button"
                          onClick={() => setSeatsToBook(count)}
                          style={{
                            flex: 1,
                            padding: '10px 0',
                            borderRadius: '8px',
                            border: seatsToBook === count ? '2px solid var(--primary)' : '1px solid var(--border)',
                            background: seatsToBook === count ? 'var(--primary-lightest)' : 'white',
                            color: seatsToBook === count ? 'var(--primary)' : 'var(--text-main)',
                            fontWeight: 700,
                            fontSize: '1rem',
                            cursor: 'pointer'
                          }}
                        >
                          {count}
                        </button>
                      );
                    })}
                  </div>
                </div>
              )}

              {/* Price Breakdown */}
              <div style={{ background: 'var(--bg-page)', borderRadius: '12px', padding: '16px', marginBottom: '24px' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.9rem', color: 'var(--text-secondary)', marginBottom: '8px' }}>
                  <span>₹{ride.price} &times; {seatsToBook} passenger{seatsToBook > 1 ? 's' : ''}</span>
                  <span>₹{ride.price * seatsToBook}</span>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.9rem', color: 'var(--text-secondary)', marginBottom: '8px' }}>
                  <span>Booking platform fee</span>
                  <span style={{ color: 'var(--success)', fontWeight: 600 }}>₹0 (FREE)</span>
                </div>
                <div style={{ borderTop: '1px solid var(--border)', paddingTop: '10px', display: 'flex', justifyContent: 'space-between', fontWeight: 800, fontSize: '1.1rem', color: 'var(--text-main)' }}>
                  <span>Total Amount</span>
                  <span style={{ color: 'var(--primary)' }}>₹{ride.price * seatsToBook}</span>
                </div>
              </div>

              {/* CTA Button */}
              {isDriver ? (
                <div style={{ padding: '12px', background: 'var(--bg-page)', borderRadius: '8px', textAlign: 'center', color: 'var(--text-muted)', fontSize: '0.9rem' }}>
                  You are the driver of this ride. Manage it from your Dashboard.
                </div>
              ) : isPast ? (
                <button className="btn btn-full" disabled style={{ background: 'var(--border)', color: 'var(--text-muted)' }}>
                  Ride Has Departed
                </button>
              ) : isFull ? (
                <button className="btn btn-full" disabled style={{ background: 'var(--border)', color: 'var(--text-muted)' }}>
                  Ride is Full
                </button>
              ) : (
                <button 
                  onClick={handleBookClick}
                  className="btn btn-primary btn-full btn-lg"
                  style={{ gap: '8px' }}
                >
                  Book Seat{seatsToBook > 1 ? 's' : ''}
                </button>
              )}

              {/* Safety notice */}
              <div style={{ marginTop: '16px', textAlign: 'center', fontSize: '0.75rem', color: 'var(--text-muted)', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '6px' }}>
                <ShieldCheck size={14} color="var(--primary)" /> Cashless & secure booking with instant confirmation
              </div>
            </div>
          </div>

        </div>
      </div>

      {/* Confirmation Modal */}
      {showConfirmModal && (
        <div className="modal-overlay">
          <div className="modal-content animate-slide-up">
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
              <h3 className="heading-md">Confirm Your Booking</h3>
              <button onClick={() => setShowConfirmModal(false)} className="btn-icon">
                <X size={20} />
              </button>
            </div>

            <div style={{ background: 'var(--bg-page)', padding: '16px', borderRadius: '12px', marginBottom: '20px' }}>
              <div style={{ fontWeight: 700, fontSize: '1rem', color: 'var(--text-main)', marginBottom: '4px' }}>
                {ride.from} &rarr; {ride.to}
              </div>
              <div style={{ fontSize: '0.85rem', color: 'var(--text-muted)', marginBottom: '12px' }}>
                {rideDate.toLocaleDateString('en-IN', { weekday: 'short', day: 'numeric', month: 'short' })} at {rideDate.toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit' })}
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.9rem', color: 'var(--text-main)' }}>
                <span>Driver: <strong>{ride.driver?.name}</strong></span>
                <span>Seats: <strong>{seatsToBook}</strong></span>
              </div>
            </div>

            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px', padding: '12px 0', borderTop: '1px solid var(--border-light)', borderBottom: '1px solid var(--border-light)' }}>
              <span style={{ fontSize: '1rem', fontWeight: 600 }}>Total Payable:</span>
              <span style={{ fontSize: '1.5rem', fontWeight: 800, color: 'var(--primary)' }}>₹{ride.price * seatsToBook}</span>
            </div>

            <div style={{ display: 'flex', gap: '12px' }}>
              <button 
                type="button" 
                onClick={() => setShowConfirmModal(false)} 
                className="btn btn-outline"
                style={{ flex: 1 }}
              >
                Cancel
              </button>
              <button 
                type="button" 
                onClick={confirmBooking} 
                className="btn btn-primary"
                style={{ flex: 1 }}
                disabled={isBooking}
              >
                {isBooking ? <Loader2 size={18} className="spinner" /> : 'Confirm & Reserve'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default RideDetail;
