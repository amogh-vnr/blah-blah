import { useState } from 'react';
import axios from 'axios';
import { useAuth } from '../context/AuthContext';
import { X, Star, CheckCircle2, AlertCircle, Loader2 } from 'lucide-react';

function ReviewModal({ isOpen, onClose, ride, reviewee, onSuccess }) {
  const { token } = useAuth();
  const [rating, setRating] = useState(5);
  const [hoverRating, setHoverRating] = useState(0);
  const [selectedTags, setSelectedTags] = useState(['Safe Driver', 'Punctual']);
  const [comment, setComment] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);

  if (!isOpen || !ride || !reviewee) return null;

  const availableTags = [
    'Punctual',
    'Safe Driver',
    'Clean Car',
    'Friendly',
    'Great Conversations',
    'Smooth Highway Ride',
    'Comfortable AC'
  ];

  const toggleTag = (tag) => {
    setSelectedTags(prev => 
      prev.includes(tag) ? prev.filter(t => t !== tag) : [...prev, tag]
    );
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    try {
      setLoading(true);
      await axios.post(
        'http://localhost:5000/api/reviews',
        {
          rideId: ride._id,
          revieweeId: reviewee._id,
          rating,
          tags: selectedTags,
          comment: comment.trim()
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
      setError(err.response?.data?.message || 'Failed to submit review');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content animate-slide-up" style={{ maxWidth: '440px' }} onClick={(e) => e.stopPropagation()}>
        
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
          <div>
            <span className="badge badge-success" style={{ marginBottom: '4px' }}>Community Trust</span>
            <h3 className="heading-sm" style={{ margin: 0 }}>Review Your Carpool Trip</h3>
          </div>
          <button onClick={onClose} className="btn-icon">
            <X size={20} />
          </button>
        </div>

        {success ? (
          <div style={{ textAlign: 'center', padding: '30px 10px' }}>
            <CheckCircle2 size={56} color="var(--success)" style={{ margin: '0 auto 16px' }} />
            <h3 className="heading-sm mb-2" style={{ color: '#065F46' }}>Review Published!</h3>
            <p className="text-body" style={{ fontSize: '0.9rem' }}>
              Thank you for helping keep the BlahBlahCar community verified and accountable.
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

            {/* User being reviewed */}
            <div style={{ display: 'flex', alignItems: 'center', gap: '12px', background: 'var(--bg-page)', padding: '12px 16px', borderRadius: '12px' }}>
              <img 
                src={reviewee.picture || `https://ui-avatars.com/api/?name=${encodeURIComponent(reviewee.name)}&background=0056D2&color=fff`}
                alt={reviewee.name}
                style={{ width: '40px', height: '40px', borderRadius: '50%', objectFit: 'cover' }}
              />
              <div>
                <div style={{ fontWeight: 700, fontSize: '0.95rem' }}>{reviewee.name}</div>
                <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>{ride.from} ➔ {ride.to}</div>
              </div>
            </div>

            {/* Star Rating */}
            <div style={{ textAlign: 'center' }}>
              <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 600, color: 'var(--text-main)', marginBottom: '8px' }}>
                How was your experience?
              </label>
              <div style={{ display: 'flex', gap: '8px', justifyContent: 'center' }}>
                {[1, 2, 3, 4, 5].map((star) => {
                  const isFilled = (hoverRating || rating) >= star;
                  return (
                    <button
                      key={star}
                      type="button"
                      onMouseEnter={() => setHoverRating(star)}
                      onMouseLeave={() => setHoverRating(0)}
                      onClick={() => setRating(star)}
                      style={{ cursor: 'pointer', background: 'none', border: 'none', padding: '4px' }}
                    >
                      <Star 
                        size={32} 
                        fill={isFilled ? '#F59E0B' : 'transparent'} 
                        color={isFilled ? '#F59E0B' : '#D1D5DB'} 
                        style={{ transition: 'all 0.15s' }}
                      />
                    </button>
                  );
                })}
              </div>
              <div style={{ fontSize: '0.85rem', fontWeight: 700, color: '#D97706', marginTop: '6px' }}>
                {rating === 5 ? 'Excellent journey' : rating === 4 ? 'Very good' : rating === 3 ? 'Average' : 'Could be better'}
              </div>
            </div>

            {/* Compliments / Tags */}
            <div>
              <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 600, color: 'var(--text-main)', marginBottom: '8px' }}>
                What did you like most?
              </label>
              <div style={{ display: 'flex', gap: '6px', flexWrap: 'wrap' }}>
                {availableTags.map((tag) => {
                  const isSelected = selectedTags.includes(tag);
                  return (
                    <button
                      key={tag}
                      type="button"
                      onClick={() => toggleTag(tag)}
                      style={{
                        padding: '6px 12px',
                        borderRadius: '16px',
                        fontSize: '0.75rem',
                        fontWeight: 600,
                        border: isSelected ? '1px solid var(--primary)' : '1px solid var(--border)',
                        background: isSelected ? 'var(--primary-lightest)' : 'white',
                        color: isSelected ? 'var(--primary)' : 'var(--text-secondary)',
                        cursor: 'pointer',
                        transition: 'all 0.2s'
                      }}
                    >
                      {tag}
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Comment */}
            <div className="input-group">
              <label htmlFor="reviewComment">Written feedback (Optional)</label>
              <textarea 
                id="reviewComment"
                placeholder="Share helpful details for future carpoolers..."
                value={comment}
                onChange={(e) => setComment(e.target.value)}
                className="input-field"
                rows="3"
                style={{ resize: 'none' }}
              />
            </div>

            <button 
              type="submit" 
              className="btn btn-primary btn-full"
              disabled={loading}
            >
              {loading ? <Loader2 size={18} className="spinner" /> : 'Submit Review'}
            </button>

          </form>
        )}

      </div>
    </div>
  );
}

export default ReviewModal;
