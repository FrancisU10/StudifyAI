import { create } from 'zustand';

export const useVideosStore = create((set, get) => ({
  videos: [],
  materials: {},

  addVideo: (video) => {
    const exists = get().videos.some(v => v.videoId === video.videoId);
    if (!exists) {
      set((state) => ({ videos: [video, ...state.videos, ] }));
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

  removeVideo: (videoId) => set((state) => ({
    videos: state.videos.filter(video => video.videoId !== videoId),
    materials: Object.fromEntries(
      Object.entries(state.materials).filter(([key]) => key !== videoId)
    )
  })),
  
}));