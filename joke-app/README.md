# Crack a Joke - AI Trainer

Train your own AI comedian! A modern Vue.js application that uses local Qwen LLM via Ollama to generate jokes and **learns from your feedback** to become the best joke teller in the world.

## Features

- **🤖 AI Joke Generation** - Qwen LLM generates original jokes
- **👍👎 Training System** - Upvote good jokes, downvote bad ones
- **📊 Progress Tracking** - See your AI improve with detailed statistics
- **🧠 Machine Learning** - AI learns from your preferences using few-shot learning
- **💾 Persistent Storage** - All training data saved locally (localStorage)
- **🔒 Privacy-First** - Everything runs locally, no data sent to external servers
- **⚡ Modern UI** - Beautiful, responsive design with gradient backgrounds
- **📘 TypeScript** - Full type safety throughout the codebase
- **🎯 Best Practices** - Clean architecture with composables and separation of concerns

## How It Works

The AI Trainer uses a **feedback loop** to continuously improve:

1. **Generate**: AI creates a new joke using LLM
2. **Evaluate**: You vote (upvote 👍 or downvote 👎)
3. **Learn**: Your feedback is saved to training data
4. **Improve**: Next joke uses best jokes as examples, avoids patterns from bad jokes
5. **Repeat**: Each generation gets better!

### Few-Shot Learning

The AI improves using few-shot learning:
- **Positive Examples**: Top 5 jokes (highest upvote rating) are shown to the AI
- **Negative Examples**: Bottom 3 jokes (most downvoted) are flagged to avoid
- **Contextual Prompts**: AI receives explicit instructions to learn from feedback

## Architecture & Best Practices

This project follows Vue 3 Composition API best practices:

### Component Structure
- **JokeCard.vue** - Displays individual jokes with voting UI
- **TrainingStats.vue** - Shows training progress and statistics
- **AIJokeGenerator.vue** - AI generation UI and status (currently unused in training mode)

### Composables (Business Logic)
- **useTraining.ts** - Manages training state, voting, and statistics
- **useLLMGeneration.ts** - Handles LLM connection and joke generation

### Services & API Layer
- **trainingData.ts** - Training data persistence service (localStorage)
- **jokes.ts** - Joke type definitions
- **llm.ts** - Ollama API integration with training-aware prompts

This separation ensures:
- **Single Responsibility Principle** - Each module has one clear purpose
- **Reusable business logic** - Composables can be used across components
- **Easy testing and maintenance** - Clear boundaries between layers
- **Clear separation of concerns** - UI, logic, and data are independent

## Prerequisites

### Install Ollama and Qwen Model

1. **Install Ollama**

   Visit [ollama.com](https://ollama.com/) and download Ollama for your platform:
   - macOS: Download the installer
   - Linux: `curl -fsSL https://ollama.com/install.sh | sh`
   - Windows: Download from the website

2. **Pull an LLM Model**

   After installing Ollama, pull one of these models:
   ```sh
   # Llama 3.1 (8B - high quality, recommended)
   ollama pull llama3.1:8b

   # Or Qwen 2.5 (3B - faster, smaller)
   ollama pull qwen2.5:3b

   # Or others
   ollama pull mistral
   ollama pull llama3.2
   ```

3. **Verify Ollama is Running**

   Check if Ollama is running:
   ```sh
   curl http://localhost:11434/api/tags
   ```

   You should see a JSON response with available models.

4. **Update Model Configuration (Optional)**

   The app currently uses `llama3.1:8b` by default. To use a different model, edit `src/api/llm.ts`:
   ```typescript
   const defaultConfig: LLMConfig = {
     model: 'llama3.1:8b', // Change to your preferred model
     baseURL: 'http://localhost:11434'
   }
   ```

   Popular choices:
   - `llama3.1:8b` - High quality, great for jokes (default)
   - `qwen2.5:3b` - Faster, smaller, still good
   - `mistral` - Another solid option

## Project Setup

```sh
npm install
```

### Compile and Hot-Reload for Development

```sh
npm run dev
```

The app will be available at `http://localhost:5173`

## Usage

### Training Your AI Comedian

1. **Start the App**:
   - Make sure Ollama is running: `ollama serve`
   - Launch the app: `npm run dev`
   - AI automatically generates the first joke

2. **Provide Feedback**:
   - **Upvote** 👍 (green button): Joke is funny/good
   - **Downvote** 👎 (red button): Joke is not funny/bad
   - After voting, AI automatically generates the next joke

3. **Watch It Learn**:
   - Training statistics show your progress
   - Success rate increases as AI learns your humor
   - Best joke is displayed in the stats panel
   - Each new joke considers your previous feedback

4. **Continue Training**:
   - Keep voting to improve the AI
   - More feedback = better jokes
   - Training data persists in your browser

5. **Reset If Needed**:
   - Click "Reset Training Data" to start fresh
   - All feedback will be cleared

### Training Tips

- **Be consistent**: Similar jokes should get similar votes
- **Vote quickly**: Trust your first reaction
- **Train regularly**: More data = better results
- **100+ votes recommended**: AI needs data to learn effectively

All processing happens locally on your machine - no data is sent to external servers!

## Recommended IDE Setup

[VS Code](https://code.visualstudio.com/) + [Vue (Official)](https://marketplace.visualstudio.com/items?itemName=Vue.volar) (and disable Vetur).

## Recommended Browser Setup

- Chromium-based browsers (Chrome, Edge, Brave, etc.):
  - [Vue.js devtools](https://chromewebstore.google.com/detail/vuejs-devtools/nhdogjmejiglipccpnnnanhbledajbpd) 
  - [Turn on Custom Object Formatter in Chrome DevTools](http://bit.ly/object-formatters)
- Firefox:
  - [Vue.js devtools](https://addons.mozilla.org/en-US/firefox/addon/vue-js-devtools/)
  - [Turn on Custom Object Formatter in Firefox DevTools](https://fxdx.dev/firefox-devtools-custom-object-formatters/)

## Type Support for `.vue` Imports in TS

TypeScript cannot handle type information for `.vue` imports by default, so we replace the `tsc` CLI with `vue-tsc` for type checking. In editors, we need [Volar](https://marketplace.visualstudio.com/items?itemName=Vue.volar) to make the TypeScript language service aware of `.vue` types.

## Customize configuration

See [Vite Configuration Reference](https://vite.dev/config/).

### Type-Check, Compile and Minify for Production

```sh
npm run build
```

### Run Unit Tests with [Vitest](https://vitest.dev/)

```sh
npm run test:unit
```

### Run End-to-End Tests with [Playwright](https://playwright.dev)

```sh
# Install browsers for the first run
npx playwright install

# When testing on CI, must build the project first
npm run build

# Runs the end-to-end tests
npm run test:e2e
# Runs the tests only on Chromium
npm run test:e2e -- --project=chromium
# Runs the tests of a specific file
npm run test:e2e -- tests/example.spec.ts
# Runs the tests in debug mode
npm run test:e2e -- --debug
```

### Lint with [ESLint](https://eslint.org/)

```sh
npm run lint
```
