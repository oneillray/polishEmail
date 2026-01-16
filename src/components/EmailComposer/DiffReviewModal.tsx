import { GuxButton, GuxModal } from "genesys-spark-components-react";

type Props = {
  title: string;
  original: string;
  polished: string;
  onCancel: () => void;
  onApply: () => void;
  applyLabel?: string;
};

export function DiffReviewModal({
  title,
  original,
  polished,
  onCancel,
  onApply,
  applyLabel = "Apply",
}: Props) {
  return (
    <GuxModal open size="large" onGuxdismiss={onCancel}>
      <div slot="title">{title}</div>

      <div slot="content">
        <div className="compare">
          <div>
            <div className="paneTitle primary">Original</div>
            <div className="pane color-primary">{original}</div>
          </div>
          <div>
            <div className="paneTitle primary">Polished</div>
            <div className="pane color-primary">{polished}</div>
          </div>
        </div>
      </div>

      <div slot="end-align-buttons">
        <GuxButton accent="secondary" onClick={onCancel}>
          Cancel
        </GuxButton>
        <GuxButton accent="primary" onClick={onApply}>
          {applyLabel}
        </GuxButton>
      </div>
    </GuxModal>
  );
}

