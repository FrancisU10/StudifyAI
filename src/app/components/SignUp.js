'use client'
import React from 'react'
import { useAuth } from '../hooks/useAuth'
import { useState } from 'react'
import { useRouter } from 'next/navigation'

export default function SignUp() {
    const router = useRouter()
    const { signUp, error, loading } = useAuth()
    const [email, setEmail] = useState('')
    const [password, setPassword] = useState('')
    const [confirmPassword, setConfirmPassword] = useState('')
    const [formError, setFormError] = useState(null)

    async function handleSubmit(e) {
        e.preventDefault()
        setFormError(null)
        if (password !== confirmPassword) {
            setFormError("Passwords do not match")
            return
        }
        const result = await signUp(email, password)
        if (!result) {
            return
        }
        router.push('/confirm-email')
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
            <input
                type="password"
                placeholder="Confirm Password"
                className="mb-4 p-2 border border-zinc-600 rounded w-64"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                required
            />

            {(formError || error) && (
                <p className="text-red-500 mb-4">
                    {formError || error}
                </p>
            )}

            <button
                type="submit"
                className="w-64 py-2 rounded bg-gradient-to-r from-blue-800 to-blue-500 text-white focus:outline-none focus:ring-2 cursor-pointer"
            >
                {loading ? 'Signing Up...' : 'Sign Up'}
            </button>
        </form>
      </>  
    )
}