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
      <div className=" flex justify-center ml-32">
        <h1 className="mr-64 font-poppins font-medium">people may you know</h1>
      </div>
      <div className="overflow-x-auto">
  <div className="min-w-full bg-white shadow-md rounded-lg">
    {error && <p className="text-red-500 p-4">{error}</p>}
    <ul className="divide-y divide-gray-200">
      {users?.map((user) => (
        <li key={user?.id} className="flex items-center justify-between p-4 hover:bg-gray-50">
          <div className="flex items-center space-x-4 cursor-pointer" onClick={() => handleUserClick(user.id)}>
            {user?.profile?.path ? (
              <img
                className="h-12 w-12 rounded-full object-cover"
                src={user?.profile?.path}
                alt="Profile"
              />
            ) : (
              <img className="h-12 w-12 rounded-full object-cover" src="/profilenull.jpg" alt="Default Profile" />
            )}
            <div className="text-left">
              <p className="font-semibold text-lg">{user?.details?.first_name} {user?.details?.last_name}</p>
            </div>
          </div>
          <button
            className="px-4 py-2 bg-blue-600 text-white text-sm rounded-lg hover:bg-blue-700"
            onClick={() => sendRequest(user?.id)}
          >
            Send
          </button>
        </li>
      ))}
    </ul>
  </div>
</div>

    </div>
  );
};
export default User;
