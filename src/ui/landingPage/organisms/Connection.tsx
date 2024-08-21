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
    <div className="p-4 sm:p-8  bg-gray-100 ">
      <div className="bg-gray-100 ">
        <div className="justify-center items-center flex p-5 bg-gray-200">
          <h1 className="ml-20 font-poppins font-medium">Connections</h1>
        </div>
        <div className="ml-96 mt-10 justify-start w-[92rem] h-auto p-8 items-start bg-gray-100">
          <div className="justify-start flex flex-wrap gap-8 mb-10 overflow-hidden">
            {error && <p>{error}</p>}
            {connects.length === 0 ? (
              <div className="flex flex-col mt-14 items-center justify-center w-full h-[75vh] bg-gray-100">
                <div className="shadow-lg rounded-lg p-6 max-w-md text-center">
                  <div className="text-4xl text-gray-500 mb-4">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                      className="w-16 h-16 mx-auto"
                    >
                      <path
                        stroke-linecap="round"
                        stroke-linejoin="round"
                        stroke-width="2"
                        d="M12 9v3m0 0v3m0-3h3m-3 0H9m13 4a9 9 0 11-18 0 9 9 0 0118 0z"
                      />
                    </svg>
                  </div>
                  <h2 className="text-2xl font-semibold text-gray-700">No Connections Yet</h2>
                  <p className="text-gray-600 mt-2">You haven't connected with anyone yet.</p>
                </div>
              </div>
            ) : (
              connects.map((connect) => (
                <div
                  key={connect.id}
                  className="flex flex-col p-5 mb-5 justify-center items-center w-64 bg-white shadow-lg rounded-lg"
                >
                  <div onClick={() => handleUserClick(connect.id)}>
                    <div className="h-44 w-44 mb-5 shadow-lg">
                      {connect?.profile?.path ? (
                        <img className="rounded h-44 w-44" src={connect.profile.path} alt="" />
                      ) : (
                        <img className="rounded-full" src="/profilenull.jpg" alt="" />
                      )}
                    </div>
                    <div className="gap-2 mb-5 flex flex-col font-poppins font-medium">
                      <p>
                        {connect.details.first_name} {connect.details.last_name}
                      </p>
                      <p>{connect.details.phone_number}</p>
                    </div>
                  </div>
                  <button
                    onClick={() => Remove(connect.id)}
                    className="mt-4 border border-blue-400 bg-blue-500 hover:bg-blue-600 text-white rounded-lg w-32 p-2 "
                    type="button"
                  >
                    Remove
                  </button>
                </div>
              ))
            )}
          </div>
        </div>
      </div>
      <div className="border-t border-gray-300 mt-10"></div>

      <User />
    </div>
  );
};

export default Connection;
