import { FormEvent, useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import axiosInstance from '../../../service/instance';
import { BsFillSendFill } from 'react-icons/bs';
import { RxCross2 } from 'react-icons/rx';

interface CommentProps {
  commentId: string;
  refresh: (commentId: string) => void;
  onClose: () => void;
  comment: string;
}

interface FormData {
  comment: string;
}

const EditComment: React.FC<CommentProps> = ({ commentId, refresh, comment, onClose }) => {
  const [formData, setformData] = useState<FormData>({ comment: '' });
  const {
    reset,
    formState: { isSubmitting },
  } = useForm<FormData>();

  useEffect(() => {
    setformData((prevData) => ({
      ...prevData,
      comment: comment || '',
    }));
  }, [comment]);

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    try {
      e.preventDefault();
      const data = new FormData();
      if (formData.comment) data.append('comment', formData?.comment);
      await axiosInstance.patch(`/post/comment/${commentId}`, data, {
        headers: { 'Content-Type': 'application/json' },
      });
      onClose();
      reset();
      refresh(commentId);
    } catch (err) {
      console.error('Error while submitting:', err);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setformData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  return (
    <div className='flex justify-between'>
      <form onSubmit={handleSubmit}>
        <input type="text" name="comment" value={formData.comment} onChange={handleChange} />
        <div>
          <div className="mb-3">
            <button
              name="Comment"
              type="submit"
              disabled={isSubmitting}
              className="h-8 p-0 w-8  rounded-lg rounded-r-md text-blue-600 rounded-l-none"
            >
              <BsFillSendFill className="text-xl" />
            </button>
          </div>
        </div>
      </form>
      <div>
        <p onClick={onClose}>
          <RxCross2 className="text-red-500" />
        </p>
      </div>
    </div>
  );
};

export default EditComment;
