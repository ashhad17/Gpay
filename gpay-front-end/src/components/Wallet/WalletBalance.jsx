import { useState, useEffect } from 'react';
import { getWalletBalance } from '../../services/wallet';

export default function WalletBalance() {
  const [balance, setBalance] = useState(0);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchBalance = async () => {
      try {
        const response = await getWalletBalance();
        setBalance(response.balance);
      } catch (error) {
        setError(error.response?.data?.message || 'Failed to fetch balance');
      } finally {
        setIsLoading(false);
      }
    };

    fetchBalance();
  }, []);

  return (
    <div className="bg-white p-6 rounded-lg shadow-md">
      <h2 className="text-xl font-semibold mb-4">Wallet Balance</h2>
      {isLoading ? (
        <p className="text-center">Loading...</p>
      ) : error ? (
        <p className="text-red-600">{error}</p>
      ) : (
        <div className="text-center">
          <p className="text-4xl font-bold text-blue-600">₹{balance.toLocaleString()}</p>
          <p className="mt-2 text-gray-600">Available balance</p>
        </div>
      )}
    </div>
  );
}