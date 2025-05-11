"use client"

import { useEffect } from "react"
import { initializeUsers, initializeSettings } from "@/lib/firebase-data"

export default function DataInitializer() {
  useEffect(() => {
    // Initialize users and settings in Firebase
    initializeUsers()
    initializeSettings()
  }, [])

  return null
}
