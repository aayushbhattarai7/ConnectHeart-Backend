import { useState } from 'react';
import { useLang } from '../../../hooks/useLang';
import { SubmitHandler, useForm } from 'react-hook-form';
import axiosInstance from '../../../service/instance';
import { authLabel } from '../../../localization/auth';
import InputField from '../../common/atoms/InputField';
import Button from '../../common/atoms/Button';
import axios from 'axios';

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
  const [error, setError] = useState<string>('');
  const [success, setSuccess] = useState<string>('');

  const { lang } = useLang();
  const {
    register,
    handleSubmit,
    reset,
    formState: { isSubmitting },
  } = useForm<FormData>();

  const onSubmit: SubmitHandler<FormData> = async (data) => {
    if (!commentId || !postId) {
      setError('Post or Comment not found');
      return;
    }
    try {
      const response = await axiosInstance.post(`/post/comment/${postId}/${commentId}`, data, {
        headers: {
          'Content-Type': 'application/json',
        },
      });
      console.log(response?.data?.details);
      setSuccess('Replied Successfully');
      reset();
      refresh(postId);
    } catch (error: any) {
      if (axios.isAxiosError(error)) {
        setError(error.response?.data?.message || 'Error while replying');
      } else {
        setError('Error while replying');
      }
    }
  };

  return (
    <div>
      {error && <p>{error}</p>}
      {success && <p>{success}</p>}
      <form onSubmit={handleSubmit(onSubmit)}>
        <div className=" rounded-md mb-3">
          <InputField
            placeholder={authLabel.comment[lang]}
            type="text"
            name="comment"
            register={register}
            required
            className=""
          />
        </div>
        <div className=" w-28">
          <Button
            name=""
            buttonText={authLabel.comment[lang]}
            type="submit"
            disabled={isSubmitting}
            className=""
          />
        </div>
      </form>
    </div>
  );
};

export default ReplyComment;
