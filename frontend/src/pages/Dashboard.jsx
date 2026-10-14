import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { useAuth } from '../context/AuthContext';
import { 
  MapPin, Calendar, Users, Loader2, Car, Navigation, 
  ShieldCheck, Clock, Trash2, XCircle, CheckCircle2, ChevronRight, Phone, Leaf
} from 'lucide-react';
import Footer from '../components/Footer';

function Dashboard() {
  const { token, user } = useAuth();
  const navigate = useNavigate();
  const [bookings, setBookings] = useState([]);
  const [publishedRides, setPublishedRides] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('bookings');
  const [actionLoading, setActionLoading] = useState(false);
  const [feedbackMsg, setFeedbackMsg] = useState({ type: '', text: '' });

  const fetchData = async () => {
    try {
      setLoading(true);
      const [bookingsRes, ridesRes] = await Promise.all([
        axios.get('http://localhost:5000/api/bookings', { headers: { Authorization: `Bearer ${token}` } }),
        axios.get('http://localhost:5000/api/rides/mine', { headers: { Authorization: `Bearer ${token}` } })
      ]);
      setBookings(bookingsRes.data.data || []);
      setPublishedRides(ridesRes.data.data || []);
    } catch (error) {
      console.error('Failed to fetch dashboard data', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (token) fetchData();
  }, [token]);

  const handleCancelBooking = async (bookingId) => {
    if (!window.confirm('Are you sure you want to cancel this booking? Your seat will be returned to the ride.')) {
      return;
    }
    try {
      setActionLoading(true);
      await axios.put(
        `http://localhost:5000/api/bookings/${bookingId}/cancel`,
        {},
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setFeedbackMsg({ type: 'success', text: 'Booking cancelled successfully. Seats have been restored.' });
      setTimeout(() => setFeedbackMsg({ type: '', text: '' }), 4000);
      fetchData();
    } catch (err) {
      alert(err.response?.data?.message || 'Failed to cancel booking');
    } finally {
      setActionLoading(false);
    }
  };

  const handleDeleteRide = async (rideId) => {
    if (!window.confirm('Are you sure you want to delete this published ride? All associated bookings will be notified.')) {
      return;
    }
    try {
      setActionLoading(true);
      await axios.delete(
        `http://localhost:5000/api/rides/${rideId}`,
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setFeedbackMsg({ type: 'success', text: 'Published ride deleted successfully.' });
      setTimeout(() => setFeedbackMsg({ type: '', text: '' }), 4000);
      fetchData();
    } catch (err) {
      alert(err.response?.data?.message || 'Failed to delete ride');
    } finally {
      setActionLoading(false);
    }
  };

  return (
    <div style={{ backgroundColor: 'var(--bg-page)', minHeight: 'calc(100vh - 70px)' }}>
      
      {/* Profile Header */}
      <div style={{ backgroundColor: 'white', borderBottom: '1px solid var(--border-light)', padding: '36px 0' }}>
        <div className="container">
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '24px' }}>
            
            <div style={{ display: 'flex', alignItems: 'center', gap: '20px' }}>
              <img 
                src={user?.picture || `https://ui-avatars.com/api/?name=${encodeURIComponent(user?.name || 'User')}&background=0056D2&color=fff&bold=true`} 
                alt={user?.name} 
                style={{ width: '84px', height: '84px', borderRadius: '50%', objectFit: 'cover', border: '3px solid var(--primary-light)' }}
              />
              <div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '4px' }}>
                  <h1 className="heading-md" style={{ margin: 0 }}>{user?.name}</h1>
                  <span className="badge badge-success" style={{ gap: '4px' }}>
                    <ShieldCheck size={14} /> Verified Member
                  </span>
                </div>
                <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem', margin: 0 }}>{user?.email}</p>
                <div style={{ display: 'flex', gap: '16px', marginTop: '8px', fontSize: '0.825rem', color: 'var(--text-secondary)' }}>
                  <span>Member since 2026</span>
                  <span>&bull;</span>
                  <span style={{ color: '#059669', fontWeight: 600, display: 'flex', alignItems: 'center', gap: '4px' }}>
                    <Leaf size={14} /> ~45 kg CO₂ saved
                  </span>
                </div>
              </div>
            </div>

            <div style={{ display: 'flex', gap: '12px' }}>
              <Link to="/offer" className="btn btn-primary" style={{ gap: '6px' }}>
                <Car size={18} /> Offer a new ride
              </Link>
              <Link to="/search" className="btn btn-outline" style={{ gap: '6px' }}>
                Find rides
              </Link>
            </div>

          </div>
        </div>
      </div>

      {/* Main Content Area */}
      <div className="container py-8">
        
        {feedbackMsg.text && (
          <div style={{ 
            marginBottom: '24px', 
            padding: '14px 20px', 
            borderRadius: '12px', 
            backgroundColor: feedbackMsg.type === 'success' ? 'var(--success-light)' : 'var(--error-light)',
            color: feedbackMsg.type === 'success' ? '#065F46' : 'var(--error)',
            fontWeight: 600,
            display: 'flex',
            alignItems: 'center',
            gap: '8px',
            border: `1px solid ${feedbackMsg.type === 'success' ? 'var(--success)' : 'var(--error)'}`
          }}>
            <CheckCircle2 size={20} />
            {feedbackMsg.text}
          </div>
        )}

        {/* Tab Controls */}
        <div style={{ display: 'flex', gap: '8px', marginBottom: '24px', borderBottom: '2px solid var(--border-light)' }}>
          <button 
            onClick={() => setActiveTab('bookings')}
            style={{
              padding: '12px 24px',
              fontSize: '1.05rem',
              fontWeight: 700,
              background: 'none',
              border: 'none',
              borderBottom: activeTab === 'bookings' ? '3px solid var(--primary)' : '3px solid transparent',
              color: activeTab === 'bookings' ? 'var(--primary)' : 'var(--text-muted)',
              cursor: 'pointer',
              marginBottom: '-2px',
              transition: 'all 0.2s'
            }}
          >
            My Bookings ({bookings.length})
          </button>
          <button 
            onClick={() => setActiveTab('published')}
            style={{
              padding: '12px 24px',
              fontSize: '1.05rem',
              fontWeight: 700,
              background: 'none',
              border: 'none',
              borderBottom: activeTab === 'published' ? '3px solid var(--primary)' : '3px solid transparent',
              color: activeTab === 'published' ? 'var(--primary)' : 'var(--text-muted)',
              cursor: 'pointer',
              marginBottom: '-2px',
              transition: 'all 0.2s'
            }}
          >
            Published Rides ({publishedRides.length})
          </button>
        </div>

        {/* Tab Contents */}
        {loading ? (
          <div className="card" style={{ padding: '60px', textAlign: 'center' }}>
            <Loader2 size={44} className="text-primary spinner mx-auto mb-4" />
            <p className="text-body font-medium">Fetching your trips...</p>
          </div>
        ) : activeTab === 'bookings' ? (
          bookings.length > 0 ? (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
              {bookings.map(booking => {
                if (!booking.ride) return null;
                const rideDate = new Date(booking.ride.date);
                const isCancelled = booking.status === 'cancelled';

                return (
                  <div key={booking._id} className="card" style={{ padding: '28px', opacity: isCancelled ? 0.7 : 1 }}>
                    
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '20px', borderBottom: '1px solid var(--border-light)', paddingBottom: '16px' }}>
                      <div>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '6px' }}>
                          <span className={`badge ${isCancelled ? 'badge-cancelled' : 'badge-success'}`}>
                            {booking.status}
                          </span>
                          <span style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>
                            Booking ID: <span style={{ fontFamily: 'monospace' }}>{booking._id.slice(-6)}</span>
                          </span>
                        </div>
                        <div style={{ fontSize: '1.15rem', fontWeight: 800, color: 'var(--text-main)' }}>
                          {rideDate.toLocaleDateString('en-IN', { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' })} at {rideDate.toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit' })}
                        </div>
                      </div>

                      <div style={{ textAlign: 'right' }}>
                        <div style={{ fontSize: '1.4rem', fontWeight: 800, color: isCancelled ? 'var(--text-muted)' : 'var(--primary)' }}>
                          ₹{booking.ride.price * booking.seatsBooked}
                        </div>
                        <div style={{ fontSize: '0.85rem', color: 'var(--text-muted)', fontWeight: 600 }}>
                          {booking.seatsBooked} seat{booking.seatsBooked > 1 ? 's' : ''} reserved
                        </div>
                      </div>
                    </div>

                    {/* Route Timeline */}
                    <div style={{ display: 'flex', alignItems: 'center', gap: '20px', marginBottom: '20px' }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                        <div style={{ width: '12px', height: '12px', borderRadius: '50%', border: '2.5px solid var(--primary)', background: 'white' }}></div>
                        <span style={{ fontWeight: 700, fontSize: '1.05rem', color: 'var(--text-main)' }}>{booking.ride.from}</span>
                      </div>
                      <div style={{ width: '60px', height: '2px', background: 'var(--border)' }}></div>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                        <div style={{ width: '12px', height: '12px', borderRadius: '50%', border: '2.5px solid var(--dark-navy)', background: 'white' }}></div>
                        <span style={{ fontWeight: 700, fontSize: '1.05rem', color: 'var(--text-main)' }}>{booking.ride.to}</span>
                      </div>
                    </div>

                    {/* Driver & Actions footer */}
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '16px', paddingTop: '16px', borderTop: '1px solid var(--border-light)' }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                        <img 
                          src={booking.ride.driver?.picture || `https://ui-avatars.com/api/?name=${encodeURIComponent(booking.ride.driver?.name || 'Driver')}&background=0056D2&color=fff`} 
                          alt="Driver"
                          style={{ width: '36px', height: '36px', borderRadius: '50%', objectFit: 'cover' }}
                        />
                        <div>
                          <div style={{ fontSize: '0.9rem', fontWeight: 600, color: 'var(--text-main)' }}>
                            Driver: {booking.ride.driver?.name || 'Verified Driver'}
                          </div>
                          <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>
                            {booking.ride.vehicle || 'Vehicle details provided'}
                          </div>
                        </div>
                      </div>

                      <div style={{ display: 'flex', gap: '12px', alignItems: 'center' }}>
                        <Link 
                          to={`/ride/${booking.ride._id}`}
                          className="btn btn-outline btn-sm"
                          style={{ gap: '4px' }}
                        >
                          View Ride Details <ChevronRight size={16} />
                        </Link>

                        {!isCancelled && (
                          <button
                            onClick={() => handleCancelBooking(booking._id)}
                            className="btn btn-ghost btn-sm"
                            style={{ color: 'var(--error)', gap: '4px' }}
                            disabled={actionLoading}
                          >
                            <XCircle size={16} /> Cancel Booking
                          </button>
                        )}
                      </div>
                    </div>

                  </div>
                );
              })}
            </div>
          ) : (
            <div className="card" style={{ padding: '60px 24px', textAlign: 'center' }}>
              <Car size={52} color="var(--primary)" className="mx-auto mb-4" style={{ opacity: 0.6 }} />
              <h3 className="heading-md mb-2">No bookings yet</h3>
              <p className="text-body mb-6" style={{ maxWidth: '400px', margin: '0 auto 24px' }}>
                You have not booked any shared carpool trips yet. Search thousands of routes across India.
              </p>
              <Link to="/search" className="btn btn-primary">
                Find a Ride
              </Link>
            </div>
          )
        ) : (
          publishedRides.length > 0 ? (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
              {publishedRides.map(ride => {
                const rideDate = new Date(ride.date);
                const isPast = rideDate < new Date();

                return (
                  <div key={ride._id} className="card" style={{ padding: '28px', opacity: isPast ? 0.7 : 1 }}>
                    
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '20px', borderBottom: '1px solid var(--border-light)', paddingBottom: '16px' }}>
                      <div>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '6px' }}>
                          <span className={`badge ${isPast ? 'badge-cancelled' : 'badge-info'}`}>
                            {isPast ? 'Completed' : 'Active Ride'}
                          </span>
                          <span style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>
                            Ride ID: <span style={{ fontFamily: 'monospace' }}>{ride._id.slice(-6)}</span>
                          </span>
                        </div>
                        <div style={{ fontSize: '1.15rem', fontWeight: 800, color: 'var(--text-main)' }}>
                          {rideDate.toLocaleDateString('en-IN', { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' })} at {rideDate.toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit' })}
                        </div>
                      </div>

                      <div style={{ textAlign: 'right' }}>
                        <div style={{ fontSize: '1.4rem', fontWeight: 800, color: 'var(--primary)' }}>
                          ₹{ride.price} <span style={{ fontSize: '0.9rem', color: 'var(--text-muted)', fontWeight: 500 }}>/ seat</span>
                        </div>
                        <div style={{ fontSize: '0.85rem', color: 'var(--text-muted)', fontWeight: 600 }}>
                          {ride.seats} seat{ride.seats > 1 ? 's' : ''} available
                        </div>
                      </div>
                    </div>

                    {/* Route Timeline */}
                    <div style={{ display: 'flex', alignItems: 'center', gap: '20px', marginBottom: '20px' }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                        <div style={{ width: '12px', height: '12px', borderRadius: '50%', border: '2.5px solid var(--primary)', background: 'white' }}></div>
                        <span style={{ fontWeight: 700, fontSize: '1.05rem', color: 'var(--text-main)' }}>{ride.from}</span>
                      </div>
                      <div style={{ width: '60px', height: '2px', background: 'var(--border)' }}></div>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                        <div style={{ width: '12px', height: '12px', borderRadius: '50%', border: '2.5px solid var(--dark-navy)', background: 'white' }}></div>
                        <span style={{ fontWeight: 700, fontSize: '1.05rem', color: 'var(--text-main)' }}>{ride.to}</span>
                      </div>
                    </div>

                    {/* Vehicle & Delete actions */}
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '16px', paddingTop: '16px', borderTop: '1px solid var(--border-light)' }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '8px', color: 'var(--text-secondary)', fontSize: '0.9rem' }}>
                        <Car size={18} color="var(--primary)" />
                        <span>{ride.vehicle || 'Standard Passenger Vehicle'} {ride.vehicleColor ? `(${ride.vehicleColor})` : ''}</span>
                      </div>

                      <div style={{ display: 'flex', gap: '12px', alignItems: 'center' }}>
                        <Link 
                          to={`/ride/${ride._id}`}
                          className="btn btn-outline btn-sm"
                          style={{ gap: '4px' }}
                        >
                          View Public Page <ChevronRight size={16} />
                        </Link>

                        <button
                          onClick={() => handleDeleteRide(ride._id)}
                          className="btn btn-ghost btn-sm"
                          style={{ color: 'var(--error)', gap: '4px' }}
                          disabled={actionLoading}
                        >
                          <Trash2 size={16} /> Delete Ride
                        </button>
                      </div>
                    </div>

                  </div>
                );
              })}
            </div>
          ) : (
            <div className="card" style={{ padding: '60px 24px', textAlign: 'center' }}>
              <Navigation size={52} color="var(--primary)" className="mx-auto mb-4" style={{ opacity: 0.6 }} />
              <h3 className="heading-md mb-2">No rides published</h3>
              <p className="text-body mb-6" style={{ maxWidth: '400px', margin: '0 auto 24px' }}>
                You have not offered any rides yet. Share your fuel costs by offering empty seats today.
              </p>
              <Link to="/offer" className="btn btn-primary">
                Offer a Ride Now
              </Link>
            </div>
          )
        )}

      </div>

      <Footer />
    </div>
  );
}

export default Dashboard;
