import { Link } from 'react-router-dom';
import { Car, Search, PlusCircle } from 'lucide-react';

function Navbar() {
  return (
    <nav className="navbar">
      <div className="container flex justify-between items-center">
        <Link to="/" className="logo">
          <Car size={32} />
          <span>BlahBlahCar</span>
        </Link>
        <div className="flex gap-4 items-center">
          <Link to="/search" className="btn btn-outline">
            <Search size={20} />
            Find a ride
          </Link>
          <Link to="/offer" className="btn btn-primary">
            <PlusCircle size={20} />
            Publish a ride
          </Link>
        </div>
      </div>
    </nav>
  );
}

export default Navbar;
