"use client"

import { useState, useEffect } from "react"
import { authClient } from "@/lib/auth-client"

export function useSession() {
  const [session, setSession] = useState<any>(null)
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    const fetchSession = async () => {
      try {
        const sessionData = await authClient.getSession()
        setSession(sessionData?.data)
      } catch (error) {
        console.error("Error fetching session:", error)
      } finally {
        setIsLoading(false)
      }
    }

    fetchSession()
  }, [])

  const revokeSession = () => {
    setSession(null)
  }

  return { session, isLoading, revokeSession }
}