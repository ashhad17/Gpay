import api from './api';

export const createWallet = async (userId) => {
  const response = await api.post('/wallet/create', { userId });
  return response.data;
};
export const addMoney = async (data) => {
  const response = await api.post('/wallet/add-money', data);
  return response.data;
}

export const getWalletBalance = async () => {
  const response = await api.get('/wallet/balance');
  return response.data;
};