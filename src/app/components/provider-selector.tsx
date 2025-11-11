"use client"

import { Select, SelectContent, SelectItem, SelectTrigger } from "~/components/ui/select"
import { Badge } from "~/components/ui/badge"

interface ProviderSelectorProps {
  currentProvider: string
  onProviderChange: (provider: string) => void
  apiKeys: Record<string, string>
  disabled?: boolean
}

const PROVIDERS = [
  {
    id: "openai",
    name: "OpenAI",
    description: "GPT models",
    color: "bg-[#10a37f]",
  },
  {
    id: "openrouter",
    name: "OpenRouter",
    description: "100+ models",
    color: "bg-[#8b5cf6]",
  },
  {
    id: "anthropic",
    name: "Anthropic",
    description: "Claude models",
    color: "bg-[#f97316]",
  },
  {
    id: "google",
    name: "Google AI",
    description: "Gemini models",
    color: "bg-[#4285f4]",
  },
]

export function ProviderSelector({ currentProvider, onProviderChange, apiKeys, disabled }: ProviderSelectorProps) {
  const currentProviderInfo = PROVIDERS.find((p) => p.id === currentProvider)

  return (
    <Select value={currentProvider} onValueChange={onProviderChange} disabled={disabled}>
      <SelectTrigger className="w-[200px] bg-[#1a1b26] border-[#414868] text-[#c0caf5] hover:bg-[#292e42] focus:border-[#7aa2f7]">
        <div className="flex items-center gap-2 flex-1">
          {currentProviderInfo && (
            <>
              <div className={`w-3 h-3 rounded-full ${currentProviderInfo.color}`} />
              <span className="font-medium">{currentProviderInfo.name}</span>
              {!apiKeys[currentProvider] && (
                <Badge variant="outline" className="text-xs border-[#f7768e] text-[#f7768e]">
                  No Key
                </Badge>
              )}
            </>
          )}
        </div>
      </SelectTrigger>
      <SelectContent className="bg-[#1a1b26] border-[#414868] text-[#c0caf5]">
        {PROVIDERS.map((provider) => (
          <SelectItem
            key={provider.id}
            value={provider.id}
            className="hover:bg-[#292e42] focus:bg-[#292e42] cursor-pointer"
          >
            <div className="flex items-center gap-3 py-1">
              <div className={`w-3 h-3 rounded-full ${provider.color}`} />
              <div className="flex-1">
                <div className="flex items-center gap-2">
                  <span className="font-medium">{provider.name}</span>
                  {!apiKeys[provider.id] && (
                    <Badge variant="outline" className="text-xs border-[#f7768e] text-[#f7768e]">
                      No Key
                    </Badge>
                  )}
                </div>
                <p className="text-xs text-[#565f89]">{provider.description}</p>
              </div>
            </div>
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  )
}
