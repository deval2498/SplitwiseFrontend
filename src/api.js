import axios from 'axios';

// Create a custom instance of Axios
const api = axios.create();

// Set the Authorization header with the access token
api.interceptors.request.use((config) => {
  const accessToken = localStorage.getItem('accessToken');
  if (accessToken) {
    config.headers['access-token'] = `${accessToken}`;
  }
  return config;
}, (error) => {
  return Promise.reject(error);
});

export default api;