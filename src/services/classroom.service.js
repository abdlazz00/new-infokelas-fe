import api from '@/lib/axios';

export const classroomService = {
  // Ambil semua kelas user
  getMyClasses: async () => {
    const res = await api.get('/my-classrooms');
    return res.data;
  },

  // Ambil detail satu kelas
  getClassDetail: async (id) => {
    const res = await api.get(`/classrooms/${id}`);
    return res.data;
  },

  // Gabung kelas baru
  joinClass: async (code) => {
    const res = await api.post('/join-class', { code });
    return res.data;
  },
  
  // Ambil mata kuliah dalam kelas
  getSubjects: async (classroomId) => {
    const res = await api.get(`/classrooms/${classroomId}/subjects`);
    return res.data;
  },
};