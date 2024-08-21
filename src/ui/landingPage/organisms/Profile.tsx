import { useEffect, useState } from 'react';
import axiosInstance from '../../../service/instance';
import { IoMdMale, IoMdFemale } from 'react-icons/io';
import { FaUserFriends } from 'react-icons/fa';
import { BiEditAlt } from 'react-icons/bi';
import UserPost from './UserPost';

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

const Profile = () => {
  const [user, setUser] = useState<User | null>(null);
  const [count, setCount] = useState<Count | null>(null);

  const profile = async () => {
    try {
      const response = await axiosInstance.get('/user/user', {
        headers: {
          'Content-Type': 'application/json',
        },
      });
      setUser(response?.data?.getuser);
    } catch (error) {
      console.error('Error fetching user details:', error);
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
      console.error('Error fetching friend count:', error);
    }
  };

  useEffect(() => {
    profile();
    getFriendCount();
  }, []);

  return (
    <div className="min-h-screen  flex flex-col bg-gray-100 w-full justify-center  mt-10 px-5 sm:px-10 lg:px-20 ml-32 ">
      <div className="max-w-5xl mx-auto bg-white p-20 w-max2 mt-20 rounded-xl shadow-lg">
        <div className="flex  justify-start items-start gap-8 mb-7">
          <div className="relative  mb-6">
            {user?.profile?.path ? (
              <img
                className="h-32 w-32 rounded-full object-cover"
                src={user?.profile?.path}
                alt="Profile"
              />
            ) : (
              <img
                className="h-32 w-32 rounded-full object-cover border border-gray-200"
                src="/profilenull.jpg"
                alt="Default Profile"
              />
            )}
            <div className="absolute bottom-0 right-0 bg-white p-1 rounded-full shadow-md">
              {user?.details?.gender === 'MALE' && <IoMdMale className="text-blue-700 text-3xl" />}
              {user?.details?.gender === 'FEMALE' && (
                <IoMdFemale className="text-pink-700 text-3xl" />
              )}
            </div>
          </div>
          <div>
            <button className="border border-gray-200 p-3 rounded-2xl mb-3">
              Upload new photo
            </button>
            <p className="text-gray-500 font-poppins text-sm">JPG, JPEG or PNG is allowed</p>
          </div>

          {/* <div className="text-center">
            <h2 className="text-2xl font-semibold text-gray-800">
              {user?.details?.first_name} {user?.details?.last_name}
            </h2>
            <p className="text-gray-600">{user?.email}</p>
            <p className="text-gray-600">{user?.details?.phone_number}</p>

            <div className="flex flex-col items-center mt-4">
              <h3 className="text-xl font-semibold text-gray-800">{count?.counts}</h3>
              <FaUserFriends className="text-blue-900 text-4xl mt-1" />
            </div>
          </div> */}
        </div>
        <div className="h-[1px] w-full bg-gray-200  mb-10"></div>
        <div className="border border-gray-200 rounded-xl flex justify-between font-poppins mb-7">
          <div>
            <div className="mb-10 flex justify-between  w-[53rem] mt-4 p-3 pl-10">
              <h1 className="font-medium text-xl">Personal Info</h1>
              <div>
                <button className="justify-end flex border border-gray-200 p-2 rounded-lg">
                  <span className="pt-[4px]">
                    <BiEditAlt />
                  </span>
                  Edit
                </button>
              </div>
            </div>
            <div className="flex justify-around">
              <div className="p-7">
                <h1 className="text-gray-500">Full Name</h1>
                <p>
                  {user?.details?.first_name} {user?.details?.last_name}
                </p>
              </div>
              <div className="p-7">
                <h1 className="text-gray-500">Email</h1>
                <p>{user?.email}</p>
              </div>
              <div className="p-7">
                <h1 className="text-gray-500">Phone</h1>
                <p>{user?.details?.phone_number}</p>
              </div>
            </div>
          </div>

          <div className="border border-gray-100 rounded-lg"></div>
        </div>
        <div className="border border-gray-200 rounded-xl flex justify-between font-poppins ">
          <div className='flex justify-start items-start'>
          <div className='mb-10 flex justify-start items-start  w-[53rem] mt-5 p-3 pl-10'>
              <h1 className="font-medium text-xl">Posts</h1>
            <div className='flex justify-start'>
            <UserPost />
            </div>
            </div>
            </div>
        </div>
      </div>
    </div>
  );
};

export default Profile;
