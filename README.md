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

### Key files

- **UI**: `src/components/EmailComposer/EmailComposer.tsx`

- **Review modal**: `src/components/EmailComposer/DiffReviewModal.tsx`
- **Gemini client**: `src/lib/gemini/polishEmail.ts`
  - (This uses Groq model `llama-3.3-70b-versatile`.)

