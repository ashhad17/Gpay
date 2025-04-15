import api from './api';
import axios from 'axios';
import {jwtDecode} from 'jwt-decode';
export const registerUser = async (userData) => {
  const response = await api.post('/auth/register', userData);
  return response.data;
};

export const sendOtp = async (data) => {
  const response = await api.post('/auth/send-otp', data);
  return response.data;
};

export const verifyOtp = async (otpData) => {
    try {
        console.log('Sending verify OTP request with:', otpData);
        const response = await api.post('/auth/verify-otp', otpData);
        console.log('Verify OTP response:', response.data);
        return response.data;
      } catch (error) {
        console.error('Verify OTP error:', {
          status: error.response?.status,
          data: error.response?.data,
          message: error.message
        });
        throw error;
      }
};

export const verifyToken = async () => {
  const token = localStorage.getItem('token');
  if (!token) {
    throw new Error('Token is missing');
  }

  // Decode token locally (optional) to check if it contains phone
  const decoded = jwtDecode(token);
  console.log(decoded);  // Check the decoded token

  // You can also make an API request to verify the token if needed
  try {
    const response = await axios.get('/api/verify-token', {
      headers: { Authorization: `Bearer ${token}` }
    });
    return response.data;
  } catch (error) {
    throw new Error('Token verification failed');
  }
};