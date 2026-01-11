import api from '@/lib/axios';

export const assignmentService = {
  // Ambil tugas berdasarkan ID Kelas
  getByClassroom: async (classroomId) => {
    const res = await api.get(`/classrooms/${classroomId}/assignments`);
    return res.data;
  },

  // Ambil detail satu tugas
  getDetail: async (id) => {
    const res = await api.get(`/assignments/${id}`);
    return res.data;
  },
  
  // Submit tugas (Upload file)
  submitAssignment: async (id, formData) => {
    // Header 'Content-Type': 'multipart/form-data' biasanya otomatis ditangani axios saat kirim FormData
    const res = await api.post(`/assignments/${id}/submit`, formData);
    return res.data;
  }
};