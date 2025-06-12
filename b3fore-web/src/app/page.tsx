"use client"

import { useState, useEffect, useRef } from "react"
import { useChat } from "ai/react"
import { useUser } from "@clerk/nextjs"
import { Button } from "~/components/ui/button"
import { Input } from "~/components/ui/input"
import { Badge } from "~/components/ui/badge"
import { Settings, Send, Terminal, Bot } from "lucide-react"
import { AuthGuard } from "./components/auth-guard"
import { UserMenu } from "./components/user-menu"
import { ChatTabs } from "./components/chat-tabs"
import { SettingsModal } from "./components/settings-modal"
import { CommandPalette } from "./components/command-palette"
import { MessageContent } from "./components/message-content"
import { ModelSelector } from "./components/model-selector"
import { ProviderSelector } from "./components/provider-selector"

interface ChatSession {
  id: string
  title: string
  messages: any[]
  provider: string
  model: string
  userId: string
}

const DEFAULT_MODELS = {
  openai: "gpt-4o-mini",
  openrouter: "anthropic/claude-3.5-sonnet",
  anthropic: "claude-3-5-sonnet-20241022",
  google: "gemini-1.5-flash",
}

const WELCOME_MESSAGE = {
  id: "welcome",
  role: "assistant" as const,
  content: `# Welcome to b3fore! 🚀

Your **vim-inspired AI chat interface** is ready. I'm here to help you with coding, questions, and more!

## Quick Start
Here's a sample of what I can help you with:

\`\`\`typescript
// TypeScript example - AI-powered chat interface
interface ChatMessage {
  id: string
  role: 'user' | 'assistant'
  content: string
  timestamp: Date
}

const sendMessage = async (message: string): Promise<ChatMessage> => {
  const response = await fetch('/api/chat', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ 
      messages: [{ role: 'user', content: message }],
      provider: 'openai',
      model: 'gpt-4o-mini'
    })
  })
  
  if (!response.ok) {
    throw new Error('Failed to send message')
  }
  
  return response.json()
}

// Usage example
const handleUserMessage = async (input: string) => {
  try {
    const aiResponse = await sendMessage(input)
    console.log('AI Response:', aiResponse.content)
  } catch (error) {
    console.error('Error:', error)
  }
}
\`\`\`

### Vim Shortcuts Available
\`\`\`bash
# Navigation and commands:
Esc          # Enter normal mode
i            # Insert mode (focus input)
:set         # Open settings
:new         # Create new chat
Ctrl+P       # Command palette
\`\`\`

\`\`\`python
# Python example - I can help with any language!
def fibonacci(n: int) -> int:
    """Generate the nth Fibonacci number using recursion."""
    if n <= 1:
        return n
    return fibonacci(n-1) + fibonacci(n-2)

def fibonacci_sequence(count: int) -> list[int]:
    """Generate a list of Fibonacci numbers."""
    return [fibonacci(i) for i in range(count)]

# Generate first 10 fibonacci numbers
fib_numbers = fibonacci_sequence(10)
print(f"Fibonacci sequence: {fib_numbers}")

# Output: [0, 1, 1, 2, 3, 5, 8, 13, 21, 34]
\`\`\`

## Features

- 🔑 **BYOK Support** - Bring your own API keys (OpenAI, OpenRouter, etc.)
- 🤖 **Multiple Models** - Switch between different AI models easily
- ⌨️ **Vim Shortcuts** - Navigate like a pro with familiar keybindings
- 🎨 **Syntax Highlighting** - Beautiful code rendering with custom highlighter
- 💬 **Multiple Chats** - Organize your conversations in tabs
- 🌙 **Dark Theme** - Tokyo Night inspired colorscheme, easy on the eyes
- 🚀 **Real-time Streaming** - See responses as they're generated
- 👤 **User Authentication** - Secure login with Clerk

## Getting Started

1. **Configure API Keys**: Click the settings icon or use \`:set\` to add your API keys
2. **Choose Your Model**: Select from various AI models using the dropdown
3. **Start Chatting**: Type your message and press Enter
4. **Use Vim Mode**: Press \`Esc\` to enter normal mode, \`i\` to return to insert mode
5. **Create New Chats**: Use \`:new\` or click the + button in the sidebar
6. **Command Palette**: Press \`Ctrl+P\` for quick actions

Ready to start? Just type your message below or use **Ctrl+P** for the command palette!`,
}

function B3foreApp() {
  const { user } = useUser()
  const [sessions, setSessions] = useState<ChatSession[]>([])
  const [activeSessionId, setActiveSessionId] = useState<string>("")
  const [showSettings, setShowSettings] = useState(false)
  const [showCommandPalette, setShowCommandPalette] = useState(false)
  const [vimMode, setVimMode] = useState(false)
  const [apiKeys, setApiKeys] = useState({
    openai: "",
    openrouter: "",
    anthropic: "",
    google: "",
  })

  const inputRef = useRef<HTMLInputElement>(null)

  // Initialize user sessions
  useEffect(() => {
    if (user && sessions.length === 0) {
      const welcomeSession: ChatSession = {
        id: "welcome-" + user.id,
        title: "Welcome",
        messages: [WELCOME_MESSAGE],
        provider: "openai",
        model: DEFAULT_MODELS.openai,
        userId: user.id,
      }
      setSessions([welcomeSession])
      setActiveSessionId(welcomeSession.id)
    }
  }, [user, sessions.length])

  // Load user's API keys from localStorage
  useEffect(() => {
    if (user) {
      const savedKeys = localStorage.getItem(`b3fore-api-keys-${user.id}`)
      if (savedKeys) {
        setApiKeys(JSON.parse(savedKeys))
      }
    }
  }, [user])

  // Save API keys to localStorage
  useEffect(() => {
    if (user && Object.values(apiKeys).some((key) => key !== "")) {
      localStorage.setItem(`b3fore-api-keys-${user.id}`, JSON.stringify(apiKeys))
    }
  }, [apiKeys, user])

  const activeSession = sessions.find((s) => s.id === activeSessionId)

  const { messages, input, handleInputChange, handleSubmit, isLoading } = useChat({
    api: "/api/chat",
    body: {
      provider: activeSession?.provider || "openai",
      model: activeSession?.model || DEFAULT_MODELS.openai,
      apiKey: apiKeys[activeSession?.provider as keyof typeof apiKeys] || "",
      userId: user?.id,
    },
    initialMessages: activeSession?.id.startsWith("welcome") ? [WELCOME_MESSAGE] : [],
  })

  // Vim-like keyboard shortcuts
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      // Escape to enter command mode
      if (e.key === "Escape") {
        setVimMode(true)
        inputRef.current?.blur()
      }

      // Command palette with Ctrl+P
      if (e.ctrlKey && e.key === "p") {
        e.preventDefault()
        setShowCommandPalette(true)
      }

      // Settings with :set
      if (vimMode && e.key === ":") {
        e.preventDefault()
        setShowSettings(true)
        setVimMode(false)
      }

      // New chat with :new
      if (vimMode && e.key === "n") {
        e.preventDefault()
        createNewChat()
        setVimMode(false)
      }

      // Focus input with 'i'
      if (vimMode && e.key === "i") {
        e.preventDefault()
        inputRef.current?.focus()
        setVimMode(false)
      }
    }

    window.addEventListener("keydown", handleKeyDown)
    return () => window.removeEventListener("keydown", handleKeyDown)
  }, [vimMode])

  const createNewChat = () => {
    if (!user) return

    const newId = `chat-${Date.now()}-${user.id}`
    const newSession: ChatSession = {
      id: newId,
      title: "New Chat",
      messages: [],
      provider: "openai",
      model: DEFAULT_MODELS.openai,
      userId: user.id,
    }
    setSessions([...sessions, newSession])
    setActiveSessionId(newId)
  }

  const deleteSession = (id: string) => {
    if (sessions.length === 1) return
    const newSessions = sessions.filter((s) => s.id !== id)
    setSessions(newSessions)
    if (activeSessionId === id) {
      setActiveSessionId(newSessions[0].id)
    }
  }

  const updateSessionProvider = (provider: string) => {
    if (!activeSession) return
    const updatedSessions = sessions.map((session) =>
      session.id === activeSessionId
        ? {
            ...session,
            provider,
            model: DEFAULT_MODELS[provider as keyof typeof DEFAULT_MODELS],
          }
        : session,
    )
    setSessions(updatedSessions)
  }

  const updateSessionModel = (model: string) => {
    if (!activeSession) return
    const updatedSessions = sessions.map((session) =>
      session.id === activeSessionId ? { ...session, model } : session,
    )
    setSessions(updatedSessions)
  }

  if (!user) {
    return null // AuthGuard will handle this
  }

  return (
    <div className="h-screen bg-[#1a1b26] text-[#c0caf5] flex overflow-hidden font-mono">
      {/* Main Chat Area */}
      <div className="flex-1 flex flex-col">
        {/* Header */}
        <div className="h-12 bg-[#16161e] border-b border-[#292e42] flex items-center justify-between px-4">
          <div className="flex items-center gap-3">
            <Terminal className="w-5 h-5 text-[#7aa2f7]" />
            <span className="text-lg font-bold text-[#bb9af7]">b3fore</span>
            <Badge variant="outline" className="text-xs border-[#414868] text-[#9ece6a]">
              v0.1.0
            </Badge>
          </div>

          <div className="flex items-center gap-3">
            {vimMode && <Badge className="bg-[#f7768e] text-[#1a1b26] text-xs">NORMAL</Badge>}
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setShowSettings(true)}
              className="text-[#565f89] hover:text-[#c0caf5] hover:bg-[#292e42]"
            >
              <Settings className="w-4 h-4" />
            </Button>
            <UserMenu />
          </div>
        </div>

        {/* Model Selection Bar */}
        <div className="bg-[#16161e] border-b border-[#292e42] p-3">
          <div className="flex items-center gap-4">
            <ProviderSelector
              currentProvider={activeSession?.provider || "openai"}
              onProviderChange={updateSessionProvider}
              apiKeys={apiKeys}
              disabled={isLoading}
            />
            <ModelSelector
              provider={activeSession?.provider || "openai"}
              currentModel={activeSession?.model || DEFAULT_MODELS.openai}
              onModelChange={updateSessionModel}
              disabled={isLoading}
            />
          </div>
        </div>

        {/* Chat Messages */}
        <div className="flex-1 overflow-y-auto p-4 space-y-4">
          {messages.length === 0 ? (
            <div className="flex flex-col items-center justify-center h-full text-center">
              <Bot className="w-16 h-16 text-[#7aa2f7] mb-4" />
              <h2 className="text-2xl font-bold text-[#bb9af7] mb-2">Start a new conversation</h2>
              <p className="text-[#565f89] mb-4">Your vim-inspired AI chat interface</p>
              <div className="text-sm text-[#565f89] space-y-1">
                <p>
                  <kbd className="bg-[#292e42] px-2 py-1 rounded">Esc</kbd> Enter normal mode
                </p>
                <p>
                  <kbd className="bg-[#292e42] px-2 py-1 rounded">i</kbd> Insert mode (focus input)
                </p>
                <p>
                  <kbd className="bg-[#292e42] px-2 py-1 rounded">:set</kbd> Open settings
                </p>
                <p>
                  <kbd className="bg-[#292e42] px-2 py-1 rounded">Ctrl+P</kbd> Command palette
                </p>
              </div>
            </div>
          ) : (
            messages.map((message) => (
              <div key={message.id} className={`flex ${message.role === "user" ? "justify-end" : "justify-start"}`}>
                <div
                  className={`max-w-[85%] p-4 rounded-lg ${
                    message.role === "user"
                      ? "bg-[#7aa2f7] text-[#1a1b26]"
                      : "bg-[#292e42] text-[#c0caf5] border border-[#414868]"
                  }`}
                >
                  <MessageContent content={message.content} role={message.role} />
                </div>
              </div>
            ))
          )}

          {isLoading && (
            <div className="flex justify-start">
              <div className="bg-[#292e42] text-[#c0caf5] border border-[#414868] p-3 rounded-lg">
                <div className="flex items-center gap-2">
                  <div className="w-2 h-2 bg-[#7aa2f7] rounded-full animate-pulse"></div>
                  <div className="w-2 h-2 bg-[#7aa2f7] rounded-full animate-pulse delay-100"></div>
                  <div className="w-2 h-2 bg-[#7aa2f7] rounded-full animate-pulse delay-200"></div>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Input Area */}
        <div className="p-4 bg-[#16161e] border-t border-[#292e42]">
          <form onSubmit={handleSubmit} className="flex gap-2">
            <div className="flex-1 relative">
              <Input
                ref={inputRef}
                value={input}
                onChange={handleInputChange}
                placeholder={vimMode ? "-- NORMAL --" : "Type your message... (Esc for normal mode)"}
                disabled={vimMode}
                className="bg-[#1a1b26] border-[#414868] text-[#c0caf5] placeholder-[#565f89] focus:border-[#7aa2f7] pr-10"
              />
              {!vimMode && (
                <Button
                  type="submit"
                  size="sm"
                  disabled={isLoading || !input.trim()}
                  className="absolute right-1 top-1 h-8 w-8 p-0 bg-[#7aa2f7] hover:bg-[#6b94f5] text-[#1a1b26]"
                >
                  <Send className="w-4 h-4" />
                </Button>
              )}
            </div>
          </form>
        </div>
      </div>

      {/* Right Sidebar - Chat Tabs */}
      <ChatTabs
        sessions={sessions}
        activeSessionId={activeSessionId}
        onSessionSelect={setActiveSessionId}
        onNewChat={createNewChat}
        onDeleteSession={deleteSession}
      />

      {/* Modals */}
      <SettingsModal
        open={showSettings}
        onOpenChange={setShowSettings}
        apiKeys={apiKeys}
        onApiKeysChange={setApiKeys}
      />

      <CommandPalette
        open={showCommandPalette}
        onOpenChange={setShowCommandPalette}
        onNewChat={createNewChat}
        onSettings={() => setShowSettings(true)}
      />
    </div>
  )
}

export default function B3fore() {
  return (
    <AuthGuard>
      <B3foreApp />
    </AuthGuard>
  )
}
