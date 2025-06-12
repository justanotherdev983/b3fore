"use client"

import { useState } from "react"
import { Button } from "~/components/ui/button"
import { Input } from "~/components/ui/input"
import { Label } from "~/components/ui/label"
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "~/components/ui/dialog"
import { Badge } from "~/components/ui/badge"
import { Key, Eye, EyeOff, ExternalLink } from "lucide-react"

interface SettingsModalProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  apiKeys: {
    openai: string
    openrouter: string
    anthropic: string
    google: string
  }
  onApiKeysChange: (keys: any) => void
}

export function SettingsModal({ open, onOpenChange, apiKeys, onApiKeysChange }: SettingsModalProps) {
  const [showKeys, setShowKeys] = useState<Record<string, boolean>>({})
  const [tempKeys, setTempKeys] = useState(apiKeys)

  const providers = [
    {
      id: "openai",
      name: "OpenAI",
      description: "GPT-4, GPT-3.5 Turbo",
      color: "bg-[#10a37f]",
      url: "https://platform.openai.com/api-keys",
    },
    {
      id: "openrouter",
      name: "OpenRouter",
      description: "Access to 100+ models",
      color: "bg-[#8b5cf6]",
      url: "https://openrouter.ai/keys",
    },
    {
      id: "anthropic",
      name: "Anthropic",
      description: "Claude 3 models",
      color: "bg-[#f97316]",
      url: "https://console.anthropic.com/account/keys",
    },
    {
      id: "google",
      name: "Google AI",
      description: "Gemini models",
      color: "bg-[#4285f4]",
      url: "https://makersuite.google.com/app/apikey",
    },
  ]

  const handleSave = () => {
    onApiKeysChange(tempKeys)
    onOpenChange(false)
  }

  const toggleShowKey = (provider: string) => {
    setShowKeys((prev) => ({ ...prev, [provider]: !prev[provider] }))
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="bg-[#1a1b26] border-[#414868] text-[#c0caf5] max-w-2xl">
        <DialogHeader>
          <DialogTitle className="text-[#bb9af7] flex items-center gap-2">
            <Key className="w-5 h-5" />
            API Configuration
          </DialogTitle>
          <DialogDescription className="text-[#565f89]">
            Configure your API keys for different AI providers. Your keys are stored locally and never sent to our
            servers.
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-6 py-4">
          {providers.map((provider) => (
            <div key={provider.id} className="space-y-3">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className={`w-3 h-3 rounded-full ${provider.color}`} />
                  <div>
                    <Label className="text-[#c0caf5] font-medium">{provider.name}</Label>
                    <p className="text-xs text-[#565f89]">{provider.description}</p>
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  {tempKeys[provider.id as keyof typeof tempKeys] && (
                    <Badge className="bg-[#9ece6a] text-[#1a1b26] text-xs">Configured</Badge>
                  )}
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => window.open(provider.url, "_blank")}
                    className="text-[#565f89] hover:text-[#c0caf5] h-8 w-8 p-0"
                  >
                    <ExternalLink className="w-3 h-3" />
                  </Button>
                </div>
              </div>

              <div className="relative">
                <Input
                  type={showKeys[provider.id] ? "text" : "password"}
                  placeholder={`Enter your ${provider.name} API key`}
                  value={tempKeys[provider.id as keyof typeof tempKeys]}
                  onChange={(e) => setTempKeys((prev) => ({ ...prev, [provider.id]: e.target.value }))}
                  className="bg-[#16161e] border-[#414868] text-[#c0caf5] placeholder-[#565f89] focus:border-[#7aa2f7] pr-10"
                />
                <Button
                  type="button"
                  variant="ghost"
                  size="sm"
                  onClick={() => toggleShowKey(provider.id)}
                  className="absolute right-1 top-1 h-8 w-8 p-0 text-[#565f89] hover:text-[#c0caf5]"
                >
                  {showKeys[provider.id] ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </Button>
              </div>
            </div>
          ))}
        </div>

        <div className="flex justify-end gap-2 pt-4 border-t border-[#292e42]">
          <Button
            variant="ghost"
            onClick={() => onOpenChange(false)}
            className="text-[#565f89] hover:text-[#c0caf5] hover:bg-[#292e42]"
          >
            Cancel
          </Button>
          <Button onClick={handleSave} className="bg-[#7aa2f7] hover:bg-[#6b94f5] text-[#1a1b26]">
            Save Configuration
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  )
}
