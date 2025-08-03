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
import { Plus } from "lucide-react";
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
              {notes?.map((note) => (
                <SidebarMenuItem key={note.id}>
                  <SidebarMenuButton
                    isActive={note.id == selectedNote?.id}
                    onClick={() => setSelectedNote(note)}
                  >
                    {note.title}
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
