import { Note } from "../interfaces";
import Link from "@tiptap/extension-link";
import { useCallback, useState } from "react";
import { useEditor, EditorContent, Editor, BubbleMenu } from "@tiptap/react";
import Document from "@tiptap/extension-document";
import Paragraph from "@tiptap/extension-paragraph";
import Text from "@tiptap/extension-text";
import Bold from "@tiptap/extension-bold";
import Underline from "@tiptap/extension-underline";
import Italic from "@tiptap/extension-italic";
import Strike from "@tiptap/extension-strike";
import Code from "@tiptap/extension-code";
import History from "@tiptap/extension-history";
import {
  BoldIcon,
  Code2Icon,
  ItalicIcon,
  Link2,
  RotateCcw,
  RotateCw,
  Strikethrough,
  UnderlineIcon,
} from "lucide-react";
import { Dialog, DialogTrigger, DialogContent, DialogClose } from "./ui/dialog";
import { buttonVariants } from "./ui/button";
import { Input } from "./ui/input";

interface TextEditorProps {
  note: Note;
  setNote: (note: Note) => void;
  saving: boolean;
}

export default function TextEditorPanel({
  note,
  setNote,
  saving,
}: TextEditorProps) {
  const editor = useEditor(
    {
      extensions: [
        Document,
        History,
        Paragraph,
        Text,
        Link.configure({
          openOnClick: false,
        }),
        Bold,
        Underline,
        Italic,
        Strike,
        Code,
      ],
      content: note.content,
      onUpdate({ editor }) {
        const html = editor.getHTML();
        if (note.content === html) return;
        setNote({ ...note, content: html });
      },
    },
    [note.content, note.id]
  ) as Editor;

  const [url, setUrl] = useState<string>("");

  const saveLink = useCallback(() => {
    if (url) {
      editor
        .chain()
        .focus()
        .extendMarkRange("link")
        .setLink({ href: url, target: "_blank" })
        .run();
    } else {
      editor.chain().focus().extendMarkRange("link").unsetLink().run();
    }
  }, [editor, url]);

  const removeLink = useCallback(() => {
    editor.chain().focus().extendMarkRange("link").unsetLink().run();
  }, [editor]);

  const toggleBold = useCallback(() => {
    editor.chain().focus().toggleBold().run();
  }, [editor]);

  const toggleUnderline = useCallback(() => {
    editor.chain().focus().toggleUnderline().run();
  }, [editor]);

  const toggleItalic = useCallback(() => {
    editor.chain().focus().toggleItalic().run();
  }, [editor]);

  const toggleStrike = useCallback(() => {
    editor.chain().focus().toggleStrike().run();
  }, [editor]);

  const toggleCode = useCallback(() => {
    editor.chain().focus().toggleCode().run();
  }, [editor]);

  if (!editor) {
    return null;
  }
  return (
    <div className="flex flex-col h-[29rem] w-[80%]">
      <div className="flex h-full w-full flex-col px-3 py-2">
        <div className="space-y-2 h-full">
          <div className="flex w-full space-x-2 items-center">
            <button
              onClick={() => editor.chain().focus().undo().run()}
              disabled={!editor.can().undo()}
            >
              <RotateCcw className="text-muted-foreground w-5 h-5" />
            </button>
            <button
              onClick={() => editor.chain().focus().redo().run()}
              disabled={!editor.can().redo()}
            >
              <RotateCw className="text-muted-foreground w-5 h-5" />
            </button>
            <Dialog>
              <DialogTrigger
                className={`p-1
                  ${editor.isActive("link") ? "bg-accent rounded" : ""}
                `}
              >
                <Link2 className="text-muted-foreground w-5 h-5" />
              </DialogTrigger>
              <DialogContent>
                <h2 className="modal-title">Edit link</h2>
                <Input
                  autoFocus
                  value={url}
                  onChange={(e) => setUrl(e.target.value)}
                />
                <div className="flex justify-end space-x-2">
                  <DialogClose
                    className={buttonVariants({
                      variant: "destructive",
                    })}
                    onClick={removeLink}
                  >
                    Remove
                  </DialogClose>
                  <DialogClose
                    className={buttonVariants({
                      variant: "default",
                    })}
                    onClick={saveLink}
                  >
                    Save
                  </DialogClose>
                </div>
              </DialogContent>
            </Dialog>
            <button
              className={`p-1
                  ${editor.isActive("bold") ? "bg-accent rounded" : ""}
                `}
              onClick={toggleBold}
            >
              <BoldIcon className="text-muted-foreground w-5 h-5" />
            </button>
            <button
              className={`p-1
                  ${editor.isActive("underline") ? "bg-accent rounded" : ""}
                `}
              onClick={toggleUnderline}
            >
              <UnderlineIcon className="text-muted-foreground w-5 h-5" />
            </button>
            <button
              className={`p-1
                  ${editor.isActive("italic") ? "bg-accent rounded" : ""}
                `}
              onClick={toggleItalic}
            >
              <ItalicIcon className="text-muted-foreground w-5 h-5" />
            </button>
            <button
              className={`p-1
                  ${editor.isActive("strike") ? "bg-accent rounded" : ""}
                `}
              onClick={toggleStrike}
            >
              <Strikethrough className="text-muted-foreground w-5 h-5" />
            </button>
            <button
              className={`p-1
                  ${editor.isActive("code") ? "bg-accent rounded" : ""}
                `}
              onClick={toggleCode}
            >
              <Code2Icon className="text-muted-foreground w-5 h-5" />
            </button>
            <div className="flex w-full justify-end text-xs text-muted-foreground">
              <div>{saving ? "Saving..." : "Saved"}</div>
            </div>
          </div>

          <BubbleMenu
            className="z-50 rounded-md border bg-popover px-3 py-1.5 text-sm text-popover-foreground shadow-md animate-in fade-in-0 zoom-in-95 data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=closed]:zoom-out-95 data-[side=bottom]:slide-in-from-top-2 data-[side=left]:slide-in-from-right-2 data-[side=right]:slide-in-from-left-2 data-[side=top]:slide-in-from-bottom-2"
            tippyOptions={{ duration: 150 }}
            editor={editor}
            shouldShow={({ editor, from, to }) => {
              return from === to && editor.isActive("link");
            }}
          >
            <div className="flex space-x-2">
              <a href={url} target="_blank" className="text-blue-600 underline">
                Open
              </a>
              <button type="button" onClick={removeLink}>
                Remove
              </button>
            </div>
          </BubbleMenu>

          <EditorContent
            className="flex w-full h-full rounded-md overflow-auto border border-input bg-background px-3 py-2 text-sm ring-0 placeholder:text-muted-foreground focus-visible:outline-none disabled:cursor-not-allowed disabled:opacity-50"
            editor={editor}
          />
        </div>
      </div>
    </div>
  );
}
