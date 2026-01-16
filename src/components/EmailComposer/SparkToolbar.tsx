import { Bold, Italic, List, ListOrdered, Redo2, Undo2 } from "lucide-react";
import type { Editor } from "@tiptap/react";

type Props = {
  editor: Editor;
  onAiUndo: () => void;
  canAiUndo: boolean;
};

export function SparkToolbar({ editor, onAiUndo, canAiUndo }: Props) {
  return (
    <div className="sparkToolbar" role="toolbar" aria-label="Editor toolbar">
      <button
        className="sparkIconButton"
        onClick={() => editor.chain().focus().toggleBold().run()}
        aria-pressed={editor.isActive("bold")}
        title="Bold"
        type="button"
      >
        <Bold size={16} />
      </button>
      <button
        className="sparkIconButton"
        onClick={() => editor.chain().focus().toggleItalic().run()}
        aria-pressed={editor.isActive("italic")}
        title="Italic"
        type="button"
      >
        <Italic size={16} />
      </button>
      <span className="sparkToolbarDivider" />
      <button
        className="sparkIconButton"
        onClick={() => editor.chain().focus().toggleBulletList().run()}
        aria-pressed={editor.isActive("bulletList")}
        title="Bulleted list"
        type="button"
      >
        <List size={16} />
      </button>
      <button
        className="sparkIconButton"
        onClick={() => editor.chain().focus().toggleOrderedList().run()}
        aria-pressed={editor.isActive("orderedList")}
        title="Numbered list"
        type="button"
      >
        <ListOrdered size={16} />
      </button>
      <span className="sparkToolbarDivider" />
      <button
        className="sparkButton"
        onClick={onAiUndo}
        disabled={!canAiUndo}
        type="button"
        title="Undo last AI apply"
      >
        <Undo2 size={16} />
        Undo AI
      </button>
      <span className="sparkToolbarSpacer" />
      <button
        className="sparkIconButton"
        onClick={() => editor.chain().focus().undo().run()}
        disabled={!editor.can().chain().focus().undo().run()}
        type="button"
        title="Undo"
      >
        <Undo2 size={16} />
      </button>
      <button
        className="sparkIconButton"
        onClick={() => editor.chain().focus().redo().run()}
        disabled={!editor.can().chain().focus().redo().run()}
        type="button"
        title="Redo"
      >
        <Redo2 size={16} />
      </button>
    </div>
  );
}

