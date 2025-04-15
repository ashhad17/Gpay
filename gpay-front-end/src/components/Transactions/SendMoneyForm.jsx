// import { useState } from 'react';
import { sendMoney } from '../../services/transactions';
import React, { useEffect, useState } from 'react';
import { useLocation } from 'react-router-dom';
export default function SendMoneyForm() {
  const [formData, setFormData] = useState({
    receiverPhone: '',
    amount: ''
  });
  const [message, setMessage] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [showOtpVerification, setShowOtpVerification] = useState(false);
  const [transactionId, setTransactionId] = useState(null);
  const [otp, setOtp] = useState('');
  const location = useLocation();
  useEffect(() => {
    if (location.state) {
      setFormData((prev) => ({
        ...prev,
        ...location.state,
      }));
    }
  }, [location.state]);
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSendMoney = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    try {
      const response = await sendMoney(formData);
      setMessage(response.message);
      setTransactionId(response.transactionId);
      
      // For high-value transactions, show OTP verification
      if (formData.amount > 1000) {
        setShowOtpVerification(true);
      } else {
        // Refresh wallet balance or redirect
      }
    } catch (error) {
      setMessage(error.response?.data?.message || 'Transaction failed');
    } finally {
      setIsLoading(false);
    }
  };

  const handleVerifyOtp = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    try {
      const response = await verifyTransactionOtp({ transactionId, otp });
      setMessage(response.message);
      setShowOtpVerification(false);
      // Refresh wallet balance or redirect
    } catch (error) {
      setMessage(error.response?.data?.message || 'OTP verification failed');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="max-w-md mx-auto bg-white p-8 rounded-lg shadow-md">
      <h2 className="text-2xl font-bold mb-6 text-center">Send Money</h2>
      {message && <p className={`mb-4 text-center ${message.includes('success') ? 'text-green-600' : 'text-red-600'}`}>{message}</p>}
      
      {!showOtpVerification ? (
        <form onSubmit={handleSendMoney}>
          <div className="mb-4">
            <label className="block text-gray-700 mb-2" htmlFor="receiverPhone">
              Receiver Phone Number
            </label>
            <input
              type="tel"
              id="receiverPhone"
              name="receiverPhone"
              value={formData.receiverPhone}
              onChange={handleChange}
              className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              required
            />
          </div>
          <div className="mb-6">
            <label className="block text-gray-700 mb-2" htmlFor="amount">
              Amount
            </label>
            <input
              type="number"
              id="amount"
              name="amount"
              value={formData.amount}
              onChange={handleChange}
              className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              required
            />
          </div>
          <button
            type="submit"
            disabled={isLoading}
            className="w-full bg-blue-500 text-white py-2 px-4 rounded-lg hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-opacity-50 disabled:opacity-50"
          >
            {isLoading ? 'Processing...' : 'Send Money'}
          </button>
        </form>
      ) : (
        <form onSubmit={handleVerifyOtp}>
          <div className="mb-6">
            <label className="block text-gray-700 mb-2" htmlFor="otp">
              Enter OTP for Transaction
            </label>
            <input
              type="text"
              id="otp"
              value={otp}
              onChange={(e) => setOtp(e.target.value)}
              className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              required
            />
          </div>
          <button
            type="submit"
            disabled={isLoading}
            className="w-full bg-blue-500 text-white py-2 px-4 rounded-lg hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-opacity-50 disabled:opacity-50"
          >
            {isLoading ? 'Verifying...' : 'Verify OTP'}
          </button>
        </form>
      )}
    </div>
  );
}