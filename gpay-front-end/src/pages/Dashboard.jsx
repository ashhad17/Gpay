import { useState,useEffect } from 'react';
import { generateDynamicQR, generateFixedQR } from '../services/transactions';  // Import the function to generate dynamic QR
import { useAuth } from '../context/AuthContext';  // Assuming useAuth gives user details from JWT
import { fetchUserByEmail } from '../services/auth';
import AddMoneyToWallet from '../components/Wallet/AddMoneyToWallet' 
 // Assuming this function adds money to a wallet
import {Link } from'react-router-dom';
 export default function Dashboard() {
  const { user: tokenUser } = useAuth();  // This comes from JWT
  const [user, setUser] = useState(null);
  const [dynamicQrCode, setDynamicQrCode] = useState('');
  const [message, setMessage] = useState('');
  const [amount, setAmount] = useState("0"); 
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    const loadUser = async () => {
      try {
        if (tokenUser?.email) {
          const freshUser = await fetchUserByEmail(tokenUser.email);
          setUser(freshUser);
        }
      } catch (error) {
        console.error('Failed to fetch user:', error);
      }
    };

    loadUser();
  }, [tokenUser]);

  const generateDynamicQRCode = async () => {
    setIsLoading(true);
    try {
      if (!user?.phone) {
        setMessage('Phone number is required.');
        return;
      }

      const data = { receiverPhone: user.phone,amount:amount};
      const response = await generateDynamicQR(data);
      setDynamicQrCode(response.qrCode);
      setMessage('QR Code generated successfully');
    } catch (error) {
      setMessage(error.response?.data?.message || 'Failed to generate QR Code');
    } finally {
      setIsLoading(false);
    }
  };

  // return (
  //   <div className="container mx-auto px-4 py-8">
  //     <h1 className="text-3xl font-bold mb-8">Dashboard</h1>
      
  //     <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
  //       <div className="bg-white p-6 rounded-lg shadow-md">
  //         <h2 className="text-xl font-semibold mb-4">Welcome, {user?.name || 'User'}!</h2>
  //         <p className="text-gray-600">Email: {user?.email}</p>
  //         <p className="text-gray-600">Phone: {user?.phone}</p>
  //       </div>
  //     </div>

  //     {/* QR Code Generation Section */}
  //     <div className="mt-8 bg-white p-6 rounded-lg shadow-md">
  //       <h3 className="text-xl font-semibold mb-4">Generate Dynamic QR Code</h3>
  //       {message && <p className={`mb-4 text-center ${message.includes('success') ? 'text-green-600' : 'text-red-600'}`}>{message}</p>}
        
  //       <div className="text-center">
  //         <button
  //           onClick={generateDynamicQRCode}
  //           disabled={isLoading}
  //           className="w-full bg-blue-500 text-white py-2 px-4 rounded-lg hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-opacity-50 disabled:opacity-50"
  //         >
  //           {isLoading ? 'Generating...' : 'Generate QR Code'}
  //         </button>
  //       </div>

  //       {dynamicQrCode && (
  //         <div className="mt-6 text-center">
  //           <h3 className="text-lg font-semibold mb-2">Your QR Code</h3>
  //           <img src={dynamicQrCode} alt="Payment QR Code" className="mx-auto w-48 h-48" />
  //           <p className="mt-2 text-sm text-gray-600">Share this QR code with the sender</p>
  //         </div>
  //       )}
  //     </div>
  //   </div>
  // );
  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-8">Dashboard</h1>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
        <div className="bg-white p-6 rounded-lg shadow-md">
          <h2 className="text-xl font-semibold mb-4">Welcome, {user?.name || 'User'}!</h2>
          <p className="text-gray-600">Email: {user?.email}</p>
          <p className="text-gray-600">Phone: {user?.phone || 'Not available'}</p>
        </div>
        
        {user?.walletId ? <WalletBalance /> : <AddMoneyToWallet />}
      </div>

      {/* QR Code Generation Section */}
      <div className="mt-8 bg-white p-6 rounded-lg shadow-md">
        <h3 className="text-xl font-semibold mb-4">Generate Dynamic QR Code</h3>
        {message && <p className={`mb-4 text-center ${message.includes('success') ? 'text-green-600' : 'text-red-600'}`}>{message}</p>}
        
        <div className="text-center">
          <button
            onClick={() => generateDynamicQRCode(user?.phone)}
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

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-8">
        <Link 
          to="/send-money" 
          className="bg-blue-100 p-6 rounded-lg shadow-md hover:bg-blue-200 transition-colors"
        >
          <h3 className="text-lg font-semibold mb-2 text-blue-800">Send Money</h3>
          <p className="text-blue-600">Transfer money to another user</p>
        </Link>
        
        <Link 
          to="/qr" 
          className="bg-green-100 p-6 rounded-lg shadow-md hover:bg-green-200 transition-colors"
        >
          <h3 className="text-lg font-semibold mb-2 text-green-800">QR Payments</h3>
          <p className="text-green-600">Generate or scan QR codes for payments</p>
        </Link>
      </div>
    </div>
  );

}
