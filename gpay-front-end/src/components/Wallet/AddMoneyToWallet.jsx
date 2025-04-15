// components/Wallet/AddMoneyToWallet.jsx
import { useState } from 'react';
// import axios from '../../api/axios';
import { toast } from 'react-toastify';
import { addMoney } from '../../services/wallet';

export default function AddMoneyToWallet() {
  const [amount, setAmount] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleAddMoney = async () => {
    if (!amount || isNaN(amount) || amount <= 0) {
      toast.error("Enter a valid amount");
      return;
    }

    try {
      setIsLoading(true);
      const data = {
        amount: parseFloat(amount),
      };
      const response=await addMoney(data);
      console.log(response);
      toast.success("Money added to wallet!");
      setAmount('');
    } catch (error) {
      toast.error(error.response?.data?.message || "Failed to add money");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="bg-white p-6 rounded-lg shadow-md">
      <h2 className="text-xl font-semibold mb-4">Add Money to Wallet</h2>
      <input
        type="number"
        value={amount}
        onChange={(e) => setAmount(e.target.value)}
        placeholder="Enter amount"
        className="w-full border px-3 py-2 mb-4 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
      />
      <button
        onClick={handleAddMoney}
        disabled={isLoading}
        className="w-full bg-blue-600 text-white py-2 rounded hover:bg-blue-700"
      >
        {isLoading ? "Processing..." : "Add Money"}
      </button>
    </div>
  );
}
