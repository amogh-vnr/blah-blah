import { useState } from 'react';
import axios from 'axios';
import { useAuth } from '../context/AuthContext';
import { X, MapPin, Calendar, Users, DollarSign, CheckCircle2, AlertCircle, Loader2 } from 'lucide-react';

function RideRequestModal({ isOpen, onClose, initialFrom = '', initialTo = '', onSuccess }) {
  const { token, user } = useAuth();
  
  const getDefaultDate = () => {
    const d = new Date();
    d.setDate(d.getDate() + 1);
    d.setHours(9, 0, 0, 0);
    return d.toISOString().slice(0, 16);
  };

  const [from, setFrom] = useState(initialFrom);
  const [to, setTo] = useState(initialTo);
  const [date, setDate] = useState(getDefaultDate());
  const [seats, setSeats] = useState(1);
  const [maxBudget, setMaxBudget] = useState(400);
  const [notes, setNotes] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);

  if (!isOpen) return null;

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    if (!from.trim() || !to.trim()) {
      setError('Please provide origin and destination.');
      return;
    }

    try {
      setLoading(true);
      await axios.post(
        'http://localhost:5000/api/requests',
        {
          from: from.trim(),
          to: to.trim(),
          date: new Date(date).toISOString(),
          seats: Number(seats),
          maxBudget: Number(maxBudget),
          notes: notes.trim()
        },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setSuccess(true);
      if (onSuccess) onSuccess();
      setTimeout(() => {
        setSuccess(false);
        onClose();
      }, 1800);
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to submit ride request');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content animate-slide-up" style={{ maxWidth: '480px' }} onClick={(e) => e.stopPropagation()}>
        
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
          <div>
            <span className="badge badge-info" style={{ marginBottom: '4px' }}>Community Request</span>
            <h3 className="heading-sm" style={{ margin: 0 }}>Post a "Looking for Ride" Request</h3>
          </div>
          <button onClick={onClose} className="btn-icon">
            <X size={20} />
          </button>
        </div>

        {success ? (
          <div style={{ textAlign: 'center', padding: '30px 10px' }}>
            <CheckCircle2 size={56} color="var(--success)" style={{ margin: '0 auto 16px' }} />
            <h3 className="heading-sm mb-2" style={{ color: '#065F46' }}>Request Published to Board!</h3>
            <p className="text-body" style={{ fontSize: '0.9rem' }}>
              Drivers heading from <strong>{from}</strong> to <strong>{to}</strong> will see your request and can offer you empty seats.
            </p>
          </div>
        ) : (
          <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
            
            {error && (
              <div style={{ display: 'flex', alignItems: 'center', gap: '10px', background: 'var(--error-light)', color: 'var(--error)', padding: '12px 16px', borderRadius: '10px', fontSize: '0.85rem' }}>
                <AlertCircle size={18} />
                <span>{error}</span>
              </div>
            )}

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
              <div className="input-group">
                <label htmlFor="reqFrom">Leaving from</label>
                <input 
                  type="text"
                  id="reqFrom"
                  placeholder="e.g. Mumbai (Thane)"
                  value={from}
                  onChange={(e) => setFrom(e.target.value)}
                  className="input-field"
                  required
                />
              </div>

              <div className="input-group">
                <label htmlFor="reqTo">Going to</label>
                <input 
                  type="text"
                  id="reqTo"
                  placeholder="e.g. Pune"
                  value={to}
                  onChange={(e) => setTo(e.target.value)}
                  className="input-field"
                  required
                />
              </div>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1.2fr 0.8fr', gap: '12px' }}>
              <div className="input-group">
                <label htmlFor="reqDate">Preferred Date & Time</label>
                <input 
                  type="datetime-local"
                  id="reqDate"
                  value={date}
                  onChange={(e) => setDate(e.target.value)}
                  className="input-field"
                  required
                />
              </div>

              <div className="input-group">
                <label htmlFor="reqSeats">Seats needed</label>
                <select
                  id="reqSeats"
                  value={seats}
                  onChange={(e) => setSeats(Number(e.target.value))}
                  className="input-field"
                >
                  <option value="1">1 Passenger</option>
                  <option value="2">2 Passengers</option>
                  <option value="3">3 Passengers</option>
                  <option value="4">4 Passengers</option>
                </select>
              </div>
            </div>

            <div className="input-group">
              <label htmlFor="maxBudget">Max Budget Per Seat (INR)</label>
              <div style={{ position: 'relative', display: 'flex', alignItems: 'center' }}>
                <span style={{ position: 'absolute', left: '16px', fontWeight: 800, color: 'var(--primary)' }}>₹</span>
                <input 
                  type="number"
                  id="maxBudget"
                  min="50"
                  step="10"
                  value={maxBudget}
                  onChange={(e) => setMaxBudget(Number(e.target.value))}
                  className="input-field"
                  style={{ paddingLeft: '38px', fontWeight: 700 }}
                  required
                />
              </div>
            </div>

            <div className="input-group">
              <label htmlFor="reqNotes">Notes (Luggage, Pickup landmark, Preferences)</label>
              <textarea 
                id="reqNotes"
                placeholder="e.g. 1 trolley bag. Flexible by 30 mins. Ladies only carpool preferred."
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                className="input-field"
                rows="2"
                style={{ resize: 'none' }}
              />
            </div>

            <div style={{ display: 'flex', gap: '12px', marginTop: '6px' }}>
              <button 
                type="button" 
                onClick={onClose} 
                className="btn btn-outline"
                style={{ flex: 1 }}
              >
                Cancel
              </button>
              <button 
                type="submit" 
                className="btn btn-primary"
                style={{ flex: 1 }}
                disabled={loading}
              >
                {loading ? <Loader2 size={18} className="spinner" /> : 'Post Request'}
              </button>
            </div>

          </form>
        )}

      </div>
    </div>
  );
}

export default RideRequestModal;
