## Email Polish (Assisted Authoring)

React email composer scaffold that integrates with Groq (OpenAI-compatible API) to **refine** email text using an **Assisted Authoring** pattern:

- User writes normally
- AI proposes a polished version
- User reviews side-by-side in a modal
- User clicks **Apply** (or cancels)
- User can **Undo** AI-applied changes

### Setup

- **Install deps**:

```bash
npm install
```

- **Set env var**: copy `env.example` to `.env` and fill in your Groq key:

```bash
cp env.example .env
```

Then edit `.env`:

```bash
GROQ_API_KEY=...
```

Note: If you change `.env`, **restart** `npm run dev` for changes to take effect.

### Run

```bash
npm run dev
```

### Deploy to Vercel

- **1) Push to GitHub** (Vercel deploys from a repo)
- **2) In Vercel**: “New Project” → import your repo
- **3) Set env var** in Vercel Project Settings → Environment Variables:
  - **`GROQ_API_KEY`** = your Groq key
- **4) Build settings**:
  - **Build Command**: `npm run build`
  - **Output Directory**: `dist`

This repo provides a serverless endpoint at **`/api/polish`** (Vercel function in `api/polish.ts`) so your Groq key is never shipped to the browser.

### Key files

- **UI**: `src/components/EmailComposer/EmailComposer.tsx`

- **Review modal**: `src/components/EmailComposer/DiffReviewModal.tsx`
- **Gemini client**: `src/lib/gemini/polishEmail.ts`
  - (This uses Groq model `llama-3.3-70b-versatile`.)

