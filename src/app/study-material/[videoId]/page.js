'use client';

import { useState, useEffect } from "react";
import { useRouter, useParams } from "next/navigation";
import { useVideosStore } from "../../store/videosStore";
import { useAuth } from "../../hooks/useAuth";
import { supabase } from "../../supabase/supabaseClient";

export default function ResultsPage() {
  const { videoId } = useParams();
  const getMaterial = useVideosStore((state) => state.getMaterial);
  const addVideo = useVideosStore((state) => state.addVideo);
  const setMaterial = useVideosStore((state) => state.setMaterial);
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(true);
  const router = useRouter();
  const { user, authLoading } = useAuth();

  useEffect(() => {
    async function fetchMaterial() {
      let material = getMaterial(videoId);
      if (!material) {
        if (!user) {
          router.push('/');
          return;
        }
        const { data, error } = await supabase
          .from('studyMaterials')
          .select('*')
          .eq('user_id', user.id)
          .eq('video_id', videoId)
          .single();

        if (error || !data) {
          router.push('/');
          return;
        }
        addVideo({ videoId: data.video_id, title: data.title });
        setMaterial(data.video_id, {
          summary: data.summary,
          questions: data.questions,
          flashcards: data.flashcards,
        });

        material = data;
      }
      setResult(material);
      setLoading(false);
    }

    if (!authLoading) {
      fetchMaterial();
    }
  }, [videoId, getMaterial, addVideo, setMaterial, user, authLoading, router]);

  if (!result) return <p className="text-white p-6">Loading...</p>;

  return (
    <div className="pt-16 pl-64 p-6 min-h-screen bg-black text-white">
      <h1 className="text-3xl font-bold mb-6">Study Materials</h1>

      <section className="mb-10">
        <h2 className="text-2xl font-semibold mb-2">📄 Summary</h2>
        <p className="text-gray-300 whitespace-pre-line">{result.summary}</p>
      </section>

      <section className="mb-10">
        <h2 className="text-2xl font-semibold mb-2">❓ Multiple Choice Questions</h2>
        <ul className="space-y-4">
          {result.questions.map((q, i) => (
            <li key={i}>
              <strong>{i + 1}. {q.question}</strong>
              <ul className="list-disc ml-5 mt-1">
                {q.options.map((opt, j) => (
                  <li key={j}>{opt}</li>
                ))}
              </ul>
              <p className="text-green-400 mt-1">Answer: {q.answer}</p>
            </li>
          ))}
        </ul>
      </section>

      <section>
        <h2 className="text-2xl font-semibold mb-2">🧠 Flashcards</h2>
        <ul className="space-y-3">
          {result.flashcards.map((card, i) => (
            <li key={i}>
              <strong>{card.term}:</strong> {card.definition}
            </li>
          ))}
        </ul>
      </section>
    </div>
  );
}