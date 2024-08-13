import React, { FormEvent, useState } from 'react';
import InputField from '../../common/atoms/InputField';
import Button from '../../common/atoms/Button';
import Label from '../../common/atoms/Label';
import { useLang } from '../../../hooks/useLang';
import { useForm } from 'react-hook-form';
import { authLabel } from '../../../localization/auth';
import axiosInstance from '../../../service/instance';
interface FormData {
  thought: string;
  feeling: string;
  files: File[];
}
interface PostProps {
  postId: string;
  refresh: (postId: string) => void;
}

const Post: React.FC<PostProps> = ({ postId, refresh }) => {
  const { lang } = useLang();

  const {
    register,
    reset,
    formState: { isSubmitting },
  } = useForm<FormData>();
  const [formData, setformData] = useState<FormData>({
    thought: '',
    feeling: '',
    files: [],
  });

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    try {
      e.preventDefault();
      const data = new FormData();
      data.append('thought', formData.thought);
      data.append('feeling', formData.feeling);
      data.append('type', 'POST');
      formData.files?.forEach((file) => {
        data.append('files', file);
      });
      console.log('Submitting data: ', data);
      const res = await axiosInstance.post('/post', data, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });
      reset();
      refresh(postId);
      console.log('Response data: ', res.data);
    } catch (err) {
      console.error('🚀 ~ handleSubmit ~ err:', err);
    }
  };

  const handleChange = (e: any) => {
    const { name, value } = e.target;
    setformData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setformData((prevData) => ({
      ...prevData,
      files: Array.from(e.target.files || []),
    }));
  };

  return (
    <div className="flex flex-col justify-center items-center w-lgx p-6">
      <form
        onSubmit={handleSubmit}
        noValidate
        encType="multipart/form-data"
        className="w-full max-w-lg bg-white p-8 rounded-lg shadow-md justify-center items-center"
      >
        <Label name="thought" label={authLabel.thought[lang]} required></Label>

        <InputField
          placeholder={authLabel.thought[lang]}
          type="thought"
          name="thought"
          register={register}
          onChange={handleChange}
          className={'border rounded p-2 outline-none mb-4'}
        />
        <div className="mb-3 flex flex-col">
          <Label name="feeling" label={authLabel.feeling[lang]} required></Label>

          <select className="w-56" id="feeling" {...register('feeling')} onChange={handleChange}>
            <option value="">Feeling</option>
            <option value="Happy">Happy</option>
            <option value="Loved">Loved</option>
            <option value="Flirty">Flirty</option>
            <option value="Curious">Curious</option>
            <option value="Grateful">Grateful</option>
            <option value="In Love">In Love</option>
            <option value="Playful">Playful</option>
            <option value="Anxious">Anxious</option>
            <option value="Romantic">Romantic</option>
            <option value="Cheerful">Cheerful</option>
          </select>
        </div>
        <div className="flex flex-col">
          <Label name="files" label={authLabel.media[lang]}></Label>
          <input
            type="file"
            name="files"
            multiple
            onChange={handleFileChange}
            className="mb-4 w-56 p-2 border border-gray-300 rounded-lg"
          />
        </div>
        <Button
          buttonText={authLabel.post[lang]}
          name=""
          type="submit"
          disabled={isSubmitting}
          className=""
        />
      </form>
    </div>
  );
};

export default Post;
