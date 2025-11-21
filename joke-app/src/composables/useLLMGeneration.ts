import { ref, onMounted } from 'vue'
import { generateJoke, checkOllamaStatus } from '@/api/llm'

export interface GenerationState {
  isGenerating: boolean
  error: string | null
  isAvailable: boolean
}

export const useLLMGeneration = () => {
  const isGenerating = ref(false)
  const error = ref<string | null>(null)
  const isAvailable = ref(false)

  const checkAvailability = async () => {
    try {
      isAvailable.value = await checkOllamaStatus()
    } catch (err) {
      isAvailable.value = false
      console.error('Failed to check Ollama status:', err)
    }
  }

  onMounted(() => {
    checkAvailability()
  })

  const generateNewJoke = async (): Promise<string | null> => {
    if (!isAvailable.value) {
      error.value = 'Ollama is not available. Please ensure Ollama is running.'
      return null
    }

    isGenerating.value = true
    error.value = null

    try {
      const jokeText = await generateJoke()
      return jokeText
    } catch (err) {
      if (err instanceof Error) {
        error.value = err.message
      } else {
        error.value = 'An unexpected error occurred while generating the joke'
      }
      return null
    } finally {
      isGenerating.value = false
    }
  }

  const clearError = () => {
    error.value = null
  }

  const state = {
    isGenerating,
    error,
    isAvailable
  }

  return {
    state,
    generateNewJoke,
    clearError,
    checkAvailability
  }
}
