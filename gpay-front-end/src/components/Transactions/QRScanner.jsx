import { useState } from 'react';
import { sendMoneyFromQR } from '../../services/transactions';
import QrReader from 'react-qr-reader'; // You'll need to install this package

export default function QRScanner() {
  const [result, setResult] = useState('');
  const [message, setMessage] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [scanning, setScanning] = useState(false);

  const handleScan = async (data) => {
    if (data) {
      setResult(data);
      setScanning(false);
      try {
        setIsLoading(true);
        const qrData = JSON.parse(data);
        const response = await sendMoneyFromQR({ qrCodeData: data });
        setMessage(response.message);
      } catch (error) {
        setMessage(error.response?.data?.message || 'Transaction failed');
      } finally {
        setIsLoading(false);
      }
    }
  };

  const handleError = (err) => {
    console.error(err);
    setMessage('Error scanning QR code');
  };

  return (
    <div className="max-w-md mx-auto bg-white p-8 rounded-lg shadow-md">
      <h2 className="text-2xl font-bold mb-6 text-center">Scan QR Code</h2>
      
      {message && (
        <p className={`mb-4 text-center ${message.includes('success') ? 'text-green-600' : 'text-red-600'}`}>
          {message}
        </p>
      )}

      {scanning ? (
        <div className="mb-4">
          <QrReader
            delay={300}
            onError={handleError}
            onScan={handleScan}
            style={{ width: '100%' }}
          />
          <button
            onClick={() => setScanning(false)}
            className="mt-4 w-full bg-red-500 text-white py-2 px-4 rounded-lg hover:bg-red-600"
          >
            Cancel Scan
          </button>
        </div>
      ) : (
        <button
          onClick={() => setScanning(true)}
          disabled={isLoading}
          className="w-full bg-blue-500 text-white py-2 px-4 rounded-lg hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-opacity-50 disabled:opacity-50"
        >
          {isLoading ? 'Processing...' : 'Start Scanning'}
        </button>
      )}

      {result && (
        <div className="mt-4 p-3 bg-gray-100 rounded">
          <p className="text-sm text-gray-700">Scanned data:</p>
          <p className="text-xs font-mono break-all">{result}</p>
        </div>
      )}
    </div>
  );
}