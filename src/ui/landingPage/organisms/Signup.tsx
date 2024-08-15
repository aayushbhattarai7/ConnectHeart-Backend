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
  const [error, setError] = useState('');
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
      if (data.profile[0]) {
        formData.append('profile', data.profile[0]);
      }

      const response = await axiosInstance.post('/user/signup', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });
      setError(response?.data?.message);
      console.log('🚀 ~ const onSubmit: SubmitHandler<FormData> = ~ response:', response);

      navigate('/login');
    } catch (error) {
      if (axios.isAxiosError(error)) {
        setError(error.response?.data?.message || '');
      } else {
        setError('Required field shouldnot be empty');
      }
    }
  };

  return (
    <div className="flex flex-col justify-center items-center mt-10 h-screen bg-[#f3f4f6] font-poppins ">
      <div className=" shadow-[0_4px_6px_rgba(128,128,128,0.5)] bg-white p-7 rounded-lg flex flex-col justify-center items-center pl-20">
        <div className="mr-64  mb-3 ">
          <h1 className="text-2xl mb-3 font-semibold">Signup</h1>
          <p>Hi, Welcome to ConnectHeart👋</p>
        </div>
        <form onSubmit={handleSubmit(onSubmit)} noValidate encType="multipart/form-data">
          {error && <p className="text-red-500">{error}</p>}
          <div className="mb-3">
            <div className="mb-2">
              <Label name={'first_name'} label={authLabel.firstName[lang]} required></Label>
            </div>
            <InputField
              placeholder={authLabel.firstName[lang]}
              type="text"
              name="first_name"
              register={register}
              className=""
            />
          </div>
          <div className="mb-3">
            <div className="mb-2">
              <Label name={'last_name'} label={authLabel.lastName[lang]} required></Label>
            </div>
            <InputField
              placeholder={authLabel.lastName[lang]}
              type="text"
              name="last_name"
              register={register}
              className=""
            />
          </div>

          <div className="mb-3">
            <div className="mb-2">
              <Label name={'phone_number'} label={authLabel.phoneNumber[lang]}></Label>
            </div>
            <InputField
              placeholder={authLabel.phoneNumber[lang]}
              type="text"
              name="phone_number"
              register={register}
              className=""
            />
          </div>

          <div className="border rounded-lg w-[21rem] p-4 flex flex-col">
            <div className="mb-2">
              <Label name={'gender'} label={authLabel.gender[lang]} required></Label>
            </div>
            <select className="w-48 h-8" {...register('gender')}>
              <option value="">Gender</option>
              <option value="MALE">Male</option>
              <option value="FEMALE">Female</option>
            </select>
          </div>

          <div className="mb-3">
            <div className="mb-2">
              <Label name={'email'} label={authLabel.email[lang]} required></Label>
            </div>
            <InputField
              placeholder={authLabel.enterYourEmail[lang]}
              type="email"
              name="email"
              register={register}
              className=""
            />
          </div>

          <div className="mb-3">
            <div className="mb-2">
              <Label name={'password'} label={authLabel.password[lang]} required></Label>
            </div>

            <InputField
              placeholder={authLabel.enterYourPassword[lang]}
              type="password"
              name="password"
              register={register}
              className=""
            />
          </div>

          <div className="border rounded-lg w-[21rem] p-4 flex flex-col mb-3">
            <Label name={'profile'} label={authLabel.profile[lang]}></Label>
            <input type="file" {...register('profile')} />
          </div>

          <Button
            buttonText={authLabel.signup[lang]}
            name=""
            type="submit"
            disabled={isSubmitting}
            className={'w-[21rem] mb-5  hover:bg-blue-900 '}
          />
        </form>
        <div className="flex w-[25rem] ml-6">
          <Link className="flex text-blue-800 " to={'/login'}>
            Already registered?
            <MdOutlineArrowOutward />
          </Link>
        </div>
      </div>
    </div>
  );
};

export default Signup;



/* {/* <NavLink
                to={``}

                ///message/${connect.id}
                className={({ isActive }) =>
                  isActive ? 'rounded-2xl bg-blue-500 p-3 text-white' : ''
                }  */