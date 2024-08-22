import React, { FormEvent, useEffect, useState } from 'react';
import axiosInstance from '../../../service/instance';
import { FaImage } from 'react-icons/fa6';
import Button from '../../common/atoms/Button';
import { useForm } from 'react-hook-form';
import { RxCross2 } from 'react-icons/rx';

interface PostProps {
  postId: string;
  refresh: (postId: string) => void;
  onClose: () => void;
  thought: string;
  feeling: string;
}

interface FormData {
  thought: string;
  feeling: string;
  files: File[];
}

const EditPost: React.FC<PostProps> = ({ postId, refresh, onClose, thought, feeling }) => {
  const [formData, setformData] = useState<FormData>({ thought: '', feeling: '', files: [] });
  const [imagePreviews, setImagePreviews] = useState<string[]>([]);
  const {
    register,
    reset,
    formState: { isSubmitting },
  } = useForm<FormData>();

  useEffect(() => {
    setformData((prevData) => ({
      ...prevData,
      thought: thought || '',
      feeling: feeling || '',
    }));
  }, [thought, feeling]);
  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    try {
      e.preventDefault();
      const data = new FormData();
      if (formData.thought) data.append('thought', formData?.thought);
      if (formData.feeling) data.append('feeling', formData?.feeling);
      data.append('type', 'POST');
      if (formData.files) formData.files?.forEach((file) => data.append('files', file));
      await axiosInstance.patch(`/post/${postId}`, data, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });

      reset();
      refresh(postId);
      onClose();
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

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files ? Array.from(e.target.files) : [];
    if (files.length > 0) {
      setformData((prevData) => ({
        ...prevData,
        files,
      }));

      setImagePreviews(files.map(URL.createObjectURL));
    } else {
      setformData((prevData) => ({
        ...prevData,
      }));
      setImagePreviews(files.map(URL.createObjectURL));
    }
  };

  return (
    <div className="flex">
      <div>
        <form onSubmit={handleSubmit} noValidate encType="multipart/form-data">
          <div className="flex w-96 flex-col pl-5 justify-center  gap-10 items-start mb-4 bg-white">
            <div className="flex justify-center pl-7 flex-col mt-3 gap-8 ">
              <input
                placeholder="What on your mind ?"
                name="thought"
                value={formData.thought}
                onChange={handleChange}
                className="w-[20rem] p-2 pl-6 border bg-gray-100 border-gray-300 rounded-lg focus:outline-none resize-none"
              />
              <div className="flex gap-10  justify-center">
                <select
                  id="feeling"
                  {...register('feeling')}
                  onChange={handleChange}
                  value={formData.feeling}
                  className=" rounded-md  w-24 py-2  focus:outline-none bg-white text-yellow-500"
                >
                  <option value="">Feeling</option>
                  <option value="Happy">😊 Happy</option>
                  <option value="Loved">❤️ Loved</option>
                  <option value="Flirty">😉 Flirty</option>
                  <option value="Curious">🤔 Curious</option>
                  <option value="Grateful">🙏 Grateful</option>
                  <option value="In Love">😍 In Love</option>
                  <option value="Playful">😜 Playful</option>
                  <option value="Anxious">😰 Anxious</option>
                  <option value="Romantic">💘 Romantic</option>
                  <option value="Cheerful">😁 Cheerful</option>
                </select>

                <label className="cursor-pointer flex items-center gap-1 text-green-500">
                  <FaImage className="text-2xl" />
                  <input
                    type="file"
                    name="files"
                    multiple
                    onChange={handleFileChange}
                    className="hidden"
                  />
                  <span className="text-sm text-gray-600">Media</span>
                </label>
              </div>
              <div className="flex flex-col items-center justify-between">
                <Button
                  buttonText="update"
                  name=""
                  type="submit"
                  disabled={isSubmitting}
                  className="p-2 rounded-lg bg-blue-500 text-white hover:bg-blue-600 disabled:bg-blue-300"
                />
              </div>
            </div>
          </div>

          <div className="flex gap-2 mt-2">
            {imagePreviews.map((src, index) => (
              <img
                key={index}
                src={src}
                alt="Selected"
                className="w-20 h-20 rounded-md object-cover"
              />
            ))}
          </div>
        </form>
      </div>
      <p onClick={onClose}>
        <RxCross2 className='text-red-500' />
      </p>
    </div>
  );
};

export default EditPost;
