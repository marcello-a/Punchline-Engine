<script setup lang="ts">
import { onMounted } from 'vue'
import JokeCard from './components/JokeCard.vue'
import TrainingStats from './components/TrainingStats.vue'
import { useTraining } from './composables/useTraining'
import { useLLMGeneration } from './composables/useLLMGeneration'

// Composables
const {
  currentJoke,
  stats,
  hasVoted,
  hasTrainingData,
  setCurrentJoke,
  createNewJoke,
  upvoteJoke,
  downvoteJoke,
  clearTrainingData
} = useTraining()

const {
  state: llmState,
  generateNewJoke,
  checkAvailability
} = useLLMGeneration()

// Event handlers
const handleUpvote = async () => {
  upvoteJoke()
  // Clear current joke to show loading state
  currentJoke.value = null
  // Auto-generate next joke after voting
  await generateNext()
}

const handleDownvote = async () => {
  downvoteJoke()
  // Clear current joke to show loading state
  currentJoke.value = null
  // Auto-generate next joke after voting
  await generateNext()
}

const generateNext = async () => {
  // Clear current joke to show loading state
  currentJoke.value = null
  const jokeText = await generateNewJoke()
  if (jokeText) {
    const joke = createNewJoke(jokeText)
    setCurrentJoke(joke)
  }
}

const handleClearData = () => {
  if (confirm('Are you sure you want to reset all training data? This cannot be undone.')) {
    clearTrainingData()
    // Generate a fresh joke after clearing
    generateNext()
  }
}

// Generate initial joke on mount
onMounted(async () => {
  // Wait a bit for Ollama check
  await new Promise(resolve => setTimeout(resolve, 500))

  if (llmState.isAvailable.value) {
    await generateNext()
  }
})
</script>

<template>
  <div class="app">
    <header class="header">
      <h1 class="title">Crack a Joke - AI Trainer</h1>
      <p class="subtitle">Train your AI comedian to become the best joke teller in the world!</p>
    </header>

    <main class="main">
      <!-- Training Stats -->
      <TrainingStats v-if="hasTrainingData" :stats="stats" @clear-data="handleClearData" />

      <!-- Current Joke Display -->
      <div v-if="currentJoke && !llmState.isGenerating.value" class="joke-section">
        <div class="training-hint">
          <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
            <circle cx="12" cy="12" r="10"/>
            <line x1="12" y1="16" x2="12" y2="12"/>
            <line x1="12" y1="8" x2="12.01" y2="8"/>
          </svg>
          Vote to train the AI and get the next joke
        </div>

        <JokeCard
          :joke="currentJoke"
          @upvote="handleUpvote"
          @downvote="handleDownvote"
          @next="generateNext"
        />
      </div>

      <!-- Loading/Status Messages -->
      <div v-if="!currentJoke" class="status-card">
        <div v-if="llmState.isGenerating.value" class="loading-state">
          <div class="spinner-large"></div>
          <p class="status-text">AI is crafting a hilarious joke...</p>
          <p class="status-subtext">
            {{ hasTrainingData ? 'Learning from your feedback' : 'Starting fresh' }}
          </p>
        </div>

        <div v-else-if="!llmState.isAvailable.value" class="error-state">
          <svg class="error-icon" xmlns="http://www.w3.org/2000/svg" width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
            <path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z"/>
            <line x1="12" y1="9" x2="12" y2="13"/>
            <line x1="12" y1="17" x2="12.01" y2="17"/>
          </svg>
          <h3>Ollama Not Running</h3>
          <p>Make sure Ollama is running with the Qwen model:</p>
          <div class="code-block">
            <code>ollama serve</code>
            <code>ollama pull qwen2.5:3b</code>
          </div>
          <button @click="checkAvailability" class="retry-btn">
            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
              <polyline points="23 4 23 10 17 10"/>
              <path d="M20.49 15a9 9 0 1 1-2.12-9.36L23 10"/>
            </svg>
            Retry Connection
          </button>
        </div>

        <div v-else-if="llmState.error.value" class="error-state">
          <svg class="error-icon" xmlns="http://www.w3.org/2000/svg" width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
            <circle cx="12" cy="12" r="10"/>
            <line x1="12" y1="8" x2="12" y2="12"/>
            <line x1="12" y1="16" x2="12.01" y2="16"/>
          </svg>
          <h3>Generation Failed</h3>
          <p>{{ llmState.error.value }}</p>
          <button @click="generateNext" class="retry-btn">
            Try Again
          </button>
        </div>
      </div>
    </main>
  </div>
</template>

<style>
* {
  margin: 0;
  padding: 0;
  box-sizing: border-box;
}

body {
  font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Oxygen, Ubuntu, Cantarell, 'Open Sans', 'Helvetica Neue', sans-serif;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  min-height: 100vh;
}

#app {
  min-height: 100vh;
}
</style>

<style scoped>
.app {
  min-height: 100vh;
  display: flex;
  flex-direction: column;
  padding: 2rem;
}

.header {
  text-align: center;
  color: white;
  margin-bottom: 2rem;
}

.title {
  font-size: 3rem;
  font-weight: 800;
  margin-bottom: 0.5rem;
  text-shadow: 2px 2px 4px rgba(0, 0, 0, 0.2);
}

.subtitle {
  font-size: 1.25rem;
  opacity: 0.9;
}

.main {
  flex: 1;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 1.5rem;
}

.joke-section {
  width: 100%;
  max-width: 600px;
  display: flex;
  flex-direction: column;
  gap: 1rem;
}

.training-hint {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 0.5rem;
  padding: 0.75rem 1rem;
  background: rgba(255, 255, 255, 0.95);
  color: #6366f1;
  border-radius: 8px;
  font-size: 0.9rem;
  font-weight: 600;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
}

.training-hint svg {
  flex-shrink: 0;
}

.status-card {
  width: 100%;
  max-width: 600px;
  background: rgba(255, 255, 255, 0.95);
  backdrop-filter: blur(10px);
  border-radius: 16px;
  padding: 3rem 2rem;
  box-shadow: 0 8px 16px -4px rgba(0, 0, 0, 0.15);
  text-align: center;
}

.loading-state {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 1rem;
}

.spinner-large {
  width: 64px;
  height: 64px;
  border: 6px solid #e5e7eb;
  border-top-color: #6366f1;
  border-radius: 50%;
  animation: spin 1s linear infinite;
}

@keyframes spin {
  to {
    transform: rotate(360deg);
  }
}

.status-text {
  font-size: 1.25rem;
  font-weight: 700;
  color: #1f2937;
}

.status-subtext {
  font-size: 0.95rem;
  color: #6b7280;
}

.error-state {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 1rem;
}

.error-icon {
  color: #ef4444;
}

.error-state h3 {
  font-size: 1.5rem;
  color: #1f2937;
  margin-top: 0.5rem;
}

.error-state p {
  color: #6b7280;
  font-size: 1rem;
  max-width: 400px;
}

.code-block {
  background: #1f2937;
  border-radius: 8px;
  padding: 1rem;
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
  margin: 1rem 0;
}

.code-block code {
  color: #10b981;
  font-family: 'Courier New', monospace;
  font-size: 0.9rem;
}

.retry-btn {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  padding: 0.75rem 1.5rem;
  background: #6366f1;
  color: white;
  border: none;
  border-radius: 8px;
  font-size: 1rem;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.2s ease;
}

.retry-btn:hover {
  background: #4f46e5;
  transform: translateY(-2px);
}

@media (max-width: 768px) {
  .app {
    padding: 1rem;
  }

  .title {
    font-size: 2rem;
  }

  .subtitle {
    font-size: 1rem;
  }

  .status-card {
    padding: 2rem 1.5rem;
  }
}
</style>
