import { Link, useNavigate } from 'react-router-dom';
import { useContext, useState } from 'react';
import { AuthContext } from '../context/AuthContext';
import { Search, User, LogOut, Menu, X, PlusSquare } from 'lucide-react';

const Header = () => {
  const { user, logout } = useContext(AuthContext);
  const [isOpen, setIsOpen] = useState(false);
  const navigate = useNavigate();

  return (
    <header className="bg-secondary text-white sticky top-0 z-50 shadow-lg">
      <div className="container mx-auto px-4 py-3 flex items-center justify-between">
        {/* Logo */}
        <Link to="/" className="flex items-center space-x-2">
          <div className="bg-primary text-secondary p-1 rounded font-bold text-xl">IT</div>
          <span className="text-xl font-bold tracking-tight">YellowPages</span>
        </Link>

        {/* Desktop Nav */}
        <nav className="hidden md:flex items-center space-x-6">
          <Link to="/" className="hover:text-primary transition-colors">Home</Link>
          <Link to="/search" className="hover:text-primary transition-colors">Browse</Link>
          {user ? (
            <div className="flex items-center space-x-4">
              <Link to="/submit-business" className="bg-primary text-secondary px-4 py-2 rounded-md font-semibold hover:bg-primary-dark transition-colors flex items-center gap-2">
                <PlusSquare size={18} />
                Add Listing
              </Link>
              <div className="h-6 w-px bg-gray-600"></div>
              <div className="relative group">
                <button className="flex items-center space-x-2 hover:text-primary">
                  <User size={20} />
                  <span>{user.name}</span>
                </button>
                <div className="absolute right-0 mt-2 w-48 bg-white text-secondary rounded-md shadow-xl py-2 hidden group-hover:block border border-gray-100">
                  {user.role === 'admin' && (
                    <Link to="/admin" className="block px-4 py-2 hover:bg-gray-100">Admin Dashboard</Link>
                  )}
                  <button onClick={logout} className="w-full text-left px-4 py-2 hover:bg-gray-100 flex items-center gap-2 text-red-600">
                    <LogOut size={16} />
                    Logout
                  </button>
                </div>
              </div>
            </div>
          ) : (
            <div className="flex items-center space-x-4">
              <Link to="/login" className="hover:text-primary transition-colors">Login</Link>
              <Link to="/register" className="bg-primary text-secondary px-4 py-2 rounded-md font-semibold hover:bg-primary-dark transition-colors">Join Now</Link>
            </div>
          )}
        </nav>

        {/* Mobile menu button */}
        <button className="md:hidden text-white" onClick={() => setIsOpen(!isOpen)}>
          {isOpen ? <X size={28} /> : <Menu size={28} />}
        </button>
      </div>

      {/* Mobile Nav */}
      {isOpen && (
        <div className="md:hidden bg-secondary border-t border-gray-700 py-4 px-4 space-y-4 shadow-xl">
          <Link to="/" className="block py-2 hover:text-primary" onClick={() => setIsOpen(false)}>Home</Link>
          <Link to="/search" className="block py-2 hover:text-primary" onClick={() => setIsOpen(false)}>Browse</Link>
          {user ? (
            <>
              <Link to="/submit-business" className="block py-2 text-primary" onClick={() => setIsOpen(false)}>Add Listing</Link>
              {user.role === 'admin' && (
                <Link to="/admin" className="block py-2" onClick={() => setIsOpen(false)}>Admin Dashboard</Link>
              )}
              <button onClick={() => { logout(); setIsOpen(false); }} className="block w-full text-left py-2 text-red-400">Logout</button>
            </>
          ) : (
            <>
              <Link to="/login" className="block py-2" onClick={() => setIsOpen(false)}>Login</Link>
              <Link to="/register" className="block py-2 text-primary" onClick={() => setIsOpen(false)}>Join Now</Link>
            </>
          )}
        </div>
      )}
    </header>
  );
};

export default Header;
