import axios from 'axios';
import { useSelector } from 'react-redux';

const API_URL = 'https://crowd-farming-backend.onrender.com/api'; // Adjust if your API URL is different
// const API_URL = useSelector(state => state.endpoint.endpoint);

export const signup = async (userData) => {
  try {
    const response = await axios.post(`${API_URL}/signup`, userData);
    return response.data;
  } catch (error) {
    throw error.response.data;
  }
};

export const login = async (userData) => {
  try {
    const response = await axios.post(`${API_URL}/login`, userData);
    return response.data;
  } catch (error) {
    throw error.response.data;
  }
};

export const logout = async () => {
  try {
    const response = await axios.post(`${API_URL}/logout`);
    return response.data;
  } catch (error) {
    throw error.response.data;
  }
};
