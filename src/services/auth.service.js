import api from '@/lib/axios';
import axios from 'axios';

export const authService = {
  login: async (identifier, password) => {
    const res = await api.post('/login', { identifier, password });
    return res.data;
  },

  logout: async () => {
    // Kita coba logout ke backend, tapi kalau gagal tetap hapus lokal
    try {
      await api.post('/logout');
    } catch (error) {
      console.warn("Logout backend failed, clearing local session anyway.");
    }
  },

  requestOtp: async (identifier) => {
    const res = await api.post('/forgot-password', { identifier });
    return res.data;
  },

  resetPassword: async (identifier, otp, newPassword) => {
    const res = await api.post('/reset-password', {
      identifier,
      otp,
      password: newPassword,
      password_confirmation: newPassword,
    });
    return res.data;
  },

  getProfile: async () => {
    const res = await api.get('/profile');
    return res.data;
  },

  updateProfile: async (formData) => {
    const token = localStorage.getItem('token');
    const res = await axios.post(`${api.defaults.baseURL}/profile/update`, formData, {
      headers: {
        'Authorization': `Bearer ${token}`,
        'Accept': 'application/json',
      }
    });
    return res.data;
  },

  updatePassword: async (currentPassword, newPassword) => {
    const res = await api.post('/profile/password', {
      current_password: currentPassword,
      password: newPassword,
      password_confirmation: newPassword,
    });
    return res.data;
  }
};