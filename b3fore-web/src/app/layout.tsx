import type React from "react"
import type { Metadata } from "next"
import { Inter } from "next/font/google"
import { ClerkProvider } from "@clerk/nextjs"
import "~/styles/globals.css"

const inter = Inter({ subsets: ["latin"] })

export const metadata: Metadata = {
  title: "b3fore - AI Chat Interface",
  description: "A vim-inspired AI chat application with BYOK support",
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <ClerkProvider>
      <html lang="en" className="dark">
        <body className={inter.className}>{children}</body>
      </html>
    </ClerkProvider>
  )
}
