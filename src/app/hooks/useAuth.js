'use client'
import { useState, useEffect } from "react"
import { supabase } from "../supabase/supabaseClient"
    
export function useAuth() {
   const [error, setError] = useState(null)
   const [loading, setLoading] = useState(false)
   const [user, setUser] = useState(null)
   const [authLoading, setAuthLoading] = useState(true)

   useEffect(() => {
      supabase.auth.getUser().then(({ data }) => {
         setUser(data.user || null)
         setAuthLoading(false)
      })

      const { data: authListener } = supabase.auth.onAuthStateChange((_event, session) => {
         setUser(session?.user ?? null)
         setAuthLoading(false)
      })

      return () => {
         authListener.subscription.unsubscribe()
      }
   }, [])

   async function signUp(email, password) {
      setLoading(true)
      setError(null)
      const { error, data } = await supabase.auth.signUp({ email, password})
      setLoading(false)
      if (error) {
         setError(error.message)
         return null
      }
      return data
   }

   async function signIn(email, password) {
      setLoading(true)
      setError(null)
      const { error, data } = await supabase.auth.signInWithPassword({ email, password})
      setLoading(false)
      if (error) {
         setError(error.message)
         return null
      }
      return data
   }

   async function signInWithGoogle() {
      setLoading(true)
      setError(null)
      const { error } = await supabase.auth.signInWithOAuth({ provider: 'google' })
      setLoading(false)
      if (error) {
         setError(error.message)
      }
   }

    async function signOut() {
      setLoading(true)
      setError(null)
      setAuthLoading(true)
      const { error } = await supabase.auth.signOut()
      setLoading(false)
      setAuthLoading(false)
      if (error) {
         setError(error.message)
         return false
      }
      return true
   }

   return {
        signUp,
        signIn,
        signInWithGoogle,
        signOut,
        user,
        error,
        loading,
        authLoading
   }
}