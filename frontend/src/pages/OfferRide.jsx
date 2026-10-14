import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { 
  Car, MapPin, Calendar, Users, DollarSign, ShieldCheck, 
  Sparkles, CheckCircle2, AlertCircle, ChevronDown, Award, TrendingUp, Loader2
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import Footer from '../components/Footer';

function OfferRide() {
  const navigate = useNavigate();
  const { token, user } = useAuth();
  
  // Tomorrow's date formatted for datetime-local
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
    vehicleColor: 'Pearl White'
  });

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState('');
  const [openFaq, setOpenFaq] = useState(null);

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const calculatedSavings = (Number(formData.price) || 0) * (Number(formData.seats) || 0);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    // Validations
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
        vehicleColor: formData.vehicleColor.trim()
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

  const driverFaqs = [
    {
      q: 'How much does it cost to publish a ride?',
      a: 'Publishing a ride on BlahBlahCar is 100% free! We do not charge listing fees or driver commissions.'
    },
    {
      q: 'How do passengers pay me for the ride?',
      a: 'Passengers pay you directly when they board or reach the destination via instant UPI or cash.'
    },
    {
      q: 'Can I choose who travels with me?',
      a: 'Yes, you can view passenger profiles, ratings, and past reviews before meeting at the pickup landmark.'
    },
    {
      q: 'What if I need to cancel or modify my published ride?',
      a: 'You can easily manage and delete your published rides anytime from your BlahBlahCar Dashboard.'
    }
  ];

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
            Share your empty seats with verified passengers on your route and cover your petrol and toll expenses.
          </p>
        </div>
      </section>

      {/* Main Publishing Form (Overlapping the hero) */}
      <div className="container" style={{ marginTop: '-40px', maxWidth: '780px', marginBottom: '60px' }}>
        <div className="card" style={{ padding: '40px', boxShadow: 'var(--shadow-lg)', border: '1px solid var(--border-light)' }}>
          
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '24px', borderBottom: '1px solid var(--border-light)', paddingBottom: '16px' }}>
            <div style={{ width: '44px', height: '44px', borderRadius: '50%', background: 'var(--primary-light)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <Car size={24} color="var(--primary)" />
            </div>
            <div>
              <h2 className="heading-sm" style={{ margin: 0 }}>Publish a Carpool Ride</h2>
              <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)', margin: 0 }}>Enter your travel itinerary and car details</p>
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

            {/* Dynamic Real-Time Savings Calculator Box */}
            <div style={{ background: 'linear-gradient(135deg, #EBF3FD 0%, #D8E7FA 100%)', border: '1px solid #BFD9F7', borderRadius: '16px', padding: '18px 24px', display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginTop: '6px' }}>
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
              style={{ marginTop: '10px' }}
            >
              {isSubmitting ? <Loader2 size={20} className="spinner" /> : 'Publish Ride Now'}
            </button>
          </form>

        </div>
      </div>

      {/* 3 Value Pillars */}
      <section className="py-16 container">
        <div style={{ textAlign: 'center', marginBottom: '40px' }}>
          <h2 className="heading-lg" style={{ marginBottom: '8px' }}>Drive. Share. Save.</h2>
          <p className="text-body">Here is why over 21 million drivers choose BlahBlahCar for their highway journeys.</p>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '32px' }}>
          <div className="card" style={{ padding: '32px', textAlign: 'center', border: '1px solid var(--border-light)' }}>
            <div style={{ width: '56px', height: '56px', borderRadius: '50%', background: 'var(--primary-light)', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 20px' }}>
              <ShieldCheck size={28} color="var(--primary)" />
            </div>
            <h3 className="heading-sm mb-2">Drive with peace of mind</h3>
            <p className="text-body">
              You know who you are travelling with. We verify telephone numbers, email addresses, and member IDs.
            </p>
          </div>

          <div className="card" style={{ padding: '32px', textAlign: 'center', border: '1px solid var(--border-light)' }}>
            <div style={{ width: '56px', height: '56px', borderRadius: '50%', background: '#E8F5E9', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 20px' }}>
              <Car size={28} color="#2E7D32" />
            </div>
            <h3 className="heading-sm mb-2">Carpooling made effortless</h3>
            <p className="text-body">
              Publish in under a minute. Manage booking requests on your dashboard with complete control.
            </p>
          </div>

          <div className="card" style={{ padding: '32px', textAlign: 'center', border: '1px solid var(--border-light)' }}>
            <div style={{ width: '56px', height: '56px', borderRadius: '50%', background: '#FFF3E0', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 20px' }}>
              <TrendingUp size={28} color="#EF6C00" />
            </div>
            <h3 className="heading-sm mb-2">Save on highway travel</h3>
            <p className="text-body">
              Save up to ₹8,000 every month by sharing empty seats with polite, verified commuters.
            </p>
          </div>
        </div>
      </section>

      {/* Driver Testimonial Section */}
      <section className="py-16" style={{ backgroundColor: 'white' }}>
        <div className="container">
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '40px', alignItems: 'center' }}>
            <div>
              <img 
                src="/driver-testimonial.jpg" 
                alt="BlahBlahCar verified driver" 
                style={{ borderRadius: '20px', width: '100%', maxHeight: '400px', objectFit: 'cover', boxShadow: 'var(--shadow-md)' }}
              />
            </div>
            <div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '6px', color: '#F59E0B', marginBottom: '12px' }}>
                <Award size={22} color="#F59E0B" />
                <span style={{ fontWeight: 700, fontSize: '0.95rem' }}>Top Ambassador Driver</span>
              </div>
              <h3 className="heading-md" style={{ marginBottom: '16px', lineHeight: 1.3 }}>
                "Covering toll and petrol expenses turned my Mumbai-Pune trips into completely free commutes!"
              </h3>
              <p className="text-body" style={{ marginBottom: '20px', fontSize: '1.05rem', lineHeight: 1.6 }}>
                "I used to drive alone every weekend on the Mumbai-Pune expressway. With BlahBlahCar, I publish my seats two days in advance. My seats are booked within hours, and the passengers are punctual professionals."
              </p>
              <div>
                <strong style={{ fontSize: '1.05rem', color: 'var(--text-main)' }}>Amit Patel</strong>
                <div style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>Maruti Ertiga Owner &bull; 64 trips published</div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 3 Step Guide */}
      <section className="py-20 container">
        <div style={{ textAlign: 'center', marginBottom: '48px' }}>
          <h2 className="heading-lg" style={{ marginBottom: '8px' }}>Publish in 3 easy steps</h2>
          <p className="text-body">Join millions of car owners sharing rides every day.</p>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '32px' }}>
          <div style={{ textAlign: 'center' }}>
            <div style={{ width: '64px', height: '64px', borderRadius: '50%', background: 'var(--primary)', color: 'white', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 20px', fontSize: '1.5rem', fontWeight: 800 }}>
              1
            </div>
            <h4 className="heading-sm mb-2">Create your account</h4>
            <p className="text-body">Sign up for free and verify your phone number and ID to build trust.</p>
          </div>

          <div style={{ textAlign: 'center' }}>
            <div style={{ width: '64px', height: '64px', borderRadius: '50%', background: 'var(--primary)', color: 'white', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 20px', fontSize: '1.5rem', fontWeight: 800 }}>
              2
            </div>
            <h4 className="heading-sm mb-2">Publish your itinerary</h4>
            <p className="text-body">Specify your route, departure time, seats offered and fair price.</p>
          </div>

          <div style={{ textAlign: 'center' }}>
            <div style={{ width: '64px', height: '64px', borderRadius: '50%', background: 'var(--primary)', color: 'white', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 20px', fontSize: '1.5rem', fontWeight: 800 }}>
              3
            </div>
            <h4 className="heading-sm mb-2">Drive & collect costs</h4>
            <p className="text-body">Meet at the designated landmark and receive direct UPI or cash.</p>
          </div>
        </div>
      </section>

      {/* Driver FAQ Section */}
      <section className="py-16" style={{ backgroundColor: 'white' }}>
        <div className="container" style={{ maxWidth: '850px' }}>
          <div style={{ textAlign: 'center', marginBottom: '36px' }}>
            <h2 className="heading-lg" style={{ marginBottom: '8px' }}>Driver FAQs</h2>
            <p className="text-body">Answers to common driver questions regarding bookings and regulations.</p>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
            {driverFaqs.map((faq, index) => {
              const isOpen = openFaq === index;
              return (
                <div 
                  key={index} 
                  className="card"
                  style={{ padding: '20px 24px', cursor: 'pointer', border: '1px solid var(--border-light)' }}
                  onClick={() => setOpenFaq(isOpen ? null : index)}
                >
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <h4 style={{ fontSize: '1.05rem', fontWeight: 700, color: 'var(--text-main)', margin: 0 }}>
                      {faq.q}
                    </h4>
                    <ChevronDown 
                      size={20} 
                      color="var(--primary)" 
                      style={{ transform: isOpen ? 'rotate(180deg)' : 'rotate(0deg)', transition: 'transform 0.2s' }} 
                    />
                  </div>

                  {isOpen && (
                    <div style={{ marginTop: '14px', paddingTop: '14px', borderTop: '1px solid var(--border-light)', color: 'var(--text-secondary)', fontSize: '0.95rem', lineHeight: 1.6 }}>
                      {faq.a}
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
}

export default OfferRide;
