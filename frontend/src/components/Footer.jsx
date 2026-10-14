import { Link } from 'react-router-dom';
import { Globe, ShieldCheck, Heart } from 'lucide-react';

function Footer() {
  const topRoutes = [
    { from: 'Mumbai', to: 'Pune', price: '350' },
    { from: 'New Delhi', to: 'Chandigarh', price: '480' },
    { from: 'Bengaluru', to: 'Mysuru', price: '300' },
    { from: 'Chennai', to: 'Pondicherry', price: '320' },
    { from: 'Hyderabad', to: 'Vijayawada', price: '550' },
    { from: 'Pune', to: 'Goa', price: '850' }
  ];

  return (
    <footer className="footer">
      <div className="container">
        <div className="footer-grid">
          {/* Top Carpool Routes */}
          <div>
            <h4 className="footer-heading">Top Carpool Routes</h4>
            <ul className="footer-links">
              {topRoutes.map((route, i) => (
                <li key={i}>
                  <Link to={`/search?from=${encodeURIComponent(route.from)}&to=${encodeURIComponent(route.to)}`}>
                    {route.from} &rarr; {route.to} <span style={{ color: 'var(--primary)', fontWeight: 600 }}>from ₹{route.price}</span>
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* About & Community */}
          <div>
            <h4 className="footer-heading">About BlahBlahCar</h4>
            <ul className="footer-links">
              <li><Link to="/">How Carpooling Works</Link></li>
              <li><Link to="/offer">Become a Driver</Link></li>
              <li><Link to="/search">Find a Ride</Link></li>
              <li><a href="#faq">Trust & Safety Guidelines</a></li>
              <li><a href="#faq">Help Centre & FAQ</a></li>
              <li><a href="#faq">Zero Carbon Mission</a></li>
            </ul>
          </div>

          {/* Legal & App */}
          <div>
            <h4 className="footer-heading">Safety & Legal</h4>
            <ul className="footer-links">
              <li><a href="#faq">Terms and Conditions</a></li>
              <li><a href="#faq">Privacy Policy</a></li>
              <li><a href="#faq">Cookies Policy</a></li>
              <li><a href="#faq">Insurance & Claims</a></li>
            </ul>

            <div style={{ marginTop: '24px', padding: '16px', background: 'white', borderRadius: '12px', border: '1px solid var(--border-light)' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px', color: 'var(--dark-navy)', fontWeight: 700, fontSize: '0.9rem', marginBottom: '4px' }}>
                <ShieldCheck size={18} color="var(--primary)" /> 100% Verified Community
              </div>
              <p style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>
                Government ID verified drivers, peer ratings, and 24/7 incident support.
              </p>
            </div>
          </div>
        </div>

        {/* Footer Bottom */}
        <div className="footer-bottom">
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <Globe size={18} color="var(--primary)" />
            <span style={{ fontWeight: 600, color: 'var(--text-main)', fontSize: '0.85rem' }}>English (India) &bull; INR (₹)</span>
          </div>

          <div>
            <span>&copy; {new Date().getFullYear()} BlahBlahCar, Inc. All rights reserved. Built with modern web standards.</span>
          </div>
        </div>
      </div>
    </footer>
  );
}

export default Footer;
