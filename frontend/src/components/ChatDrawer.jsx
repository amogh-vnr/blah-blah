import { useState, useEffect, useRef } from 'react';
import axios from 'axios';
import { useAuth } from '../context/AuthContext';
import { 
  X, Send, Phone, MessageSquare, Clock, ShieldCheck, 
  ExternalLink, Sparkles, AlertCircle 
} from 'lucide-react';

function ChatDrawer({ isOpen, onClose, ride, otherUser }) {
  const { token, user } = useAuth();
  const [messages, setMessages] = useState([]);
  const [inputText, setInputText] = useState('');
  const [loading, setLoading] = useState(false);
  const messagesEndRef = useRef(null);

  const quickChips = [
    'Where is the exact pickup landmark?',
    'I have 1 medium suitcase with me.',
    'Running 5 minutes late!',
    'Arrived at the boarding location.',
    'Which color is your vehicle?'
  ];

  const fetchMessages = async () => {
    if (!ride?._id || !token) return;
    try {
      const res = await axios.get(`http://localhost:5000/api/messages/ride/${ride._id}`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setMessages(res.data.data || []);
    } catch (err) {
      console.error('Error fetching messages', err);
    }
  };

  useEffect(() => {
    if (isOpen && ride?._id) {
      fetchMessages();
      const interval = setInterval(fetchMessages, 3000);
      return () => clearInterval(interval);
    }
  }, [isOpen, ride?._id]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const handleSend = async (textToSend) => {
    const content = textToSend || inputText;
    const recipientId = otherUser?._id || otherUser?.id || (typeof otherUser === 'string' ? otherUser : null);

    if (!token) {
      alert('Please log in to send messages.');
      return;
    }

    if (!content.trim() || !recipientId) return;

    try {
      setLoading(true);
      await axios.post(
        'http://localhost:5000/api/messages',
        {
          rideId: ride._id,
          recipientId,
          text: content.trim(),
          quickAction: textToSend ? content.trim() : ''
        },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setInputText('');
      fetchMessages();
    } catch (err) {
      const errorMsg = typeof err.response?.data === 'string' 
        ? err.response?.data?.message || 'Failed to send message'
        : err.response?.data?.message;
      alert(errorMsg || 'Failed to send message');
    } finally {
      setLoading(false);
    }
  };

  if (!isOpen) return null;

  const cleanPhone = (otherUser?.phone || '+91 98765 43210').replace(/[^0-9+]/g, '');

  return (
    <div 
      style={{
        position: 'fixed',
        inset: 0,
        backgroundColor: 'rgba(0,0,0,0.4)',
        zIndex: 1000,
        display: 'flex',
        justifyContent: 'flex-end',
        backdropFilter: 'blur(2px)'
      }}
      onClick={onClose}
    >
      <div 
        style={{
          width: '100%',
          maxWidth: '460px',
          height: '100%',
          backgroundColor: 'white',
          display: 'flex',
          flexDirection: 'column',
          boxShadow: 'var(--shadow-lg)',
          animation: 'slideInRight 0.3s ease'
        }}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Drawer Header */}
        <div style={{ padding: '20px 24px', borderBottom: '1px solid var(--border-light)', display: 'flex', alignItems: 'center', justifyContent: 'space-between', backgroundColor: 'var(--bg-page)' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
            <img 
              src={otherUser?.picture || `https://ui-avatars.com/api/?name=${encodeURIComponent(otherUser?.name || 'User')}&background=0056D2&color=fff`} 
              alt={otherUser?.name}
              style={{ width: '42px', height: '42px', borderRadius: '50%', objectFit: 'cover' }}
            />
            <div>
              <div style={{ fontWeight: 700, fontSize: '1rem', color: 'var(--text-main)', display: 'flex', alignItems: 'center', gap: '6px' }}>
                {otherUser?.name || 'Verified Member'}
                <ShieldCheck size={16} color="var(--success)" />
              </div>
              <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>
                {ride ? `${ride.from} ➔ ${ride.to}` : 'Carpool Conversation'}
              </div>
            </div>
          </div>

          <button onClick={onClose} className="btn-icon">
            <X size={20} />
          </button>
        </div>

        {/* Direct Contact Action Bar */}
        <div style={{ padding: '12px 20px', background: 'var(--primary-lightest)', borderBottom: '1px solid var(--border-light)', display: 'flex', gap: '10px' }}>
          <a 
            href={`tel:${cleanPhone}`}
            className="btn btn-outline btn-sm"
            style={{ flex: 1, padding: '8px 12px', fontSize: '0.85rem', gap: '6px', justifyContent: 'center' }}
          >
            <Phone size={14} /> Call Driver
          </a>
          <a 
            href={`https://wa.me/${cleanPhone.replace('+', '')}?text=${encodeURIComponent(`Hi! Regarding our BlahBlahCar ride ${ride?.from} to ${ride?.to}:`)}`}
            target="_blank"
            rel="noopener noreferrer"
            className="btn btn-sm"
            style={{ flex: 1, padding: '8px 12px', fontSize: '0.85rem', gap: '6px', justifyContent: 'center', background: '#25D366', color: 'white' }}
          >
            WhatsApp <ExternalLink size={13} />
          </a>
        </div>

        {/* Message Thread */}
        <div style={{ flex: 1, overflowY: 'auto', padding: '20px', display: 'flex', flexDirection: 'column', gap: '14px', backgroundColor: '#F9FAFB' }}>
          {messages.length === 0 ? (
            <div style={{ textAlign: 'center', margin: 'auto', color: 'var(--text-muted)' }}>
              <MessageSquare size={36} color="var(--primary)" style={{ opacity: 0.5, margin: '0 auto 12px' }} />
              <div style={{ fontWeight: 600, color: 'var(--text-main)', marginBottom: '4px' }}>No messages yet</div>
              <p style={{ fontSize: '0.85rem', maxWidth: '280px', margin: '0 auto' }}>
                Coordinate exact pickup points, luggage questions, or timing updates with {otherUser?.name}.
              </p>
            </div>
          ) : (
            messages.map((msg) => {
              const isMine = msg.sender?._id === user?._id || msg.sender === user?._id;
              const timeStr = new Date(msg.createdAt).toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit', hour12: true });

              return (
                <div 
                  key={msg._id}
                  style={{
                    alignSelf: isMine ? 'flex-end' : 'flex-start',
                    maxWidth: '80%',
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: isMine ? 'flex-end' : 'flex-start'
                  }}
                >
                  <div 
                    style={{
                      padding: '12px 16px',
                      borderRadius: isMine ? '18px 18px 4px 18px' : '18px 18px 18px 4px',
                      backgroundColor: isMine ? 'var(--primary)' : 'white',
                      color: isMine ? 'white' : 'var(--text-main)',
                      boxShadow: 'var(--shadow-sm)',
                      border: isMine ? 'none' : '1px solid var(--border-light)',
                      fontSize: '0.925rem',
                      lineHeight: 1.4
                    }}
                  >
                    {msg.text}
                  </div>
                  <span style={{ fontSize: '0.7rem', color: 'var(--text-muted)', marginTop: '4px', padding: '0 4px' }}>
                    {timeStr}
                  </span>
                </div>
              );
            })
          )}
          <div ref={messagesEndRef} />
        </div>

        {/* Quick Suggestion Chips */}
        <div style={{ padding: '10px 16px', borderTop: '1px solid var(--border-light)', display: 'flex', gap: '8px', overflowX: 'auto', backgroundColor: 'white' }}>
          {quickChips.map((chip, idx) => (
            <button
              key={idx}
              type="button"
              onClick={() => handleSend(chip)}
              style={{
                background: 'var(--bg-page)',
                border: '1px solid var(--border-light)',
                borderRadius: '16px',
                padding: '6px 12px',
                fontSize: '0.775rem',
                color: 'var(--text-main)',
                whiteSpace: 'nowrap',
                cursor: 'pointer',
                fontWeight: 500,
                transition: 'all 0.2s'
              }}
            >
              {chip}
            </button>
          ))}
        </div>

        {/* Chat Input Form */}
        <div style={{ padding: '16px', borderTop: '1px solid var(--border-light)', backgroundColor: 'white' }}>
          <form 
            onSubmit={(e) => { e.preventDefault(); handleSend(); }}
            style={{ display: 'flex', gap: '8px' }}
          >
            <input 
              type="text"
              placeholder={`Message ${otherUser?.name || 'driver'}...`}
              value={inputText}
              onChange={(e) => setInputText(e.target.value)}
              className="input-field"
              style={{ padding: '12px 16px', fontSize: '0.9rem' }}
            />
            <button 
              type="submit" 
              className="btn btn-primary"
              disabled={loading || !inputText.trim()}
              style={{ padding: '0 20px', borderRadius: '12px' }}
            >
              <Send size={18} />
            </button>
          </form>
        </div>

      </div>
    </div>
  );
}

export default ChatDrawer;
