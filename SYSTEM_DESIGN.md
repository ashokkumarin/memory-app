# Memory App — System Design

## Overview

Memory App is a personal knowledge management system with semantic search and LLM-powered retrieval. Users store key-value memory entries (e.g., `favorite_food: pizza`) and query them in natural language via a chat interface. The app runs entirely locally — no cloud dependencies.

---

## Architecture

```
┌─────────────────────────────────────────────────────┐
│                  Electron Shell                      │
│            (loads localhost:5173)                    │
│                                                      │
│  ┌──────────────────────────────────────────────┐   │
│  │            React Frontend (Vite)              │   │
│  │   ┌──────────────┐   ┌────────────────────┐  │   │
│  │   │  Chat Mode   │   │  Settings Mode     │  │   │
│  │   │ ChatContainer│   │  MemoryList        │  │   │
│  │   │ ChatInput    │   │  InputBar (CRUD)   │  │   │
│  │   │ MessageBubble│   │  MemoryRow         │  │   │
│  │   └──────┬───────┘   └────────┬───────────┘  │   │
│  │          │  Fetch API         │               │   │
│  └──────────┼────────────────────┼───────────────┘   │
└─────────────┼────────────────────┼───────────────────┘
              │  HTTP (port 3000)  │
              ▼                    ▼
┌─────────────────────────────────────────────────────┐
│              Express Backend (Node.js)               │
│                                                      │
│  POST /query          GET /memory                    │
│  POST /memory         DELETE /memory/:id             │
│                                                      │
│  ┌─────────────────┐  ┌──────────────────────────┐  │
│  │ queryController │  │    memoryController      │  │
│  └────────┬────────┘  └────────────┬─────────────┘  │
│           │                        │                 │
│  ┌────────▼────────────────────────▼─────────────┐  │
│  │                  Services                      │  │
│  │  embeddingService  llmService  memoryService   │  │
│  └────────┬──────────────┬──────────┬────────────┘  │
└───────────┼──────────────┼──────────┼────────────────┘
            │              │          │
            ▼              ▼          ▼
     ┌─────────────┐  ┌─────────┐  ┌─────────────────┐
     │   Ollama    │  │ Ollama  │  │   SQLite DB      │
     │  Embeddings │  │   LLM   │  │  memory.db       │
     │ nomic-embed │  │  phi3   │  │  (backend/data/) │
     │   -text     │  │         │  │                  │
     └─────────────┘  └─────────┘  └─────────────────┘
        localhost:11434                (file-based)
```

---

## Technology Stack

| Layer | Technology |
|-------|------------|
| Desktop wrapper | Electron |
| Frontend | React 19 + Vite |
| Backend | Node.js + Express 5 |
| Database | SQLite3 (file-based) |
| Embeddings | Ollama — `nomic-embed-text` |
| LLM | Ollama — `phi3` |
| HTTP (frontend→backend) | Fetch API |
| HTTP (backend→Ollama) | Axios |

---

## Directory Structure

```
memory-app/
├── backend/
│   ├── server.js               # Express entry point (port 3000)
│   ├── routes/                 # Route definitions
│   ├── controllers/
│   │   ├── memoryController.js # CRUD handlers
│   │   └── queryController.js  # Semantic search + LLM pipeline
│   ├── services/
│   │   ├── memoryService.js    # DB read/write operations
│   │   ├── embeddingService.js # Ollama embedding calls
│   │   └── llmService.js       # Ollama LLM calls
│   ├── db/
│   │   └── db.js               # SQLite connection
│   └── data/
│       └── memory.db           # SQLite database file
├── frontend/
│   └── src/
│       ├── App.jsx             # Root; manages page/mode state
│       ├── components/
│       │   ├── Chat/           # ChatContainer, ChatInput, MessageBubble
│       │   ├── Memory/         # InputBar, MemoryList, MemoryRow, MemoryItem
│       │   ├── Sidebar.jsx     # Tab navigation (Chat / Settings)
│       │   └── buttons/        # ActionButton, IconButton
│       ├── pages/              # Page-level wrappers
│       ├── services/
│       │   └── api.js          # Centralized API client (4 functions)
│       └── styles/
│           └── inputModeStyles.js  # Shared color/style tokens
├── electron/
│   └── main.js                 # Loads localhost:5173; 1000×700 window
└── package.json                # Root: runs all 3 apps concurrently
```

---

## Database Schema

**SQLite — `memory` table**

```sql
CREATE TABLE IF NOT EXISTS memory (
  id         INTEGER PRIMARY KEY AUTOINCREMENT,
  key        TEXT UNIQUE NOT NULL,
  value      TEXT NOT NULL,
  embedding  TEXT,                              -- JSON array (768-dim float vector)
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
);
```

Each row stores a key-value pair alongside its pre-computed embedding vector (serialized as JSON). The embedding is generated once at insert/update time and reused at query time.

---

## API Endpoints

| Method | Path | Description |
|--------|------|-------------|
| `GET` | `/memory` | Return all stored memories |
| `POST` | `/memory` | Insert or update a key-value entry (generates embedding) |
| `DELETE` | `/memory/:id` | Delete a memory entry by ID |
| `POST` | `/query` | Run semantic search + LLM answer generation |

**POST /query request body:**
```json
{ "question": "What's my favorite food?" }
```

**POST /query response:**
```json
{ "answer": "Your favorite food is pizza." }
```

---

## Core Data Flows

### 1. Saving a Memory

```
User fills InputBar (key + value)
  → POST /memory {key, value}
  → embeddingService.getEmbedding("Key: {key}. Value: {value}. This is a stored memory.")
    → Ollama /api/embeddings (nomic-embed-text) → 768-dim vector
  → memoryService.addOrUpdate(key, value, embedding)
    → INSERT OR REPLACE INTO memory (key, value, embedding)
  → 200 OK {success: true}
  → Frontend refetches GET /memory → re-renders MemoryList
```

### 2. Querying a Memory (Chat Mode)

```
User types question → ChatInput
  → POST /query {question}
  → embeddingService.getEmbedding(question) → queryVec
  → memoryService.getAll() → all rows [{key, value, embedding}, ...]
  → For each row:
      cosineSim   = dot(queryVec, rowVec) / (|queryVec| × |rowVec|)
      keywordBoost = +0.25 if question contains key
                   | +0.15 if key contains question word
      score = cosineSim + keywordBoost
  → Sort descending; take top-1
  → If score < 0.6 → return "No relevant data found"
  → llmService.callLLM({question, context: "key: value"})
    → Ollama /api/generate (phi3)
    → Prompt: "You are helpful. Use ONLY the provided data. ..."
    → Returns natural language answer
  → 200 OK {answer: "..."}
  → Frontend appends MessageBubble (bot)
```

### 3. Deleting a Memory

```
User clicks Delete on MemoryRow
  → DELETE /memory/:id
  → memoryService.delete(id)
    → DELETE FROM memory WHERE id = ?
  → 200 OK
  → Frontend refetches GET /memory
```

---

## Semantic Search Strategy

The retrieval step uses a **hybrid scoring** approach combining semantic similarity with keyword matching:

```
score = cosine_similarity(query_embedding, memory_embedding)
      + keyword_boost
```

| Condition | Boost |
|-----------|-------|
| Query text contains the memory key | +0.25 |
| Memory key is a substring of a query word | +0.15 |
| No keyword overlap | +0.00 |

**Rejection threshold:** If the top result scores below **0.6**, the system returns `"No relevant data found"` rather than hallucinating an answer.

---

## LLM Integration

Both the embedding model and the generative model run locally via **Ollama** (no API keys, no cloud calls).

| Purpose | Endpoint | Model |
|---------|----------|-------|
| Embedding generation | `POST localhost:11434/api/embeddings` | `nomic-embed-text` (768-dim) |
| Answer generation | `POST localhost:11434/api/generate` | `phi3` |

**LLM prompt structure:**
```
You are a helpful assistant. Use ONLY the provided data to answer.

Context:
{key}: {value}

Question: {question}
Answer:
```

---

## Frontend State Management

There is no global state store (no Redux, no Context API). All state is local `useState` hooks at the component level:

- `App.jsx` — tracks current mode (`chat` | `input`)
- `ChatContainer.jsx` — tracks messages array
- `InputBar.jsx` — tracks key/value form fields
- `MemoryList.jsx` — fetches and holds all memory rows

API calls are centralized in `frontend/src/services/api.js`:

```js
sendQuery(question)       // POST /query
getMemory()               // GET /memory
saveMemory({key, value})  // POST /memory
deleteMemory(id)          // DELETE /memory/:id
```

All requests point to the hardcoded base URL `http://localhost:3000`.

---

## Electron Shell

The Electron app is a thin wrapper:

- Loads `http://localhost:5173` (Vite dev server) in a `BrowserWindow`
- Window size: **1000 × 700 px**, no menu bar
- No IPC or native OS integration beyond the window shell
- All app logic runs in the web layer (React + Express)

---

## Key Design Decisions & Trade-offs

| Decision | Rationale | Trade-off |
|----------|-----------|-----------|
| **100% local (Ollama)** | Privacy — no data leaves the machine | Requires Ollama + models pre-installed; slower than cloud APIs |
| **SQLite** | Zero-config, file-based, portable | Not suitable for concurrent multi-user access |
| **Pre-computed embeddings** | Embedding stored at write time, not recomputed on every query | Embeddings become stale if model changes |
| **Hybrid search (cosine + keyword)** | Improves recall for exact key lookups | Keyword boost is heuristic; may over-rank exact matches |
| **Top-1 retrieval** | Keeps context tight for the LLM | May miss relevant context when multiple entries are related |
| **No auth / no multi-user** | Single-user personal tool | Not deployable as a shared service |
| **No .env** | Simplicity for local dev | All endpoints are hardcoded; requires code changes for different environments |

---

## Running the App

**Prerequisites:** Node.js, Ollama running with `nomic-embed-text` and `phi3` models pulled.

```bash
# Install all dependencies
npm install

# Start all three processes concurrently (backend + frontend + electron)
npm start
```

Individual processes:
```bash
cd backend && node server.js      # Express API on :3000
cd frontend && npm run dev        # Vite dev server on :5173
cd electron && npx electron .     # Desktop shell
```
