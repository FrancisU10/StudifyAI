'use client';
import Image from "next/image";
import { useAuth } from "../hooks/useAuth"; 
import { useRouter } from "next/navigation"; 

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

export default function Navbar() {
      const { user, authLoading } = useAuth();
      const router = useRouter()
      const handleLogin = () => {
        router.push('/login');
      }
      const handleSignUp = () => {
        router.push('/signup');
      }
    
      if (authLoading) {
        return null 
      }
    return (
         <nav className="fixed top-0 transition-all duration-300 right-0 h-16 flex items-center justify-end px-4 pr-6 w-[calc(100%-15rem)] sm:w-[calc(100%-13rem)] md:w-[calc(100%-16rem)] bg-black z-10">
            {!user ? (
            <>
                <button
                onClick={handleLogin}
                className="text-sm mr-3 text-white px-4 py-2 rounded bg-gradient-to-r from-zinc-800 to-zinc-600 cursor-pointer"
                >
                Login
                </button>
                <button
                onClick={handleSignUp}
                className="text-sm text-white px-4 py-2 rounded bg-gradient-to-r from-zinc-800 to-zinc-600 cursor-pointer"
                >
                Sign Up
                </button>
            </>
            ) : (
            <>
                <span className="text-white font-semibold mr-2">Welcome,</span>
                <UserAvatar user={user} />
            </>
            )}
        </nav>
    );
}