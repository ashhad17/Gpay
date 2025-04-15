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
export const fetchUserByEmail = async (email) => {
  const response = await api.get(`/auth/user-by-email?email=${email}`);
  return response.data;
};

export const verifyToken = async () => {
  const token = localStorage.getItem('token');
  console.log('Token from localStorage:', token);
  if (!token) {
    throw new Error('Token is missing');
  }

  try {
    const decoded = jwtDecode(token);
console.log('Decoded token:', decoded); // Should contain phone, email, etc.

    return { user: decoded }; // Return as object with user key to match the context code
  } catch (error) {
    console.error('Invalid token:', error);
    throw new Error('Token is invalid');
  }
};