import React from "react";

const Modal = ({ isOpen, title, children, onClose }) => {
  if (!isOpen) return null;

  return (
    <>
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-black/30 z-40"
        onClick={onClose}
      ></div>

      {/* Modal Content */}
      <div className="fixed top-1/2 left-1/2 z-50 w-11/12 md:w-1/2 lg:w-1/3 bg-white rounded-lg shadow-lg transform -translate-x-1/2 -translate-y-1/2 p-6">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-bold">{title}</h2>
          <button
            className="text-gray-500 hover:text-gray-700 font-bold text-lg"
            onClick={onClose}
          >
            ×
          </button>
        </div>
        <div>{children}</div>
      </div>
    </>
  );
};

export default Modal;
