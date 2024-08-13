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
        setError(error.response?.data?.message || 'e');
      } else {
        setError('Email or password is incorrect');
      }
    }
  };

  return (
    <div className=" ">
      <div
        className="flex flex-col justify-center items-center h-screen 
      bg-[#f3f4f6] font-poppins "
      >
        <div
          className=" shadow-[0_4px_6px_rgba(128,128,128,0.5)] bg-white
       p-9 rounded-lg flex flex-col justify-center items-center pl-20"
        >
          <div className="mr-64  mb-6 ">
            <h1 className="text-2xl mb-3 font-semibold">Login</h1>
            <p>Hi, Welcome Back👋</p>
          </div>

          <div
            className="flex gap-3 border rounded-lg  w-googlew mr-16 p-3 
          justify-center mb-9"
          >
            <img className="bg-white w-7 h-7" src="/google.png" alt="" />
            <button type="submit">Continue With Google</button>
          </div>

          <div className="pr-10 relative mb-8">
            <div className=" w-googlew h-0 border relative top-4  "></div>
            <p
              className="text-gray-400  bg-white ml-24 top-1  
            absolute"
            >
              or login with email
            </p>
          </div>

          <form onSubmit={handleSubmit(onSubmit)} noValidate className="">
            {error && <p className="text-red-500">{error}</p>}

            <div className="mb-5">
              <div className="mb-2">
                <Label name={'email'} label={authLabel.email[lang]}></Label>
              </div>
              <InputField
                placeholder={authLabel.enterYourEmail[lang]}
                type="email"
                name="email"
                register={register}
                className=""
              />
            </div>

            <div className="mb-5">
              <div className="mb-2">
                <Label name={'password'} label={authLabel.password[lang]}></Label>
              </div>

              <InputField
                placeholder={authLabel.enterYourPassword[lang]}
                type="password"
                name="password"
                register={register}
                className=""
              />
            </div>

            <div className="flex gap-20 mr-10 mb-7">
              <div className="flex gap-3">
                <input type="checkbox" />
                <p>Remember Me</p>
              </div>
              <Link className="text-blue-800" to={''}>
                Forget Password?
              </Link>
            </div>

            <div className="">
              <Button
                buttonText={authLabel.login[lang]}
                name=""
                type="submit"
                disabled={isSubmitting}
                className={'w-[22rem] mb-5  hover:bg-blue-900 '}
              />
            </div>
          </form>

          <div className="flex w-[25rem]">
            <Link className="flex text-blue-800  " to={'/signup'}>
              Not registered yet?
              <MdOutlineArrowOutward />
            </Link>
            <Link to={''}></Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;
