import { useState, useEffect } from 'react';
import axios from 'axios';
import { useAuth } from '../context/AuthContext';
import { MapPin, Calendar, Users, Loader2, Car, Navigation } from 'lucide-react';

function Dashboard() {
  const { token, user } = useAuth();
  const [bookings, setBookings] = useState([]);
  const [publishedRides, setPublishedRides] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('bookings');

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const [bookingsRes, ridesRes] = await Promise.all([
          axios.get('http://localhost:5000/api/bookings', { headers: { Authorization: `Bearer ${token}` } }),
          axios.get('http://localhost:5000/api/rides/mine', { headers: { Authorization: `Bearer ${token}` } })
        ]);
        setBookings(bookingsRes.data.data);
        setPublishedRides(ridesRes.data.data);
      } catch (error) {
        console.error('Failed to fetch dashboard data', error);
      } finally {
        setLoading(false);
      }
    };
    if (token) fetchData();
  }, [token]);

  return (
    <div className="container py-12 animate-fade-in">
      <div className="mb-8 flex items-center gap-6 p-8 bg-white rounded-[24px] border border-gray-200">
        <img 
          src={user?.picture || `https://ui-avatars.com/api/?name=${user?.name}`} 
          alt={user?.name} 
          className="w-24 h-24 rounded-full border-4 border-gray-50"
          style={{ width: '96px', height: '96px', objectFit: 'cover' }}
        />
        <div>
          <h1 className="title-md">Welcome back, {user?.name}</h1>
          <p className="text-body">{user?.email}</p>
        </div>
      </div>

      <div className="flex gap-4 mb-8 border-b border-gray-200 pb-2">
        <button 
          onClick={() => setActiveTab('bookings')}
          className={`title-md pb-2 px-4 ${activeTab === 'bookings' ? 'text-primary border-b-2 border-primary' : 'text-gray-400'}`}
          style={{ transition: 'all 0.2s' }}
        >
          My Bookings
        </button>
        <button 
          onClick={() => setActiveTab('published')}
          className={`title-md pb-2 px-4 ${activeTab === 'published' ? 'text-primary border-b-2 border-primary' : 'text-gray-400'}`}
          style={{ transition: 'all 0.2s' }}
        >
          Published Rides
        </button>
      </div>
      
      {loading ? (
        <div className="flex justify-center py-12">
          <Loader2 size={48} className="text-primary animate-spin" />
        </div>
      ) : activeTab === 'bookings' ? (
        bookings.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6" style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(350px, 1fr))', gap: '24px' }}>
            {bookings.map(booking => (
              <div key={booking._id} className="card">
                <div className="flex justify-between items-start mb-6">
                  <div>
                    <span className="inline-block px-3 py-1 bg-green-100 text-green-700 text-xs font-bold rounded-full uppercase tracking-wider mb-2">
                      {booking.status}
                    </span>
                    <div className="font-semibold text-lg">{new Date(booking.ride.date).toLocaleDateString('en-IN', { weekday: 'long', day: 'numeric', month: 'long' })}</div>
                  </div>
                  <div className="text-right">
                    <div className="font-bold text-primary text-xl">₹{booking.ride.price * booking.seatsBooked}</div>
                    <div className="text-sm text-gray-500">{booking.seatsBooked} seats</div>
                  </div>
                </div>
                
                <div className="flex flex-col gap-4 mb-6 relative">
                  <div className="absolute left-[7px] top-[14px] bottom-[14px] w-[2px] bg-gray-200"></div>
                  <div className="flex items-start gap-4 relative z-10">
                    <div className="w-4 h-4 rounded-full border-4 border-primary bg-white mt-1"></div>
                    <div><div className="font-medium">{booking.ride.from}</div></div>
                  </div>
                  <div className="flex items-start gap-4 relative z-10">
                    <div className="w-4 h-4 rounded-full border-4 border-secondary bg-white mt-1"></div>
                    <div><div className="font-medium">{booking.ride.to}</div></div>
                  </div>
                </div>

                <div className="pt-4 border-t border-gray-100 flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    {booking.ride.driver?.picture ? (
                      <img src={booking.ride.driver.picture} className="w-8 h-8 rounded-full" style={{ width: '32px', height: '32px' }} />
                    ) : (
                      <div className="w-8 h-8 rounded-full bg-gray-200 flex items-center justify-center">
                        <Users size={16} className="text-gray-500" />
                      </div>
                    )}
                    <span className="text-sm font-medium text-gray-700">Driver: {booking.ride.driver?.name}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="card text-center py-16">
            <Car size={48} className="mx-auto text-gray-300 mb-4" />
            <h3 className="title-md mb-2">No bookings yet</h3>
            <p className="text-body">You haven't booked any rides. Why not find one now?</p>
          </div>
        )
      ) : (
        publishedRides.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6" style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(350px, 1fr))', gap: '24px' }}>
            {publishedRides.map(ride => (
              <div key={ride._id} className="card">
                <div className="flex justify-between items-start mb-6">
                  <div>
                    <span className="inline-block px-3 py-1 bg-blue-100 text-blue-700 text-xs font-bold rounded-full uppercase tracking-wider mb-2">
                      Published
                    </span>
                    <div className="font-semibold text-lg">{new Date(ride.date).toLocaleDateString('en-IN', { weekday: 'long', day: 'numeric', month: 'long' })}</div>
                  </div>
                  <div className="text-right">
                    <div className="font-bold text-primary text-xl">₹{ride.price} / seat</div>
                    <div className="text-sm text-gray-500">{ride.seats} seats total</div>
                  </div>
                </div>
                
                <div className="flex flex-col gap-4 mb-6 relative">
                  <div className="absolute left-[7px] top-[14px] bottom-[14px] w-[2px] bg-gray-200"></div>
                  <div className="flex items-start gap-4 relative z-10">
                    <div className="w-4 h-4 rounded-full border-4 border-primary bg-white mt-1"></div>
                    <div><div className="font-medium">{ride.from}</div></div>
                  </div>
                  <div className="flex items-start gap-4 relative z-10">
                    <div className="w-4 h-4 rounded-full border-4 border-secondary bg-white mt-1"></div>
                    <div><div className="font-medium">{ride.to}</div></div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="card text-center py-16">
            <Navigation size={48} className="mx-auto text-gray-300 mb-4" />
            <h3 className="title-md mb-2">No published rides</h3>
            <p className="text-body">You haven't published any rides yet. Offer a ride to save on travel costs!</p>
          </div>
        )
      )}
    </div>
  );
}

export default Dashboard;
