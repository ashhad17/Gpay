import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import Navbar from './components/Layout/Navbar';
import Footer from './components/Layout/Footer';
import RegisterPage from './pages/Auth/RegisterPage';
import LoginPage from './pages/Auth/LoginPage';
import Dashboard from './pages/Dashboard';
import WalletPage from './pages/WalletPage';
import SendMoneyPage from './pages/Transactions/SendMoneyPage';
import QRPage from './pages/Transactions/QRPage';
import ProtectedRoute from './components/ProtectedRoute';
import QRCodeScanner from './pages/QRCodeScanner';
import CameraQRCodeScanner from './components/Transactions/CameraQRCodeScanner';

function App() {
  return (
    <Router>
      <AuthProvider>
        <div className="min-h-screen flex flex-col">
          <Navbar />
          <main className="flex-grow container mx-auto px-4 py-8">
            <Routes>
              <Route path="/register" element={<RegisterPage />} />
              <Route path="/login" element={<LoginPage />} />
              
              <Route path="/dashboard" element={<ProtectedRoute>
      <Dashboard />
    </ProtectedRoute>} />
              <Route path="/wallet" element={<ProtectedRoute>
      <WalletPage />
    </ProtectedRoute>} />
              <Route path="/send-money" element={<ProtectedRoute>
      <SendMoneyPage />
    </ProtectedRoute>} />
              <Route path="/qr" element={<ProtectedRoute>
      <QRPage />
    </ProtectedRoute>} />
              <Route path="/" element={<ProtectedRoute>
      <Dashboard />
    </ProtectedRoute>} />
    <Route path="/scan-qr" element={<ProtectedRoute><QRCodeScanner/></ProtectedRoute>} />
            
            <Route path="/camera-qr" element={<ProtectedRoute><CameraQRCodeScanner/></ProtectedRoute>} />
            </Routes>
          </main>
          <Footer />
        </div>
      </AuthProvider>
    </Router>
  );
}

export default App;