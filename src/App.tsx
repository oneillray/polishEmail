import { EmailComposer } from "./components/EmailComposer/EmailComposer";

export function App() {
  return (
    <div className="page">
      <header className="pageHeader">
        <div>
          <div className="title">Email Polish</div>
          <div className="subtitle">Assisted authoring with review + undo.</div>
        </div>
      </header>
      <main className="pageBody">
        <EmailComposer />
      </main>
    </div>
  );
}

