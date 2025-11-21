import { ref, computed } from 'vue'
import { trainingDataService } from '@/services/trainingData'
import type { TrainingStats } from '@/services/trainingData'
import type { Joke } from '@/api/jokes'

export function useTraining() {
  const currentJoke = ref<Joke | null>(null)
  const jokeIdCounter = ref(1)

  // Load existing training data stats
  const updateStats = () => {
    return trainingDataService.getStats()
  }

  const stats = ref<TrainingStats>(updateStats())

  const hasVoted = ref(false)

  const setCurrentJoke = (joke: Joke) => {
    currentJoke.value = joke
    hasVoted.value = false
  }

  const createNewJoke = (jokeText: string): Joke => {
    const newJoke: Joke = {
      id: jokeIdCounter.value++,
      joke: jokeText,
      upvotes: 0,
      downvotes: 0
    }
    return newJoke
  }

  const upvoteJoke = () => {
    if (currentJoke.value && !hasVoted.value) {
      currentJoke.value.upvotes++
      hasVoted.value = true
      trainingDataService.saveJoke(currentJoke.value)
      stats.value = updateStats()
    }
  }

  const downvoteJoke = () => {
    if (currentJoke.value && !hasVoted.value) {
      currentJoke.value.downvotes++
      hasVoted.value = true
      trainingDataService.saveJoke(currentJoke.value)
      stats.value = updateStats()
    }
  }

  const clearTrainingData = () => {
    trainingDataService.clearData()
    stats.value = updateStats()
    jokeIdCounter.value = 1
  }

  const hasTrainingData = computed(() => trainingDataService.hasTrainingData())

  return {
    currentJoke,
    stats,
    hasTrainingData,
    setCurrentJoke,
    createNewJoke,
    upvoteJoke,
    downvoteJoke,
    clearTrainingData,
    updateStats
  }
}
