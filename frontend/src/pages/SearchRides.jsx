import { useState, useEffect, useMemo } from 'react';
import { useLocation, useNavigate, Link } from 'react-router-dom';
import axios from 'axios';
import { 
  MapPin, Calendar, Users, Loader2, Star, Clock, 
  ShieldCheck, Sparkles, Filter, ChevronRight, ArrowUpDown, X, Car
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';

function SearchRides() {
  const [rides, setRides] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  // Filters & Sorting state
  const [sortBy, setSortBy] = useState('earliest'); // 'earliest', 'price', 'duration'
  const [filterTime, setFilterTime] = useState([]); // 'morning', 'afternoon', 'evening'
  const [verifiedOnly, setVerifiedOnly] = useState(false);
  const [maxTwoBack, setMaxTwoBack] = useState(false);

  const { user } = useAuth();
  const location = useLocation();
  const navigate = useNavigate();
  const searchParams = new URLSearchParams(location.search);
  
  const from = searchParams.get('from') || '';
  const to = searchParams.get('to') || '';
  const date = searchParams.get('date') || '';
  const searchSeats = searchParams.get('seats') || '1';

  // State for top quick-bar re-search
  const [fromInput, setFromInput] = useState(from);
  const [toInput, setToInput] = useState(to);
  const [dateInput, setDateInput] = useState(date);
  const [seatsInput, setSeatsInput] = useState(searchSeats);

  useEffect(() => {
    setFromInput(from);
    setToInput(to);
    setDateInput(date);
    setSeatsInput(searchSeats);
  }, [from, to, date, searchSeats]);

  const fetchRides = async () => {
    try {
      setLoading(true);
      setError('');
      const params = new URLSearchParams();
      if (from) params.append('from', from);
      if (to) params.append('to', to);
      if (date) params.append('date', date);
      if (searchSeats) params.append('seats', searchSeats);

      const response = await axios.get(`http://localhost:5000/api/rides?${params.toString()}`);
      setRides(response.data.data || []);
    } catch (err) {
      console.error('Error fetching rides', err);
      setError('Could not connect to ride service. Please check your connection.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchRides();
  }, [location.search]);

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    const params = new URLSearchParams();
    if (fromInput) params.append('from', fromInput);
    if (toInput) params.append('to', toInput);
    if (dateInput) params.append('date', dateInput);
    if (seatsInput) params.append('seats', seatsInput);
    navigate(`/search?${params.toString()}`);
  };

  // Filter & Sort Logic
  const filteredRides = useMemo(() => {
    let result = [...rides];

    // Filter by departure time of day
    if (filterTime.length > 0) {
      result = result.filter(ride => {
        const hour = new Date(ride.date).getHours();
        if (filterTime.includes('morning') && hour < 12) return true;
        if (filterTime.includes('afternoon') && hour >= 12 && hour < 18) return true;
        if (filterTime.includes('evening') && hour >= 18) return true;
        return false;
      });
    }

    // Filter by verified drivers
    if (verifiedOnly) {
      result = result.filter(ride => ride.driver && ride.driver.name);
    }

    // Sorting
    if (sortBy === 'earliest') {
      result.sort((a, b) => new Date(a.date) - new Date(b.date));
    } else if (sortBy === 'price') {
      result.sort((a, b) => a.price - b.price);
    }

    return result;
  }, [rides, sortBy, filterTime, verifiedOnly, maxTwoBack]);

  const handleTimeToggle = (period) => {
    setFilterTime(prev => 
      prev.includes(period) ? prev.filter(p => p !== period) : [...prev, period]
    );
  };

  const clearFilters = () => {
    setSortBy('earliest');
    setFilterTime([]);
    setVerifiedOnly(false);
    setMaxTwoBack(false);
  };

  return (
    <div style={{ backgroundColor: 'var(--bg-page)', minHeight: 'calc(100vh - 70px)', paddingBottom: '60px' }}>
      
      {/* Top Search Modification Bar */}
      <div style={{ backgroundColor: 'white', borderBottom: '1px solid var(--border-light)', padding: '16px 0', boxShadow: 'var(--shadow-sm)' }}>
        <div className="container">
          <form onSubmit={handleSearchSubmit} style={{ display: 'flex', gap: '12px', alignItems: 'center', flexWrap: 'wrap' }}>
            <div style={{ flex: '1 1 200px', display: 'flex', alignItems: 'center', gap: '8px', border: '1px solid var(--border)', borderRadius: '12px', padding: '8px 14px', background: 'var(--bg-page)' }}>
              <div style={{ width: '10px', height: '10px', borderRadius: '50%', border: '2px solid var(--primary)' }}></div>
              <input 
                type="text" 
                placeholder="Leaving from" 
                value={fromInput} 
                onChange={(e) => setFromInput(e.target.value)}
                style={{ border: 'none', background: 'transparent', outline: 'none', width: '100%', fontWeight: 600, color: 'var(--text-main)', fontSize: '0.9rem' }}
              />
            </div>

            <div style={{ flex: '1 1 200px', display: 'flex', alignItems: 'center', gap: '8px', border: '1px solid var(--border)', borderRadius: '12px', padding: '8px 14px', background: 'var(--bg-page)' }}>
              <MapPin size={16} color="var(--primary)" />
              <input 
                type="text" 
                placeholder="Going to" 
                value={toInput} 
                onChange={(e) => setToInput(e.target.value)}
                style={{ border: 'none', background: 'transparent', outline: 'none', width: '100%', fontWeight: 600, color: 'var(--text-main)', fontSize: '0.9rem' }}
              />
            </div>

            <div style={{ flex: '0 1 170px', display: 'flex', alignItems: 'center', gap: '8px', border: '1px solid var(--border)', borderRadius: '12px', padding: '8px 14px', background: 'var(--bg-page)' }}>
              <Calendar size={16} color="var(--text-muted)" />
              <input 
                type="date" 
                value={dateInput} 
                onChange={(e) => setDateInput(e.target.value)}
                style={{ border: 'none', background: 'transparent', outline: 'none', width: '100%', fontWeight: 600, color: 'var(--text-main)', fontSize: '0.85rem' }}
              />
            </div>

            <div style={{ flex: '0 1 120px', display: 'flex', alignItems: 'center', gap: '8px', border: '1px solid var(--border)', borderRadius: '12px', padding: '8px 14px', background: 'var(--bg-page)' }}>
              <Users size={16} color="var(--text-muted)" />
              <input 
                type="number" 
                min="1" 
                max="8" 
                value={seatsInput} 
                onChange={(e) => setSeatsInput(e.target.value)}
                style={{ border: 'none', background: 'transparent', outline: 'none', width: '100%', fontWeight: 600, color: 'var(--text-main)', fontSize: '0.9rem' }}
              />
            </div>

            <button type="submit" className="btn btn-primary" style={{ padding: '10px 24px', fontSize: '0.95rem' }}>
              Update Search
            </button>
          </form>
        </div>
      </div>

      {/* Main Content Area */}
      <div className="container mt-6">
        <div style={{ display: 'grid', gridTemplateColumns: '280px minmax(0, 1fr)', gap: '32px', alignItems: 'start' }}>
          
          {/* Left Sidebar: Real BlaBlaCar Filters */}
          <div className="card" style={{ padding: '24px', position: 'sticky', top: '90px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px', borderBottom: '1px solid var(--border-light)', paddingBottom: '12px' }}>
              <h3 className="heading-sm" style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                <Filter size={18} color="var(--primary)" /> Filters
              </h3>
              {(filterTime.length > 0 || verifiedOnly || sortBy !== 'earliest') && (
                <button 
                  onClick={clearFilters}
                  style={{ fontSize: '0.8rem', color: 'var(--primary)', fontWeight: 600 }}
                >
                  Clear all
                </button>
              )}
            </div>

            {/* Sort by */}
            <div className="mb-6">
              <h4 style={{ fontSize: '0.85rem', fontWeight: 700, color: 'var(--text-main)', textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: '12px' }}>
                Sort by
              </h4>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                <label className="radio-option">
                  <input 
                    type="radio" 
                    name="sort" 
                    checked={sortBy === 'earliest'} 
                    onChange={() => setSortBy('earliest')} 
                  />
                  <span>Earliest departure</span>
                </label>
                <label className="radio-option">
                  <input 
                    type="radio" 
                    name="sort" 
                    checked={sortBy === 'price'} 
                    onChange={() => setSortBy('price')} 
                  />
                  <span>Lowest price</span>
                </label>
              </div>
            </div>

            {/* Departure Time */}
            <div className="mb-6" style={{ borderTop: '1px solid var(--border-light)', paddingTop: '16px' }}>
              <h4 style={{ fontSize: '0.85rem', fontWeight: 700, color: 'var(--text-main)', textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: '12px' }}>
                Departure Time
              </h4>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                <label className="checkbox-option">
                  <input 
                    type="checkbox" 
                    checked={filterTime.includes('morning')} 
                    onChange={() => handleTimeToggle('morning')} 
                  />
                  <span>Morning (Before 12:00)</span>
                </label>
                <label className="checkbox-option">
                  <input 
                    type="checkbox" 
                    checked={filterTime.includes('afternoon')} 
                    onChange={() => handleTimeToggle('afternoon')} 
                  />
                  <span>Afternoon (12:00 - 18:00)</span>
                </label>
                <label className="checkbox-option">
                  <input 
                    type="checkbox" 
                    checked={filterTime.includes('evening')} 
                    onChange={() => handleTimeToggle('evening')} 
                  />
                  <span>Evening (After 18:00)</span>
                </label>
              </div>
            </div>

            {/* Trust and Safety */}
            <div style={{ borderTop: '1px solid var(--border-light)', paddingTop: '16px' }}>
              <h4 style={{ fontSize: '0.85rem', fontWeight: 700, color: 'var(--text-main)', textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: '12px' }}>
                Trust & Amenities
              </h4>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                <label className="checkbox-option">
                  <input 
                    type="checkbox" 
                    checked={verifiedOnly} 
                    onChange={(e) => setVerifiedOnly(e.target.checked)} 
                  />
                  <span>Verified Profiles Only</span>
                </label>
                <label className="checkbox-option">
                  <input 
                    type="checkbox" 
                    checked={maxTwoBack} 
                    onChange={(e) => setMaxTwoBack(e.target.checked)} 
                  />
                  <span>Max 2 in rear seat</span>
                </label>
              </div>
            </div>

          </div>

          {/* Right Ride List Content */}
          <div>
            
            {/* Results Header */}
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline', marginBottom: '16px' }}>
              <div>
                <h2 className="heading-md" style={{ color: 'var(--text-main)' }}>
                  {from && to ? `${from} → ${to}` : 'Available Carpool Rides'}
                </h2>
                <p style={{ color: 'var(--text-muted)', fontSize: '0.875rem' }}>
                  {loading ? 'Searching...' : `${filteredRides.length} ride${filteredRides.length === 1 ? '' : 's'} available`}
                </p>
              </div>
            </div>

            {/* Content states */}
            {loading ? (
              <div className="card" style={{ padding: '60px 24px', textAlign: 'center' }}>
                <Loader2 size={44} className="text-primary spinner mx-auto mb-4" />
                <h3 className="heading-sm mb-2">Finding best carpool matches</h3>
                <p className="text-body">Comparing drivers, routes and lowest fares...</p>
              </div>
            ) : filteredRides.length > 0 ? (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                {filteredRides.map(ride => {
                  const rideDate = new Date(ride.date);
                  const arrDate = new Date(rideDate.getTime() + 3 * 60 * 60 * 1000);
                  const isFull = ride.seats < 1;

                  return (
                    <div
                      key={ride._id}
                      onClick={() => navigate(`/ride/${ride._id}`)}
                      className={`card ${isFull ? 'ride-full' : 'card-hover'}`}
                      style={{ 
                        padding: '24px 28px', 
                        cursor: 'pointer',
                        border: '1px solid var(--border-light)',
                        display: 'flex',
                        justifyContent: 'space-between',
                        alignItems: 'center',
                        gap: '24px',
                        transition: 'var(--transition)'
                      }}
                    >
                      {/* Left: Journey Timeline & Driver */}
                      <div style={{ flex: 1 }}>
                        
                        {/* Timeline */}
                        <div style={{ display: 'flex', alignItems: 'center', gap: '24px', marginBottom: '16px' }}>
                          
                          {/* Departure */}
                          <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                            <span style={{ fontSize: '1.25rem', fontWeight: 800, color: 'var(--text-main)' }}>
                              {rideDate.toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit', hour12: false })}
                            </span>
                            <div style={{ width: '12px', height: '12px', borderRadius: '50%', border: '2.5px solid var(--primary)', background: 'white' }}></div>
                            <span style={{ fontSize: '1.1rem', fontWeight: 700, color: 'var(--text-main)' }}>
                              {ride.from}
                            </span>
                          </div>

                          {/* Duration line */}
                          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', color: 'var(--text-muted)', fontSize: '0.8rem' }}>
                            <div style={{ width: '40px', height: '2px', background: 'var(--border)' }}></div>
                            <span>3h 00m</span>
                            <div style={{ width: '40px', height: '2px', background: 'var(--border)' }}></div>
                          </div>

                          {/* Arrival */}
                          <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                            <div style={{ width: '12px', height: '12px', borderRadius: '50%', border: '2.5px solid var(--dark-navy)', background: 'white' }}></div>
                            <span style={{ fontSize: '1.25rem', fontWeight: 800, color: 'var(--text-main)' }}>
                              {arrDate.toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit', hour12: false })}
                            </span>
                            <span style={{ fontSize: '1.1rem', fontWeight: 700, color: 'var(--text-main)' }}>
                              {ride.to}
                            </span>
                          </div>

                        </div>

                        {/* Driver & Badges */}
                        <div style={{ display: 'flex', alignItems: 'center', gap: '16px', flexWrap: 'wrap' }}>
                          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                            <img 
                              src={ride.driver?.picture || `https://ui-avatars.com/api/?name=${encodeURIComponent(ride.driver?.name || 'Driver')}&background=E8F0FE&color=0056D2&bold=true`}
                              alt={ride.driver?.name}
                              style={{ width: '36px', height: '36px', borderRadius: '50%', objectFit: 'cover' }}
                            />
                            <div>
                              <div style={{ fontWeight: 600, fontSize: '0.9rem', color: 'var(--text-main)' }}>
                                {ride.driver?.name || 'Verified Driver'}
                              </div>
                              <div style={{ display: 'flex', alignItems: 'center', gap: '4px', fontSize: '0.8rem', color: 'var(--text-muted)' }}>
                                <Star size={13} fill="#F59E0B" color="#F59E0B" />
                                <span style={{ fontWeight: 700, color: 'var(--text-main)' }}>4.9</span>
                                <span>(38)</span>
                              </div>
                            </div>
                          </div>

                          <div style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
                            <span className="badge badge-info" style={{ fontSize: '0.75rem', gap: '4px' }}>
                              <Sparkles size={12} /> Instant Booking
                            </span>
                            {ride.vehicle && (
                              <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)', display: 'flex', alignItems: 'center', gap: '4px' }}>
                                <Car size={14} /> {ride.vehicle}
                              </span>
                            )}
                          </div>
                        </div>

                      </div>

                      {/* Right: Price & CTA */}
                      <div style={{ textAlign: 'right', display: 'flex', flexDirection: 'column', alignItems: 'flex-end', gap: '8px', minWidth: '130px' }}>
                        <div style={{ fontSize: '1.6rem', fontWeight: 800, color: 'var(--text-main)' }}>
                          ₹{ride.price}
                        </div>
                        <div style={{ fontSize: '0.85rem', color: isFull ? 'var(--error)' : 'var(--text-muted)', fontWeight: 600 }}>
                          {isFull ? 'Fully Booked' : `${ride.seats} seat${ride.seats > 1 ? 's' : ''} left`}
                        </div>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '4px', color: 'var(--primary)', fontWeight: 700, fontSize: '0.9rem', marginTop: '4px' }}>
                          Details <ChevronRight size={18} />
                        </div>
                      </div>

                    </div>
                  );
                })}
              </div>
            ) : (
              <div className="card" style={{ padding: '60px 24px', textAlign: 'center' }}>
                <Car size={52} color="var(--primary)" className="mx-auto mb-4" style={{ opacity: 0.6 }} />
                <h3 className="heading-md mb-2">No direct rides found</h3>
                <p className="text-body mb-6" style={{ maxWidth: '420px', margin: '0 auto 24px' }}>
                  We couldn't find rides matching your exact criteria. Try changing the date or clearing filters.
                </p>
                <div style={{ display: 'flex', gap: '12px', justifyContent: 'center' }}>
                  <button onClick={clearFilters} className="btn btn-outline">
                    Reset Filters
                  </button>
                  <Link to="/offer" className="btn btn-primary">
                    Publish this route
                  </Link>
                </div>
              </div>
            )}

          </div>

        </div>
      </div>

    </div>
  );
}

export default SearchRides;
