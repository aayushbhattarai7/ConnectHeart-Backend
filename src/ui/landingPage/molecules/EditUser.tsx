import { FormEvent, useEffect, useState } from 'react';
import axiosInstance from '../../../service/instance';
import { useForm } from 'react-hook-form';
import { FaImage } from 'react-icons/fa';
import Button from '../../common/atoms/Button';
import { RxCross2 } from 'react-icons/rx';

interface UserProps {
  email?: string;
  first_name: string;
  last_name: string;
  phone_number: string;
  refresh: (postId: string) => void;
  onClose: () => void;
  id: string;
}

interface FormData {
  first_name: string;
  last_name: string;
  email: string;
  phone_number: string;
  files: File | null;
}

const EditUser: React.FC<UserProps> = ({
  email,
  first_name,
  last_name,
  phone_number,
  refresh,
  onClose,
  id,
}) => {
  const [imagePreviews, setImagePreviews] = useState<string[]>([]);
  const [formData, setFormdata] = useState<FormData>({
    first_name: '',
    last_name: '',
    email: '',
    phone_number: '',
    files: null as File | null,
  });

  const {
    reset,
    formState: { isSubmitting },
  } = useForm<FormData>();

  useEffect(() => {
    setFormdata((prevData) => ({
      ...prevData,
      first_name: first_name,
      last_name: last_name,
      email: email || '',
      phone_number: phone_number || '',
    }));
  }, [first_name, last_name, email, phone_number]);

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    try {
      e.preventDefault();
      const data = new FormData();
      if (formData.first_name) data.append('first_name', formData?.first_name);
      if (formData.last_name) data.append('last_name', formData?.last_name);
      if (formData.email) data.append('email', formData?.email);
      if (formData.phone_number) data.append('phone_number', formData?.phone_number);
      data.append('type', 'PROFILE');
      if (formData.files) data.append('profile', formData.files);

      await axiosInstance.patch('/user/update', data, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });
      refresh(id);
      reset();
      onClose();
    } catch (error) {}
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormdata((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files ? Array.from(e.target.files) : null;

    if (files) {
      setFormdata((prevData) => ({
        ...prevData,
        files: files[0],
      }));

      setImagePreviews(files.map((file) => URL.createObjectURL(file))); // Generate previews
    } else {
      setFormdata((prevData) => ({
        ...prevData,
        files: null,
      }));

      setImagePreviews([]);
    }
  };

  return (
    <div className='flex'>
    <div className="  flex flex-col  w-full justify-center  mt-10 px-5 sm:px-10 lg:px-20  ">
      <form onSubmit={handleSubmit} noValidate encType="multipart/form-data">
        <div className="flex w-96 flex-col pl-5 justify-center  gap-10 items-start mb-4 bg-white">
          <div className="flex justify-center pl-7 flex-col mt-3 gap-8 ">
            <input
              placeholder="First Name"
              name="first_name"
              value={formData.first_name}
              onChange={handleChange}
              className="w-[20rem] p-2 pl-6 border bg-gray-100 border-gray-300 rounded-lg focus:outline-none resize-none"
            />
            <input
              placeholder="Last Name"
              name="last_name"
              value={formData.last_name}
              onChange={handleChange}
              className="w-[20rem] p-2 pl-6 border bg-gray-100 border-gray-300 rounded-lg focus:outline-none resize-none"
            />

            <input
              placeholder="Email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              className="w-[20rem] p-2 pl-6 border bg-gray-100 border-gray-300 rounded-lg focus:outline-none resize-none"
            />

            <input
              placeholder="Phone"
              name="phone_number"
              value={formData.phone_number}
              onChange={handleChange}
              className="w-[20rem] p-2 pl-6 border bg-gray-100 border-gray-300 rounded-lg focus:outline-none resize-none"
            />

            <div className="flex gap-10  justify-center">
              <label className="cursor-pointer flex items-center gap-1 text-green-500">
                <FaImage className="text-2xl" />
                <input
                  type="file"
                  name="profile"
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

export default EditUser;
