import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom';
import Navbar from './components/Navbar';
import Home from './pages/Home';
import SearchRides from './pages/SearchRides';
import OfferRide from './pages/OfferRide';

function App() {
  return (
    <Router>
      <div className="flex flex-col" style={{ minHeight: '100vh' }}>
        <Navbar />
        <main style={{ flex: 1 }}>
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/search" element={<SearchRides />} />
            <Route path="/offer" element={<OfferRide />} />
          </Routes>
        </main>
      </div>
    </Router>
  );
}

export default App;
