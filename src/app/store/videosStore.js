import { create } from 'zustand';

export const useVideosStore = create((set, get) => ({
  videos: [],
  materials: {},

  addVideo: (video) => {
    const exists = get().videos.some(v => v.videoId === video.videoId);
    if (!exists) {
      set((state) => ({ videos: [...state.videos, video] }));
    }
  },
  setVideos: (videoArray) => set({ videos: videoArray }),
  
  setMaterial: (videoId, data) => {
    set((state) => ({
      materials: {
        ...state.materials,
        [videoId]: data
      }
    }));
  },

  getMaterial: (videoId) => get().materials[videoId],

  clearVideos: () => set({ videos: [], materials: {} }),
}));