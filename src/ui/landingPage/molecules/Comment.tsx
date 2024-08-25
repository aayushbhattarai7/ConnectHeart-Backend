import axiosInstance from '../../../service/instance';
import { useState } from 'react';
import InputField from '../../common/atoms/InputField';
import { authLabel } from '../../../localization/auth';
import { SubmitHandler, useForm } from 'react-hook-form';
import { useLang } from '../../../hooks/useLang';
import { BsFillSendFill } from 'react-icons/bs';
import axios from 'axios';

interface FormData {
  comment?: string;
}

interface CommentProps {
  postId: string;
  refresh: (postId: string) => void;
}

const Comments: React.FC<CommentProps> = ({ postId, refresh }) => {
  const [error, setError] = useState<string>('');
  const { lang } = useLang();
  const {
    register,
    handleSubmit,
    reset,
    formState: { isSubmitting },
  } = useForm<FormData>();

  const onSubmit: SubmitHandler<FormData> = async (data) => {
    if (!postId) {
      setError('No post found');
      return;
    }
    try {
      const response = await axiosInstance.post(`/post/comment/${postId}`, data, {
        headers: {
          'Content-Type': 'application/json',
        },
      });
      reset();
      refresh(postId);
      console.log(response);
    } catch (error: any) {
      if (axios.isAxiosError(error)) {
        setError(error.response?.data?.message || 'Error while fetching post');
      } else {
        setError('Error while fetching post');
      }
    }
  };

  const handleKeyPress = (event: React.KeyboardEvent<HTMLInputElement>) => {
    if (event.key === 'Enter') {
      event.preventDefault();
      handleSubmit(onSubmit)();
    }
  };

  return (
    <div className=" ">
      {error && <p>{error}</p>}
      <form onSubmit={handleSubmit(onSubmit)} action="">
        <div className="flex shadow-xl h-16 2xl:w-[40rem] mx-auto bg-gray-200 sm:w-56  rounded-lg border border-gray-200 ml-10">
          <div className=" rounded-lg mb-4  h-10 ">
            <InputField
              placeholder={authLabel.comment[lang]}
              type="text"
              name="comment"
              register={register}
              className={`h-14 2xl:w-[35.5rem] mx-auto bg-gray-200 text-lg  sm:w-56  border-none outline-none`}
              required
              onKeyDown={handleKeyPress}
            />
          </div>

          <div className="mb-3">
            <button
              name="Comment"
              type="submit"
              disabled={isSubmitting}
              className="h-16 p-0 w-16  rounded-lg rounded-r-md text-blue-600 rounded-l-none"
            >
              <BsFillSendFill className="text-2xl" />
            </button>
          </div>
        </div>
      </form>
    </div>
  );
};

export default Comments;
