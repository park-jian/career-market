import axios from 'axios';

const api = axios.create({
  //baseURL: 'http://43.201.73.11:8080',
  baseURL: process.env.NODE_ENV === 'production' 
    ? '/api'
    : 'http://43.201.73.11:8080',
  withCredentials: true
});

export default api;