'use client'
import React from 'react'
import { useAuth } from '../hooks/useAuth'
import { useState } from 'react'
import { useRouter } from 'next/navigation'

export default function Login() {
    const router = useRouter()
    const { signIn, error, loading } = useAuth()
    const [email, setEmail] = useState('')
    const [password, setPassword] = useState('')
    const [formError, setFormError] = useState(null)

    const handleSubmit = async (e) => {
        e.preventDefault()
        setFormError(null)
        if (!email || !password) {
            setFormError("All fields are required")
            return
        }
        const result = await signIn(email, password)
        if (!result) {
            return
        }
        router.push('/')
    }

   return (
    <>
        <form onSubmit={handleSubmit} className="items-center justify-center flex flex-col">
            <input
                type="email"
                placeholder="Email"
                className="mb-4 p-2 border border-zinc-600 rounded w-64"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
            />
            <input
                type="password"
                placeholder="Password"
                className="mb-4 p-2 border border-zinc-600 rounded w-64"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
            />
            {formError && (
                <p className="text-red-500 text-sm mb-2">{formError}</p>
                )}
                {error && (
                <p className="text-red-500 text-sm mb-2">{error}</p>
            )}
            <button
                type="submit"
                className="w-64 py-2 rounded bg-gradient-to-r from-blue-800 to-blue-500 text-white hover:bg-blue-700 focus:outline-none focus:ring-2 cursor-pointer"
                disabled={loading}
            >
                {loading ? 'Logging in...' : 'Log In'}
            </button>
        </form>
    </>
   )
}