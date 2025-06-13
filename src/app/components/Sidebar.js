'use client'
import Image from "next/image"
import { useAuth } from "../hooks/useAuth";
import { useRouter } from "next/navigation";

export default function Sidebar() {
  const { signOut, loading, authLoading } = useAuth()
  const router = useRouter();
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
    <aside className="fixed left-0 top-0 h-full transition-all duration-300 w-60 sm:w-52 md:w-64 bg-black border-r border-zinc-800">
        <div className="flex flex-col items-center justify-center h-16 pt-10">
            <Image
                src="/logo.png"
                alt="Studify AI Logo"
                width={80}
                height={80}
                className="mt-5"
            />
            <h2 className="text-zinc-500">
                Past Studies
            </h2>
            <button onClick={handleLogout} disabled={loading} className="mt-4 px-4 py-2 bg-red-800 text-white rounded hover:bg-red-900 focus:outline-none focus:ring-2">
              {loading ? 'Logging out...' : 'Log Out'}
            </button>
        </div>
    </aside>
  )
}