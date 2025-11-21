<script setup lang="ts">
import type { Joke } from '@/api/jokes'

defineProps<{
  joke: Joke
}>()

const emit = defineEmits<{
  upvote: []
  downvote: []
  next: []
}>()
</script>

<template>
  <div class="joke-card">
    <div class="joke-content">
      <p class="joke-text">{{ joke.joke }}</p>
    </div>

    <div class="vote-section">
      <button @click="emit('upvote')" class="vote-btn upvote-btn" title="Upvote">
        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
          <path d="M12 19V5M5 12l7-7 7 7"/>
        </svg>
        <span class="vote-count">{{ joke.upvotes }}</span>
      </button>

      <button @click="emit('downvote')" class="vote-btn downvote-btn" title="Downvote">
        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
          <path d="M12 5v14M19 12l-7 7-7-7"/>
        </svg>
        <span class="vote-count">{{ joke.downvotes }}</span>
      </button>
    </div>

    <div class="navigation">
      <button @click="emit('next')" class="nav-btn" title="Skip this joke and generate a new one">
        <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
          <path d="M9 18l6-6-6-6"/>
        </svg>
        Skip (no vote)
      </button>
    </div>
  </div>
</template>

<style scoped>
.joke-card {
  max-width: 600px;
  margin: 0 auto;
  background: white;
  border-radius: 16px;
  box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06);
  padding: 2rem;
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
}

.joke-content {
  min-height: 120px;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 1rem;
}

.joke-text {
  font-size: 1.25rem;
  line-height: 1.75;
  color: #1f2937;
  text-align: center;
  margin: 0;
}

.vote-section {
  display: flex;
  gap: 1rem;
  justify-content: center;
  align-items: center;
  padding: 1rem 0;
  border-top: 1px solid #e5e7eb;
  border-bottom: 1px solid #e5e7eb;
}

.vote-btn {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  padding: 0.75rem 1.5rem;
  border: none;
  border-radius: 8px;
  font-size: 1rem;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.2s ease;
}

.upvote-btn {
  background: #10b981;
  color: white;
}

.upvote-btn:hover {
  background: #059669;
  transform: translateY(-2px);
}

.upvote-btn:active {
  transform: translateY(0);
}

.downvote-btn {
  background: #ef4444;
  color: white;
}

.downvote-btn:hover {
  background: #dc2626;
  transform: translateY(-2px);
}

.downvote-btn:active {
  transform: translateY(0);
}

.vote-count {
  font-size: 1.125rem;
  font-weight: 700;
}

.navigation {
  display: flex;
  justify-content: center;
  gap: 1rem;
}

.nav-btn {
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

.nav-btn:hover {
  background: #4f46e5;
  transform: translateY(-2px);
}

.nav-btn:active {
  transform: translateY(0);
}

.nav-btn:disabled {
  background: #9ca3af;
  cursor: not-allowed;
  transform: none;
}
</style>
