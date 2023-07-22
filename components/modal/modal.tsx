import { X } from "lucide-react";

type ModalProps = {
  isOpen: boolean;
  setIsOpen: (isOpen: boolean) => void;
};

const Modal = ({ isOpen, setIsOpen }: ModalProps) => {
  return (
    <dialog open={isOpen} className="modal modal-top sm:modal-middle">
      <form method="dialog" className="modal-box">
        <button
          type="button"
          onClick={() => {
            setIsOpen(false);
          }}
          className="btn btn-sm btn-circle btn-ghost absolute right-2 top-2"
        >
          <X />
        </button>
        <h3 className="font-bold text-lg">Hello!</h3>
        <p className="py-4">Press ESC key or click outside to close</p>
      </form>
      <form method="dialog" className="modal-backdrop bg-black opacity-50">
        <button
          type="button"
          onClick={() => {
            setIsOpen(false);
          }}
        >
          close
        </button>
      </form>
    </dialog>
  );
};

export default Modal;
