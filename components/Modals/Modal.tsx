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

          <div className="relative bg-[#505050] w-[40vw] rounded-2xl z-10 text-white p-4 flew items-center justify-center pointer-events-auto">
            <div className="">{children}</div>
          </div>
        </div>
      )}
    </div>
  );
}
