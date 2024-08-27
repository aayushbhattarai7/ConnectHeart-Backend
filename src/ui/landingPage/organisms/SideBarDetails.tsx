import { Link, NavLink, useLocation } from 'react-router-dom';
import { FaHeart, FaUserFriends, FaUser, FaUserClock } from 'react-icons/fa';
import { IoHomeSharp } from 'react-icons/io5';
import { IoMenu } from 'react-icons/io5';
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
    <div>
      {location.pathname !== '/login' && location.pathname !== '/signup' && location.pathname !=='/message' && (
        <div className="p-8 flex-col  fixed top-20 left-2 w-72  h-screen xs:h-auto bg-white  ">
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
            <div className="flex gap-1 ml-2 mb-2">
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

          <div className="flex flex-col gap-5 text-black">
            <NavLink
              to={'/'}
              className={`group flex gap-3 h-14 justify-center items-center pr-7 hover:border-blue-200 hover:bg-gray-200 hover:text-blue-600 hover:rounded-lg ${isActive('/') ? 'rounded-lg w-[14rem] bg-gray-200 text-black' : ''}`}
            >
              <div className=" flex items-center justify-center rounded-full w-[2.5rem] h-[2.5rem] text-[1.7rem] group-hover:bg-gray-300 group-hover:border-blue-300">
                <IoHomeSharp />
              </div>
              <p className="text-xl"> Date Feed</p>
            </NavLink>

            <NavLink
              to={'/connect'}
              className={`group flex gap-3 h-14 justify-center items-center pr-7 hover:border-blue-200 hover:bg-gray-200 hover:text-blue-600 hover:rounded-lg ${isActive('/connect') ? 'rounded-lg w-[14rem] bg-gray-200 text-black' : ''}`}
            >
              <div className=" flex items-center justify-center rounded-full w-[2.5rem] h-[2.5rem] group-hover:bg-gray-300 p-1 text-[1.8rem] group-hover:border-blue-300">
                <FaUserFriends />
              </div>
              <p className="text-xl"> Connection</p>
            </NavLink>

            <NavLink
              to={'/requests'}
              className={`group flex gap-3 h-14 justify-center items-center pr-10 hover:border-blue-200 hover:bg-gray-200 hover:text-blue-600 hover:rounded-lg ${isActive('/requests') ? 'rounded-lg w-[14rem] bg-gray-200 text-black' : ''}`}
            >
              <div className=" flex items-center justify-center rounded-full w-[2.5rem] h-[2.5rem] text-[1.8rem] group-hover:bg-gray-300 group-hover:border-blue-300">
                <FaUserClock />
              </div>
              <p className="text-xl"> Requests</p>
            </NavLink>

            <NavLink
              to={'/message'}
              className={`group flex gap-3 h-14 justify-center items-center pr-10 hover:border-blue-200 hover:bg-gray-200 hover:text-blue-600 hover:rounded-lg ${isActive('/message') ? 'rounded-lg w-[14rem] bg-gray-200 text-black' : ''}`}
            >
              <div className=" flex items-center justify-center rounded-full w-[2.5rem] h-[2.5rem] text-[1.8rem] group-hover:bg-gray-300 group-hover:border-blue-300">
                <AiFillMessage />
              </div>
              <p className="text-xl"> Message</p>
            </NavLink>

            <NavLink
              to={'/profile'}
              className={`group flex gap-3 h-14 justify-center items-center pr-16 hover:border-blue-200 hover:bg-gray-200 hover:text-blue-600 hover:rounded-lg ${isActive('/profile') ? 'rounded-lg w-[14rem] bg-gray-200 text-black' : ''}`}
            >
              <div className=" flex items-center justify-center rounded-full w-[2.5rem] h-[2.5rem] text-[1.8rem] group-hover:bg-gray-300 group-hover:border-blue-300">
                <FaUser />
              </div>
              <p className="text-xl"> Profile</p>
            </NavLink>

            <div className="border  border-gray-300"></div>

            <NavLink
              to={'/settings'}
              className={`group flex gap-3 h-14 justify-center items-center pr-16 hover:border-blue-200 hover:bg-gray-200 hover:text-blue-600 hover:rounded-lg ${isActive('/settings') ? 'rounded-lg w-[14rem] bg-gray-200 text-black' : ''}`}
            >
              <div className=" flex items-center justify-center rounded-full w-[2.5rem] h-[2.5rem] text-[1.8rem] group-hover:bg-gray-300 group-hover:border-blue-300">
                <IoMdSettings />
              </div>
              <p className="text-xl"> Settings</p>
            </NavLink>
          </div>
          <div></div>
        </div>
      )}
     
    </div>
  );
};

export default SideBarDetails;
