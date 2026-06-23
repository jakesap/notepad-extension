import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarRail,
} from "@/components/ui/sidebar";
import { Note } from "@/interfaces";
import { GripVertical, Plus } from "lucide-react";
import { useState } from "react";
interface SidebarProps {
  notes: Note[] | null;
  setNotes: React.Dispatch<React.SetStateAction<Note[] | null>>;
  selectedNote: Note | undefined;
  setSelectedNote: React.Dispatch<React.SetStateAction<Note | undefined>>;
}
export function SidebarComponent({
  notes,
  setNotes,
  selectedNote,
  setSelectedNote,
}: SidebarProps) {
  const [dragIndex, setDragIndex] = useState<number | null>(null);
  const [overIndex, setOverIndex] = useState<number | null>(null);

  const handleDrop = (toIndex: number) => {
    if (!notes || dragIndex === null || dragIndex === toIndex) {
      setDragIndex(null);
      setOverIndex(null);
      return;
    }
    const reordered = [...notes];
    const [moved] = reordered.splice(dragIndex, 1);
    reordered.splice(toIndex, 0, moved);
    setNotes(reordered);
    setDragIndex(null);
    setOverIndex(null);
  };

  return (
    <Sidebar>
      <SidebarHeader>
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
      </SidebarHeader>
      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupLabel>Notes</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {notes?.map((note, index) => (
                <SidebarMenuItem
                  key={note.id}
                  draggable
                  onDragStart={() => setDragIndex(index)}
                  onDragOver={(e) => {
                    e.preventDefault();
                    if (overIndex !== index) setOverIndex(index);
                  }}
                  onDrop={() => handleDrop(index)}
                  onDragEnd={() => {
                    setDragIndex(null);
                    setOverIndex(null);
                  }}
                  className={
                    dragIndex === index
                      ? "opacity-50"
                      : overIndex === index
                      ? "border-t-2 border-primary"
                      : undefined
                  }
                >
                  <SidebarMenuButton
                    isActive={note.id == selectedNote?.id}
                    onClick={() => setSelectedNote(note)}
                    className="group/note"
                  >
                    <GripVertical className="w-4 h-4 shrink-0 cursor-grab text-muted-foreground opacity-0 group-hover/note:opacity-100" />
                    <span className="truncate">{note.title}</span>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>
      <SidebarRail />
    </Sidebar>
  );
}
