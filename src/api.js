import axios from 'axios';

// Create a custom instance of Axios
const api = axios.create();

// Set the Authorization header with the access token
api.interceptors.request.use((config) => {
  
  config.headers['access-token'] = `lTEsKBVKvmo35lmA0fJtQx9X4pzPOpPg4X6VqWNF`;
  return config;
}, (error) => {
  return Promise.reject(error);
});

export default api;
