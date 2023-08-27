import { useEffect, useState } from "react";
import Textarea from "./components/Textarea";
import browser from "webextension-polyfill";
import { Note } from "./interfaces";
import FileDrawer from "./components/FileDrawer";
import DeleteConfirmationModal from "./components/DeleteConfirmationModal";
import InfoModal from "./components/InfoModal";

export default function Popup() {
  const [saving, setSaving] = useState(false);
  const [notes, setNotes] = useState<Note[]>([]);
  const [selectedNote, setSelectedNote] = useState<Note | undefined>();

  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const [infoModalOpen, setInfoModalOpen] = useState(false);

  const createNote = () => {
    const newNote = {
      id: notes[notes.length - 1] ? notes[notes.length - 1].id + 1 : 1,
      title: "New Note",
      content: "",
    };
    console.log(newNote);
    setNotes([...notes, newNote]);
    setSelectedNote(newNote);
  };

  const deleteNote = () => {
    console.log("deleting note: ", selectedNote);
    const newNotes = notes
      .filter((x) => x.id !== selectedNote?.id)
      .sort((a, b) => a.id - b.id)
      .map((x, i) => ({ ...x, id: i }));

    setNotes(newNotes);
    setSelectedNote(undefined);
  };

  const save = (newNotes: Note[]) => {
    if (selectedNote) {
      const newFilteredNotes = [
        ...newNotes.filter((x) => x.id !== selectedNote.id),
        selectedNote,
      ].sort((a, b) => a.id - b.id);
      setNotes(newFilteredNotes);
      browser.storage.local
        .set({ "notepad-data": newFilteredNotes })
        .catch((e) => {
          console.log(e);
        });

      browser.storage.local
        .set({ "last-opened": [selectedNote] })
        .catch((e) => {
          console.log(e);
        });
    } else {
      browser.storage.local.set({ "notepad-data": notes }).catch((e) => {
        console.log(e);
      });
    }
  };

  const loadFiles = () => {
    browser.storage.local
      .get("notepad-data")
      .then((file) => {
        if (file["notepad-data"]) {
          const loadedFiles = file["notepad-data"] as Note[];
          setNotes(loadedFiles.sort((a, b) => a.id - b.id));
          if (loadedFiles[0]) {
            setSelectedNote(loadedFiles[0]);
          }
        }
      })
      .catch((e) => {
        console.log(e);
      });

    browser.storage.local
      .get("last-opened")
      .then((file) => {
        if (file["last-opened"]) {
          const loadedFiles = file["last-opened"] as Note[];
          setSelectedNote(loadedFiles[0]);
        }
      })
      .catch((e) => {
        console.log(e);
      });
  };

  useEffect(() => {
    loadFiles();
  }, []);

  useEffect(() => {
    const savedNote = notes.find((x) => x.id === selectedNote?.id);
    if (
      selectedNote &&
      savedNote &&
      (savedNote.content !== selectedNote.content ||
        savedNote.title !== selectedNote.title)
    ) {
      setSaving(true);
      const t = setTimeout(() => {
        save(notes);
        setSaving(false);
      }, 300);

      return () => clearTimeout(t);
    } else if (selectedNote == undefined) {
      setSaving(true);
      const t = setTimeout(() => {
        save(notes);
        setSaving(false);
      }, 300);

      return () => clearTimeout(t);
    }
  }, [selectedNote]);

  return (
    <div
      id="popup"
      className="flex flex-row w-max h-max p-3 space-x-4 bg-gray-800 overflow-hidden font-mono"
    >
      <FileDrawer
        notes={notes}
        selectedNote={selectedNote}
        onSelect={(id: number) =>
          setSelectedNote(notes.find((x) => x.id === id))
        }
        onNew={() => createNote()}
        onDelete={() => setDeleteModalOpen(true)}
        onInfo={() => setInfoModalOpen(true)}
      />
      <Textarea
        textFile={selectedNote}
        setTextFile={(file?: Note) => setSelectedNote(file)}
        saving={saving}
      />
      {selectedNote && (
        <DeleteConfirmationModal
          isOpen={deleteModalOpen}
          setIsOpen={setDeleteModalOpen}
          note={selectedNote}
          onDelete={() => deleteNote()}
        />
      )}
      <InfoModal isOpen={infoModalOpen} setIsOpen={setInfoModalOpen} />
    </div>
  );
}
