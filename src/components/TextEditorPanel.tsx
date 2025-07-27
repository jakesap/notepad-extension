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
import browser from "webextension-polyfill";
import {
  BoldIcon,
  Check,
  Code2Icon,
  Download,
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
            <div className="flex w-full justify-end space-x-2 text-xs text-muted-foreground">
              <button
                className="flex space-x-2 text-sm text-muted-foreground items-center"
                type="button"
                disabled={saving}
                title="Export data"
                onClick={() => {
                  browser.storage.local.get("notepad-data").then((data) => {
                    const json = JSON.stringify(data["notepad-data"], null, 2);
                    const blob = new Blob([json], { type: "application/json" });
                    const url = URL.createObjectURL(blob);
                    const a = document.createElement("a");
                    a.href = url;
                    a.download = "notepad-extension-data.json";
                    a.click();
                    URL.revokeObjectURL(url);
                  });
                }}
              >
                <Download className="w-4 h-4 " />
              </button>
              {saving ? (
                <div role="status" title="Saving...">
                  <svg
                    aria-hidden="true"
                    className="w-4 h-4 text-gray-200 animate-spin dark:text-gray-600 fill-blue-600"
                    viewBox="0 0 100 101"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path
                      d="M100 50.5908C100 78.2051 77.6142 100.591 50 100.591C22.3858 100.591 0 78.2051 0 50.5908C0 22.9766 22.3858 0.59082 50 0.59082C77.6142 0.59082 100 22.9766 100 50.5908ZM9.08144 50.5908C9.08144 73.1895 27.4013 91.5094 50 91.5094C72.5987 91.5094 90.9186 73.1895 90.9186 50.5908C90.9186 27.9921 72.5987 9.67226 50 9.67226C27.4013 9.67226 9.08144 27.9921 9.08144 50.5908Z"
                      fill="currentColor"
                    />
                    <path
                      d="M93.9676 39.0409C96.393 38.4038 97.8624 35.9116 97.0079 33.5539C95.2932 28.8227 92.871 24.3692 89.8167 20.348C85.8452 15.1192 80.8826 10.7238 75.2124 7.41289C69.5422 4.10194 63.2754 1.94025 56.7698 1.05124C51.7666 0.367541 46.6976 0.446843 41.7345 1.27873C39.2613 1.69328 37.813 4.19778 38.4501 6.62326C39.0873 9.04874 41.5694 10.4717 44.0505 10.1071C47.8511 9.54855 51.7191 9.52689 55.5402 10.0491C60.8642 10.7766 65.9928 12.5457 70.6331 15.2552C75.2735 17.9648 79.3347 21.5619 82.5849 25.841C84.9175 28.9121 86.7997 32.2913 88.1811 35.8758C89.083 38.2158 91.5421 39.6781 93.9676 39.0409Z"
                      fill="currentFill"
                    />
                  </svg>
                  <span className="sr-only">Saving...</span>
                </div>
              ) : (
                <div title="Everything is saved!">
                  <Check className="w-4 h-4" />
                </div>
              )}
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
