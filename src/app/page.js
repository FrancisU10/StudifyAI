'use client';

import { useRouter } from "next/navigation";
import { useAuth } from "./hooks/useAuth";
import Image from "next/image";

function UserAvatar({ user }) {
  if (user?.user_metadata?.avatar_url) {
    console.log(user.user_metadata.avatar_url)
    console.log(user)
    return (
      <Image
        width={40}
        height={40}
        src={user.user_metadata.avatar_url}
        alt="User avatar"
        className="w-10 h-10 rounded-full"
      />
    );
  }
  const letter = user?.email ? user.email.charAt(0).toUpperCase() : '?';
  return (
    <div className="w-10 h-10 rounded-full bg-blue-600 text-white flex items-center justify-center font-bold select-none">
      {letter}
    </div>
  );
}

export default function Home() {
  const { user, authLoading } = useAuth();
  const router = useRouter()
  const handleLogin = () => {
    router.push('/login');
  }
  const handleSignUp = () => {
    router.push('/signup');
  }

  if (authLoading) {
    return null // Maybe add spinner here later
  }

  return (
      <div className="pt-16 pl-60 sm:pl-52 md:pl-64 p-6 min-h-screen bg-black text-white">
      <main className="flex flex-col gap-[32px] row-start-2 items-center justify-center mt-20">
        <h1 className="text-4xl font-bold">Welcome to Studify AI</h1>
        <p className="text-lg text-gray-400">
          An AI-powered study assistant that transforms videos into study tools
        </p>
        <input
          id="video_url"
          type="text"
          className="w-full max-w-md p-4 border border-gray-300 rounded-lg focus:outline-none focus:ring-2"
          placeholder="Paste a video URL here"
        />
        <button className="w-full max-w-md p-4 bg-blue-600 text-white rounded-lg hover:bg-blue-700 focus:outline-none focus:ring-2 cursor-pointer">
          Generate Study Material
        </button>
      </main>
    </div>
  );
}
