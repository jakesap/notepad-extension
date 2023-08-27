import { Note } from "../interfaces";
import Modal from "./Modal";

interface DeleteConfirmationModalProps {
  note: Note;
  onDelete: () => void;
  isOpen: boolean;
  setIsOpen: (open: boolean) => void;
}

export default function DeleteConfirmationModal({
  note,
  onDelete,
  isOpen,
  setIsOpen,
}: DeleteConfirmationModalProps) {
  return (
    <Modal title="Delete Note" isOpen={isOpen} setIsOpen={setIsOpen}>
      <p className="text-gray-200 text-sm">
        Are you sure you want to delete your selected note {note.title}?
      </p>
      <div className="flex flex-row space-x-3">
        <button
          className="rounded shadow px-2 bg-red-400"
          onClick={() => {
            onDelete();
            setIsOpen(false);
          }}
        >
          Delete
        </button>
        <button
          className="rounded shadow p-2 bg-gray-700"
          onClick={() => setIsOpen(false)}
        >
          Cancel
        </button>
      </div>
    </Modal>
  );
}
