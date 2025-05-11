"use client"

import { TestProvider } from "@/lib/test-context"

export default function TestLayout({ children }) {
  return <TestProvider>{children}</TestProvider>
}
