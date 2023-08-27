import { Note } from "../interfaces";
import {
  DocumentPlusIcon,
  InformationCircleIcon,
  TrashIcon,
} from "@heroicons/react/24/outline";

interface FileDrawerProps {
  notes?: Note[];
  selectedNote?: Note;
  onSelect: (id: number) => void;
  onNew: () => void;
  onDelete: () => void;
  onInfo: () => void;
}

export default function FileDrawer({
  notes,
  selectedNote,
  onSelect,
  onNew,
  onDelete,
  onInfo,
}: FileDrawerProps) {
  return (
    <div className="rounded border flex flex-col border-gray-700 text-gray-200 text-sm w-[25%] space-y-3 py-2 px-3">
      <div className="flex flex-row justify-between w-full">
        <div className="flex flex-row space-x-3">
          <button type="button" onClick={onNew}>
            <DocumentPlusIcon className="w-5 h-5 text-gray-400" />
          </button>
          <button type="button" onClick={onDelete}>
            <TrashIcon className="w-5 h-5 text-gray-400" />
          </button>
        </div>
        <button type="button" onClick={onInfo}>
          <InformationCircleIcon className="w-5 h-5 text-gray-400" />
        </button>
      </div>
      <div className="bg-gray-600 rounded-lg h-[1px] w-15" />
      <div className="overflow-y-auto space-y-3">
        {notes &&
          notes.map((note) => (
            <div className="flex items-start">
              <button
                type="button"
                key={note.id}
                value={note.id}
                className={`cursor-pointer w-full ${
                  note.id != selectedNote?.id ? "hover:text-gray-400" : ""
                }`}
                onClick={(e) => onSelect(parseInt(e.currentTarget.value))}
              >
                <p
                  className={`text-lg text-left font-medium w-full px-1 ${
                    note.id == selectedNote?.id ? "bg-gray-500 rounded" : ""
                  }`}
                >
                  {note.title}
                </p>
              </button>
            </div>
          ))}
      </div>
    </div>
  );
}
