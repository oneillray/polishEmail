import { X } from "lucide-react";

type Props = {
  title: string;
  original: string;
  polished: string;
  onCancel: () => void;
  onApply: () => void;
};

export function DiffReviewModal({ title, original, polished, onCancel, onApply }: Props) {
  return (
    <div className="modalOverlay" role="dialog" aria-modal="true" aria-label={title}>
      <div className="modal">
        <div className="modalHeader">
          <div className="modalTitle">{title}</div>
          <button className="btn" onClick={onCancel} aria-label="Close">
            <X size={16} />
          </button>
        </div>

        <div className="modalBody">
          <div className="compare">
            <div>
              <div className="paneTitle">Original</div>
              <div className="pane">{original}</div>
            </div>
            <div>
              <div className="paneTitle">Polished</div>
              <div className="pane">{polished}</div>
            </div>
          </div>
        </div>

        <div className="modalFooter">
          <button className="btn" onClick={onCancel}>
            Cancel
          </button>
          <button className="btn btnPrimary" onClick={onApply}>
            Apply
          </button>
        </div>
      </div>
    </div>
  );
}

