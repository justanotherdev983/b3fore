"use client"

import type React from "react"

import { useUser } from "@clerk/nextjs"
import { SignIn } from "@clerk/nextjs"
import { Terminal, Loader2 } from "lucide-react"

interface AuthGuardProps {
  children: React.ReactNode
}

export function AuthGuard({ children }: AuthGuardProps) {
  const { isLoaded, isSignedIn } = useUser()

  if (!isLoaded) {
    return (
      <div className="h-screen bg-[#1a1b26] text-[#c0caf5] flex items-center justify-center font-mono">
        <div className="flex flex-col items-center gap-4">
          <Terminal className="w-12 h-12 text-[#7aa2f7] animate-pulse" />
          <div className="flex items-center gap-2">
            <Loader2 className="w-4 h-4 animate-spin text-[#7aa2f7]" />
            <span className="text-[#565f89]">Loading b3fore...</span>
          </div>
        </div>
      </div>
    )
  }

  if (!isSignedIn) {
    return (
      <div className="h-screen bg-[#1a1b26] text-[#c0caf5] flex items-center justify-center font-mono">
        <div className="w-full max-w-md">
          <div className="text-center mb-8">
            <div className="flex items-center justify-center gap-3 mb-4">
              <Terminal className="w-8 h-8 text-[#7aa2f7]" />
              <span className="text-2xl font-bold text-[#bb9af7]">b3fore</span>
            </div>
            <p className="text-[#565f89]">Sign in to access your vim-inspired AI chat interface</p>
          </div>

          <div className="bg-[#16161e] border border-[#292e42] rounded-lg p-6">
            <SignIn
              appearance={{
                elements: {
                  rootBox: "w-full",
                  card: "bg-transparent shadow-none border-0 p-0",
                  headerTitle: "text-[#c0caf5] text-xl font-bold",
                  headerSubtitle: "text-[#565f89]",
                  socialButtonsBlockButton: "bg-[#292e42] border-[#414868] text-[#c0caf5] hover:bg-[#1f2335]",
                  socialButtonsBlockButtonText: "text-[#c0caf5]",
                  formFieldInput: "bg-[#1a1b26] border-[#414868] text-[#c0caf5] focus:border-[#7aa2f7]",
                  formFieldLabel: "text-[#c0caf5]",
                  formButtonPrimary: "bg-[#7aa2f7] hover:bg-[#6b94f5] text-[#1a1b26]",
                  footerActionLink: "text-[#7aa2f7] hover:text-[#6b94f5]",
                  identityPreviewText: "text-[#c0caf5]",
                  identityPreviewEditButton: "text-[#7aa2f7]",
                },
              }}
            />
          </div>
        </div>
      </div>
    )
  }

  return <>{children}</>
}
