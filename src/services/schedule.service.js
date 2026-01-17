import api from '@/lib/axios';

// Pastikan export const namanya 'scheduleService'
export const scheduleService = {
  
  // Pastikan nama fungsinya 'getSchedules' (pakai 's' di belakang)
  getSchedules: async () => {
    const res = await api.get('/schedules');
    return res.data.data;
  },
  
  getTodaySchedules: async () => {
    const res = await api.get('/schedules?today=true');
    return res.data.data;
  }
};