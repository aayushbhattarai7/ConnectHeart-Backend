import { Link, NavLink, useLocation } from 'react-router-dom';
import { FaHeart, FaUserFriends, FaUser, FaUserClock } from 'react-icons/fa';
import { RiHome2Fill } from 'react-icons/ri';

import { AiFillMessage } from 'react-icons/ai';
import { IoMdFemale, IoMdMale, IoMdSettings } from 'react-icons/io';
import { useEffect, useState } from 'react';
import axiosInstance from '../../../service/instance';

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

interface Count {
  counts?: string;
}

const SideBarDetails = () => {
  const [user, setUser] = useState<User | null>(null);
  const [count, setCount] = useState<Count | null>(null);
  const location = useLocation();
  const isActive = (path: string) => location.pathname === path;

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

  const getFriendCount = async () => {
    try {
      const response = await axiosInstance.get('/connect/count', {
        headers: {
          'Content-Type': 'application/json',
        },
      });
      setCount(response?.data);
    } catch (error) {
      console.error(error);
    }
  };

  useEffect(() => {
    getUserDetails();
    getFriendCount();
  }, []);

  return (
    <>
      {location.pathname !== '/login' && location.pathname !== '/signup' && (
        <div className="fixed top-20 left-2 w-72 h-screen bg-gray-100">
          <div className="p-8 flex-col sticky top-0 h-full">
            <div key={user?.id} className="flex-col justify-center ml-4 flex mb-10 ">
              {user?.profile?.path ? (
                <Link to="/profile">
                  {' '}
                  <img
                    className="h-44 w-44 rounded-2xl mb-3"
                    src={user?.profile?.path}
                    alt="Profile"
                  />
                </Link>
              ) : (
                <Link to="/profile">
                  <img
                    className="h-44 w-44 rounded-2xl mb-3"
                    src="/profilenull.jpg"
                    alt="Default Profile"
                  />
                </Link>
              )}
              <div className="flex gap-1 ml-2 mb-3">
                <h1 className="text-xl text-blue-950">{user?.details?.first_name}</h1>
                <h1 className="text-xl text-blue-950">{user?.details?.last_name}</h1>
              </div>

              {user?.details?.gender === 'MALE' && (
                <p className="text-blue-700 text-2xl">
                  <IoMdMale />
                </p>
              )}
              {user?.details?.gender === 'FEMALE' && (
                <p className="text-pink-700 text-xl">
                  <IoMdFemale />
                </p>
              )}
            </div>

            <div className="flex gap-9 ml-8 mb-10">
              <Link to="/connect">
                {' '}
                <div className="w-fit flex flex-col items-center pr-9">
                  <h1 className="font-poppins font-medium">{count?.counts}</h1>
                  <h1 className="pr-1 text-blue-900 text-xl">
                    <FaUserFriends />
                  </h1>
                </div>
              </Link>
              <div className="w-fit flex flex-col items-center">
                <h1>100</h1>
                <h1 className="pr-1 text-red-600">
                  <FaHeart />
                </h1>
              </div>
            </div>

            <div className="flex flex-col gap-6 text-black">
              <div
                className={`flex gap-3  h-14 justify-center items-center pr-10 ${isActive('/') ? 'rounded-lg w-[14rem] bg-gray-200 text-black' : ''}`}
              >
                <div className=" flex items-center  justify-center hover:bg-blue-200 hover:rounded-full hover:border hover:border-blue-200 w-[2.5rem] h-[2.5rem]">
                  <NavLink to={'/'} className="   text-2xl">
                    <RiHome2Fill />
                  </NavLink>
                </div>

                <NavLink to={'/'} className="p-1 text-xl">
                  Date Feed
                </NavLink>
              </div>

              <div
                className={`flex gap-3  h-14 justify-center items-center pr-7 hover:border-blue-200 hover:bg-gray-200 hover:text-blue-600 hover:rounded-lg  ${isActive('/connect') ? 'rounded-lg w-[14rem] bg-gray-200 text-black' : ''}`}
              >
                <div className="border border-blue-200 flex items-center  justify-center bg-blue-200 rounded-full w-[2.5rem] h-[2.5rem]">
                  <NavLink to={'/connect'} className="p-1 text-2xl ">
                    <FaUserFriends />
                  </NavLink>
                </div>
                <NavLink to={'/connect'} className="p-1 text-xl">
                  Connection
                </NavLink>
              </div>

              <div
                className={`flex gap-3  h-14 justify-center items-center pr-12 hover:border-blue-200 hover:bg-gray-200 hover:text-blue-600 hover:rounded-lg ${isActive('/requests') ? 'rounded-lg w-[14rem] bg-gray-200 text-black' : ''}`}
              >
                <div className=" flex items-center  justify-center  rounded-full w-[2.5rem] h-[2.5rem]">
                  <NavLink to={'/requests'} className="p-1 text-2xl">
                    <FaUserClock />
                  </NavLink>
                </div>
                <NavLink to={'/requests'} className="p-1 text-xl">
                  Requests
                </NavLink>
              </div>

              <div
                className={`flex gap-3  h-14 justify-center items-center pr-10 hover:border-blue-200 hover:bg-gray-200 hover:text-blue-600 hover:rounded-lg ${isActive('/message') ? 'rounded-lg w-[14rem] bg-gray-200 text-black' : ''}`}
              >
                <div className=" flex items-center  justify-center  rounded-full w-[2.7rem] h-[2.7rem]">
                  <NavLink to={'/message'} className="p-1   text-2xl">
                    <AiFillMessage />
                  </NavLink>
                </div>
                <NavLink to={'/message'} className="p-1 text-xl">
                  Messages
                </NavLink>
              </div>

              <div
                className={`flex gap-3  h-14 justify-center items-center pr-16 hover:border-blue-200 hover:bg-gray-200 hover:text-blue-600 hover:rounded-lg ${isActive('/profile') ? 'rounded-lg w-[14rem] bg-gray-200 text-black' : ''}`}
              >
                <div className=" flex items-center  justify-center  rounded-full w-[2.7rem] h-[2.7rem]">
                  <NavLink to={'/profile'} className="p-1  text-2xl">
                    <FaUser />
                  </NavLink>
                </div>
                <NavLink to={'/profile'} className="p-1 text-xl">
                  Profile
                </NavLink>
              </div>

              <div className="border border-gray-300"></div>

              <div
                className={`flex gap-3 mb-2 h-10 hover:border-blue-200 hover:bg-gray-200 hover:text-blue-600 hover:rounded-lg ${isActive('/settings') ? 'rounded-lg bg-blue-500 text-white' : ''}`}
              >
                <NavLink to={'/settings'} className="p-1 text-2xl">
                  <IoMdSettings />
                </NavLink>
                <NavLink to={'/settings'} className="p-1 text-xl">
                  Settings
                </NavLink>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default SideBarDetails;
