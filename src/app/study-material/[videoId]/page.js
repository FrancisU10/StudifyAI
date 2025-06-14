'use client';

import { useState, useEffect } from "react";
import { useRouter, useParams } from "next/navigation";
import { useVideosStore } from "../../store/videosStore";
import { useAuth } from "../../hooks/useAuth";
import { supabase } from "../../supabase/supabaseClient";
import  LoadingScreen from "../../components/LoadingScreen";

export default function ResultsPage() {
  const { videoId } = useParams();
  const getMaterial = useVideosStore((state) => state.getMaterial);
  const addVideo = useVideosStore((state) => state.addVideo);
  const setMaterial = useVideosStore((state) => state.setMaterial);
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(true);
  const router = useRouter();
  const { user, authLoading } = useAuth();

  const [flashIndex, setFlashIndex] = useState(0);
  const [flipped, setFlipped] = useState(false);
  const [questionIndex, setQuestionIndex] = useState(0);
  const [selectedAnswer, setSelectedAnswer] = useState(null);

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
      setFlashIndex(0);
      setFlipped(false);
      setQuestionIndex(0);
      setSelectedAnswer(null);
    }

    if (!authLoading) {
      fetchMaterial();
    }
  }, [videoId, getMaterial, addVideo, setMaterial, user, authLoading, router]);

  if (loading || !result) return <LoadingScreen/>

  const flashcard = result.flashcards?.[flashIndex];
  const currentQuestion = result.questions?.[questionIndex];

  return (
    <div className="bg-black min-h-screen text-white
      pt-16
      pl-52 sm:pl-52 md:pl-64
      pr-4
      overflow-x-hidden
      "
    >
      {/* Center container max width and full width */}
      <div className="w-full max-w-4xl mx-auto flex flex-col items-center space-y-16 px-4 sm:px-6 lg:px-8">
        <h1 className="text-3xl font-bold mb-6 text-center">Study Materials</h1>

        <section
          id="summary"
          className="w-full max-w-full text-center"
          style={{ maxWidth: '100%' }}
        >
          <h2 className="text-2xl font-semibold mb-4">📄 Summary</h2>
          <p className="text-gray-300 whitespace-pre-line break-words">{result.summary}</p>
        </section>

        <section
          id="flashcards"
          className="w-full max-w-full flex flex-col items-center"
          style={{ maxWidth: '100%' }}
        >
          <h2 className="text-2xl font-semibold mb-4 text-center">🧠 Flashcards</h2>
          {flashcard ? (
            <>
              <div
                className="relative w-full max-w-md h-80 perspective cursor-pointer"
                onClick={() => setFlipped(!flipped)}
              >
                <div className={`flip-card-inner ${flipped ? "flipped" : ""}`}>
                  <div className="flip-card-front bg-black border border-gray-700 rounded-lg shadow-md flex items-center justify-center text-xl md:text-2xl font-semibold text-white p-4 md:p-6 text-center">
                    {flashcard.term}
                  </div>
                  <div className="flip-card-back bg-black border border-gray-700 rounded-lg shadow-md flex items-center justify-center text-xl md:text-2xl font-semibold text-white p-4 md:p-6 text-center">
                    {flashcard.definition}
                  </div>
                </div>
              </div>

              <div className="mt-4 flex gap-4">
                <button
                  disabled={flashIndex === 0}
                  onClick={() => {
                    setFlipped(false);
                    setFlashIndex((i) => Math.max(i - 1, 0));
                  }}
                  className="px-5 py-2 bg-gray-700 rounded hover:bg-gray-600 transition disabled:opacity-40"
                >
                  Previous
                </button>
                <button
                  disabled={flashIndex === result.flashcards.length - 1}
                  onClick={() => {
                    setFlipped(false);
                    setFlashIndex((i) => Math.min(i + 1, result.flashcards.length - 1));
                  }}
                  className="px-5 py-2 bg-gray-700 rounded hover:bg-gray-600 transition disabled:opacity-40"
                >
                  Next
                </button>
              </div>
              <p className="mt-2 text-gray-400 text-sm">
                Flashcard {flashIndex + 1} of {result.flashcards.length}
              </p>
            </>
          ) : (
            <p>No flashcards available.</p>
          )}
        </section>

        <section
          id="questions"
          className="w-full max-w-full text-center"
          style={{ maxWidth: '100%' }}
        >
          <h2 className="text-2xl font-semibold mb-4">❓ Multiple Choice Questions</h2>
          {currentQuestion ? (
            <>
              <p className="mb-4 font-semibold text-lg md:text-xl">
                {questionIndex + 1}. {currentQuestion.question}
              </p>
              <div className="space-y-2 text-left max-w-full">
                {currentQuestion.options.map((opt, i) => {
                  const isSelected = selectedAnswer === opt;
                  const isCorrect = currentQuestion.answer === opt;
                  const isAnswered = selectedAnswer !== null;

                  let btnClass = "w-full p-3 rounded border text-left cursor-pointer ";
                  if (isAnswered) {
                    if (isSelected) {
                      btnClass += isCorrect
                        ? "bg-green-600 border-green-600 text-white"
                        : "bg-red-600 border-red-600 text-white";
                    } else if (isCorrect) {
                      btnClass += "bg-green-600 border-green-600 text-white";
                    } else {
                      btnClass += "bg-gray-700 border-gray-700 text-gray-400 cursor-not-allowed";
                    }
                  } else {
                    btnClass += "bg-gray-800 border-gray-600 hover:bg-gray-700";
                  }

                  return (
                    <button
                      key={i}
                      disabled={isAnswered}
                      onClick={() => setSelectedAnswer(opt)}
                      className={btnClass}
                    >
                      {opt}
                    </button>
                  );
                })}
              </div>

              <div className="mt-4 flex justify-between">
                <button
                  disabled={questionIndex === 0}
                  onClick={() => {
                    setSelectedAnswer(null);
                    setQuestionIndex((i) => Math.max(i - 1, 0));
                  }}
                  className="px-5 py-2 bg-gray-700 rounded disabled:opacity-50"
                >
                  Previous Question
                </button>
                <button
                  disabled={questionIndex === result.questions.length - 1}
                  onClick={() => {
                    setSelectedAnswer(null);
                    setQuestionIndex((i) => Math.min(i + 1, result.questions.length - 1));
                  }}
                  className="px-5 py-2 bg-gray-700 rounded disabled:opacity-50"
                >
                  Next Question
                </button>
              </div>
              <p className="mt-2 text-gray-400 text-sm">
                Question {questionIndex + 1} of {result.questions.length}
              </p>
            </>
          ) : (
            <p>No questions available.</p>
          )}
        </section>
      </div>
    </div>
  );
}