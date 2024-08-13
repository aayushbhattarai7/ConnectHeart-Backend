import axios from 'axios';
import axiosInstance from '../../../service/instance';
import { useEffect, useState } from 'react';
import { NavLink, useNavigate } from 'react-router-dom';

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

const MessageUser = () => {
  const [connects, setConnects] = useState<Connection[]>([]);
  const [error, setError] = useState<string | null>(null);
  const navigate = useNavigate();
  const isActive = (path: string) => location.pathname === path;
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

  const handleChatClick = (userId: string) => {
    navigate(`/message/${userId}`);
  };

  useEffect(() => {
    showConnection();
  }, []);
  return (
    <div>
      <div className=" ml-[18rem] mt-24 justify-start fixed top-0 w-[34rem]  p-8 items-start h-screen border">
        <div className="justify-start flex flex-col  gap-2 mb-2 overflow-hidden">
          {error && <p>{error}</p>}
          {connects?.map((connect) => (
            <div
              key={connect?.id}
              className=" flex flex-col p-10 h-20 mb-10 justify-center items-start w-[35rem] "
            >
              <NavLink
                to={`/message/${connect.id}`}
                className={({ isActive }) => (isActive ? 'rounded-2xl bg-blue-500 p-3 text-white' : '')}
              >
                <div className="flex pt-2  ">
                  {connect?.profile?.path ? (
                    <img
                      className="h-16 w-16 rounded-full mb-3"
                      src={connect?.profile?.path}
                      alt="Profile"
                    />
                  ) : (
                    <img
                      className="w-16 h-16 rounded-full"
                      src="/profilenull.jpg"
                      alt="Default Profile"
                    />
                  )}
                  <div className="flex justify-center w-[20rem] pl-3 items-center">
                    <div
                      key={connect?.id}
                      className=" mb-3 mt-2  w-[10rem] mr-16 flex flex-col font-medium"
                    >
                      <p className=" font-medium">
                        {connect?.details?.first_name} {connect?.details?.last_name}{' '}
                      </p>
                      <p className=" text-sm">message</p>
                    </div>
                    <p>5:30 pm</p>
                  </div>
                </div>
              </NavLink>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
export default MessageUser;
