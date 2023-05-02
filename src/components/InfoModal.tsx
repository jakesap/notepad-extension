import Modal from "./Modal";

interface InfoModalProps {
  isOpen: boolean;
  setIsOpen: (open: boolean) => void;
}

export default function InfoModal({ isOpen, setIsOpen }: InfoModalProps) {
  return (
    <Modal title="Notepad Extension" isOpen={isOpen} setIsOpen={setIsOpen}>
      <div className="flex flex-col text-gray-200 text-sm space-y-3">
        <p>Thank you for downloading Notepad Extension!</p>
        <div>
          Notepad Extension is open source and you can view the code here:
          <a href="https://github.com/jakesap/notepad-extension">
            <div className="text-blue-400">
              https://github.com/jakesap/notepad-extension
            </div>
          </a>
        </div>
      </div>
      <div className="justify-start">
        <button
          className="rounded shadow p-2 bg-gray-700"
          onClick={() => setIsOpen(false)}
        >
          Close
        </button>
      </div>
    </Modal>
  );
}
