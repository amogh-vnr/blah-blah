import { useState } from 'react';
import { X, CheckCircle2, QrCode, Smartphone, Copy, Check } from 'lucide-react';

function UpiPaymentModal({ isOpen, onClose, amount, driverName, tripRoute }) {
  const [copied, setCopied] = useState(false);
  const [isPaid, setIsPaid] = useState(false);

  if (!isOpen) return null;

  const upiId = `${(driverName || 'driver').toLowerCase().replace(/\s+/g, '')}@okaxis`;

  const handleCopy = () => {
    navigator.clipboard.writeText(upiId);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleSimulatePayment = () => {
    setIsPaid(true);
    setTimeout(() => {
      setIsPaid(false);
      onClose();
    }, 2500);
  };

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content animate-slide-up" style={{ maxWidth: '420px', textAlign: 'center' }} onClick={(e) => e.stopPropagation()}>
        
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
          <h3 className="heading-sm" style={{ margin: 0, display: 'flex', alignItems: 'center', gap: '8px' }}>
            <QrCode size={20} color="var(--primary)" /> Instant UPI Settlement
          </h3>
          <button onClick={onClose} className="btn-icon">
            <X size={20} />
          </button>
        </div>

        {isPaid ? (
          <div style={{ padding: '30px 10px' }}>
            <CheckCircle2 size={64} color="var(--success)" style={{ margin: '0 auto 16px' }} />
            <h3 className="heading-sm mb-2" style={{ color: '#065F46' }}>Payment Received!</h3>
            <p className="text-body" style={{ fontSize: '0.9rem' }}>
              ₹{amount} has been successfully settled with {driverName}. Zero platform fee charged.
            </p>
          </div>
        ) : (
          <div>
            <p className="text-body" style={{ fontSize: '0.875rem', marginBottom: '16px' }}>
              Scan with any UPI App to pay driver directly upon arrival or trip start.
            </p>

            {/* Generated SVG QR Code Graphic */}
            <div style={{ background: 'white', border: '2px solid var(--border)', borderRadius: '16px', padding: '16px', display: 'inline-block', margin: '0 auto 16px', boxShadow: 'var(--shadow-sm)' }}>
              <svg width="180" height="180" viewBox="0 0 100 100">
                {/* QR Code corner markers */}
                <rect width="100" height="100" fill="white" />
                {/* Top-left marker */}
                <rect x="10" y="10" width="24" height="24" fill="#0056D2" rx="4" />
                <rect x="14" y="14" width="16" height="16" fill="white" rx="2" />
                <rect x="18" y="18" width="8" height="8" fill="#0056D2" rx="1" />
                {/* Top-right marker */}
                <rect x="66" y="10" width="24" height="24" fill="#0056D2" rx="4" />
                <rect x="70" y="14" width="16" height="16" fill="white" rx="2" />
                <rect x="74" y="18" width="8" height="8" fill="#0056D2" rx="1" />
                {/* Bottom-left marker */}
                <rect x="10" y="66" width="24" height="24" fill="#0056D2" rx="4" />
                <rect x="14" y="70" width="16" height="16" fill="white" rx="2" />
                <rect x="18" y="74" width="8" height="8" fill="#0056D2" rx="1" />
                {/* Simulated data matrix cells */}
                <rect x="42" y="12" width="6" height="6" fill="#05192D" />
                <rect x="52" y="18" width="6" height="6" fill="#05192D" />
                <rect x="42" y="28" width="6" height="6" fill="#05192D" />
                <rect x="50" y="38" width="8" height="8" fill="#0056D2" />
                <rect x="16" y="44" width="6" height="6" fill="#05192D" />
                <rect x="28" y="52" width="6" height="6" fill="#05192D" />
                <rect x="44" y="54" width="6" height="6" fill="#05192D" />
                <rect x="68" y="44" width="6" height="6" fill="#05192D" />
                <rect x="78" y="56" width="6" height="6" fill="#05192D" />
                <rect x="64" y="70" width="8" height="8" fill="#05192D" />
                <rect x="78" y="80" width="6" height="6" fill="#05192D" />
                <rect x="46" y="74" width="6" height="6" fill="#05192D" />
                <rect x="54" y="84" width="6" height="6" fill="#05192D" />
                {/* Center BlahBlahCar badge */}
                <circle cx="50" cy="50" r="12" fill="white" />
                <circle cx="47" cy="50" r="5" fill="#0056D2" />
                <circle cx="53" cy="50" r="5" fill="#0056D2" />
              </svg>
            </div>

            {/* Total Fare Amount */}
            <div style={{ marginBottom: '16px' }}>
              <div style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>Amount to pay</div>
              <div style={{ fontSize: '1.75rem', fontWeight: 800, color: 'var(--primary)' }}>
                ₹{amount}
              </div>
              <div style={{ fontSize: '0.8rem', color: 'var(--text-secondary)' }}>
                For {tripRoute || 'Carpool Ride'}
              </div>
            </div>

            {/* Driver UPI Copy Box */}
            <div style={{ background: 'var(--bg-page)', padding: '10px 14px', borderRadius: '10px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px', fontSize: '0.85rem' }}>
              <span style={{ fontWeight: 600, color: 'var(--text-main)', fontFamily: 'monospace' }}>
                {upiId}
              </span>
              <button 
                type="button" 
                onClick={handleCopy}
                style={{ display: 'flex', alignItems: 'center', gap: '4px', color: 'var(--primary)', fontWeight: 600, fontSize: '0.8rem' }}
              >
                {copied ? <><Check size={14} /> Copied</> : <><Copy size={14} /> Copy UPI</>}
              </button>
            </div>

            {/* Popular UPI Apps row */}
            <div style={{ display: 'flex', gap: '8px', justifyContent: 'center', marginBottom: '20px' }}>
              {['GPay', 'PhonePe', 'Paytm', 'BHIM'].map((app) => (
                <span 
                  key={app} 
                  style={{ 
                    padding: '6px 12px', 
                    borderRadius: '8px', 
                    background: 'white', 
                    border: '1px solid var(--border)', 
                    fontSize: '0.75rem', 
                    fontWeight: 700, 
                    color: 'var(--text-secondary)' 
                  }}
                >
                  {app}
                </span>
              ))}
            </div>

            {/* Simulate confirmation */}
            <button 
              type="button" 
              onClick={handleSimulatePayment} 
              className="btn btn-primary btn-full"
            >
              Simulate Instant Settlement (₹{amount})
            </button>
          </div>
        )}

      </div>
    </div>
  );
}

export default UpiPaymentModal;
