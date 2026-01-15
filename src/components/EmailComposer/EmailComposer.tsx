import { useMemo, useState } from "react";
import { Wand2, Undo2 } from "lucide-react";
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

  const [undoStack, setUndoStack] = useState<string[]>([]);
  const [menuOpen, setMenuOpen] = useState(false);
  const [isPolishing, setIsPolishing] = useState(false);
  const [pendingReview, setPendingReview] = useState<PendingReview | null>(null);
  const [error, setError] = useState<string | null>(null);

  const canUndo = undoStack.length > 0;
  const canRefine = text.trim().length > 0 && !isPolishing;

  const helperText = useMemo(() => {
    if (isPolishing) return "Refining with Gemini…";
    if (error) return error;
    return "AI suggestions are reviewed before applying. Undo is always available.";
  }, [error, isPolishing]);

  async function runRefine(mode: PolishMode) {
    setError(null);
    setIsPolishing(true);
    setMenuOpen(false);
    try {
      const polished = await polishEmail(text, mode);
      setPendingReview({ mode, original: text, polished });
    } catch (e) {
      const message = e instanceof Error ? e.message : "Failed to refine text.";
      setError(message);
    } finally {
      setIsPolishing(false);
    }
  }

  function applyPolish() {
    if (!pendingReview) return;
    setUndoStack((s) => [...s, pendingReview.original]);
    setText(pendingReview.polished);
    setPendingReview(null);
  }

  function undo() {
    setUndoStack((s) => {
      if (s.length === 0) return s;
      const prev = s[s.length - 1]!;
      setText(prev);
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
          <button className="btn" onClick={undo} disabled={!canUndo || isPolishing}>
            <Undo2 size={16} />
            Undo
          </button>

          <div className="popover">
            <button
              className="btn btnPrimary"
              onClick={() => setMenuOpen((v) => !v)}
              disabled={!canRefine}
              aria-haspopup="menu"
              aria-expanded={menuOpen}
            >
              <Wand2 size={16} />
              Refine
            </button>

            {menuOpen ? (
              <div className="menu" role="menu">
                <div className="menuTitle">Refine preset</div>
                <div className="menuGrid">
                  <button className="btn" onClick={() => runRefine("fix-clean")}>
                    Fix & Clean
                  </button>
                  <button className="btn" onClick={() => runRefine("professional")}>
                    Professional
                  </button>
                  <button className="btn" onClick={() => runRefine("friendly")}>
                    Friendly
                  </button>
                  <button className="btn" onClick={() => runRefine("concise")}>
                    Concise
                  </button>
                </div>
                <div className="divider" />
                <div className="hint">
                  Tip: We preserve facts (names/dates/links). You’ll review before applying.
                </div>
              </div>
            ) : null}
          </div>
        </div>
      </div>

      <div className="composerBody">
        <textarea
          className="textarea"
          value={text}
          onChange={(e) => setText(e.target.value)}
          placeholder="Write your email…"
        />
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
          onApply={applyPolish}
        />
      ) : null}
    </section>
  );
}

