"use client";
interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  children?: React.ReactNode;
  noBackground?: boolean;
}

export default function Modal({
  isOpen,
  onClose,
  children,
  noBackground = false,
}: ModalProps) {
  return (
    <div>
      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center w-screen h-screen font-salsa pointer-events-none">
          {!noBackground && (
            <div
              className={`absolute inset-0 bg-black opacity-50 pointer-events-auto`}
              onClick={onClose}
            ></div>
          )}

          <div className="relative bg-[#505050] w-[90vw] md:w-[40vw] max-w-lg rounded-2xl z-10 text-white p-4 flex flex-col items-center justify-center pointer-events-auto">
            <div className="w-full">{children}</div>
          </div>
        </div>
      )}
    </div>
  );
}
