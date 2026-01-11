import api from '@/lib/axios';

export const announcementService = {
    getAnnouncements: async () => {
        const res = await api.get('/announcements');
        return res.data.data;
    },

    getLatest: async (limit = 3) => {
        const res = await api.get('/announcements', {
            params: {
                limit
            }
        })
        return res.data.data;
    }
};
