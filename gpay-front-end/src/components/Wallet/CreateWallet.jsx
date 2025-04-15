import { useState, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';
import { createWallet } from '../../services/wallet';

export default function CreateWallet() {
  const { user } = useAuth();
  const [message, setMessage] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [walletCreated, setWalletCreated] = useState(false);

  useEffect(() => {
    // Check if user already has a wallet
    if (user?.walletId) {
      setWalletCreated(true);
    }
  }, [user]);

  const handleCreateWallet = async () => {
    setIsLoading(true);
    try {
      await createWallet({ userId: user.id });
      setMessage('Wallet created successfully!');
      setWalletCreated(true);
    } catch (error) {
      setMessage(error.response?.data?.message || 'Failed to create wallet');
    } finally {
      setIsLoading(false);
    }
  };

  if (walletCreated) {
    return (
      <div className="bg-white p-6 rounded-lg shadow-md text-center">
        <p className="text-green-600">Your wallet is ready to use!</p>
      </div>
    );
  }

  return (
    <div className="bg-white p-6 rounded-lg shadow-md text-center">
      <h3 className="text-lg font-semibold mb-4">Create Your Wallet</h3>
      <p className="mb-4 text-gray-600">You need a wallet to start sending and receiving money</p>
      {message && <p className={`mb-4 ${message.includes('success') ? 'text-green-600' : 'text-red-600'}`}>{message}</p>}
      <button
        onClick={handleCreateWallet}
        disabled={isLoading}
        className="bg-blue-500 text-white py-2 px-6 rounded-lg hover:bg-blue-600 disabled:opacity-50"
      >
        {isLoading ? 'Creating...' : 'Create Wallet'}
      </button>
    </div>
  );
}