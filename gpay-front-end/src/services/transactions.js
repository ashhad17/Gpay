import api from './api';

// services/transactions.js
export const generateDynamicQR = async (data) => {
  const { receiverPhone, amount } = data;
  if (!receiverPhone || !amount) throw new Error('Missing receiverPhone or amount');
  
  const response = await api.post('/qr/generate/dynamic', data);
  return response.data;
};

export const generateFixedQR = async () => {
  const response = await api.get('/qr/generate/fixed');
  return response.data;
};

export const generateFixedAmountQR = async (amount) => {
  if (!amount) throw new Error('Amount is required');
  const response = await api.get(`/qr/generate/fixed-amount?amount=${amount}`);
  return response.data;
};

export const sendMoney = async (transactionData) => {
  const response = await api.post('/transactions/send', transactionData);
  return response.data;
};

export const sendMoneyFromQR = async (qrData) => {
  const response = await api.post('/transactions/send-from-qr', qrData);
  return response.data;
};

export const verifyTransactionOtp = async (otpData) => {
  const response = await api.post('/transactions/verify-otp', otpData);
  return response.data;
};