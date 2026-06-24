import { useEffect, useState } from "react";
import TextEditorPanel from "./components/TextEditorPanel";
import browser from "webextension-polyfill";
import { Note } from "./interfaces";
import { SidebarComponent } from "./components/Sidebar";

export default function Popup() {
  const [saving, setSaving] = useState(false);
  const [notes, setNotes] = useState<Note[] | null>(null);
  const [selectedNote, setSelectedNote] = useState<Note | undefined>();

  useEffect(() => {
    browser.storage.local
      .get(["notepad-data", "notepad-selected-note-id"])
      .then((file) => {
        const notes = (file["notepad-data"] as Note[]) || [];
        const selectedNoteId = file["notepad-selected-note-id"] as
          | number
          | undefined;

        if (notes.length > 0) {
          const lastSelectedNote = notes.find((x) => x.id === selectedNoteId);
          setSelectedNote(lastSelectedNote || notes[0]);
        }

        setNotes(notes);
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
  }, [notes]);

  useEffect(() => {
    if (selectedNote) {
      browser.storage.local.set({
        "notepad-selected-note-id": selectedNote.id,
      });
    }
  }, [selectedNote]);

  return (
    <div id="popup" className="flex flex-row w-full h-[29rem]">
      <SidebarComponent
        notes={notes}
        setNotes={setNotes}
        selectedNote={selectedNote}
        setSelectedNote={setSelectedNote}
      />

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
