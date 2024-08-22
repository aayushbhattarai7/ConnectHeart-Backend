import { useEffect, useState } from 'react';
import axiosInstance from '../../../service/instance';
import { IoMdMale, IoMdFemale } from 'react-icons/io';
import { FaImage, FaUserFriends } from 'react-icons/fa';
import { BiEditAlt } from 'react-icons/bi';
import UserPost from './UserPost';
import EditUser from '../molecules/EditUser';

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
  const [edit, setEdit] = useState(false);
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

  const handleUpdateClick = () => {
    setEdit(true);
  };
  const handleCloseEdit = () => {
    setEdit(false);
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
                className="h-32 w-32 rounded-full object-cover border bordre-gray-200"
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
          <div className="mt-5">
            <button
              className="border border-blue-200 p-3 bg-blue-500 rounded-xl text-white hover:bg-blue-600 mb-3"
              onClick={handleUpdateClick}
            >
              Upload new photo
            </button>
            <p className="text-gray-500 font-poppins text-sm">JPG, JPEG or PNG is allowed</p>
          </div>
        </div>
        <div className="h-[1px] w-full bg-gray-200  mb-10"></div>
        <div className="border border-gray-200 rounded-xl flex justify-between font-poppins mb-7">
          <div>
            <div className="mb-10 flex justify-between  w-[53rem] mt-4 p-3 pl-10">
              <h1 className="font-medium text-xl">Personal Info</h1>
              <div>
                <button
                  className="justify-end flex border  p-2 rounded-lg  bg-blue-500 border-blue-400 text-white hover:bg-blue-600"
                  onClick={handleUpdateClick}
                >
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
          <div className="flex justify-start items-start">
            <div className="mb-10 flex justify-start items-start  w-[53rem] mt-5 p-3 pl-10">
              <h1 className="font-medium text-xl">Posts</h1>
              <div className="flex justify-start">
                <UserPost />
              </div>
            </div>
          </div>
        </div>
      </div>
      {edit && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
          <div className="bg-white p-4 rounded-lg shadow-lg">
            <EditUser
              id={user?.id!}
              refresh={profile}
              onClose={handleCloseEdit}
              first_name={user?.details?.first_name!}
              last_name={user?.details?.last_name!}
              email={user?.email}
              phone_number={user?.details?.phone_number!}
            />
          </div>
        </div>
      )}
    </div>
  );
};

export default Profile;
