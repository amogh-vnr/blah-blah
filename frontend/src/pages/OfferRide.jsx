import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { 
  Car, MapPin, Calendar, Users, DollarSign, ShieldCheck, 
  Sparkles, CheckCircle2, AlertCircle, ChevronDown, Award, 
  TrendingUp, Loader2, Volume2, Briefcase, Dog, Snowflake
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import Footer from '../components/Footer';

function OfferRide() {
  const navigate = useNavigate();
  const { token, user } = useAuth();
  
  const getDefaultDateTime = () => {
    const d = new Date();
    d.setDate(d.getDate() + 1);
    d.setHours(8, 0, 0, 0);
    return d.toISOString().slice(0, 16);
  };

  const [formData, setFormData] = useState({
    from: '',
    to: '',
    date: getDefaultDateTime(),
    price: '350',
    seats: '3',
    vehicle: 'Maruti Ertiga',
    vehicleColor: 'Pearl White',
    ladiesOnly: false,
    chattyLevel: 'BlaBla',
    luggageSize: 'Medium',
    petsAllowed: false,
    acEnabled: true
  });

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState('');
  const [openFaq, setOpenFaq] = useState(null);

  const handleChange = (e) => {
    const value = e.target.type === 'checkbox' ? e.target.checked : e.target.value;
    setFormData({
      ...formData,
      [e.target.name]: value
    });
  };

  const calculatedSavings = (Number(formData.price) || 0) * (Number(formData.seats) || 0);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    if (!formData.from.trim() || !formData.to.trim()) {
      setError('Please provide both departure and destination cities.');
      return;
    }

    if (formData.from.toLowerCase().trim() === formData.to.toLowerCase().trim()) {
      setError('Departure and destination cities cannot be the same.');
      return;
    }

    if (new Date(formData.date) <= new Date()) {
      setError('Please pick a departure time in the future.');
      return;
    }

    if (Number(formData.price) <= 0) {
      setError('Price per seat must be greater than 0.');
      return;
    }

    setIsSubmitting(true);
    
    try {
      await axios.post('http://localhost:5000/api/rides', {
        from: formData.from.trim(),
        to: formData.to.trim(),
        date: new Date(formData.date).toISOString(),
        price: Number(formData.price),
        seats: Number(formData.seats),
        vehicle: formData.vehicle.trim(),
        vehicleColor: formData.vehicleColor.trim(),
        ladiesOnly: formData.ladiesOnly,
        chattyLevel: formData.chattyLevel,
        luggageSize: formData.luggageSize,
        petsAllowed: formData.petsAllowed,
        acEnabled: formData.acEnabled
      }, {
        headers: { Authorization: `Bearer ${token}` }
      });
      
      navigate('/dashboard');
    } catch (err) {
      console.error('Error publishing ride', err);
      setError(err.response?.data?.message || 'Failed to publish ride. Please try again.');
      setIsSubmitting(false);
    }
  };

  return (
    <div style={{ backgroundColor: 'var(--bg-page)', minHeight: 'calc(100vh - 70px)' }}>
      
      {/* Hero Section */}
      <section 
        style={{
          background: 'linear-gradient(135deg, #054752 0%, #0056D2 100%)',
          color: 'white',
          padding: '60px 24px 80px',
          textAlign: 'center'
        }}
      >
        <div className="container" style={{ maxWidth: '800px' }}>
          <span className="badge badge-info" style={{ marginBottom: '16px', background: 'rgba(255,255,255,0.2)', color: 'white' }}>
            Driver Hub
          </span>
          <h1 className="heading-xl" style={{ color: 'white', marginBottom: '16px' }}>
            Become a BlahBlahCar driver and save on travel costs
          </h1>
          <p style={{ fontSize: '1.15rem', color: 'rgba(255,255,255,0.9)', maxWidth: '600px', margin: '0 auto' }}>
            Share empty seats with verified passengers on your route and offset your fuel and highway tolls.
          </p>
        </div>
      </section>

      {/* Main Publishing Form */}
      <div className="container" style={{ marginTop: '-40px', maxWidth: '820px', marginBottom: '60px' }}>
        <div className="card" style={{ padding: '40px', boxShadow: 'var(--shadow-lg)', border: '1px solid var(--border-light)' }}>
          
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '24px', borderBottom: '1px solid var(--border-light)', paddingBottom: '16px' }}>
            <div style={{ width: '44px', height: '44px', borderRadius: '50%', background: 'var(--primary-light)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <Car size={24} color="var(--primary)" />
            </div>
            <div>
              <h2 className="heading-sm" style={{ margin: 0 }}>Publish a Carpool Ride</h2>
              <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)', margin: 0 }}>Configure route, fare, luggage and ride preferences</p>
            </div>
          </div>

          {error && (
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px', background: 'var(--error-light)', color: 'var(--error)', padding: '14px 18px', borderRadius: '12px', marginBottom: '20px', fontSize: '0.9rem', fontWeight: 500 }}>
              <AlertCircle size={20} />
              <span>{error}</span>
            </div>
          )}

          <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
            
            {/* From and To */}
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '16px' }}>
              <div className="input-group">
                <label htmlFor="from" style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                  <MapPin size={16} color="var(--primary)" /> Leaving from
                </label>
                <input 
                  type="text" 
                  id="from" 
                  name="from" 
                  required 
                  className="input-field" 
                  placeholder="e.g. Mumbai (Dadar)" 
                  value={formData.from}
                  onChange={handleChange}
                />
              </div>

              <div className="input-group">
                <label htmlFor="to" style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                  <MapPin size={16} color="var(--dark-navy)" /> Going to
                </label>
                <input 
                  type="text" 
                  id="to" 
                  name="to" 
                  required 
                  className="input-field" 
                  placeholder="e.g. Pune (Wakad)" 
                  value={formData.to}
                  onChange={handleChange}
                />
              </div>
            </div>

            {/* Date and Seats */}
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '16px' }}>
              <div className="input-group">
                <label htmlFor="date" style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                  <Calendar size={16} color="var(--primary)" /> Date & Departure Time
                </label>
                <input 
                  type="datetime-local" 
                  id="date" 
                  name="date" 
                  required 
                  className="input-field" 
                  value={formData.date}
                  onChange={handleChange}
                />
              </div>

              <div className="input-group">
                <label htmlFor="seats" style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                  <Users size={16} color="var(--primary)" /> Passenger Seats Offered
                </label>
                <select 
                  id="seats" 
                  name="seats" 
                  className="input-field"
                  value={formData.seats}
                  onChange={handleChange}
                >
                  <option value="1">1 Passenger</option>
                  <option value="2">2 Passengers (Max 2 in rear recommended)</option>
                  <option value="3">3 Passengers</option>
                  <option value="4">4 Passengers</option>
                  <option value="5">5 Passengers (SUV/MUV)</option>
                  <option value="6">6 Passengers</option>
                </select>
              </div>
            </div>

            {/* Price & Vehicle */}
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '16px' }}>
              <div className="input-group">
                <label htmlFor="price" style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                  <span style={{ fontWeight: 800, color: 'var(--primary)' }}>₹</span> Price per seat (INR)
                </label>
                <input 
                  type="number" 
                  id="price" 
                  name="price" 
                  min="50" 
                  step="10" 
                  required 
                  className="input-field" 
                  placeholder="e.g. 350"
                  value={formData.price}
                  onChange={handleChange}
                />
              </div>

              <div className="input-group">
                <label htmlFor="vehicle" style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                  <Car size={16} color="var(--primary)" /> Vehicle Model & Color
                </label>
                <input 
                  type="text" 
                  id="vehicle" 
                  name="vehicle" 
                  className="input-field" 
                  placeholder="e.g. Hyundai Creta (Silver)"
                  value={formData.vehicle}
                  onChange={handleChange}
                />
              </div>
            </div>

            {/* Preferences: BlaBla Meter, Luggage & Ladies Only */}
            <div style={{ background: 'var(--bg-page)', padding: '20px', borderRadius: '14px', border: '1px solid var(--border-light)' }}>
              <h4 style={{ fontSize: '0.9rem', fontWeight: 700, color: 'var(--text-main)', marginBottom: '14px' }}>
                Ride Preferences & "BlaBla" Meter
              </h4>

              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '16px', marginBottom: '14px' }}>
                
                {/* Chatty Meter */}
                <div className="input-group">
                  <label htmlFor="chattyLevel" style={{ fontSize: '0.8rem', display: 'flex', alignItems: 'center', gap: '4px' }}>
                    <Volume2 size={15} color="var(--primary)" /> Chatty Meter
                  </label>
                  <select 
                    id="chattyLevel" 
                    name="chattyLevel" 
                    value={formData.chattyLevel} 
                    onChange={handleChange}
                    className="input-field"
                    style={{ padding: '10px 12px', fontSize: '0.85rem' }}
                  >
                    <option value="Bla">Bla (Quiet, prefer music)</option>
                    <option value="BlaBla">BlaBla (Friendly, like chatting)</option>
                    <option value="BlaBlaBla">BlaBlaBla (Loves sharing road stories)</option>
                  </select>
                </div>

                {/* Luggage Size */}
                <div className="input-group">
                  <label htmlFor="luggageSize" style={{ fontSize: '0.8rem', display: 'flex', alignItems: 'center', gap: '4px' }}>
                    <Briefcase size={15} color="var(--primary)" /> Luggage Allowance
                  </label>
                  <select 
                    id="luggageSize" 
                    name="luggageSize" 
                    value={formData.luggageSize} 
                    onChange={handleChange}
                    className="input-field"
                    style={{ padding: '10px 12px', fontSize: '0.85rem' }}
                  >
                    <option value="Small">Small bag / backpack</option>
                    <option value="Medium">Medium trolley suitcase</option>
                    <option value="Large">Large heavy luggage</option>
                  </select>
                </div>

              </div>

              {/* Toggles: Ladies Only, AC, Pets */}
              <div style={{ display: 'flex', gap: '20px', flexWrap: 'wrap', paddingTop: '10px', borderTop: '1px solid var(--border)' }}>
                <label className="checkbox-option" style={{ fontSize: '0.85rem', fontWeight: 600 }}>
                  <input 
                    type="checkbox" 
                    name="ladiesOnly"
                    checked={formData.ladiesOnly} 
                    onChange={handleChange} 
                  />
                  <span>🌸 Ladies Only Ride</span>
                </label>

                <label className="checkbox-option" style={{ fontSize: '0.85rem', fontWeight: 600 }}>
                  <input 
                    type="checkbox" 
                    name="acEnabled"
                    checked={formData.acEnabled} 
                    onChange={handleChange} 
                  />
                  <span>❄️ Air Conditioning</span>
                </label>

                <label className="checkbox-option" style={{ fontSize: '0.85rem', fontWeight: 600 }}>
                  <input 
                    type="checkbox" 
                    name="petsAllowed"
                    checked={formData.petsAllowed} 
                    onChange={handleChange} 
                  />
                  <span>🐾 Pets Welcome</span>
                </label>
              </div>
            </div>

            {/* Dynamic Savings Calculator */}
            <div style={{ background: 'linear-gradient(135deg, #EBF3FD 0%, #D8E7FA 100%)', border: '1px solid #BFD9F7', borderRadius: '16px', padding: '18px 24px', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
              <div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '6px', color: 'var(--primary)', fontWeight: 700, fontSize: '0.95rem' }}>
                  <Sparkles size={18} /> Estimated Trip Savings
                </div>
                <p style={{ margin: 0, fontSize: '0.85rem', color: 'var(--text-secondary)' }}>
                  By filling {formData.seats} seat{formData.seats > 1 ? 's' : ''} at ₹{formData.price} each:
                </p>
              </div>
              <div style={{ textAlign: 'right' }}>
                <div style={{ fontSize: '1.6rem', fontWeight: 800, color: 'var(--primary)' }}>
                  ₹{calculatedSavings}
                </div>
                <div style={{ fontSize: '0.75rem', color: '#059669', fontWeight: 700 }}>
                  Offsets ~80% of fuel costs
                </div>
              </div>
            </div>

            {/* Submit Button */}
            <button 
              type="submit" 
              className="btn btn-primary btn-full btn-lg" 
              disabled={isSubmitting}
            >
              {isSubmitting ? <Loader2 size={20} className="spinner" /> : 'Publish Ride Now'}
            </button>
          </form>

        </div>
      </div>

      <Footer />
    </div>
  );
}

export default OfferRide;
