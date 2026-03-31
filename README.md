# Memory App

A personal knowledge management tool with semantic search and local LLM-powered retrieval. Store key-value memories and query them in natural language — all running entirely on your machine.

## Features

- Store structured key-value memories (e.g., `favorite_food: pizza`)
- Query memories in natural language via a chat interface
- Semantic search using vector embeddings + keyword matching
- LLM-generated answers grounded in your stored data
- Desktop app via Electron
- No cloud dependencies — 100% local

## Tech Stack

| Layer | Technology |
|-------|------------|
| Desktop | Electron |
| Frontend | React 19 + Vite |
| Backend | Node.js + Express 5 |
| Database | SQLite3 |
| Embeddings | Ollama — `nomic-embed-text` |
| LLM | Ollama — `phi3` |

## Prerequisites

- [Node.js](https://nodejs.org/) (v18+)
- [Ollama](https://ollama.com/) installed and running

Pull the required models:
```bash
ollama pull nomic-embed-text
ollama pull phi3
```

## Getting Started

```bash
# Clone the repo
git clone <repo-url>
cd memory-app

# Install all dependencies
npm install

# Start the app (backend + frontend + Electron)
npm start
```

This runs all three processes concurrently:
- **Backend** — Express API on `http://localhost:3000`
- **Frontend** — Vite dev server on `http://localhost:5173`
- **Electron** — Desktop shell loading the frontend

## Usage

### Settings Mode (gear icon)
Add memories using key-value pairs:
- **Key:** a short identifier (e.g., `favorite_food`)
- **Value:** the stored information (e.g., `pizza`)

Edit or delete existing entries from the list below the input bar.

### Chat Mode (chat icon)
Ask questions in natural language:
> "What's my favorite food?"
> "Where do I work?"

The app performs a semantic search over your stored memories and returns an LLM-generated answer.

## Project Structure

```
memory-app/
├── backend/          # Express API, services, SQLite DB
├── frontend/         # React + Vite SPA
├── electron/         # Electron desktop wrapper
└── package.json      # Root script — runs all three concurrently
```

See [SYSTEM_DESIGN.md](SYSTEM_DESIGN.md) for full architecture documentation.

## How It Works

1. **Saving** — each entry is embedded using `nomic-embed-text` and stored in SQLite alongside the key-value pair.
2. **Querying** — the question is embedded, then scored against all stored entries using cosine similarity + keyword boost. The top result (if above a 0.6 threshold) is passed to `phi3` as context for answer generation.
