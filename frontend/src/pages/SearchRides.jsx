import { useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import axios from 'axios';
import { MapPin, Calendar, Users, Clock, Loader2 } from 'lucide-react';

function SearchRides() {
  const [rides, setRides] = useState([]);
  const [loading, setLoading] = useState(true);
  const location = useLocation();
  const searchParams = new URLSearchParams(location.search);
  
  const from = searchParams.get('from') || '';
  const to = searchParams.get('to') || '';
  const date = searchParams.get('date') || '';
  const seats = searchParams.get('seats') || '';

  useEffect(() => {
    const fetchRides = async () => {
      try {
        setLoading(true);
        // Simulate network delay for realistic feel
        await new Promise(resolve => setTimeout(resolve, 800));
        
        const params = new URLSearchParams();
        if (from) params.append('from', from);
        if (to) params.append('to', to);
        if (date) params.append('date', date);
        if (seats) params.append('seats', seats);

        const response = await axios.get(`http://localhost:5000/api/rides?${params.toString()}`);
        setRides(response.data);
      } catch (error) {
        console.error('Error fetching rides', error);
      } finally {
        setLoading(false);
      }
    };

    fetchRides();
  }, [location.search, from, to, date, seats]);

  return (
    <div className="container py-20 animate-fade-in">
      <h2 className="title-lg mb-8">Available rides</h2>
      
      {/* Search summary */}
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
            <span>{seats || '1'} passenger(s)</span>
          </div>
        </div>
      </div>

      {loading ? (
        <div className="flex flex-col items-center justify-center py-20">
          <Loader2 size={48} className="text-primary animate-spin mb-4" style={{ animation: 'spin 1s linear infinite' }} />
          <p className="text-body">Searching for best rides...</p>
          <style>{`@keyframes spin { 100% { transform: rotate(360deg); } }`}</style>
        </div>
      ) : rides.length > 0 ? (
        <div className="flex flex-col gap-6">
          {rides.map(ride => (
            <div key={ride._id} className="card flex justify-between items-center" style={{ cursor: 'pointer' }}>
              <div className="flex-col gap-4">
                <div className="flex items-center gap-4 mb-4">
                  <span className="font-semibold text-lg">{new Date(ride.date).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}</span>
                  <div style={{ width: '12px', height: '12px', borderRadius: '50%', border: '2px solid var(--primary)', backgroundColor: 'white' }}></div>
                  <span className="font-medium">{ride.from}</span>
                </div>
                <div className="flex items-center gap-4">
                  <span className="font-semibold text-lg text-muted">&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;</span>
                  <div style={{ width: '12px', height: '12px', borderRadius: '50%', border: '2px solid var(--secondary)', backgroundColor: 'white' }}></div>
                  <span className="font-medium">{ride.to}</span>
                </div>
              </div>
              
              <div className="flex flex-col items-end gap-4">
                <span className="title-md font-bold text-primary">£{ride.price}</span>
                <div className="flex items-center gap-2 text-body">
                  <Users size={16} />
                  <span>{ride.seats} seats left</span>
                </div>
                <span className="text-sm font-medium">Driver: {ride.driver}</span>
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
    </div>
  );
}

export default SearchRides;
