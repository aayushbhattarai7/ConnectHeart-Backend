import React, { useState } from 'react';
import InputField from '../../common/atoms/InputField';
import Button from '../../common/atoms/Button';
import Label from '../../common/atoms/Label';
import { useForm, SubmitHandler } from 'react-hook-form';
import { useLang } from '../../../hooks/useLang';
import { Link, useNavigate } from 'react-router-dom';
import { MdOutlineArrowOutward } from 'react-icons/md';
import { authLabel } from '../../../localization/auth';
import axiosInstance from '../../../service/instance';
import axios from 'axios';
import GoogleAuth from '../molecules/GoogleLogin';

interface FormData {
  email: string;
  password: string;
}

const Login: React.FC = () => {
  const navigate = useNavigate();
  const { lang } = useLang();
  const {
    register,
    handleSubmit,
    formState: { isSubmitting },
  } = useForm<FormData>();
  const [error, setError] = useState<string | null>(null);

  const onSubmit: SubmitHandler<FormData> = async (data, e) => {
    try {
      console.log('Submitting data: ', data);
      const response = await axiosInstance.post('/user/login', data, {
        headers: {
          'Content-Type': 'application/json',
        },
      });
      e?.preventDefault();
      setError(response?.data?.message);
      const token = response?.data?.data?.tokens?.accessToken;
      if (token) {
        sessionStorage.setItem('accessToken', token);
      }
      navigate('/');
    } catch (error) {
      if (axios.isAxiosError(error)) {
        setError(error.response?.data?.message || 'An error occurred');
      } else {
        setError('Email or password is incorrect');
      }
    }
  };

  return (
    <div className="flex justify-center items-center min-h-screen bg-[#f3f4f6] font-poppins px-4">
      <div className="w-full max-w-md bg-white p-6 rounded-lg shadow-md">
        <h1 className="text-2xl font-semibold mb-4">Login</h1>
        <p className="mb-6">Hi, Welcome Back👋</p>

        <div className="flex items-center justify-center gap-3  rounded-lg pl-20 p-2 mb-6">
          {/* <img className="w-7 h-7" src="/google.png" alt="Google Logo" />
          <button type="button" className="text-blue-500">
            Continue With Google
          </button> */}
          <GoogleAuth />
        </div>

        <div className="relative mb-6">
          <div className="absolute inset-x-0 top-1/2 border-t border-gray-300" />
          <p className="absolute inset-x-0 top-1/2 text-center bg-white px-2 text-gray-400">
            or login with email
          </p>
        </div>

        <form onSubmit={handleSubmit(onSubmit)} noValidate>
          {error && <p className="text-red-500 mb-4">{error}</p>}

          <div className="mb-4">
            <Label name="email" label={authLabel.email[lang]} />
            <InputField
              placeholder={authLabel.enterYourEmail[lang]}
              type="email"
              name="email"
              register={register}
              className="w-full"
            />
          </div>

          <div className="mb-4">
            <Label name="password" label={authLabel.password[lang]} />
            <InputField
              placeholder={authLabel.enterYourPassword[lang]}
              type="password"
              name="password"
              register={register}
              className="w-full"
            />
          </div>

          <div className="flex justify-between items-center mb-6">
            <div className="flex items-center gap-2">
              <input type="checkbox" id="rememberMe" />
              <label htmlFor="rememberMe">Remember Me</label>
            </div>
            <Link className="text-blue-800" to="">
              Forgot Password?
            </Link>
          </div>

          <Button
            buttonText={authLabel.login[lang]}
            name=""
            type="submit"
            disabled={isSubmitting}
            className="w-full mb-5 hover:bg-blue-900"
          />

          <div className="text-center">
            <Link className="text-blue-800 flex justify-center items-center" to="/signup">
              Not registered yet? <MdOutlineArrowOutward className="ml-1" />
            </Link>
          </div>
        </form>
      </div>
    </div>
  );
};

export default Login;
