"use client"
import { Badge } from "~/components/ui/badge"
import { Select, SelectContent, SelectItem, SelectTrigger } from "~/components/ui/select"
import { ChevronDown, Zap, Brain, Sparkles, Bot } from "lucide-react"

interface ModelSelectorProps {
  provider: string
  currentModel: string
  onModelChange: (model: string) => void
  disabled?: boolean
}

const PROVIDER_MODELS = {
  openai: [
    { id: "gpt-4o", name: "GPT-4o", description: "Most capable, multimodal", icon: Sparkles, tier: "premium" },
    { id: "gpt-4o-mini", name: "GPT-4o Mini", description: "Fast and efficient", icon: Zap, tier: "standard" },
    {
      id: "gpt-4-turbo",
      name: "GPT-4 Turbo",
      description: "Previous generation flagship",
      icon: Brain,
      tier: "premium",
    },
    { id: "gpt-3.5-turbo", name: "GPT-3.5 Turbo", description: "Fast and affordable", icon: Bot, tier: "standard" },
  ],
  openrouter: [
    {
      id: "anthropic/claude-3.5-sonnet",
      name: "Claude 3.5 Sonnet",
      description: "Anthropic's best",
      icon: Sparkles,
      tier: "premium",
    },
    {
      id: "anthropic/claude-3-haiku",
      name: "Claude 3 Haiku",
      description: "Fast and efficient",
      icon: Zap,
      tier: "standard",
    },
    { id: "openai/gpt-4o", name: "GPT-4o", description: "OpenAI's flagship", icon: Sparkles, tier: "premium" },
    { id: "openai/gpt-4o-mini", name: "GPT-4o Mini", description: "Efficient GPT-4", icon: Zap, tier: "standard" },
    {
      id: "meta-llama/llama-3.1-405b-instruct",
      name: "Llama 3.1 405B",
      description: "Meta's largest",
      icon: Brain,
      tier: "premium",
    },
    {
      id: "meta-llama/llama-3.1-70b-instruct",
      name: "Llama 3.1 70B",
      description: "Balanced performance",
      icon: Bot,
      tier: "standard",
    },
    {
      id: "google/gemini-pro-1.5",
      name: "Gemini Pro 1.5",
      description: "Google's advanced",
      icon: Sparkles,
      tier: "premium",
    },
    {
      id: "mistralai/mixtral-8x7b-instruct",
      name: "Mixtral 8x7B",
      description: "Mixture of experts",
      icon: Brain,
      tier: "standard",
    },
  ],
  anthropic: [
    {
      id: "claude-3-5-sonnet-20241022",
      name: "Claude 3.5 Sonnet",
      description: "Most capable",
      icon: Sparkles,
      tier: "premium",
    },
    {
      id: "claude-3-haiku-20240307",
      name: "Claude 3 Haiku",
      description: "Fast and efficient",
      icon: Zap,
      tier: "standard",
    },
    {
      id: "claude-3-opus-20240229",
      name: "Claude 3 Opus",
      description: "Most intelligent",
      icon: Brain,
      tier: "premium",
    },
  ],
  google: [
    { id: "gemini-1.5-pro", name: "Gemini 1.5 Pro", description: "Most capable", icon: Sparkles, tier: "premium" },
    {
      id: "gemini-1.5-flash",
      name: "Gemini 1.5 Flash",
      description: "Fast and efficient",
      icon: Zap,
      tier: "standard",
    },
    { id: "gemini-pro", name: "Gemini Pro", description: "Balanced performance", icon: Bot, tier: "standard" },
  ],
}

const TIER_COLORS = {
  premium: "bg-[#bb9af7] text-[#1a1b26]",
  standard: "bg-[#7aa2f7] text-[#1a1b26]",
}

export function ModelSelector({ provider, currentModel, onModelChange, disabled }: ModelSelectorProps) {
  const models = PROVIDER_MODELS[provider as keyof typeof PROVIDER_MODELS] || []
  const currentModelInfo = models.find((m) => m.id === currentModel) || models[0]

  if (models.length === 0) {
    return (
      <div className="flex items-center gap-2 text-[#565f89] text-sm">
        <Bot className="w-4 h-4" />
        <span>No models available</span>
      </div>
    )
  }

  return (
    <div className="flex items-center gap-2">
      <Select value={currentModel} onValueChange={onModelChange} disabled={disabled}>
        <SelectTrigger className="w-[280px] bg-[#1a1b26] border-[#414868] text-[#c0caf5] hover:bg-[#292e42] focus:border-[#7aa2f7]">
          <div className="flex items-center gap-2 flex-1">
            {currentModelInfo && (
              <>
                <currentModelInfo.icon className="w-4 h-4 text-[#7aa2f7]" />
                <div className="flex items-center gap-2 flex-1 min-w-0">
                  <span className="font-medium truncate">{currentModelInfo.name}</span>
                  <Badge className={`text-xs ${TIER_COLORS[currentModelInfo.tier]} px-1.5 py-0.5`}>
                    {currentModelInfo.tier}
                  </Badge>
                </div>
              </>
            )}
          </div>
          <ChevronDown className="w-4 h-4 text-[#565f89]" />
        </SelectTrigger>
        <SelectContent className="bg-[#1a1b26] border-[#414868] text-[#c0caf5] max-h-[300px]">
          {models.map((model) => (
            <SelectItem
              key={model.id}
              value={model.id}
              className="hover:bg-[#292e42] focus:bg-[#292e42] cursor-pointer"
            >
              <div className="flex items-center gap-3 py-1">
                <model.icon className="w-4 h-4 text-[#7aa2f7] flex-shrink-0" />
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2">
                    <span className="font-medium">{model.name}</span>
                    <Badge className={`text-xs ${TIER_COLORS[model.tier]} px-1.5 py-0.5`}>{model.tier}</Badge>
                  </div>
                  <p className="text-xs text-[#565f89] truncate">{model.description}</p>
                </div>
              </div>
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    </div>
  )
}
