import { useEffect, useState } from 'react';
import axiosInstance from '../../../service/instance';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

interface Connection {
  id: string;
  email?: string;
  username?: string;
  details: {
    first_name?: string;
    middle_name?: string;
    last_name?: string;
  };
  profile?: {
    id?: string;
    path?: string;
  };
}

const User = () => {
  const [users, setUsers] = useState<Connection[]>([]);
  const [error, setError] = useState<string | null>(null);
  const navigate = useNavigate();

  const showUsers = async () => {
    try {
      const response = await axiosInstance.get('/connect/suggestion', {
        headers: {
          'Content-Type': 'application/json',
        },
      });
      setUsers(response?.data?.user);
      console.log(response);
    } catch (error) {
      if (axios.isAxiosError(error)) {
        setError(error.response?.data?.message || 'Error while fetching post');
      } else {
        setError('Error while fetching users');
      }
    }
  };

  const sendRequest = async (id: string) => {
    try {
      const response = await axiosInstance.post(`/connect/${id}`);
      setUsers((prevRequests) => prevRequests.filter((user) => user.id !== id));
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
    showUsers();
  }, []);

  return (
    <div>
      <div className=" flex justify-center">
        <h1 className="mr-64 font-poppins font-medium">people may you know</h1>
      </div>
      <div className="justify-start flex flex-wrap gap-8 overflow-hidden">
        {error && <p>{error}</p>}
        {users?.map((user) => (
          <div
            key={user?.id}
            className=" flex flex-col p-5 mb-10 justify-center items-center w-64 shadow-xl"
          >
            <div onClick={() => handleUserClick(user.id)}>
              {user?.profile?.path ? (
                <img
                  className="h-44 w-44 rounded-2xl mb-3"
                  src={user?.profile?.path}
                  alt="Profile"
                />
              ) : (
                <img
                  className="h-44 w-44 rounded-2xl mb-3"
                  src="/profilenull.jpg"
                  alt="Default Profile"
                />
              )}
              <div className=" gap-2 mb-5 flex mr-16 font-poppins font-medium">
                <p>{user?.details?.first_name}</p>
                <p>{user?.details?.last_name}</p>
              </div>
            </div>
            <button
              className="border border-blue-400 bg-blue-600 text-white rounded-lg w-40"
              onClick={() => sendRequest(user?.id)}
            >
              Send
            </button>
          </div>
        ))}
      </div>
    </div>
  );
};
export default User;
