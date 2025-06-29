import type React from "react"
import type { Metadata } from "next"
import { Inter } from "next/font/google"
import "./globals.css"

const inter = Inter({ subsets: ["latin"] })

export const metadata: Metadata = {
  title: "API Documentation Generator – AI-Powered Tool to Create REST Docs Instantly",
  description: "Generate clean, AI-enhanced API docs from your JSON schema in seconds",
  keywords: ["API", "documentation", "generator", "JSON", "schema", "AI", "API Documentation Generator"],
  authors: [{ name: "API Docs Generator" }],
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head />
      <body className={inter.className}>{children}</body>
    </html>
  )
}
