<script setup lang="ts">
import type { TrainingStats } from '@/services/trainingData'

interface Props {
  stats: TrainingStats
}

defineProps<Props>()

const emit = defineEmits<{
  clearData: []
}>()
</script>

<template>
  <div class="training-stats">
    <div class="stats-header">
      <h3 class="stats-title">
        <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
          <path d="M3 3v18h18"/>
          <path d="M18 17V9"/>
          <path d="M13 17V5"/>
          <path d="M8 17v-3"/>
        </svg>
        Training Progress
      </h3>
    </div>

    <div class="stats-grid">
      <div class="stat-card">
        <div class="stat-label">Jokes Generated</div>
        <div class="stat-value">{{ stats.totalJokes }}</div>
      </div>

      <div class="stat-card success">
        <div class="stat-label">Upvotes</div>
        <div class="stat-value">{{ stats.totalUpvotes }}</div>
      </div>

      <div class="stat-card danger">
        <div class="stat-label">Downvotes</div>
        <div class="stat-value">{{ stats.totalDownvotes }}</div>
      </div>

      <div class="stat-card primary">
        <div class="stat-label">Success Rate</div>
        <div class="stat-value">{{ stats.successRate.toFixed(1) }}%</div>
      </div>
    </div>

    <div v-if="stats.bestJoke" class="best-joke-section">
      <h4 class="section-title">
        <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
          <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/>
        </svg>
        Best Joke (Rating: +{{ stats.bestJoke.rating }})
      </h4>
      <p class="best-joke-text">"{{ stats.bestJoke.joke }}"</p>
    </div>

    <button v-if="stats.totalJokes > 0" @click="emit('clearData')" class="clear-btn">
      <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
        <polyline points="3 6 5 6 21 6"/>
        <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"/>
      </svg>
      Reset Training Data
    </button>
  </div>
</template>

<style scoped>
.training-stats {
  width: 100%;
  max-width: 600px;
  background: rgba(255, 255, 255, 0.95);
  backdrop-filter: blur(10px);
  border-radius: 16px;
  padding: 1.5rem;
  box-shadow: 0 8px 16px -4px rgba(0, 0, 0, 0.15);
}

.stats-header {
  margin-bottom: 1.25rem;
}

.stats-title {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  font-size: 1.25rem;
  font-weight: 700;
  color: #1f2937;
  margin: 0;
}

.stats-title svg {
  color: #6366f1;
}

.stats-grid {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 0.75rem;
  margin-bottom: 1.25rem;
}

.stat-card {
  background: #f3f4f6;
  border-radius: 8px;
  padding: 1rem;
  text-align: center;
  border: 2px solid transparent;
  transition: all 0.2s ease;
}

.stat-card:hover {
  transform: translateY(-2px);
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
}

.stat-card.success {
  background: linear-gradient(135deg, #d1fae5 0%, #a7f3d0 100%);
  border-color: #10b981;
}

.stat-card.danger {
  background: linear-gradient(135deg, #fee2e2 0%, #fecaca 100%);
  border-color: #ef4444;
}

.stat-card.primary {
  background: linear-gradient(135deg, #ddd6fe 0%, #c4b5fd 100%);
  border-color: #8b5cf6;
}

.stat-label {
  font-size: 0.875rem;
  color: #6b7280;
  font-weight: 600;
  margin-bottom: 0.25rem;
}

.stat-value {
  font-size: 1.75rem;
  font-weight: 800;
  color: #1f2937;
}

.best-joke-section {
  background: linear-gradient(135deg, #fef3c7 0%, #fde68a 100%);
  border: 2px solid #f59e0b;
  border-radius: 8px;
  padding: 1rem;
  margin-bottom: 1rem;
}

.section-title {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  font-size: 1rem;
  font-weight: 700;
  color: #92400e;
  margin: 0 0 0.75rem 0;
}

.section-title svg {
  color: #f59e0b;
}

.best-joke-text {
  font-size: 0.95rem;
  color: #78350f;
  font-style: italic;
  margin: 0;
  line-height: 1.5;
}

.clear-btn {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 0.5rem;
  width: 100%;
  padding: 0.75rem;
  background: #ef4444;
  color: white;
  border: none;
  border-radius: 8px;
  font-size: 0.875rem;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.2s ease;
}

.clear-btn:hover {
  background: #dc2626;
  transform: translateY(-2px);
}

@media (max-width: 768px) {
  .stats-grid {
    grid-template-columns: 1fr 1fr;
  }

  .stat-value {
    font-size: 1.5rem;
  }
}
</style>
