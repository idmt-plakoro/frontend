"use client";

import Button from "../Button";
import Modal from "./Modal";

interface ErrorModalProps {
  title: string;
  content: string;
  isOpen: boolean;
  onClose: () => void;
}

export default function ErrorModal({
  title,
  content,
  isOpen,
  onClose,
}: ErrorModalProps) {
  return (
    <Modal isOpen={isOpen} onClose={onClose}>
      <p className="self-center p-4 text-center text-xl font-bold">{title}</p>
      <div className="flex flex-col items-center justify-center text-center gap-2">
        <p className="text-white opacity-60">{content}</p>
        <Button
          text="Close"
          func={onClose}
          className="bg-black"
          width="w-20 px-2"
          height="h-7"
        />
      </div>
    </Modal>
  );
}
