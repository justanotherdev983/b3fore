"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { Input } from "~/components/ui/input"
import { Dialog, DialogContent } from "~/components/ui/dialog"
import { Search, Plus, Settings, Terminal } from "lucide-react"

interface CommandPaletteProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  onNewChat: () => void
  onSettings: () => void
}

export function CommandPalette({ open, onOpenChange, onNewChat, onSettings }: CommandPaletteProps) {
  const [query, setQuery] = useState("")
  const [selectedIndex, setSelectedIndex] = useState(0)

  const commands = [
    {
      id: "new-chat",
      title: "New Chat",
      description: "Start a new conversation",
      icon: Plus,
      action: () => {
        onNewChat()
        onOpenChange(false)
      },
      shortcut: ":new",
    },
    {
      id: "settings",
      title: "Settings",
      description: "Configure API keys and preferences",
      icon: Settings,
      action: () => {
        onSettings()
        onOpenChange(false)
      },
      shortcut: ":set",
    },
    {
      id: "vim-help",
      title: "Vim Shortcuts",
      description: "View available keyboard shortcuts",
      icon: Terminal,
      action: () => {
        // Could open a help modal
        onOpenChange(false)
      },
      shortcut: ":help",
    },
  ]

  const filteredCommands = commands.filter(
    (cmd) =>
      cmd.title.toLowerCase().includes(query.toLowerCase()) ||
      cmd.description.toLowerCase().includes(query.toLowerCase()) ||
      cmd.shortcut.includes(query),
  )

  useEffect(() => {
    setSelectedIndex(0)
  }, [query])

  useEffect(() => {
    if (!open) {
      setQuery("")
      setSelectedIndex(0)
    }
  }, [open])

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "ArrowDown") {
      e.preventDefault()
      setSelectedIndex((prev) => Math.min(prev + 1, filteredCommands.length - 1))
    } else if (e.key === "ArrowUp") {
      e.preventDefault()
      setSelectedIndex((prev) => Math.max(prev - 1, 0))
    } else if (e.key === "Enter") {
      e.preventDefault()
      if (filteredCommands[selectedIndex]) {
        filteredCommands[selectedIndex].action()
      }
    }
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="bg-[#1a1b26] border-[#414868] text-[#c0caf5] max-w-lg p-0">
        <div className="p-4 border-b border-[#292e42]">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-[#565f89]" />
            <Input
              placeholder="Type a command or search..."
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              onKeyDown={handleKeyDown}
              className="bg-[#16161e] border-[#414868] text-[#c0caf5] placeholder-[#565f89] focus:border-[#7aa2f7] pl-10"
              autoFocus
            />
          </div>
        </div>

        <div className="max-h-80 overflow-y-auto">
          {filteredCommands.length === 0 ? (
            <div className="p-4 text-center text-[#565f89]">No commands found</div>
          ) : (
            filteredCommands.map((command, index) => (
              <div
                key={command.id}
                className={`p-3 cursor-pointer transition-colors ${
                  index === selectedIndex ? "bg-[#292e42]" : "hover:bg-[#1f2335]"
                }`}
                onClick={command.action}
              >
                <div className="flex items-center gap-3">
                  <command.icon className="w-4 h-4 text-[#7aa2f7]" />
                  <div className="flex-1">
                    <div className="text-sm font-medium text-[#c0caf5]">{command.title}</div>
                    <div className="text-xs text-[#565f89]">{command.description}</div>
                  </div>
                  <div className="text-xs text-[#565f89] bg-[#16161e] px-2 py-1 rounded">{command.shortcut}</div>
                </div>
              </div>
            ))
          )}
        </div>
      </DialogContent>
    </Dialog>
  )
}
