import { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { MapPin, Calendar, Users, Loader2, CheckCircle2, X } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

function SearchRides() {
  const [rides, setRides] = useState([]);
  const [loading, setLoading] = useState(true);
  
  const [selectedRide, setSelectedRide] = useState(null);
  const [modalSeats, setModalSeats] = useState(1);
  const [isBooking, setIsBooking] = useState(false);
  const [bookingSuccess, setBookingSuccess] = useState(null);
  
  const { user, token } = useAuth();
  const location = useLocation();
  const navigate = useNavigate();
  const searchParams = new URLSearchParams(location.search);
  
  const from = searchParams.get('from') || '';
  const to = searchParams.get('to') || '';
  const date = searchParams.get('date') || '';
  const searchSeats = searchParams.get('seats') || '1';

  const fetchRides = async () => {
    try {
      setLoading(true);
      const params = new URLSearchParams();
      if (from) params.append('from', from);
      if (to) params.append('to', to);
      if (date) params.append('date', date);
      if (searchSeats) params.append('seats', searchSeats);

      const response = await axios.get(`http://localhost:5000/api/rides?${params.toString()}`);
      setRides(response.data.data || []);
    } catch (error) {
      console.error('Error fetching rides', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchRides();
  }, [location.search]);

  const openBookingModal = (ride) => {
    if (!user) {
      navigate('/login', { state: { from: location, message: 'You must log in to book a ride.' } });
      return;
    }
    setSelectedRide(ride);
    setModalSeats(parseInt(searchSeats) || 1);
  };

  const handleConfirmBook = async () => {
    if (!selectedRide) return;
    try {
      setIsBooking(true);
      await axios.post(
        `http://localhost:5000/api/bookings/${selectedRide._id}`, 
        { seats: modalSeats },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setBookingSuccess(selectedRide._id);
      setTimeout(() => setBookingSuccess(null), 3000);
      setSelectedRide(null);
      fetchRides(); // refresh available seats
    } catch (error) {
      alert(error.response?.data?.message || 'Error booking ride');
    } finally {
      setIsBooking(false);
    }
  };

  return (
    <div className="container py-20 animate-fade-in relative">
      <h2 className="title-lg mb-8">Available rides</h2>
      
      <div className="card mb-12 flex justify-between items-center" style={{ padding: '16px 32px' }}>
        <div className="flex items-center gap-6">
          <div className="flex items-center gap-2">
            <MapPin size={20} className="text-primary" />
            <span className="font-medium">{from || 'Anywhere'} &rarr; {to || 'Anywhere'}</span>
          </div>
          <div className="flex items-center gap-2">
            <Calendar size={20} className="text-primary" />
            <span>{date || 'Any date'}</span>
          </div>
          <div className="flex items-center gap-2">
            <Users size={20} className="text-primary" />
            <span>{searchSeats} passenger(s)</span>
          </div>
        </div>
      </div>

      {loading ? (
        <div className="flex flex-col items-center justify-center py-20">
          <Loader2 size={48} className="text-primary animate-spin mb-4" style={{ animation: 'spin 1s linear infinite' }} />
          <p className="text-body">Searching for best rides...</p>
        </div>
      ) : rides.length > 0 ? (
        <div className="flex flex-col gap-6">
          {rides.map(ride => (
            <div key={ride._id} className="card flex justify-between items-center" style={{ cursor: 'pointer' }}>
              <div className="flex-col gap-4">
                <div className="flex items-center gap-4 mb-4">
                  <span className="font-semibold text-lg">{new Date(ride.date).toLocaleTimeString('en-IN', {hour: '2-digit', minute:'2-digit'})}</span>
                  <div style={{ width: '12px', height: '12px', borderRadius: '50%', border: '2px solid var(--primary)', backgroundColor: 'white' }}></div>
                  <span className="font-medium">{ride.from}</span>
                </div>
                <div className="flex items-center gap-4">
                  <span className="font-semibold text-lg text-muted">&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;</span>
                  <div style={{ width: '12px', height: '12px', borderRadius: '50%', border: '2px solid var(--secondary)', backgroundColor: 'white' }}></div>
                  <span className="font-medium">{ride.to}</span>
                </div>
                {ride.driver && (
                  <div className="flex items-center gap-2 mt-4 text-sm font-medium text-muted">
                    {ride.driver.picture ? (
                      <img src={ride.driver.picture} alt={ride.driver.name} style={{ width: '24px', height: '24px', borderRadius: '50%', objectFit: 'cover' }} />
                    ) : (
                      <Users size={16} />
                    )}
                    <span>Driver: {ride.driver.name}</span>
                  </div>
                )}
              </div>
              
              <div className="flex flex-col items-end gap-4">
                <span className="title-md font-bold text-primary">₹{ride.price}</span>
                <div className="flex items-center gap-2 text-body mb-2">
                  <Users size={16} />
                  <span>{ride.seats} seats left</span>
                </div>
                {bookingSuccess === ride._id ? (
                  <button className="btn" style={{ backgroundColor: '#10B981', color: 'white' }} disabled>
                    <CheckCircle2 size={20} /> Booked!
                  </button>
                ) : (
                  <button 
                    className="btn btn-primary" 
                    onClick={() => openBookingModal(ride)}
                    disabled={ride.seats < 1}
                  >
                    {ride.seats < 1 ? 'Full' : 'Book Ride'}
                  </button>
                )}
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="card text-center py-20">
          <h3 className="title-md mb-2">No rides found</h3>
          <p className="text-body">Try adjusting your search criteria or check back later.</p>
        </div>
      )}

      {/* Booking Modal */}
      {selectedRide && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50" style={{ backgroundColor: 'rgba(0,0,0,0.5)', position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 1000 }}>
          <div className="bg-white rounded-2xl p-8 max-w-md w-full animate-fade-in shadow-xl m-4">
            <div className="flex justify-between items-center mb-6">
              <h3 className="title-md">Confirm Booking</h3>
              <button onClick={() => setSelectedRide(null)} className="text-gray-500 hover:text-gray-800">
                <X size={24} />
              </button>
            </div>
            
            <div className="mb-6 bg-gray-50 p-4 rounded-xl border border-gray-100">
              <div className="flex justify-between mb-2">
                <span className="text-gray-500">From</span>
                <span className="font-medium">{selectedRide.from}</span>
              </div>
              <div className="flex justify-between mb-2">
                <span className="text-gray-500">To</span>
                <span className="font-medium">{selectedRide.to}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-500">Price per seat</span>
                <span className="font-medium text-primary">₹{selectedRide.price}</span>
              </div>
            </div>

            <div className="mb-6">
              <label className="block text-sm font-medium text-gray-700 mb-2">How many seats do you need?</label>
              <input 
                type="number" 
                min="1" 
                max={selectedRide.seats} 
                value={modalSeats}
                onChange={(e) => setModalSeats(parseInt(e.target.value) || 1)}
                className="input-field w-full"
                style={{ width: '100%', padding: '12px', border: '1px solid #E5E7EB', borderRadius: '8px' }}
              />
              <p className="text-xs text-gray-500 mt-2">Maximum available: {selectedRide.seats}</p>
            </div>

            <div className="flex justify-between items-center mb-8 border-t border-gray-100 pt-4">
              <span className="text-lg font-medium">Total Price:</span>
              <span className="title-md text-primary font-bold">₹{selectedRide.price * modalSeats}</span>
            </div>

            <div className="flex gap-4">
              <button 
                className="btn border border-gray-300 flex-1 hover:bg-gray-50 text-gray-700"
                onClick={() => setSelectedRide(null)}
              >
                Cancel
              </button>
              <button 
                className="btn btn-primary flex-1 flex justify-center"
                onClick={handleConfirmBook}
                disabled={isBooking || modalSeats > selectedRide.seats || modalSeats < 1}
              >
                {isBooking ? <Loader2 size={20} className="animate-spin" /> : 'Confirm Booking'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default SearchRides;
