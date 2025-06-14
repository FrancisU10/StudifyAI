'use client'
import Image from "next/image"
import Link from "next/link";
import { useAuth } from "../hooks/useAuth";
import { useRouter } from "next/navigation";
import { useVideosStore } from "../store/videosStore";
import { useEffect } from "react";
import { supabase } from "../supabase/supabaseClient";

export default function Sidebar() {
  const { signOut, loading, authLoading, user } = useAuth()
  const router = useRouter();
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
        <h2 className="text-zinc-500 text-lg font-semibold">Past Studies</h2>
      </div>

      <nav className="px-4 mt-4">
        {videos.length === 0 ? (
          <div className="w-full flex justify-center">
            <p className="text-zinc-600 text-sm text-center">No saved videos yet.</p>
          </div>
        ) : (
          <ul className="space-y-2">
            {videos.map(({ videoId, title }) => (
              <li key={videoId}>
                <Link
                  href={`/study-material/${videoId}`}
                  className="block py-2 rounded w-full text-zinc-200 bg-zinc-800 hover:bg-zinc-700 hover:text-white transition-colors truncate"
                  title={title}
                >
                  {title || videoId}
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
            className="mt-4 px-4 py-2 w-full bg-red-800 text-white rounded hover:bg-red-900 focus:outline-none focus:ring-2"
          >
            {loading ? 'Logging out...' : 'Log Out'}
          </button>
        )}
      </div>
    </aside>
  )
}