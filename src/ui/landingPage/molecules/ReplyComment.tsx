import { useLang } from '../../../hooks/useLang';
import { SubmitHandler, useForm } from 'react-hook-form';
import axiosInstance from '../../../service/instance';
import { authLabel } from '../../../localization/auth';
import InputField from '../../common/atoms/InputField';
import axios from 'axios';
import { BsFillSendFill } from 'react-icons/bs';

interface FormData {
  details?: {
    comment?: string;
  };
}

interface CommentProps {
  postId: string;
  commentId: string;
  refresh: (postId: string) => void;
}

const ReplyComment: React.FC<CommentProps> = ({ postId, commentId, refresh }) => {

  const { lang } = useLang();
  const {
    register,
    handleSubmit,
    reset,
    formState: { isSubmitting },
  } = useForm<FormData>();

  const onSubmit: SubmitHandler<FormData> = async (data) => {
    if (!commentId || !postId) {
      console.log('Post or Comment not found');
      return;
    }
    try {
      const response = await axiosInstance.post(`/post/comment/${postId}/${commentId}`, data, {
        headers: {
          'Content-Type': 'application/json',
        },
      });
      console.log(response?.data?.details);
      reset();
      refresh(postId);
    } catch (error: any) {
      if (axios.isAxiosError(error)) {
        console.log(error);
      } else {
        console.log('Error');
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
    <div>
      <form onSubmit={handleSubmit(onSubmit)}>
        <div className="flex shadow-xl h-9 w-[12rem] bg-white rounded-lg border border-white ">
          <div className=" rounded-lg  h-10 ">
            <InputField
              placeholder={authLabel.comment[lang]}
              type="text"
              name="comment"
              register={register}
              className={`h-8 w-[10rem] bg-white  pl-10  border-none outline-none`}
              required
              onKeyDown={handleKeyPress}
            />
          </div>
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
    </div>
  );
};

export default ReplyComment;
