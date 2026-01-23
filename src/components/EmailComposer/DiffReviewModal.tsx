import { GuxButton, GuxCard, GuxModal } from "genesys-spark-components-react";

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
      <div slot="title" className="guxModalTitle">
        {title}
      </div>

      <div slot="content">
        <div className="compare">
          <GuxCard accent="bordered" className="compareCard">
            <div className="paneTitle primary">Original</div>
            <div className="pane color-primary">{original}</div>
          </GuxCard>
          <GuxCard accent="bordered" className="compareCard">
            <div className="paneTitle primary">Polished</div>
            <div className="pane color-primary">{polished}</div>
          </GuxCard>
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

