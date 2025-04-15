import { useState } from 'react';
import { generateDynamicQR } from '../../services/transactions';

export default function QRGenerator() {
  const [formData, setFormData] = useState({
    receiverPhone: '',
    amount: ''
  });
  const [qrCode, setQrCode] = useState('');
  const [message, setMessage] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleGenerateQR = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    try {
      const response = await generateDynamicQR(formData);
      // const response = await generateDynamicQR(formData);
      setQrCode(response.qrCode);
      setMessage(response.message);
    } catch (error) {
      setMessage(error.response?.data?.message || 'QR generation failed');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="max-w-md mx-auto bg-white p-8 rounded-lg shadow-md">
      <h2 className="text-2xl font-bold mb-6 text-center">Generate QR Code</h2>
      {message && <p className={`mb-4 text-center ${message.includes('success') ? 'text-green-600' : 'text-red-600'}`}>{message}</p>}
      
      <form onSubmit={handleGenerateQR}>
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
          {isLoading ? 'Generating...' : 'Generate QR Code'}
        </button>
      </form>

      {qrCode && (
        <div className="mt-6 text-center">
          <h3 className="text-lg font-semibold mb-2">Your QR Code</h3>
          <img src={qrCode} alt="Payment QR Code" className="mx-auto w-48 h-48" />
          <p className="mt-2 text-sm text-gray-600">Share this QR code with the sender</p>
        </div>
      )}
    </div>
  );
}