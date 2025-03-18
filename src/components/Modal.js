import React, { useEffect, useRef } from 'react';

const Modal = ({ title, isOpen, onClose, children }) => {
  const dialogRef = useRef(null);
  useEffect(() => {
    if (isOpen) {
      dialogRef.current?.showModal();
    } else {
      dialogRef.current?.close();
    }
  }, [isOpen]);
  return (
    <dialog ref={dialogRef} className="modal">
      <div className="modal-box">
        <div className="flex justify-between items-center">
          <h2 className="capitalize">{title}</h2>
          <button className="btn btn-sm btn-circle btn-ghost" aria-label="close" onClick={onClose}>
            ✕
          </button>
        </div>
        {children}
      </div>
    </dialog>
  );
};

export default Modal;
