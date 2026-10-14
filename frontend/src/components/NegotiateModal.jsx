import { useState } from 'react';
import axios from 'axios';
import { useAuth } from '../context/AuthContext';
import { X, DollarSign, Sparkles, AlertCircle, CheckCircle2, Loader2, ArrowRight } from 'lucide-react';

function NegotiateModal({ isOpen, onClose, ride, onSuccess }) {
  const { token, user } = useAuth();
  const [proposedPrice, setProposedPrice] = useState(ride ? Math.round(ride.price * 0.85) : 300);
  const [seats, setSeats] = useState(1);
  const [message, setMessage] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);

  if (!isOpen || !ride) return null;

  const originalTotal = ride.price * seats;
  const proposedTotal = proposedPrice * seats;
  const savings = originalTotal - proposedTotal;

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    if (proposedPrice <= 0) {
      setError('Please propose a price greater than 0.');
      return;
    }

    if (proposedPrice >= ride.price) {
      setError(`Your offer must be lower than the asking price of ₹${ride.price}. Otherwise, use standard booking!`);
      return;
    }

    try {
      setLoading(true);
      await axios.post(
        'http://localhost:5000/api/negotiations',
        {
          rideId: ride._id,
          proposedPrice: Number(proposedPrice),
          seats: Number(seats),
          message: message.trim()
        },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setSuccess(true);
      if (onSuccess) onSuccess();
      setTimeout(() => {
        setSuccess(false);
        onClose();
      }, 2000);
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to submit negotiation offer');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content animate-slide-up" onClick={(e) => e.stopPropagation()}>
        
        {/* Header */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
          <div>
            <span className="badge badge-info" style={{ marginBottom: '4px' }}>Make an Offer</span>
            <h3 className="heading-md" style={{ margin: 0 }}>Negotiate Ride Fare</h3>
          </div>
          <button onClick={onClose} className="btn-icon">
            <X size={20} />
          </button>
        </div>

        {success ? (
          <div style={{ textAlign: 'center', padding: '30px 10px' }}>
            <CheckCircle2 size={56} color="var(--success)" style={{ margin: '0 auto 16px' }} />
            <h3 className="heading-sm mb-2" style={{ color: '#065F46' }}>Offer Sent to Driver!</h3>
            <p className="text-body" style={{ fontSize: '0.9rem' }}>
              {ride.driver?.name} has received your proposal of <strong>₹{proposedPrice}/seat</strong>. You will be notified on your Dashboard once accepted.
            </p>
          </div>
        ) : (
          <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
            
            {error && (
              <div style={{ display: 'flex', alignItems: 'center', gap: '10px', background: 'var(--error-light)', color: 'var(--error)', padding: '12px 16px', borderRadius: '10px', fontSize: '0.85rem' }}>
                <AlertCircle size={18} />
                <span>{error}</span>
              </div>
            )}

            {/* Trip summary */}
            <div style={{ background: 'var(--bg-page)', padding: '16px', borderRadius: '12px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <div>
                <div style={{ fontWeight: 700, color: 'var(--text-main)', fontSize: '0.95rem' }}>
                  {ride.from} &rarr; {ride.to}
                </div>
                <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>
                  Driver: {ride.driver?.name} &bull; Asking price: ₹{ride.price}/seat
                </div>
              </div>
              <div style={{ textAlign: 'right' }}>
                <span className="badge badge-info">{ride.seats} seats open</span>
              </div>
            </div>

            {/* Price Offer Input */}
            <div className="input-group">
              <label htmlFor="proposedPrice">Your Proposed Price Per Seat (INR)</label>
              <div style={{ position: 'relative', display: 'flex', alignItems: 'center' }}>
                <span style={{ position: 'absolute', left: '16px', fontWeight: 800, color: 'var(--primary)' }}>₹</span>
                <input 
                  type="number"
                  id="proposedPrice"
                  min="50"
                  max={ride.price - 10}
                  step="10"
                  value={proposedPrice}
                  onChange={(e) => setProposedPrice(Number(e.target.value))}
                  className="input-field"
                  style={{ paddingLeft: '38px', fontSize: '1.2rem', fontWeight: 700 }}
                  required
                />
              </div>
              <div style={{ display: 'flex', gap: '6px', marginTop: '6px' }}>
                {[0.8, 0.85, 0.9].map((ratio) => {
                  const quickVal = Math.round((ride.price * ratio) / 10) * 10;
                  return (
                    <button
                      key={ratio}
                      type="button"
                      onClick={() => setProposedPrice(quickVal)}
                      style={{
                        padding: '4px 10px',
                        borderRadius: '12px',
                        border: proposedPrice === quickVal ? '1px solid var(--primary)' : '1px solid var(--border)',
                        background: proposedPrice === quickVal ? 'var(--primary-lightest)' : 'white',
                        fontSize: '0.75rem',
                        fontWeight: 600,
                        color: proposedPrice === quickVal ? 'var(--primary)' : 'var(--text-main)',
                        cursor: 'pointer'
                      }}
                    >
                      ₹{quickVal} ({Math.round((1 - ratio) * 100)}% off)
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Seats Count */}
            <div className="input-group">
              <label htmlFor="negotiateSeats">Seats requested</label>
              <select
                id="negotiateSeats"
                value={seats}
                onChange={(e) => setSeats(Number(e.target.value))}
                className="input-field"
              >
                {[...Array(Math.min(ride.seats, 4))].map((_, idx) => (
                  <option key={idx + 1} value={idx + 1}>
                    {idx + 1} Seat{idx > 0 ? 's' : ''}
                  </option>
                ))}
              </select>
            </div>

            {/* Note to Driver */}
            <div className="input-group">
              <label htmlFor="message">Message to Driver (Optional)</label>
              <textarea 
                id="message"
                placeholder="e.g. Can meet you right at the highway entrance to save time!"
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                className="input-field"
                rows="2"
                style={{ resize: 'none' }}
              />
            </div>

            {/* Offer Summary & Savings */}
            <div style={{ background: 'linear-gradient(135deg, #ECFDF5 0%, #D1FAE5 100%)', border: '1px solid #A7F3D0', padding: '16px', borderRadius: '12px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <div>
                <div style={{ fontSize: '0.8rem', color: '#065F46', fontWeight: 600 }}>Total Counter Offer:</div>
                <div style={{ fontSize: '1.4rem', fontWeight: 800, color: '#047857' }}>₹{proposedTotal}</div>
              </div>
              <div style={{ textAlign: 'right' }}>
                <div style={{ fontSize: '0.75rem', color: '#065F46', textDecoration: 'line-through' }}>Original: ₹{originalTotal}</div>
                <div style={{ fontSize: '0.85rem', fontWeight: 700, color: '#059669' }}>
                  {savings > 0 ? `You Save ₹${savings}` : ''}
                </div>
              </div>
            </div>

            {/* Action buttons */}
            <div style={{ display: 'flex', gap: '12px' }}>
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
                {loading ? <Loader2 size={18} className="spinner" /> : 'Send Offer'}
              </button>
            </div>

          </form>
        )}

      </div>
    </div>
  );
}

export default NegotiateModal;
