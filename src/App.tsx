import { EmailRect } from "./components/EmailRect/EmailRect";

export function App() {
  return (
    <div className="page">
      <header className="pageHeader">
        <div>
          <div className="title">Email Polish</div>
          <div className="subtitle">WYSIWYG editor with assisted authoring (review + undo).</div>
        </div>
      </header>
      <main className="pageBody">
        <EmailRect />
      </main>
    </div>
  );
}

