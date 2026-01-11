import axios from 'axios';

// Mengambil URL dari environment variable (nanti kita set)
const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL || 'https://admin.infokelas.com/api';

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
    Accept: 'application/json',
  },
});

// REQUEST INTERCEPTOR: Pasang Token otomatis jika ada
api.interceptors.request.use(
  (config) => {
    // Cek apakah kode jalan di browser (bukan server)
    if (typeof window !== 'undefined') {
      const token = localStorage.getItem('token');
      if (token) {
        config.headers.Authorization = `Bearer ${token}`;
      }
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// RESPONSE INTERCEPTOR: Handle Error 401 (Unauthorized)
api.interceptors.response.use(
  (response) => response,
  (error) => {
    // Jika error datang dari response backend
    if (error.response && typeof window !== 'undefined') {
      const { status } = error.response;
      
      // Jika token basi/salah, tendang ke login
      if (status === 401 || status === 403) {
        localStorage.removeItem('token');
        localStorage.removeItem('user');
        
        // Redirect manual jika user sedang tidak di halaman login
        if (!window.location.pathname.includes('/login')) {
             window.location.href = '/login';
        }
      }
    }
    return Promise.reject(error);
  }
);

export default api;