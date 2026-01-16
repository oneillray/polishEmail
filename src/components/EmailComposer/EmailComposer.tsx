import { useMemo, useRef, useState } from "react";
import { Sparkles, ChevronDown } from "lucide-react";
import { polishEmail, type PolishMode } from "../../lib/gemini/polishEmail";
import { DiffReviewModal } from "./DiffReviewModal";

type PendingReview = {
  mode: PolishMode;
  original: string;
  polished: string;
};

const MODE_LABEL: Record<PolishMode, string> = {
  "fix-clean": "Fix & Clean",
  professional: "Professional",
  friendly: "Friendly",
  concise: "Concise",
};

export function EmailComposer() {
  const [text, setText] = useState<string>(() => {
    return `Hi Alex,

Just wanted to follow up on the proposal we discussed on Jan 10. Here’s the link: https://example.com/proposal

Can we finalize by Friday?

Thanks,
Ray`;
  });
  const [aiUndoStack, setAiUndoStack] = useState<string[]>([]);
  const [isPolishing, setIsPolishing] = useState(false);
  const [pendingReview, setPendingReview] = useState<PendingReview | null>(null);
  const [error, setError] = useState<string | null>(null);

  const [bubbleOpen, setBubbleOpen] = useState(false);
  const selectionRef = useRef<{ from: number; to: number } | null>(null);
  const textareaRef = useRef<HTMLTextAreaElement | null>(null);

  const canAiUndo = aiUndoStack.length > 0;
  const canRefineSelection = text.trim().length > 0 && !isPolishing;

  const helperText = useMemo(() => {
    if (isPolishing) return "Refining with Gemini…";
    if (error) return error;
    return "AI suggestions are reviewed before applying. Undo is always available.";
  }, [error, isPolishing]);

  async function runRefineSelection(mode: PolishMode) {
    const el = textareaRef.current;
    if (!el) return;
    const from = el.selectionStart ?? 0;
    const to = el.selectionEnd ?? 0;
    if (from === to) return;

    setError(null);
    setIsPolishing(true);
    setBubbleOpen(false);
    try {
      const selectedText = text.slice(from, to);
      selectionRef.current = { from, to };
      const polished = await polishEmail(selectedText, mode);
      setPendingReview({ mode, original: selectedText, polished });
    } catch (e) {
      const message = e instanceof Error ? e.message : "Failed to refine text.";
      setError(message);
    } finally {
      setIsPolishing(false);
    }
  }

  function acceptPolish() {
    if (!pendingReview) return;
    const range = selectionRef.current;
    if (!range) return;

    setAiUndoStack((s) => [...s, text]);
    const next = text.slice(0, range.from) + pendingReview.polished + text.slice(range.to);
    setText(next);

    setPendingReview(null);
  }

  function undoAi() {
    setAiUndoStack((s) => {
      if (s.length === 0) return s;
      const prevText = s[s.length - 1]!;
      setText(prevText);
      return s.slice(0, -1);
    });
  }

  return (
    <section className="card">
      <div className="cardHeader">
        <div>
          <div className="label">Composer</div>
        </div>

        <div className="row">
          <button className="btn" onClick={undoAi} disabled={!canAiUndo || isPolishing} type="button">
            Undo AI
          </button>
        </div>
      </div>

      <div className="composerBody">
        <textarea
          ref={textareaRef}
          className="sparkPlainTextarea"
          value={text}
          onChange={(e) => setText(e.target.value)}
          placeholder="Write your email here..."
        />

        <div className="row" style={{ marginTop: 10, justifyContent: "flex-end" }}>
          <button
            className="sparkIconButton"
            type="button"
            onClick={() => setBubbleOpen((v) => !v)}
            disabled={!canRefineSelection}
            aria-haspopup="menu"
            aria-expanded={bubbleOpen}
            title="AI polish selection"
          >
            <Sparkles size={16} />
            <ChevronDown size={14} />
          </button>
          {bubbleOpen ? (
            <div className="sparkMenu" role="menu">
              <div className="sparkMenuTitle">Polish selection</div>
              <button className="sparkMenuItem" type="button" onClick={() => runRefineSelection("fix-clean")}>
                Fix & Clean
              </button>
              <button className="sparkMenuItem" type="button" onClick={() => runRefineSelection("professional")}>
                Professional
              </button>
              <button className="sparkMenuItem" type="button" onClick={() => runRefineSelection("friendly")}>
                Friendly
              </button>
              <button className="sparkMenuItem" type="button" onClick={() => runRefineSelection("concise")}>
                Concise
              </button>
              {isPolishing ? (
                <div className="sparkSpinnerRow">
                  <span className="sparkSpinner" /> Working…
                </div>
              ) : null}
            </div>
          ) : null}
        </div>
        <div className="hint" style={{ marginTop: 10 }}>
          {helperText}
        </div>
      </div>

      {pendingReview ? (
        <DiffReviewModal
          title={`Review polish: ${MODE_LABEL[pendingReview.mode]}`}
          original={pendingReview.original}
          polished={pendingReview.polished}
          onCancel={() => setPendingReview(null)}
          onApply={acceptPolish}
          applyLabel="Accept"
        />
      ) : null}
    </section>
  );
}

