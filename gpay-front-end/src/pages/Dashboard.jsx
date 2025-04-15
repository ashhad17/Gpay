import { useState } from 'react';
import { generateDynamicQR } from '../services/transactions';  // Import the function to generate dynamic QR
import { useAuth } from '../context/AuthContext';  // Assuming useAuth gives user details from JWT

export default function Dashboard() {
  const { user } = useAuth();  // Getting user data from context (assuming JWT is stored in the context)
  const [dynamicQrCode, setDynamicQrCode] = useState('');
  const [message, setMessage] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const generateDynamicQRCode = async () => {
    setIsLoading(true);
    console.log(user);
    try {
      console.log(user.phone);
      if (!user.phone) {
        setMessage('Phone number is required.');
        return;
      }
      // Send the phone number to the backend API to generate the QR code
      const response = await generateDynamicQR({ receiverPhone: user.phone });
      setDynamicQrCode(response.qrCode);
      setMessage('QR Code generated successfully');
    } catch (error) {
      setMessage(error.response?.data?.message || 'Failed to generate QR Code');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-8">Dashboard</h1>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
        <div className="bg-white p-6 rounded-lg shadow-md">
          <h2 className="text-xl font-semibold mb-4">Welcome, {user?.name || 'User'}!</h2>
          <p className="text-gray-600">Email: {user?.email}</p>
          <p className="text-gray-600">Phone: {user?.phone}</p>
        </div>
      </div>

      {/* QR Code Generation Section */}
      <div className="mt-8 bg-white p-6 rounded-lg shadow-md">
        <h3 className="text-xl font-semibold mb-4">Generate Dynamic QR Code</h3>
        {message && <p className={`mb-4 text-center ${message.includes('success') ? 'text-green-600' : 'text-red-600'}`}>{message}</p>}
        
        <div className="text-center">
          <button
            onClick={generateDynamicQRCode}
            disabled={isLoading}
            className="w-full bg-blue-500 text-white py-2 px-4 rounded-lg hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-opacity-50 disabled:opacity-50"
          >
            {isLoading ? 'Generating...' : 'Generate QR Code'}
          </button>
        </div>

        {dynamicQrCode && (
          <div className="mt-6 text-center">
            <h3 className="text-lg font-semibold mb-2">Your QR Code</h3>
            <img src={dynamicQrCode} alt="Payment QR Code" className="mx-auto w-48 h-48" />
            <p className="mt-2 text-sm text-gray-600">Share this QR code with the sender</p>
          </div>
        )}
      </div>
    </div>
  );
}
