import api from '@/lib/axios';

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
    const res = await api.post('/profile/update', formData, {
      headers: {
        'Content-Type': 'multipart/form-data'
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