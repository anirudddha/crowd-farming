import axios from 'axios';

const API_URL = 'http://localhost:5000/api/auth'; // Adjust if your API URL is different

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
