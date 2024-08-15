import axios from 'axios';
import axiosInstance from '../../../service/instance';
import { useEffect, useState } from 'react';
import User from './User';
import { useNavigate } from 'react-router-dom';

interface Connection {
  id: string;
  email?: string;
  username?: string;
  details: {
    first_name?: string;
    last_name?: string;
    phone_number?: string;
  };
  profile: {
    id?: string;
    path?: string;
  };
}

const Connection = () => {
  const [connects, setConnects] = useState<Connection[]>([]);
  const [error, setError] = useState<string | null>(null);
  const navigate = useNavigate();
  const showConnection = async () => {
    try {
      const response = await axiosInstance.get('/connect/friends', {
        headers: {
          'Content-Type': 'application/json',
        },
      });
      setConnects(response?.data?.friends);
      console.log(response?.data?.friends);
    } catch (error) {
      if (axios.isAxiosError(error)) {
        setError(error.response?.data?.message || 'Error while fetching connection');
      } else {
        setError('Error while fetching connection');
      }
    }
  };

  const Remove = async (id: string) => {
    try {
      const response = await axiosInstance.delete(`/connect/remove/${id}`, {
        headers: {
          'Content-Type': 'application/json',
        },
      });
      setConnects((prevConnect) => prevConnect.filter((connect) => connect?.id !== id));
      console.log(response);
    } catch (error) {
      if (axios.isAxiosError(error)) {
        setError(error.response?.data?.message || 'Error while fetching post');
      } else {
        setError('Error while fetching post');
      }
    }
  };

  const handleUserClick = (userId: string) => {
    navigate(`/userProfile/${userId}`);
  };

  

  useEffect(() => {
    showConnection();
  }, []);
  return (
    <div>
      <div className=" ml-96 justify-start w-fit  p-8 items-start h-screen">
        <div className="justify-center items-center mt-10 flex p-5">
          <h1 className="mr-20 font-poppins font-medium">Connection</h1>
        </div>
        <div className="overflow-x-auto">
  <div className="min-w-full bg-white shadow-md rounded-lg">
    {error && <p className="text-red-500 p-4">{error}</p>}
    <ul className="divide-y divide-gray-200">
      {connects?.map((connect) => (
        <li key={connect?.id} className="flex items-center justify-between p-4 hover:bg-gray-50">
          <div className="flex items-center space-x-4">
            <div onClick={() => handleUserClick(connect?.id)} className="cursor-pointer">
              {connect?.profile?.path ? (
                <img
                  className="h-12 w-12 rounded-full object-cover"
                  src={connect?.profile?.path}
                  alt="Profile"
                />
              ) : (
                <img className="h-12 w-12 rounded-full" src="/profilenull.jpg" alt="Default Profile" />
              )}
            </div>
            <div className='flex p-2 justify-around  w-[70rem]'>
              <p className="text-lg font-poppins">{connect?.details?.first_name} {connect?.details?.last_name}</p>
              <p className="p-1">{connect?.details?.phone_number}</p>
              <p>{connect?.email}</p>
            </div>
          </div>
          <button
            onClick={() => Remove(connect?.id)}
            className="px-4 py-2 bg-blue-600 text-white text-sm rounded-lg hover:bg-blue-700"
          >
            Remove
          </button>
        </li>
      ))}
    </ul>
  </div>
</div>


        <div className="border border-gray-300 mb-10"></div>
        <User />
      </div>
    </div>
  );
};
export default Connection;
