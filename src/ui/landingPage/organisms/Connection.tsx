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
        setError(error.response?.data?.message || 'Error while removing connection');
      } else {
        setError('Error while removing connection');
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
    <div className="p-4 sm:p-8 lg:ml-96 bg-gray-100 min-h-screen">
      <div className="text-center mb-8">
        <h1 className="text-2xl sm:text-3xl lg:text-4xl font-semibold text-gray-800">Connections</h1>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {error && <p className="text-red-500 p-4">{error}</p>}
        {connects?.map((connect) => (
          <div
            key={connect?.id}
            className="bg-white rounded-lg shadow-md p-4 sm:p-6 flex flex-col sm:flex-row items-center sm:justify-between transform hover:scale-105 transition-transform duration-300"
          >
            <div className="flex items-center space-x-4 w-full sm:w-auto">
              <div
                onClick={() => handleUserClick(connect?.id)}
                className="cursor-pointer"
              >
                {connect?.profile?.path ? (
                  <img
                    className="h-16 w-16 sm:h-20 sm:w-20 rounded-full object-cover"
                    src={connect?.profile?.path}
                    alt="Profile"
                  />
                ) : (
                  <img
                    className="h-16 w-16 sm:h-20 sm:w-20 rounded-full"
                    src="/profilenull.jpg"
                    alt="Default Profile"
                  />
                )}
              </div>
              <div className="flex flex-col mt-2 sm:mt-0">
                <p className="text-lg sm:text-xl font-semibold text-gray-700">
                  {connect?.details?.first_name} {connect?.details?.last_name}
                </p>
                <p className="text-sm sm:text-base text-gray-500">{connect?.details?.phone_number}</p>
                <p className="text-sm sm:text-base text-gray-500">{connect?.email}</p>
              </div>
            </div>
            <button
              onClick={() => Remove(connect?.id)}
              className="mt-4 sm:mt-0 px-4 py-2 bg-blue-500 text-white text-sm font-medium rounded-lg shadow-lg hover:shadow-xl transform hover:-translate-y-1 transition duration-300"
            >
              Remove
            </button>
          </div>
        ))}
      </div>

      <div className="border-t border-gray-300 mt-10"></div>

      <User />
    </div>
  );
};

export default Connection;
