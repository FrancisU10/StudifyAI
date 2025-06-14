'use client'
import Image from "next/image"
import Link from "next/link";
import { useAuth } from "../hooks/useAuth";
import { useRouter } from "next/navigation";
import { useVideosStore } from "../store/videosStore";
import { useEffect, useState } from "react";
import { supabase } from "../supabase/supabaseClient";

export default function Sidebar() {
  const { signOut, loading, authLoading, user } = useAuth()
  const [deletingId, setDeletingId] = useState(null);
  const router = useRouter();
  const removeVideo = useVideosStore((state) => state.removeVideo);
  const setVideos = useVideosStore((state) => state.setVideos);
  const videos = useVideosStore((state) => state.videos);

  useEffect(() => {
    const fetchVideos = async () => {
      if (!user || authLoading) return;

      const { data, error } = await supabase
        .from("studyMaterials")
        .select("video_id, title")
        .eq("user_id", user.id);

      if (error) {
        console.error("Error fetching videos:", error);
        return;
      }

      if (!data || data.length === 0) {
        setVideos([]);
        return;
      }

      setVideos(
        data.map((video) => ({
          videoId: video.video_id,
          title: video.title,
        }))
      );
    };

    fetchVideos();
  }, [user, authLoading, setVideos]);

  const handleDelete = async (videoId) => {
    if (!confirm('Are you sure you want to delete this study material?')) return;
    setDeletingId(videoId);
    const { error } = await supabase
      .from("studyMaterials")
      .delete()
      .eq("video_id", videoId);
    if (error) {
      alert('Failed to delete video: ' + error.message);
      setDeletingId(null);
      return;
    }
    removeVideo(videoId);
    setDeletingId(null);
  }

  const handleLogout = async () => {
    const success = await signOut();
    if (success) {
      router.push('/login');
    }
  }

  if (authLoading) {
    return null
  }

  return (
    <aside className="fixed left-0 top-0 h-full w-60 sm:w-52 md:w-64 bg-black border-r border-zinc-800 flex flex-col">
      <div className="flex flex-col items-center pt-8 pb-4">
        <Image
          src="/logo.png"
          alt="Studify AI Logo"
          width={80}
          height={80}
          className="mb-2 cursor-pointer"
          onClick={() => router.push('/')}
        />
        <h2 className="text-zinc-400 text-lg font-semibold">Past Studies</h2>
      </div>

      <nav className="px-4 mt-4 overflow-y-auto flex-1">
        {videos.length === 0 ? (
          <div className="w-full flex justify-center">
            <p className="text-zinc-600 text-sm text-center">No saved videos yet.</p>
          </div>
        ) : (
          <ul className="space-y-2 p-2">
            {videos
              .filter(video => video.videoId) 
              .map(({ videoId, title }) => (
                <li key={videoId} className="flex items-center bg-gradient-to-r from-zinc-800 to-zinc-600 rounded-lg transition-colors justify-between">
                  <Link
                    href={`/study-material/${videoId}`}
                    className="block py-2 rounded w-full text-zinc-200 hover:text-white truncate"
                  >
                    {title}
                  </Link>
                </li>
              ))}
          </ul>
        )}
      </nav>

      <div className="px-4 pb-6">
        {user && (
          <button
            onClick={handleLogout}
            disabled={loading}
            className="mt-4 px-4 py-2 w-full bg-gradient-to-r from-red-800 to-red-500 text-white rounded cursor-pointer focus:outline-none focus:ring-2"
          >
            {loading ? 'Logging out...' : 'Log Out'}
          </button>
        )}
      </div>
    </aside>
  )
}