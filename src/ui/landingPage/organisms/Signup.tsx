import React, { useState } from 'react';
import InputField from '../../common/atoms/InputField';
import Button from '../../common/atoms/Button';
import Label from '../../common/atoms/Label';
import { useForm, SubmitHandler } from 'react-hook-form';
import { useLang } from '../../../hooks/useLang';
import { Link, useNavigate } from 'react-router-dom';
import { authLabel } from '../../../localization/auth';
import axiosInstance from '../../../service/instance';
import { MdOutlineArrowOutward } from 'react-icons/md';
import axios from 'axios';

interface FormData {
  first_name: string;
  middle_name?: string;
  last_name: string;
  phone_number: string;
  email: string;
  username?: string;
  password: string;
  profile: FileList;
  gender: string;
}

const Signup: React.FC = () => {
  const navigate = useNavigate();
  const { lang } = useLang();
  const {
    register,
    handleSubmit,
    formState: { isSubmitting },
  } = useForm<FormData>();
  const [error, setError] = useState<string>('');

  const onSubmit: SubmitHandler<FormData> = async (data) => {
    try {
      const formData = new FormData();
      formData.append('first_name', data.first_name);
      formData.append('last_name', data.last_name);
      formData.append('phone_number', data.phone_number);
      formData.append('email', data.email);
      formData.append('password', data.password);
      formData.append('gender', data.gender);
      formData.append('type', 'PROFILE');
      if (data.profile.length > 0) {
        formData.append('profile', data.profile[0]);
      }

      const response = await axiosInstance.post('/user/signup', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });
      setError(response?.data?.message || 'Success');
      navigate('/login');
    } catch (error) {
      if (axios.isAxiosError(error)) {
        setError(error.response?.data?.message || 'An error occurred');
      } else {
        setError('Required fields should not be empty');
      }
    }
  };

  return (
    <div className="flex justify-center items-center min-h-screen bg-[#f3f4f6] font-poppins mb-2 p-4">
      <div className="bg-white p-6 rounded-lg shadow-lg w-full max-w-lg">
        <h1 className="text-2xl font-semibold mb-4">Signup</h1>
        <p className="mb-6">Hi, Welcome to ConnectHeart👋</p>
        {error && <p className="text-red-500 mb-4">{error}</p>}

        <form onSubmit={handleSubmit(onSubmit)} noValidate encType="multipart/form-data">
          <div className="mb-4">
            <Label name="first_name" label={authLabel.firstName[lang]} required />
            <InputField
              placeholder={authLabel.firstName[lang]}
              type="text"
              name="first_name"
              register={register}
              className="w-full"
            />
          </div>

          <div className="mb-4">
            <Label name="last_name" label={authLabel.lastName[lang]} required />
            <InputField
              placeholder={authLabel.lastName[lang]}
              type="text"
              name="last_name"
              register={register}
              className="w-full"
            />
          </div>

          <div className="mb-4">
            <Label name="phone_number" label={authLabel.phoneNumber[lang]} />
            <InputField
              placeholder={authLabel.phoneNumber[lang]}
              type="text"
              name="phone_number"
              register={register}
              className="w-full"
            />
          </div>

          <div className="mb-4">
            <Label name="gender" label={authLabel.gender[lang]} required />
            <select
              className="w-full border rounded-lg p-2"
              {...register('gender', { required: true })}
            >
              <option value="">Gender</option>
              <option value="MALE">Male</option>
              <option value="FEMALE">Female</option>
            </select>
          </div>

          <div className="mb-4">
            <Label name="email" label={authLabel.email[lang]} required />
            <InputField
              placeholder={authLabel.enterYourEmail[lang]}
              type="email"
              name="email"
              register={register}
              className="w-full"
            />
          </div>

          <div className="mb-4">
            <Label name="password" label={authLabel.password[lang]} required />
            <InputField
              placeholder={authLabel.enterYourPassword[lang]}
              type="password"
              name="password"
              register={register}
              className="w-full"
            />
          </div>

          <div className="mb-4">
            <Label name="profile" label={authLabel.profile[lang]} />
            <input type="file" {...register('profile')} className="w-full border rounded-lg p-2" />
          </div>

          <Button
            buttonText={authLabel.signup[lang]}
            name=""
            type="submit"
            disabled={isSubmitting}
            className="w-full mb-4 bg-blue-500 text-white hover:bg-blue-700"
          />

          <div className="text-center">
            <Link className="text-blue-800 flex justify-center items-center" to="/login">
              Already registered?
              <MdOutlineArrowOutward className="ml-1" />
            </Link>
          </div>
        </form>
      </div>
    </div>
  );
};

export default Signup;
