"use client";

import { X } from "lucide-react";
import { useEffect } from "react";
import { Tooltip } from "react-tooltip";

type ModalProps = {
  isOpen: boolean;
  setIsOpen: (isOpen: boolean) => void;
  children?: React.ReactNode;
};

const Modal = ({ isOpen, setIsOpen, children }: ModalProps) => {
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "auto";
    }
  }, [isOpen]);
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 flex justify-center items-center">
      <div className="modal-box">
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
      </div>
      <div className="modal-backdrop fixed inset-0 bg-black opacity-50">
        <button
          type="button"
          className="cursor-default"
          onClick={() => {
            setIsOpen(false);
          }}
        >
          close
        </button>
      </div>
      <Tooltip id="x-tooltip" />
    </div>
  );
};

export default Modal;
