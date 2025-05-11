"use client"

import { usePathname } from "next/navigation"
import { useEffect, useState } from "react"
import LoadingSpinner from "./loading-spinner"

export default function PageTransition({ children }) {
  const pathname = usePathname()
  const [isLoading, setIsLoading] = useState(false)
  const [content, setContent] = useState(children)

  useEffect(() => {
    // Only show loading state when pathname changes
    if (pathname) {
      setIsLoading(true)

      // Short timeout to show loading state
      const timer = setTimeout(() => {
        setContent(children)
        setIsLoading(false)
      }, 500)

      return () => clearTimeout(timer)
    }
  }, [pathname, children])

  if (isLoading) {
    return <LoadingSpinner />
  }

  return <div className="animate-fadeIn">{content}</div>
}
