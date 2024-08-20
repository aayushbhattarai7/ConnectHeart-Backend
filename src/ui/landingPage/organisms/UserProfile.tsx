import { useEffect, useState } from 'react';
import axiosInstance from '../../../service/instance';
import { useParams } from 'react-router-dom';
import { IoMdFemale, IoMdMale } from 'react-icons/io';
import { FaUserFriends } from 'react-icons/fa';

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

const UserProfile = () => {
  const [user, setUser] = useState<User | null>(null);

  const fetchUser = async (id: string) => {
    try {
      const response = await axiosInstance.get(`/user/userProfile/${id}`, {
        headers: {
          'Content-Type': 'application/json',
        },
      });
      setUser(response.data.getUser[0]);
      console.log(response.data.getUser[0]);
    } catch (error) {
      console.error('Error fetching user data', error);
    }
  };

  useEffect(() => {
    const userId = user?.id
    if (userId) {
      fetchUser(userId!);
    }
  }, [user]);

  return (
    <div className="min-h-screen  flex flex-col border border-black w-full  mt-10 px-5 sm:px-10 lg:px-20 ">
      <div className="max-w-3xl mx-auto bg-white p-20 w-max2  rounded-lg shadow-lg">
        <div className="flex flex-col justify-center items-center" key={user?.id}>
          <div className="relative  mb-6">
            {user?.profile?.path ? (
              <img
                className="h-32 w-32 rounded-full object-cover"
                src={user?.profile?.path}
                alt="Profile"
              />
            ) : (
              <img
                className="h-32 w-32 rounded-full object-cover"
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

          <div className="text-center">
            <h2 className="text-2xl font-semibold text-gray-800">
              {user?.details?.first_name} {user?.details?.last_name}
            </h2>
            <p className="text-gray-600">{user?.email}</p>
            <p className="text-gray-600">{user?.details?.phone_number}</p>

            <div className="flex flex-col items-center mt-4">
              {/* <h3 className="text-xl font-semibold text-gray-800">{count?.counts}</h3> */}
              <FaUserFriends className="text-blue-900 text-4xl mt-1" />
            </div>
          </div>

          <div></div>
        </div>
      </div>
    </div>
  );
};

export default UserProfile;
