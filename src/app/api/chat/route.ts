import { StreamingTextResponse } from "ai"
import { auth } from "@clerk/nextjs/server"

export const maxDuration = 30

export async function POST(req: Request) {
  try {
    const { userId } = await auth()

    if (!userId) {
      return new Response("Unauthorized", { status: 401 })
    }

    const { messages, provider, model, apiKey } = await req.json()

    if (!apiKey) {
      return new Response("API key is required", { status: 400 })
    }

    const systemPrompt = `You are a helpful AI assistant in the b3fore chat application. Be concise and helpful. The user is authenticated with ID: ${userId}`

    switch (provider) {
      case "openai":
        const response = await fetch("https://api.openai.com/v1/chat/completions", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${apiKey}`,
          },
          body: JSON.stringify({
            model: model || "gpt-4o-mini",
            messages: [{ role: "system", content: systemPrompt }, ...messages],
            stream: true,
          }),
        })

        return new StreamingTextResponse(response.body)

      case "openrouter":
        const openrouterResponse = await fetch("https://openrouter.ai/api/v1/chat/completions", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${apiKey}`,
            "HTTP-Referer": "https://b3fore.vercel.app",
            "X-Title": "b3fore Chat App",
          },
          body: JSON.stringify({
            model: model || "anthropic/claude-3.5-sonnet",
            messages: [{ role: "system", content: systemPrompt }, ...messages],
            stream: true,
          }),
        })

        return new StreamingTextResponse(openrouterResponse.body)

      case "anthropic":
        return new Response("Anthropic provider not implemented yet", { status: 501 })
      case "google":
        return new Response("Google provider not implemented yet", { status: 501 })
      default:
        return new Response("Invalid provider", { status: 400 })
    }
  } catch (error) {
    console.error("Chat API error:", error)
    return new Response("Internal server error", { status: 500 })
  }
}
