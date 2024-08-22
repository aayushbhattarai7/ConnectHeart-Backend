import React, { useEffect, useRef, useState } from 'react';
import { BsThreeDotsVertical } from 'react-icons/bs';
import { RxCross2 } from 'react-icons/rx';
import EditPost from './EditPost';
import axiosInstance from '../../../service/instance';

interface Post {
  postId: string;
  refresh: (postId: string) => void;
  thought: string;
  feeling: string;
}

const Dropdown: React.FC<Post> = ({ postId, refresh, thought, feeling }) => {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const [edit, setEdit] = useState(false);
  const [isDelete, setIsDelete] = useState(false);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  const handleEditClick = () => {
    setEdit(true);
    setIsOpen(false);
  };

  const handleDeleteClick = () => {
    setIsDelete(true);
    setIsOpen(false);
  };

  const handleCloseEdit = () => {
    setEdit(false);
  };

  const handleCloseDelete = () => {
    setIsDelete(false);
  };

  const handleConfirmDelete = async () => {
    try {
      await axiosInstance.delete(`/post/${postId}`);
      refresh(postId);
      setIsDelete(false);
    } catch (err) {
      console.error('Error deleting post:', err);
    }
  };

  return (
    <div ref={dropdownRef} className="relative inline-block text-left">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="inline-flex justify-center w-full rounded-md shadow-sm px-4 py-2 bg-white text-sm font-medium text-gray-700 hover:bg-gray-50"
      >
        <BsThreeDotsVertical />
      </button>
      {isOpen && (
        <div className="origin-top-right absolute right-0 mt-2 w-56 rounded-md shadow-lg bg-white ring-1 ring-black ring-opacity-5">
          <div
            className="py-1"
            role="menu"
            aria-orientation="vertical"
            aria-labelledby="options-menu"
          >
            <button
              className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 w-full text-left"
              onClick={handleEditClick}
            >
                
              Edit
            </button>
            <button
              className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 w-full text-left"
              onClick={handleDeleteClick}
            >
              Delete
            </button>
          </div>
        </div>
      )}
      {edit && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
          <div className="bg-white p-4 rounded-lg shadow-lg">
            <EditPost
              postId={postId}
              refresh={refresh}
              onClose={handleCloseEdit}
              thought={thought}
              feeling={feeling}
            />
          </div>
        </div>
      )}
      {isDelete && (
        <div className="fixed inset-0 flex items-center justify-center font-poppins bg-black bg-opacity-50 z-50">
          <div className="bg-white p-6 rounded shadow-lg w-96">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-lg font-bold">Confirm Deletion</h2>
              <button onClick={handleCloseDelete} className="text-gray-500">
                <RxCross2 />
              </button>
            </div>
            <p className="mb-4">Are you sure you want to delete this post?</p>
            <div className="flex justify-end gap-4">
              <button
                name="Cancel"
                type="button"
                onClick={handleCloseDelete}
                className="bg-gray-500 text-white px-4 py-2 rounded hover:bg-gray-600"
              >
                Cancel
              </button>
              <button
                name="Confirm"
                type="button"
                onClick={handleConfirmDelete}
                className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
              >
                Delete
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Dropdown;
