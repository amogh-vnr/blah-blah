import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { Car, MapPin, Calendar, DollarSign, Users } from 'lucide-react';

function OfferRide() {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    from: '',
    to: '',
    date: '',
    price: '',
    seats: '3'
  });
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const token = localStorage.getItem('token');
    
    if (!token) {
      alert("Please sign in with Google first to publish a ride!");
      return;
    }

    setIsSubmitting(true);
    
    try {
      await axios.post('http://localhost:5000/api/rides', {
        ...formData,
        price: Number(formData.price),
        seats: Number(formData.seats),
        date: new Date(formData.date).toISOString()
      }, {
        headers: { Authorization: `Bearer ${token}` }
      });
      
      setTimeout(() => {
        navigate('/search');
      }, 500);
    } catch (error) {
      console.error('Error publishing ride', error);
      alert(error.response?.data?.message || "Failed to publish ride");
      setIsSubmitting(false);
    }
  };

  return (
    <div className="container py-20 animate-fade-in flex justify-center">
      <div className="card w-full max-w-2xl" style={{ maxWidth: '600px' }}>
        <div className="text-center mb-8">
          <div className="mx-auto flex items-center justify-center mb-4" style={{ width: '64px', height: '64px', borderRadius: '50%', backgroundColor: 'rgba(255,94,91,0.1)' }}>
            <Car size={32} className="text-secondary" />
          </div>
          <h2 className="title-lg">Publish a ride</h2>
          <p className="text-body mt-2">Earn money by sharing your travel costs.</p>
        </div>

        <form onSubmit={handleSubmit} className="flex flex-col gap-6">
          <div className="input-group">
            <label htmlFor="from"><MapPin size={16} className="inline mr-2" />Leaving from</label>
            <input 
              type="text" 
              id="from" 
              name="from" 
              required 
              className="input-field" 
              placeholder="e.g. Mumbai"
              value={formData.from}
              onChange={handleChange}
            />
          </div>

          <div className="input-group">
            <label htmlFor="to"><MapPin size={16} className="inline mr-2" />Going to</label>
            <input 
              type="text" 
              id="to" 
              name="to" 
              required 
              className="input-field" 
              placeholder="e.g. Pune"
              value={formData.to}
              onChange={handleChange}
            />
          </div>

          <div className="grid grid-cols-2 gap-6" style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '24px' }}>
            <div className="input-group">
              <label htmlFor="date"><Calendar size={16} className="inline mr-2" />Date & Time</label>
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
              <label htmlFor="seats"><Users size={16} className="inline mr-2" />Seats offered</label>
              <input 
                type="number" 
                id="seats" 
                name="seats" 
                min="1" 
                max="8" 
                required 
                className="input-field" 
                value={formData.seats}
                onChange={handleChange}
              />
            </div>
          </div>

          <div className="input-group">
            <label htmlFor="price">
              <span className="inline mr-2" style={{ fontWeight: 'bold' }}>₹</span>
              Price per seat (INR)
            </label>
            <input 
              type="number" 
              id="price" 
              name="price" 
              min="1" 
              step="10"
              required 
              className="input-field" 
              placeholder="e.g. 500"
              value={formData.price}
              onChange={handleChange}
            />
          </div>

          <button 
            type="submit" 
            className="btn btn-primary mt-4 w-full" 
            style={{ width: '100%', padding: '16px' }}
            disabled={isSubmitting}
          >
            {isSubmitting ? 'Publishing...' : 'Publish ride'}
          </button>
        </form>
      </div>
    </div>
  );
}

export default OfferRide;
