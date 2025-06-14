'use client';

import { useRouter } from "next/navigation";
import { useVideosStore } from "./store/videosStore";
import { useAuth } from "./hooks/useAuth";
import { useState } from "react";

export default function Home() {
  const { authLoading } = useAuth();
  const router = useRouter()
  const addVideo = useVideosStore((state) => state.addVideo);
  const setMaterial = useVideosStore((state) => state.setMaterial);
  const [videoURL, setVideoURL] = useState('');
  const [loading, setLoading] = useState(false);

  if (authLoading) {
    return null // Maybe add spinner here later
  }
  const handleGenerate = async() => {
    if (!videoURL) {
      return alert("Please enter a YouTube video URL");
    }
    setLoading(true);
    try {
      const response = await fetch('/api/process-video', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ videoURL: videoURL }),
      });

      const data = await response.json();
      if (!response.ok) {
        throw new Error('Failed to process video');
      }
      addVideo({
        videoId: data.videoId,
        title: data.title || "Untitled Video"
      });
      setMaterial(data.videoId, {
        summary: data.summary,
        questions: data.questions,
        flashcards: data.flashcards
      });
      router.push(`/study-material/${data.videoId}`);
    } catch (error) {
      console.error('Error processing video:', error);
      alert('Failed to generate study material. Please try again.');
    } finally {
      setLoading(false);
    }
  }

  return (
      <div className="pt-16 pl-60 sm:pl-52 md:pl-64 p-6 min-h-screen bg-black text-white">
      <main className="flex flex-col gap-[32px] row-start-2 items-center justify-center mt-20">
        <h1 className="text-4xl font-bold">Welcome to Studify AI</h1>
        <p className="text-lg text-gray-400">
          An AI-powered study assistant that transforms videos into study tools
        </p>
        <input
          value={videoURL}
          type="text"
          className="w-full max-w-md p-4 border border-gray-300 rounded-lg focus:outline-none focus:ring-2"
          placeholder="Paste a YouTube URL here"
          onChange={(e) => setVideoURL(e.target.value)}
        />
        <button onClick={handleGenerate} disabled={loading} className="w-full max-w-md p-4 bg-blue-600 text-white rounded-lg hover:bg-blue-700 focus:outline-none focus:ring-2 cursor-pointer">
             {loading ? "Generating..." : "Generate Study Material"}
        </button>
      </main>
    </div>
  );
}
