import React, { FormEvent, useEffect, useState } from 'react';
import { FaImage, FaSmile, FaVideo, FaFlag, FaEllipsisH } from 'react-icons/fa';
import { useForm } from 'react-hook-form';
import { useLang } from '../../../hooks/useLang';
import axiosInstance from '../../../service/instance';
import Button from '../../common/atoms/Button';
import { authLabel } from '../../../localization/auth';
import { Link } from 'react-router-dom';

interface FormData {
  thought: string;
  feeling: string;
  files: File[];
}

interface PostProps {
  postId: string;
  refresh: (postId: string) => void;
}

interface User {
  id?: string;
  email?: string;
  details: {
    first_name: string;
    last_name: string;
    phone_number: string;
    gender: string;
  };
  profile: {
    id?: string;
    path?: string;
  };
}

const Post: React.FC<PostProps> = ({ postId, refresh }) => {
  const { lang } = useLang();
  const {
    register,
    reset,
    formState: { isSubmitting },
  } = useForm<FormData>();

  const [user, setUser] = useState<User | null>(null);
  const [formData, setformData] = useState<FormData>({ thought: '', feeling: '', files: [] });
  const [imagePreviews, setImagePreviews] = useState<string[]>([]);

  const getUserDetails = async () => {
    try {
      const response = await axiosInstance.get('/user/user', {
        headers: {
          'Content-Type': 'application/json',
        },
      });
      setUser(response?.data?.getuser);
    } catch (error) {
      console.error(error);
    }
  };

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    try {
      e.preventDefault();
      const data = new FormData();
      data.append('thought', formData.thought);
      data.append('feeling', formData.feeling);
      data.append('type', 'POST');
      formData.files?.forEach((file) => data.append('files', file));
      const res = await axiosInstance.post('/post', data, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });
      reset();
      refresh(postId);
    } catch (err) {
      console.error('Error while submitting:', err);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setformData((prevData) => ({ ...prevData, [name]: value }));
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []);
    setformData((prevData) => ({ ...prevData, files }));

    const previews = files.map((file) => URL.createObjectURL(file));
    setImagePreviews(previews);
  };

  useEffect(() => {
    getUserDetails();
  });

  return (
    <div className="w-full  mb-10  max-w-2xl bg-white rounded-lg shadow-md p-4">
      <form onSubmit={handleSubmit} noValidate encType="multipart/form-data">
        <div className="flex gap-4 items-start mb-4" key={user?.id}>
          {user?.profile?.path ? (
            <Link to="/profile">
              {' '}
              <img className="w-10 h-10 rounded-full" src={user?.profile?.path} alt="Profile" />
            </Link>
          ) : (
            <Link to="/profile">
              <img
                className="w-10 h-10 rounded-full"
                src="/profilenull.jpg"
                alt="Default Profile"
              />
            </Link>
          )}
          <div className="flex-grow">
            <textarea
              placeholder={authLabel.thought[lang]}
              name="thought"
              onChange={handleChange}
              rows={3}
              className="w-full p-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none"
            />
            <div className="flex items-center justify-between mt-2">
              <div className="flex gap-2"></div>
              <Button
                buttonText={authLabel.post[lang]}
                name=""
                type="submit"
                disabled={isSubmitting}
                className="p-2 rounded-lg bg-blue-500 text-white hover:bg-blue-600 disabled:bg-blue-300"
              />
            </div>
          </div>
        </div>

        <div className="flex justify-between mt-2 border-t border-gray-300 pt-2">
          <div className="flex gap-4">
            <label className="cursor-pointer flex items-center gap-1 text-blue-500">
              <FaImage className="text-xl" />
              <input
                type="file"
                name="files"
                multiple
                onChange={handleFileChange}
                className="hidden"
              />
              <span className="text-sm">Photo/Video</span>
            </label>
            <button type="button" className="flex items-center gap-1 text-yellow-500">
              <FaSmile className="text-xl" />
              <select
                id="feeling"
                {...register('feeling')}
                onChange={handleChange}
                className=" rounded-md shadow-sm w-24 py-2  focus:outline-none bg-white text-yellow-500"
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
              </select>{' '}
            </button>
            <button type="button" className="flex items-center gap-1 text-red-500">
              <FaFlag className="text-xl" />
              <span className="text-sm">Tag Friends</span>
            </button>
            <button type="button" className="flex items-center gap-1 text-green-500">
              <FaVideo className="text-xl" />
              <span className="text-sm">Live Video</span>
            </button>
          </div>
          <button type="button" className="flex items-center text-gray-500">
            <FaEllipsisH className="text-xl" />
          </button>
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
  );
};

export default Post;
