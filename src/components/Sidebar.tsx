import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Sidebar, SidebarContent, SidebarGroup, SidebarGroupContent, SidebarGroupLabel, SidebarHeader, SidebarMenu, SidebarMenuButton, SidebarMenuItem, SidebarRail } from "@/components/ui/sidebar";
import { Note } from "@/interfaces";
import { Check, Plus, TextCursorInput, Trash2 } from "lucide-react";
import { useState } from "react";
interface SidebarProps {
  notes: Note[] | null;
  setNotes: React.Dispatch<React.SetStateAction<Note[] | null>>;
  selectedNote: Note | undefined;
  setSelectedNote: React.Dispatch<React.SetStateAction<Note | undefined>>;
}
export function SidebarComponent({ notes, setNotes, selectedNote, setSelectedNote }: SidebarProps) {
  const [dragIndex, setDragIndex] = useState<number | null>(null);
  const [overIndex, setOverIndex] = useState<number | null>(null);
  const [renameId, setRenameId] = useState<number | null>(null);
  const [renameValue, setRenameValue] = useState("");
  const [deleteTarget, setDeleteTarget] = useState<Note | null>(null);

  const handleDrop = () => {
    if (!notes || dragIndex === null || overIndex === null) {
      setDragIndex(null);
      setOverIndex(null);
      return;
    }
    let target = overIndex;
    if (dragIndex < target) target -= 1;
    if (target !== dragIndex) {
      const reordered = [...notes];
      const [moved] = reordered.splice(dragIndex, 1);
      reordered.splice(target, 0, moved);
      setNotes(reordered);
    }
    setDragIndex(null);
    setOverIndex(null);
  };

  const startRename = (note: Note) => {
    setRenameId(note.id);
    setRenameValue(note.title);
  };

  const confirmRename = () => {
    if (renameId === null) {
      return;
    }
    const trimmed = renameValue.trim();
    if (notes && trimmed) {
      setNotes(notes.map((x) => (x.id === renameId ? { ...x, title: trimmed } : x)));
      if (selectedNote?.id === renameId) {
        setSelectedNote({ ...selectedNote, title: trimmed });
      }
    }
    setRenameId(null);
  };

  const confirmDelete = () => {
    if (!notes || !deleteTarget) {
      setDeleteTarget(null);
      return;
    }
    setNotes(notes.filter((x) => x.id !== deleteTarget.id));
    if (selectedNote?.id === deleteTarget.id) {
      setSelectedNote(undefined);
    }
    setDeleteTarget(null);
  };

  return (
    <Sidebar>
      <SidebarHeader>
        <button
          className="flex space-x-2 p-1 text-sm text-muted-foreground items-center"
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
      </SidebarHeader>
      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupLabel className="pr-2">Notes</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {notes?.map((note, index) => (
                <SidebarMenuItem
                  key={note.id}
                  draggable={renameId !== note.id}
                  onDragStart={() => setDragIndex(index)}
                  onDragOver={(e) => {
                    e.preventDefault();
                    const rect = e.currentTarget.getBoundingClientRect();
                    const pos = index + (e.clientY > rect.top + rect.height / 2 ? 1 : 0);
                    if (overIndex !== pos) setOverIndex(pos);
                  }}
                  onDrop={handleDrop}
                  onDragEnd={() => {
                    setDragIndex(null);
                    setOverIndex(null);
                  }}
                  className={dragIndex === index ? "opacity-50" : overIndex === index ? "border-t-2 border-primary" : overIndex === index + 1 ? "border-b-2 border-primary" : undefined}
                >
                  {renameId === note.id ? (
                    <div className="flex items-center text-sm gap-1 pl-2 pr-1">
                      <Input
                        autoFocus
                        value={renameValue}
                        onChange={(e) => setRenameValue(e.target.value)}
                        onKeyDown={(e) => {
                          if (e.key === "Enter") confirmRename();
                          if (e.key === "Escape") setRenameId(null);
                        }}
                        onBlur={confirmRename}
                        className="h-7 text-sm"
                      />
                      <button
                        type="button"
                        aria-label="Confirm rename"
                        // onMouseDown so it fires before the input's onBlur
                        onMouseDown={(e) => {
                          e.preventDefault();
                          confirmRename();
                        }}
                        className="flex aspect-square w-6 shrink-0 items-center justify-center rounded-md text-muted-foreground hover:bg-accent hover:text-foreground"
                      >
                        <Check className="w-4 h-4" />
                      </button>
                    </div>
                  ) : (
                    <>
                      <SidebarMenuButton isActive={note.id == selectedNote?.id} onClick={() => setSelectedNote(note)} className="cursor-grab">
                        <span className="truncate text-sm" title={note.title}>
                          {note.title}
                        </span>
                      </SidebarMenuButton>
                      <div className={`absolute right-1 top-1/2 flex -translate-y-1/2 items-center gap-0.5 opacity-0 transition-opacity ${dragIndex === null ? "group-hover/menu-item:opacity-100 group-focus-within/menu-item:opacity-100" : ""}`}>
                        <button type="button" aria-label="Rename note" onClick={() => startRename(note)} className="flex aspect-square w-6 items-center justify-center rounded-md text-muted-foreground hover:bg-accent hover:text-foreground">
                          <TextCursorInput className="w-4 h-4" />
                        </button>
                        <button type="button" aria-label="Delete note" onClick={() => setDeleteTarget(note)} className="flex aspect-square w-6 items-center justify-center rounded-md text-muted-foreground hover:bg-accent hover:text-destructive">
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </>
                  )}
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>
      <SidebarRail />
      <Dialog
        open={deleteTarget !== null}
        onOpenChange={(open) => {
          if (!open) setDeleteTarget(null);
        }}
      >
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Delete note</DialogTitle>
            <DialogDescription>Are you sure you want to delete "{deleteTarget?.title}"? This action cannot be undone.</DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button variant="outline" onClick={() => setDeleteTarget(null)}>
              Cancel
            </Button>
            <Button variant="destructive" onClick={confirmDelete}>
              Delete
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </Sidebar>
  );
}
