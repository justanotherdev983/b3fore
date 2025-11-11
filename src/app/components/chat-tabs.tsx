"use client"

import { useState } from "react"
import { Button } from "~/components/ui/button"
import { Badge } from "~/components/ui/badge"
import { Plus, MessageSquare, MoreVertical, Edit3, Trash2, Zap, Brain, Sparkles, Bot } from "lucide-react"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "~/components/ui/dropdown-menu"

interface ChatSession {
  id: string
  title: string
  messages: any[]
  provider: string
  model: string
}

interface ChatTabsProps {
  sessions: ChatSession[]
  activeSessionId: string
  onSessionSelect: (id: string) => void
  onNewChat: () => void
  onDeleteSession: (id: string) => void
}

const MODEL_ICONS = {
  "gpt-4o": Sparkles,
  "gpt-4o-mini": Zap,
  "gpt-4-turbo": Brain,
  "gpt-3.5-turbo": Bot,
  "anthropic/claude-3.5-sonnet": Sparkles,
  "anthropic/claude-3-haiku": Zap,
  "claude-3-5-sonnet-20241022": Sparkles,
  "claude-3-haiku-20240307": Zap,
  "claude-3-opus-20240229": Brain,
  "gemini-1.5-pro": Sparkles,
  "gemini-1.5-flash": Zap,
  "gemini-pro": Bot,
  "meta-llama/llama-3.1-405b-instruct": Brain,
  "meta-llama/llama-3.1-70b-instruct": Bot,
  "google/gemini-pro-1.5": Sparkles,
  "mistralai/mixtral-8x7b-instruct": Brain,
}

const providerColors = {
  openai: "bg-[#10a37f]",
  openrouter: "bg-[#8b5cf6]",
  anthropic: "bg-[#f97316]",
  google: "bg-[#4285f4]",
}

export function ChatTabs({ sessions, activeSessionId, onSessionSelect, onNewChat, onDeleteSession }: ChatTabsProps) {
  const [editingId, setEditingId] = useState<string | null>(null)

  const getModelDisplayName = (model: string) => {
    if (model.includes("/")) {
      return model.split("/")[1].replace("-instruct", "").replace("-", " ")
    }
    return model.replace("gpt-", "GPT-").replace("claude-", "Claude ")
  }

  const getModelIcon = (model: string) => {
    const IconComponent = MODEL_ICONS[model as keyof typeof MODEL_ICONS] || Bot
    return IconComponent
  }

  return (
    <div className="w-80 bg-[#16161e] border-l border-[#292e42] flex flex-col">
      {/* Header */}
      <div className="h-12 border-b border-[#292e42] flex items-center justify-between px-4">
        <span className="text-sm font-medium text-[#bb9af7]">Chat Sessions</span>
        <Button
          variant="ghost"
          size="sm"
          onClick={onNewChat}
          className="text-[#565f89] hover:text-[#c0caf5] hover:bg-[#292e42] h-8 w-8 p-0"
        >
          <Plus className="w-4 h-4" />
        </Button>
      </div>

      {/* Sessions List */}
      <div className="flex-1 overflow-y-auto p-2 space-y-1">
        {sessions.map((session) => {
          const ModelIcon = getModelIcon(session.model)
          return (
            <div
              key={session.id}
              className={`group relative p-3 rounded-lg cursor-pointer transition-all ${
                activeSessionId === session.id ? "bg-[#292e42] border border-[#414868]" : "hover:bg-[#1f2335]"
              }`}
              onClick={() => onSessionSelect(session.id)}
            >
              <div className="flex items-start justify-between">
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-2">
                    <MessageSquare className="w-4 h-4 text-[#7aa2f7] flex-shrink-0" />
                    <span className="text-sm font-medium text-[#c0caf5] truncate">{session.title}</span>
                  </div>

                  <div className="flex items-center gap-2 mb-1">
                    <div
                      className={`w-2 h-2 rounded-full ${providerColors[session.provider as keyof typeof providerColors]}`}
                    />
                    <span className="text-xs text-[#565f89] capitalize">{session.provider}</span>
                    <Badge variant="outline" className="text-xs border-[#414868] text-[#9ece6a]">
                      {session.messages.length}
                    </Badge>
                  </div>

                  <div className="flex items-center gap-1">
                    <ModelIcon className="w-3 h-3 text-[#7aa2f7]" />
                    <span className="text-xs text-[#565f89] truncate">{getModelDisplayName(session.model)}</span>
                  </div>
                </div>

                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button
                      variant="ghost"
                      size="sm"
                      className="opacity-0 group-hover:opacity-100 h-6 w-6 p-0 text-[#565f89] hover:text-[#c0caf5]"
                    >
                      <MoreVertical className="w-3 h-3" />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end" className="bg-[#1a1b26] border-[#414868] text-[#c0caf5]">
                    <DropdownMenuItem
                      onClick={(e) => {
                        e.stopPropagation()
                        setEditingId(session.id)
                      }}
                      className="hover:bg-[#292e42]"
                    >
                      <Edit3 className="w-4 h-4 mr-2" />
                      Rename
                    </DropdownMenuItem>
                    <DropdownMenuItem
                      onClick={(e) => {
                        e.stopPropagation()
                        onDeleteSession(session.id)
                      }}
                      className="hover:bg-[#292e42] text-[#f7768e]"
                    >
                      <Trash2 className="w-4 h-4 mr-2" />
                      Delete
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </div>
            </div>
          )
        })}
      </div>

      {/* Footer */}
      <div className="p-4 border-t border-[#292e42]">
        <div className="text-xs text-[#565f89] text-center">
          <kbd className="bg-[#292e42] px-2 py-1 rounded mr-1">n</kbd>
          New chat
        </div>
      </div>
    </div>
  )
}
