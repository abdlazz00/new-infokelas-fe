import api from '@/lib/axios';

export const materialService = {
  // Ambil materi berdasarkan Subject ID
  getBySubject: async (subjectId) => {
    const res = await api.get(`/materials?subject_id=${subjectId}`);
    return res.data;
  },

  // Ambil detail satu materi (jika perlu)
  getDetail: async (id) => {
    const res = await api.get(`/materials/${id}`);
    return res.data;
  }
};