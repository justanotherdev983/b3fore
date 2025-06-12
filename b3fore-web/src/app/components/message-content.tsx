"use client"

import { CustomSyntaxHighlighter } from "./custom-syntax-highlighter"
import type { JSX } from "react"

interface MessageContentProps {
  content: string
  role: "user" | "assistant"
}

export function MessageContent({ content, role }: MessageContentProps) {
  // Parse code blocks and other markdown elements
  const parseContent = (text: string) => {
    const parts = []
    const currentIndex = 0

    // Handle headers
    const headerRegex = /^(#{1,6})\s+(.+)$/gm
    // Handle code blocks
    const codeBlockRegex = /```(\w+)?\n([\s\S]*?)```/g
    // Handle inline code
    const inlineCodeRegex = /`([^`]+)`/g
    // Handle bold text
    const boldRegex = /\*\*([^*]+)\*\*/g

    // Combine all patterns and sort by position
    const allMatches = []

    let match
    while ((match = codeBlockRegex.exec(text)) !== null) {
      allMatches.push({
        type: "codeblock",
        start: match.index,
        end: match.index + match[0].length,
        language: match[1] || "text",
        content: match[2].trim(),
        fullMatch: match[0],
      })
    }

    // Reset regex
    headerRegex.lastIndex = 0
    while ((match = headerRegex.exec(text)) !== null) {
      // Check if this header is inside a code block
      const insideCodeBlock = allMatches.some((cb) => match.index >= cb.start && match.index < cb.end)
      if (!insideCodeBlock) {
        allMatches.push({
          type: "header",
          start: match.index,
          end: match.index + match[0].length,
          level: match[1].length,
          content: match[2],
          fullMatch: match[0],
        })
      }
    }

    // Sort matches by position
    allMatches.sort((a, b) => a.start - b.start)

    // Build parts array
    let lastIndex = 0
    allMatches.forEach((match) => {
      // Add text before this match
      if (match.start > lastIndex) {
        const textContent = text.slice(lastIndex, match.start)
        if (textContent.trim()) {
          parts.push({
            type: "text",
            content: textContent,
          })
        }
      }

      // Add the match
      parts.push(match)
      lastIndex = match.end
    })

    // Add remaining text
    if (lastIndex < text.length) {
      const remainingText = text.slice(lastIndex)
      if (remainingText.trim()) {
        parts.push({
          type: "text",
          content: remainingText,
        })
      }
    }

    return parts.length > 0 ? parts : [{ type: "text", content: text }]
  }

  const parts = parseContent(content)

  return (
    <div className="space-y-3">
      {parts.map((part, index) => {
        if (part.type === "codeblock") {
          return (
            <div key={index} className="relative">
              <div className="flex items-center justify-between bg-[#16161e] px-3 py-2 rounded-t-lg border border-[#414868]">
                <span className="text-xs text-[#565f89] font-medium uppercase tracking-wide">{part.language}</span>
                <div className="flex gap-1">
                  <div className="w-3 h-3 rounded-full bg-[#f7768e]"></div>
                  <div className="w-3 h-3 rounded-full bg-[#e0af68]"></div>
                  <div className="w-3 h-3 rounded-full bg-[#9ece6a]"></div>
                </div>
              </div>
              <div className="bg-[#1a1b26] border border-[#414868] border-t-0 rounded-b-lg overflow-x-auto">
                <CustomSyntaxHighlighter code={part.content} language={part.language} />
              </div>
            </div>
          )
        } else if (part.type === "header") {
          const HeaderTag = `h${Math.min(part.level, 6)}` as keyof JSX.IntrinsicElements
          const headerClasses = {
            1: "text-2xl font-bold text-[#bb9af7] mb-4 mt-6",
            2: "text-xl font-bold text-[#7aa2f7] mb-3 mt-5",
            3: "text-lg font-semibold text-[#9ece6a] mb-2 mt-4",
            4: "text-base font-semibold text-[#e0af68] mb-2 mt-3",
            5: "text-sm font-semibold text-[#f7768e] mb-1 mt-2",
            6: "text-sm font-medium text-[#565f89] mb-1 mt-2",
          }

          return (
            <HeaderTag key={index} className={headerClasses[part.level as keyof typeof headerClasses]}>
              {part.content}
            </HeaderTag>
          )
        } else {
          // Handle inline formatting in text
          const formatText = (text: string) => {
            // Handle inline code
            const inlineCodeRegex = /`([^`]+)`/g
            const boldRegex = /\*\*([^*]+)\*\*/g

            const formattedText = text
            const elements = []
            let lastIndex = 0

            // Find all inline code and bold matches
            const matches = []
            let match

            while ((match = inlineCodeRegex.exec(text)) !== null) {
              matches.push({
                type: "inline-code",
                start: match.index,
                end: match.index + match[0].length,
                content: match[1],
              })
            }

            // Reset regex
            boldRegex.lastIndex = 0
            while ((match = boldRegex.exec(text)) !== null) {
              matches.push({
                type: "bold",
                start: match.index,
                end: match.index + match[0].length,
                content: match[1],
              })
            }

            matches.sort((a, b) => a.start - b.start)

            matches.forEach((match, i) => {
              // Add text before match
              if (match.start > lastIndex) {
                elements.push(text.slice(lastIndex, match.start))
              }

              // Add formatted element
              if (match.type === "inline-code") {
                elements.push(
                  <code key={i} className="bg-[#292e42] text-[#9ece6a] px-1.5 py-0.5 rounded text-sm font-mono">
                    {match.content}
                  </code>,
                )
              } else if (match.type === "bold") {
                elements.push(
                  <strong key={i} className="font-bold text-[#c0caf5]">
                    {match.content}
                  </strong>,
                )
              }

              lastIndex = match.end
            })

            // Add remaining text
            if (lastIndex < text.length) {
              elements.push(text.slice(lastIndex))
            }

            return elements.length > 0 ? elements : [text]
          }

          return (
            <div key={index} className="whitespace-pre-wrap leading-relaxed">
              {formatText(part.content)}
            </div>
          )
        }
      })}
    </div>
  )
}
