'use client'

import Login from "../components/Login"
import Image from "next/image"
import { useAuth } from "../hooks/useAuth"

export default function LoginPage() {
    const { signInWithGoogle, error } = useAuth()
    return (
        <>
        <div className="flex flex-col items-center justify-center min-h-screen">
            <div className="p-8 rounded-lg shadow-md w-96 items-center border-zinc-600 border">
                <div className="flex justify-center items-center">
                    <h1 className="text-2xl font-bold text-white mb-0 text-center">
                        Studify AI
                    </h1>
                    <Image
                        src="/logo.png"
                        alt="Studify AI Logo"
                        width={100}
                        height={100}
                    />
                </div>
                <Login />
                <div className="flex items-center justify-center mt-6 gap-4 w-full">
                    <div className="h-px flex-1 bg-white" />
                    <p className="text-center text-sm text-white">OR</p>
                    <div className="h-px flex-1 bg-white" />
                </div>
                <div className="flex items-center justify-center gap-2 mt-4 cursor-pointer">
                    <Image
                        src="/google.png"
                        alt="Google Logo"
                        width={24}
                        height={24}
                        className="mb-0"
                    />
                    <p onClick={signInWithGoogle} className="text-blue-600 hover:underline text-sm">
                        Login with Google
                    </p>
                </div>
            </div>
             <div className="border border-zinc-500 w-96 p-8 text-white mt-4">
                <p className="text-center text-sm">
                    Don&apos;t have an account?
                    <a href="/signup" className="text-blue-600 hover:underline ml-1">Sign Up</a>
                </p>
                {error && <p className="text-red-500">{error}</p>}
            </div>
        </div>
        </>
    )
}