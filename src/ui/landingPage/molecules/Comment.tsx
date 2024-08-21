import axiosInstance from '../../../service/instance';
import { useState } from 'react';
import InputField from '../../common/atoms/InputField';
import Button from '../../common/atoms/Button';
import { authLabel } from '../../../localization/auth';
import { SubmitHandler, useForm } from 'react-hook-form';
import { useLang } from '../../../hooks/useLang';
import Label from '../../common/atoms/Label';
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
    <div className="w-fit">
      {error && <p>{error}</p>}
      <form onSubmit={handleSubmit(onSubmit)} action="">
        <Label name={'comment'} label={authLabel.comment[lang]} required></Label>
        <div className="w-60 rounded-md mb-4">
          <InputField
            placeholder={authLabel.comment[lang]}
            type="text"
            name="comment"
            register={register}
            className=""
            required
            onKeyDown={handleKeyPress}
          />
        </div>

        <div className="mb-3">
          <Button
            buttonText={authLabel.comment[lang]}
            name=""
            type="submit"
            disabled={isSubmitting}
            className=""
          />
        </div>
      </form>
    </div>
  );
};

export default Comments;
