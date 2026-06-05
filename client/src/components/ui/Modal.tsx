import type { ReactNode } from "react";

interface ModalProps {
  title: string;
  children: ReactNode;
  onClose: () => void
};

function Modal({ title, children, onClose, ...rest }: ModalProps) {
  return (
    <div className="fixed inset-0 bg-black/60 flex justify-center items-center z-10"  {...rest}>
      <div className="bg-teal-50 p-5 flex flex-col gap-5">
        <div className="flex justify-between items-center gap-3">
          <h2 className="font-bold text-2xl text-black">{title}</h2>
          <button className="cursor-pointer text-xl text-black" onClick={onClose}>X</button>
        </div>
        <div>
          {children}
        </div>
      </div>
    </div>
  );
}

export default Modal;
