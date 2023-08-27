import { Dialog } from "@headlessui/react";

interface ModalProps {
  title: string;
  isOpen: boolean;
  setIsOpen: (isOpen: boolean) => void;
  children?: JSX.Element | JSX.Element[];
}

export default function Modal({
  title,
  isOpen,
  setIsOpen,
  children,
}: ModalProps) {
  return (
    <Dialog open={isOpen} onClose={() => setIsOpen(false)}>
      <div className="fixed inset-0 bg-black/30" aria-hidden="true" />
      <div className="fixed inset-0 flex items-center justify-center p-4">
        <Dialog.Panel className="flex flex-col mx-auto max-w-sm space-y-3 rounded bg-gray-600 text-gray-200 p-5">
          <Dialog.Title className="font-bold text-2xl">{title}</Dialog.Title>
          {children}
        </Dialog.Panel>
      </div>
    </Dialog>
  );
}
