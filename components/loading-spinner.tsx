"use client"

export default function LoadingSpinner({ fullScreen = true }) {
  return (
    <div className={`flex flex-col justify-center items-center ${fullScreen ? "h-screen" : "h-64"}`}>
      <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-emerald-500"></div>
      <p className="mt-4 text-emerald-700 font-medium">Loading...</p>
    </div>
  )
}
