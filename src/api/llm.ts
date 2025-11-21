import { trainingDataService } from '@/services/trainingData'

export interface LLMConfig {
  model: string
  baseURL: string
}

const defaultConfig: LLMConfig = {
  model: 'llama3.1:8b', // Change to 'qwen2.5:3b' when downloaded
  baseURL: 'http://localhost:11434'
}

export async function generateJoke(
  config: LLMConfig = defaultConfig
): Promise<string> {
  const bestJokes = trainingDataService.getBestJokes(5)
  const worstJokes = trainingDataService.getWorstJokes(3)

  let prompt = `You are a creative comedian AI that learns from feedback. Generate ONE new original joke that is family-friendly, clever, and funny.`

  // If we have training data, use it to improve
  if (bestJokes.length > 0) {
    prompt += `\n\nThese jokes received POSITIVE feedback (upvotes). Learn from their style and humor:\n`
    bestJokes.forEach((joke, i) => {
      prompt += `${i + 1}. "${joke.joke}" (Rating: +${joke.rating})\n`
    })
  }

  if (worstJokes.length > 0) {
    prompt += `\n\nThese jokes received NEGATIVE feedback (downvotes). AVOID their style and humor:\n`
    worstJokes.forEach((joke, i) => {
      prompt += `${i + 1}. "${joke.joke}" (Rating: ${joke.rating})\n`
    })
  }

  if (bestJokes.length === 0 && worstJokes.length === 0) {
    prompt += `\n\nSince this is your first joke, create something clever using wordplay, puns, or unexpected twists. Keep it short and punchy.`
  }

  prompt += `\n\nGenerate ONE new original joke (just the joke text, nothing else):`

  try {
    const response = await fetch(`${config.baseURL}/api/generate`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        model: config.model,
        prompt: prompt,
        stream: false,
        options: {
          temperature: 0.8, // Higher temperature for more creativity
          top_p: 0.9
        }
      })
    })

    if (!response.ok) {
      throw new Error(`Ollama API error: ${response.status} ${response.statusText}`)
    }

    const data = await response.json()

    // Clean up the response - remove quotes, extra whitespace, etc.
    let joke = data.response.trim()

    // Remove common prefixes the LLM might add
    joke = joke.replace(/^(Here's a joke:|Here's one:|Joke:)\s*/i, '')
    joke = joke.replace(/^["']|["']$/g, '') // Remove surrounding quotes

    return joke
  } catch (error) {
    if (error instanceof Error) {
      throw new Error(`Failed to generate joke: ${error.message}`)
    }
    throw new Error('Failed to generate joke: Unknown error')
  }
}

export async function checkOllamaStatus(config: LLMConfig = defaultConfig): Promise<boolean> {
  try {
    const response = await fetch(`${config.baseURL}/api/tags`, {
      method: 'GET'
    })
    return response.ok
  } catch {
    return false
  }
}
