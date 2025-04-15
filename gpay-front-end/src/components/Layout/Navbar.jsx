import { Link } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';

export default function Navbar() {
  const { user, isAuthenticated, logout } = useAuth();

  return (
    <nav className="bg-blue-600 text-white shadow-lg">
      <div className="container mx-auto px-4 py-3 flex justify-between items-center">
        <Link to="/" className="text-xl font-bold">Payment App</Link>
        
        <div className="flex items-center space-x-4">
          {isAuthenticated ? (
            <>
              <Link to="/dashboard" className="hover:bg-blue-700 px-3 py-2 rounded">Dashboard</Link>
              <Link to="/wallet" className="hover:bg-blue-700 px-3 py-2 rounded">Wallet</Link>
              <Link to="/send-money" className="hover:bg-blue-700 px-3 py-2 rounded">Send Money</Link>
              <Link to="/qr" className="hover:bg-blue-700 px-3 py-2 rounded">QR</Link>
              <button 
                onClick={logout}
                className="bg-red-500 hover:bg-red-600 px-3 py-2 rounded"
              >
                Logout
              </button>
            </>
          ) : (
            <>
              <Link to="/login" className="hover:bg-blue-700 px-3 py-2 rounded">Login</Link>
              <Link to="/register" className="hover:bg-blue-700 px-3 py-2 rounded">Register</Link>
            </>
          )}
        </div>
      </div>
    </nav>
  );
}