import type { Joke } from '@/api/jokes'

export interface TrainingJoke extends Joke {
  timestamp: number
  rating: number // upvotes - downvotes
}

export interface TrainingStats {
  totalJokes: number
  totalUpvotes: number
  totalDownvotes: number
  successRate: number
  bestJoke: TrainingJoke | null
  worstJoke: TrainingJoke | null
}

const STORAGE_KEY = 'joke-training-data'

export class TrainingDataService {
  private jokes: TrainingJoke[] = []

  constructor() {
    this.loadFromStorage()
  }

  private loadFromStorage(): void {
    try {
      const stored = localStorage.getItem(STORAGE_KEY)
      if (stored) {
        this.jokes = JSON.parse(stored)
      }
    } catch (error) {
      console.error('Failed to load training data:', error)
      this.jokes = []
    }
  }

  private saveToStorage(): void {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(this.jokes))
    } catch (error) {
      console.error('Failed to save training data:', error)
    }
  }

  saveJoke(joke: Joke): void {
    const trainingJoke: TrainingJoke = {
      ...joke,
      timestamp: Date.now(),
      rating: joke.upvotes - joke.downvotes
    }
    this.jokes.push(trainingJoke)
    this.saveToStorage()
  }

  updateJokeVotes(jokeId: number, upvotes: number, downvotes: number): void {
    const joke = this.jokes.find(j => j.id === jokeId)
    if (joke) {
      joke.upvotes = upvotes
      joke.downvotes = downvotes
      joke.rating = upvotes - downvotes
      this.saveToStorage()
    }
  }

  getBestJokes(count: number = 5): TrainingJoke[] {
    return [...this.jokes]
      .filter(j => j.rating > 0) // Only positive-rated jokes
      .sort((a, b) => b.rating - a.rating)
      .slice(0, count)
  }

  getWorstJokes(count: number = 3): TrainingJoke[] {
    return [...this.jokes]
      .filter(j => j.rating < 0) // Only negative-rated jokes
      .sort((a, b) => a.rating - b.rating)
      .slice(0, count)
  }

  getStats(): TrainingStats {
    const totalJokes = this.jokes.length
    const totalUpvotes = this.jokes.reduce((sum, j) => sum + j.upvotes, 0)
    const totalDownvotes = this.jokes.reduce((sum, j) => sum + j.downvotes, 0)

    const successRate = totalUpvotes + totalDownvotes > 0
      ? (totalUpvotes / (totalUpvotes + totalDownvotes)) * 100
      : 0

    const sortedByRating = [...this.jokes].sort((a, b) => b.rating - a.rating)
    const bestJoke = sortedByRating.length > 0 ? (sortedByRating[0] ?? null) : null

    const sortedByLowestRating = [...this.jokes].sort((a, b) => a.rating - b.rating)
    const worstJoke = sortedByLowestRating.length > 0 ? (sortedByLowestRating[0] ?? null) : null

    return {
      totalJokes,
      totalUpvotes,
      totalDownvotes,
      successRate,
      bestJoke,
      worstJoke
    }
  }

  getAllJokes(): TrainingJoke[] {
    return [...this.jokes]
  }

  clearData(): void {
    this.jokes = []
    localStorage.removeItem(STORAGE_KEY)
  }

  hasTrainingData(): boolean {
    return this.jokes.length > 0
  }
}

// Singleton instance
export const trainingDataService = new TrainingDataService()
