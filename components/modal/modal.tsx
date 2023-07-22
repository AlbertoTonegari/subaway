"use client";

import { X } from "lucide-react";
import { Tooltip } from "react-tooltip";

type ModalProps = {
  isOpen: boolean;
  setIsOpen: (isOpen: boolean) => void;
  children?: React.ReactNode;
};

const Modal = ({ isOpen, setIsOpen, children }: ModalProps) => {
  return (
    <dialog open={isOpen} className="modal modal-top sm:modal-middle">
      <form method="dialog" className="modal-box">
        <button
          data-tooltip-id="x-tooltip"
          data-tooltip-content="Close modal"
          type="button"
          onClick={() => {
            setIsOpen(false);
          }}
          className="btn btn-sm btn-circle btn-ghost absolute right-2 top-2"
        >
          <X />
        </button>
        {children}
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
      <Tooltip id="x-tooltip" />
    </dialog>
  );
};

export default Modal;
