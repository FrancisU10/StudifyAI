'use client';

import { useEffect, useState } from 'react';
import { useRouter, useParams } from 'next/navigation';
import { useVideosStore } from '../../store/videosStore';

export default function ResultsPage() {
  const { videoId } = useParams();
  const getMaterial = useVideosStore((state) => state.getMaterial);
  const [result, setResult] = useState(null);
  const router = useRouter();

  useEffect(() => {
    const material = getMaterial(videoId);
    if (!material) {
      router.push('/');
    } else {
      setResult(material);
    }
  }, [videoId, getMaterial, router]);

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