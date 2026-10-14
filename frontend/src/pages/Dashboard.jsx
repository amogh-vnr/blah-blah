import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { useAuth } from '../context/AuthContext';
import { 
  MapPin, Calendar, Users, Loader2, Car, Navigation, 
  ShieldCheck, Clock, Trash2, XCircle, CheckCircle2, ChevronRight, 
  Phone, Leaf, MessageSquare, HandCoins, QrCode, Star, Check, AlertCircle
} from 'lucide-react';
import Footer from '../components/Footer';
import ChatDrawer from '../components/ChatDrawer';
import UpiPaymentModal from '../components/UpiPaymentModal';
import ReviewModal from '../components/ReviewModal';

function Dashboard() {
  const { token, user } = useAuth();
  const navigate = useNavigate();
  
  const [bookings, setBookings] = useState([]);
  const [publishedRides, setPublishedRides] = useState([]);
  const [negotiations, setNegotiations] = useState([]);
  const [myRequests, setMyRequests] = useState([]);
  
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('bookings'); // 'bookings' | 'published' | 'negotiations' | 'requests'
  const [actionLoading, setActionLoading] = useState(false);
  const [feedbackMsg, setFeedbackMsg] = useState({ type: '', text: '' });

  // Modals state
  const [chatData, setChatData] = useState(null); // { ride, otherUser }
  const [upiData, setUpiData] = useState(null); // { amount, driverName, route }
  const [reviewData, setReviewData] = useState(null); // { ride, reviewee }
  const [counterPriceInput, setCounterPriceInput] = useState({});

  const fetchData = async () => {
    try {
      setLoading(true);
      const [bookingsRes, ridesRes, negoRes, reqRes] = await Promise.all([
        axios.get('http://localhost:5000/api/bookings', { headers: { Authorization: `Bearer ${token}` } }),
        axios.get('http://localhost:5000/api/rides/mine', { headers: { Authorization: `Bearer ${token}` } }),
        axios.get('http://localhost:5000/api/negotiations', { headers: { Authorization: `Bearer ${token}` } }),
        axios.get('http://localhost:5000/api/requests/mine', { headers: { Authorization: `Bearer ${token}` } })
      ]);
      setBookings(bookingsRes.data.data || []);
      setPublishedRides(ridesRes.data.data || []);
      setNegotiations(negoRes.data.data || []);
      setMyRequests(reqRes.data.data || []);
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

  const handleNegotiationAction = async (negoId, action, counterVal) => {
    try {
      setActionLoading(true);
      const res = await axios.put(
        `http://localhost:5000/api/negotiations/${negoId}/respond`,
        { action, counterPrice: counterVal },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setFeedbackMsg({ type: 'success', text: res.data.message });
      setTimeout(() => setFeedbackMsg({ type: '', text: '' }), 4000);
      fetchData();
    } catch (err) {
      alert(err.response?.data?.message || 'Action failed');
    } finally {
      setActionLoading(false);
    }
  };

  const handleUpdateStatus = async (rideId, newStatus) => {
    try {
      await axios.put(
        `http://localhost:5000/api/rides/${rideId}/status`,
        { status: newStatus },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setFeedbackMsg({ type: 'success', text: `Trip status marked as ${newStatus}` });
      setTimeout(() => setFeedbackMsg({ type: '', text: '' }), 4000);
      fetchData();
    } catch (err) {
      alert(err.response?.data?.message || 'Failed to update status');
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
                    <Leaf size={14} /> ~65 kg CO₂ saved
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
        <div style={{ display: 'flex', gap: '8px', marginBottom: '24px', borderBottom: '2px solid var(--border-light)', overflowX: 'auto' }}>
          <button 
            onClick={() => setActiveTab('bookings')}
            style={{
              padding: '12px 20px',
              fontSize: '1rem',
              fontWeight: 700,
              background: 'none',
              border: 'none',
              borderBottom: activeTab === 'bookings' ? '3px solid var(--primary)' : '3px solid transparent',
              color: activeTab === 'bookings' ? 'var(--primary)' : 'var(--text-muted)',
              cursor: 'pointer',
              marginBottom: '-2px',
              whiteSpace: 'nowrap'
            }}
          >
            My Bookings ({bookings.length})
          </button>

          <button 
            onClick={() => setActiveTab('published')}
            style={{
              padding: '12px 20px',
              fontSize: '1rem',
              fontWeight: 700,
              background: 'none',
              border: 'none',
              borderBottom: activeTab === 'published' ? '3px solid var(--primary)' : '3px solid transparent',
              color: activeTab === 'published' ? 'var(--primary)' : 'var(--text-muted)',
              cursor: 'pointer',
              marginBottom: '-2px',
              whiteSpace: 'nowrap'
            }}
          >
            Published Rides ({publishedRides.length})
          </button>

          <button 
            onClick={() => setActiveTab('negotiations')}
            style={{
              padding: '12px 20px',
              fontSize: '1rem',
              fontWeight: 700,
              background: 'none',
              border: 'none',
              borderBottom: activeTab === 'negotiations' ? '3px solid var(--primary)' : '3px solid transparent',
              color: activeTab === 'negotiations' ? 'var(--primary)' : 'var(--text-muted)',
              cursor: 'pointer',
              marginBottom: '-2px',
              whiteSpace: 'nowrap',
              display: 'flex',
              alignItems: 'center',
              gap: '6px'
            }}
          >
            Negotiations ({negotiations.length})
            {negotiations.some(n => n.status === 'pending' && n.driver?._id === user?._id) && (
              <span style={{ width: '8px', height: '8px', borderRadius: '50%', background: 'var(--primary)' }}></span>
            )}
          </button>

          <button 
            onClick={() => setActiveTab('requests')}
            style={{
              padding: '12px 20px',
              fontSize: '1rem',
              fontWeight: 700,
              background: 'none',
              border: 'none',
              borderBottom: activeTab === 'requests' ? '3px solid var(--primary)' : '3px solid transparent',
              color: activeTab === 'requests' ? 'var(--primary)' : 'var(--text-muted)',
              cursor: 'pointer',
              marginBottom: '-2px',
              whiteSpace: 'nowrap'
            }}
          >
            My Ride Requests ({myRequests.length})
          </button>
        </div>

        {/* Tab 1: Bookings */}
        {loading ? (
          <div className="card" style={{ padding: '60px', textAlign: 'center' }}>
            <Loader2 size={44} className="text-primary spinner mx-auto mb-4" />
            <p className="text-body font-medium">Fetching trips...</p>
          </div>
        ) : activeTab === 'bookings' ? (
          bookings.length > 0 ? (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
              {bookings.map(booking => {
                if (!booking.ride) return null;
                const rideDate = new Date(booking.ride.date);
                const isCancelled = booking.status === 'cancelled';
                const isPast = rideDate < new Date();

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

                    {/* Driver & Multi-Feature Action Row */}
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

                      <div style={{ display: 'flex', gap: '10px', alignItems: 'center', flexWrap: 'wrap' }}>
                        {/* Direct In-App Chat */}
                        <button
                          onClick={() => setChatData({ ride: booking.ride, otherUser: booking.ride.driver })}
                          className="btn btn-primary btn-sm"
                          style={{ gap: '6px' }}
                        >
                          <MessageSquare size={15} /> Chat with Driver
                        </button>

                        {/* Pay via UPI Modal */}
                        {!isCancelled && (
                          <button
                            onClick={() => setUpiData({ 
                              amount: booking.ride.price * booking.seatsBooked, 
                              driverName: booking.ride.driver?.name,
                              route: `${booking.ride.from} to ${booking.ride.to}` 
                            })}
                            className="btn btn-outline btn-sm"
                            style={{ gap: '6px' }}
                          >
                            <QrCode size={15} /> Pay via UPI
                          </button>
                        )}

                        {/* Post-Trip Review Modal */}
                        {isPast && !isCancelled && (
                          <button
                            onClick={() => setReviewData({ ride: booking.ride, reviewee: booking.ride.driver })}
                            className="btn btn-outline btn-sm"
                            style={{ gap: '6px', color: '#D97706', borderColor: '#F59E0B' }}
                          >
                            <Star size={15} /> Review Trip
                          </button>
                        )}

                        <Link 
                          to={`/ride/${booking.ride._id}`}
                          className="btn btn-ghost btn-sm"
                          style={{ gap: '4px' }}
                        >
                          Details <ChevronRight size={15} />
                        </Link>

                        {!isCancelled && !isPast && (
                          <button
                            onClick={() => handleCancelBooking(booking._id)}
                            className="btn btn-ghost btn-sm"
                            style={{ color: 'var(--error)', gap: '4px' }}
                            disabled={actionLoading}
                          >
                            <XCircle size={15} /> Cancel
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
        ) : activeTab === 'published' ? (
          /* Tab 2: Published Rides */
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
                          <span className={`badge ${isPast ? 'badge-cancelled' : ride.status === 'en_route' ? 'badge-pending' : 'badge-info'}`}>
                            {isPast ? 'Completed' : ride.status === 'en_route' ? 'En Route' : 'Active Ride'}
                          </span>
                          {ride.ladiesOnly && (
                            <span className="badge" style={{ background: '#FCE7F3', color: '#BE185D' }}>🌸 Ladies Only</span>
                          )}
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

                    {/* Status & Actions */}
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '16px', paddingTop: '16px', borderTop: '1px solid var(--border-light)' }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '8px', color: 'var(--text-secondary)', fontSize: '0.9rem' }}>
                        <Car size={18} color="var(--primary)" />
                        <span>{ride.vehicle || 'Standard Car'} {ride.vehicleColor ? `(${ride.vehicleColor})` : ''}</span>
                      </div>

                      <div style={{ display: 'flex', gap: '10px', alignItems: 'center' }}>
                        {/* Driver status controller */}
                        {ride.status === 'scheduled' && !isPast && (
                          <button
                            onClick={() => handleUpdateStatus(ride._id, 'en_route')}
                            className="btn btn-primary btn-sm"
                            style={{ gap: '4px' }}
                          >
                            <Navigation size={14} /> Start Trip
                          </button>
                        )}
                        {ride.status === 'en_route' && (
                          <button
                            onClick={() => handleUpdateStatus(ride._id, 'completed')}
                            className="btn btn-sm"
                            style={{ background: 'var(--success)', color: 'white', gap: '4px' }}
                          >
                            <Check size={14} /> Mark Completed
                          </button>
                        )}

                        <Link 
                          to={`/ride/${ride._id}`}
                          className="btn btn-outline btn-sm"
                          style={{ gap: '4px' }}
                        >
                          View Public Page <ChevronRight size={15} />
                        </Link>

                        <button
                          onClick={() => handleDeleteRide(ride._id)}
                          className="btn btn-ghost btn-sm"
                          style={{ color: 'var(--error)', gap: '4px' }}
                          disabled={actionLoading}
                        >
                          <Trash2 size={15} /> Delete Ride
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
        ) : activeTab === 'negotiations' ? (
          /* Tab 3: Fare Negotiations */
          negotiations.length > 0 ? (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
              {negotiations.map(nego => {
                const isDriver = nego.driver?._id === user?._id;
                const isPending = nego.status === 'pending';
                const isCountered = nego.status === 'countered';

                return (
                  <div key={nego._id} className="card" style={{ padding: '24px' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '14px' }}>
                      <div>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '4px' }}>
                          <span className={`badge ${nego.status === 'accepted' ? 'badge-success' : nego.status === 'rejected' ? 'badge-cancelled' : 'badge-pending'}`}>
                            {nego.status.toUpperCase()}
                          </span>
                          <span style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>
                            {isDriver ? `Offer from Passenger: ${nego.passenger?.name}` : `Your offer to Driver: ${nego.driver?.name}`}
                          </span>
                        </div>
                        <div style={{ fontWeight: 700, fontSize: '1.05rem', color: 'var(--text-main)' }}>
                          {nego.ride?.from} &rarr; {nego.ride?.to}
                        </div>
                      </div>

                      <div style={{ textAlign: 'right' }}>
                        <div style={{ fontSize: '1.3rem', fontWeight: 800, color: 'var(--primary)' }}>
                          ₹{nego.proposedPrice} <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)', fontWeight: 500 }}>/ seat</span>
                        </div>
                        <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>
                          Asking: ₹{nego.originalPrice} &bull; {nego.seats} seat{nego.seats > 1 ? 's' : ''}
                        </div>
                      </div>
                    </div>

                    {nego.message && (
                      <div style={{ background: 'var(--bg-page)', padding: '10px 14px', borderRadius: '10px', fontSize: '0.85rem', color: 'var(--text-secondary)', marginBottom: '16px' }}>
                        "{nego.message}"
                      </div>
                    )}

                    {isCountered && (
                      <div style={{ background: '#FEF3C7', border: '1px solid #FDE68A', padding: '10px 14px', borderRadius: '10px', fontSize: '0.85rem', color: '#92400E', marginBottom: '16px' }}>
                        Driver proposed counter-offer: <strong>₹{nego.counterPrice}/seat</strong>
                      </div>
                    )}

                    {/* Driver Response Controls */}
                    {isDriver && isPending && (
                      <div style={{ display: 'flex', gap: '10px', alignItems: 'center', paddingTop: '12px', borderTop: '1px solid var(--border-light)' }}>
                        <button
                          onClick={() => handleNegotiationAction(nego._id, 'accept')}
                          className="btn btn-sm"
                          style={{ background: 'var(--success)', color: 'white', gap: '4px' }}
                          disabled={actionLoading}
                        >
                          <Check size={16} /> Accept (₹{nego.proposedPrice})
                        </button>

                        <button
                          onClick={() => handleNegotiationAction(nego._id, 'reject')}
                          className="btn btn-ghost btn-sm"
                          style={{ color: 'var(--error)', gap: '4px' }}
                          disabled={actionLoading}
                        >
                          <XCircle size={16} /> Decline
                        </button>

                        <div style={{ display: 'flex', alignItems: 'center', gap: '6px', marginLeft: 'auto' }}>
                          <input 
                            type="number"
                            placeholder="Counter ₹"
                            className="input-field"
                            style={{ width: '100px', padding: '6px 10px', fontSize: '0.85rem' }}
                            value={counterPriceInput[nego._id] || ''}
                            onChange={(e) => setCounterPriceInput({ ...counterPriceInput, [nego._id]: e.target.value })}
                          />
                          <button
                            onClick={() => handleNegotiationAction(nego._id, 'counter', counterPriceInput[nego._id])}
                            className="btn btn-outline btn-sm"
                            disabled={actionLoading || !counterPriceInput[nego._id]}
                          >
                            Counter
                          </button>
                        </div>
                      </div>
                    )}

                    {/* Passenger accepting driver counter-offer */}
                    {!isDriver && isCountered && (
                      <div style={{ display: 'flex', gap: '10px', paddingTop: '12px', borderTop: '1px solid var(--border-light)' }}>
                        <button
                          onClick={() => handleNegotiationAction(nego._id, 'accept')}
                          className="btn btn-primary btn-sm"
                          disabled={actionLoading}
                        >
                          Accept Counter-Offer (₹{nego.counterPrice}/seat)
                        </button>
                        <button
                          onClick={() => handleNegotiationAction(nego._id, 'reject')}
                          className="btn btn-ghost btn-sm"
                          style={{ color: 'var(--error)' }}
                          disabled={actionLoading}
                        >
                          Decline
                        </button>
                      </div>
                    )}

                  </div>
                );
              })}
            </div>
          ) : (
            <div className="card" style={{ padding: '60px 24px', textAlign: 'center' }}>
              <HandCoins size={52} color="var(--primary)" className="mx-auto mb-4" style={{ opacity: 0.6 }} />
              <h3 className="heading-md mb-2">No active negotiations</h3>
              <p className="text-body" style={{ maxWidth: '400px', margin: '0 auto' }}>
                When passengers or drivers negotiate trip fares, offer proposals and counters appear here.
              </p>
            </div>
          )
        ) : (
          /* Tab 4: Ride Requests */
          myRequests.length > 0 ? (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
              {myRequests.map(req => (
                <div key={req._id} className="card" style={{ padding: '24px' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '10px' }}>
                    <div>
                      <span className="badge badge-info" style={{ marginBottom: '6px' }}>
                        {req.status.toUpperCase()}
                      </span>
                      <h4 style={{ fontWeight: 800, fontSize: '1.1rem', margin: 0 }}>
                        {req.from} &rarr; {req.to}
                      </h4>
                      <div style={{ fontSize: '0.85rem', color: 'var(--text-muted)', marginTop: '4px' }}>
                        Date: {new Date(req.date).toLocaleDateString('en-IN', { weekday: 'short', day: 'numeric', month: 'short' })} &bull; Seats: {req.seats}
                      </div>
                    </div>
                    <div style={{ textAlign: 'right' }}>
                      <div style={{ fontSize: '1.25rem', fontWeight: 800, color: 'var(--primary)' }}>
                        Max Budget: ₹{req.maxBudget}
                      </div>
                    </div>
                  </div>
                  {req.notes && (
                    <div style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', background: 'var(--bg-page)', padding: '8px 12px', borderRadius: '8px' }}>
                      Note: {req.notes}
                    </div>
                  )}
                </div>
              ))}
            </div>
          ) : (
            <div className="card" style={{ padding: '60px 24px', textAlign: 'center' }}>
              <Calendar size={52} color="var(--primary)" className="mx-auto mb-4" style={{ opacity: 0.6 }} />
              <h3 className="heading-md mb-2">No ride requests posted</h3>
              <p className="text-body" style={{ maxWidth: '400px', margin: '0 auto' }}>
                If you cannot find a direct ride, you can post a community request on the board.
              </p>
            </div>
          )
        )}

      </div>

      {/* Floating In-App Chat Drawer */}
      {chatData && (
        <ChatDrawer 
          isOpen={!!chatData}
          onClose={() => setChatData(null)}
          ride={chatData.ride}
          otherUser={chatData.otherUser}
        />
      )}

      {/* Instant UPI Payment Modal */}
      {upiData && (
        <UpiPaymentModal 
          isOpen={!!upiData}
          onClose={() => setUpiData(null)}
          amount={upiData.amount}
          driverName={upiData.driverName}
          tripRoute={upiData.route}
        />
      )}

      {/* Post-Trip Review Modal */}
      {reviewData && (
        <ReviewModal 
          isOpen={!!reviewData}
          onClose={() => setReviewData(null)}
          ride={reviewData.ride}
          reviewee={reviewData.reviewee}
          onSuccess={() => {
            setFeedbackMsg({ type: 'success', text: 'Thank you for your trip review!' });
            setTimeout(() => setFeedbackMsg({ type: '', text: '' }), 4000);
          }}
        />
      )}

      <Footer />
    </div>
  );
}

export default Dashboard;
