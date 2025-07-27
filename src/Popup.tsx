import { useEffect, useState } from "react";
import TextEditorPanel from "./components/TextEditorPanel";
import browser from "webextension-polyfill";
import { Note } from "./interfaces";
import { Plus } from "lucide-react";
import {
  ContextMenu,
  ContextMenuContent,
  ContextMenuItem,
  ContextMenuSeparator,
  ContextMenuTrigger,
} from "./components/ui/context-menu";

export default function Popup() {
  const [saving, setSaving] = useState(false);
  const [notes, setNotes] = useState<Note[] | null>(null);
  const [selectedNote, setSelectedNote] = useState<Note | undefined>();
  const [rename, setRename] = useState<Note>();
  const [deleteQueue, setDeleteQueue] = useState<number[]>([]);

  useEffect(() => {
    browser.storage.local
      .get("notepad-data")
      .then((file) => {
        if (file["notepad-data"]) {
          const loadedFiles = file["notepad-data"] as Note[];
          if (loadedFiles.length > 0) {
            setSelectedNote(loadedFiles[0]);
          }
          setNotes(loadedFiles.sort((a, b) => a.id - b.id));
        } else {
          setNotes([]);
        }
      })
      .catch((e) => {
        console.log(e);
      });
  }, []);

  useEffect(() => {
    if (notes === null) return;
    setSaving(true);
    const t = setTimeout(() => {
      browser.storage.local.set({ "notepad-data": notes }).catch((e) => {
        console.log(e);
      });
      setSaving(false);
    }, 300);

    return () => clearTimeout(t);
  }, [notes, selectedNote]);

  useEffect(() => {
    if (deleteQueue.length > 0) {
      if (!notes) return;
      setNotes(notes.filter((x) => !deleteQueue.includes(x.id)));
      setDeleteQueue([]);
      setSelectedNote(undefined);
    }
  }, [deleteQueue]);

  return (
    <div id="popup" className="flex flex-row w-full h-full">
      <div className="flex flex-col h-full rounded-l border-r text-sm w-[20%] max-w-[20%] min-w-[20%] overflow-x-hidden space-y-3 px-3 py-2">
        <p className="text-xs text-muted">
          Right click notes to rename or delete
        </p>
        <button
          className="flex space-x-2 text-sm text-muted-foreground items-center"
          type="button"
          onClick={() => {
            if (!notes) return;
            const newNote = {
              id: notes[notes.length - 1] ? notes[notes.length - 1].id + 1 : 1,
              title: "New Note",
              content: "",
            };
            setNotes([...notes, newNote]);
            setSelectedNote(newNote);
          }}
        >
          <Plus className="w-4 h-4 " />
          <p>Add New</p>
        </button>
        <ul className="overflow-y-auto space-y-3 px-1 overflow-x-hidden">
          {notes &&
            notes.map((note) => (
              <li className="items-start font-medium" key={note.id}>
                {rename && rename?.id === note.id ? (
                  <input
                    autoFocus
                    className="text-foreground bg-background focus-visible:outline-none max-w-full w-full px-1"
                    value={note.title}
                    onChange={(e) => {
                      const newNotes = notes.map((x) =>
                        x.id === note.id ? { ...x, title: e.target.value } : x
                      );
                      setNotes(newNotes);
                      setSelectedNote(
                        newNotes.find((x) => x.id === note.id) || undefined
                      );
                    }}
                    onBlur={() => setRename(undefined)}
                    onKeyDown={(e) => {
                      if (e.key === "Enter") {
                        setRename(undefined);
                      }
                    }}
                  />
                ) : (
                  <ContextMenu
                    onOpenChange={(open) => {
                      if (open) {
                        setSelectedNote(note);
                      }
                    }}
                  >
                    <ContextMenuTrigger
                      className="cursor-pointer w-full"
                      onClick={() => {
                        setSelectedNote(note);
                      }}
                    >
                      <p
                        title={note.title}
                        className={`text-left w-full overflow-x-clip px-1 ${
                          note.id == selectedNote?.id &&
                          "bg-accent text-accent-foreground rounded"
                        }`}
                      >
                        {note.title}
                      </p>
                    </ContextMenuTrigger>
                    <ContextMenuContent className="w-64">
                      <ContextMenuItem onClick={() => setRename(note)}>
                        Rename
                      </ContextMenuItem>
                      <ContextMenuSeparator />
                      <ContextMenuItem
                        onClick={() =>
                          setDeleteQueue([...deleteQueue, note.id])
                        }
                      >
                        Delete
                      </ContextMenuItem>
                    </ContextMenuContent>
                  </ContextMenu>
                )}
              </li>
            ))}
        </ul>
      </div>
      {selectedNote ? (
        <TextEditorPanel
          note={selectedNote}
          setNote={(note: Note) => {
            if (!notes) return;
            setNotes(
              notes.map((x) =>
                x.id === selectedNote?.id ? { ...x, ...note } : x
              )
            );
          }}
          saving={saving}
        />
      ) : (
        <div className="flex justify-center w-full text-muted items-center h-full text-sm">
          Create a note to get started
        </div>
      )}
    </div>
  );
}
