import React from 'react';
import { RxCross2 } from 'react-icons/rx';

interface DeleteConfirmationProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  itemName: string; 
}

const DeleteConfirmation: React.FC<DeleteConfirmationProps> = ({ isOpen, onClose, onConfirm, itemName }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
      <div className="bg-white p-6 rounded shadow-lg w-96">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-lg font-bold">Confirm Deletion</h2>
          <button onClick={onClose} className="text-gray-500">
            <RxCross2 />
          </button>
        </div>
        <p className="mb-4">Are you sure you want to delete this {itemName}?</p>
        <div className="flex justify-end gap-4">
          <button
            name="Confirm"
            type="button"
            onClick={onConfirm}
            className="bg-red-500 text-white hover:bg-red-600"
          />
          <button
            name="Cancel"
            type="button"
            onClick={onClose}
            className="bg-gray-500 text-white hover:bg-gray-600"
          />
        </div>
      </div>
    </div>
  );
};

export default DeleteConfirmation;
